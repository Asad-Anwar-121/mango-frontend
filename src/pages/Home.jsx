import React, { useRef, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Camera, Loader2, CheckCircle, AlertCircle, X, RefreshCw, Info, Video } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Constants
const MAX_FILES = 4;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/analyze/";

const Home = () => {
  const { updateMangoData, error, selectedFile, setSelectedFile, preview, setPreview, result, setResult } =
    useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("Please select exactly 4 images to analyze.");
  const [isRemoving, setIsRemoving] = useState(false);
  const [lastRemovedIndex, setLastRemovedIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isCameraAvailable = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  // Restore state from location.state on mount
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenGuidelinesPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
    }

    // Restore state from location.state
    const state = location.state || {};
    const savedFiles = state.savedFiles || [];
    const savedPreview = state.savedPreview || [];

    if (savedFiles.length && savedPreview.length) {
      setSelectedFile(savedFiles);
      setPreview(savedPreview);
      setFileError(savedFiles.length === MAX_FILES ? null : `Please select ${MAX_FILES - savedFiles.length} more image(s).`);
    }

    // Cleanup only camera stream on unmount
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream, location.state]);

  // Handle camera stream assignment
  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
        setFileError("Failed to access camera. Please try again or upload images manually.");
        stopCamera();
      });
    }
  }, [showCamera, cameraStream]);

  // Helper function to update files and previews
  const updateFilesAndPreviews = (newFiles, newIndex) => {
    const currentFiles = selectedFile || [];
    const currentPreviews = preview || [];
    let allFiles = [...currentFiles];

    if (lastRemovedIndex !== null && lastRemovedIndex < MAX_FILES && newFiles.length > 0) {
      allFiles.splice(lastRemovedIndex, 0, ...newFiles);
      allFiles = allFiles.slice(0, MAX_FILES);
      setLastRemovedIndex(allFiles.length < MAX_FILES && newIndex < MAX_FILES ? newIndex : null);
    } else {
      allFiles = [...currentFiles, ...newFiles].slice(0, MAX_FILES);
      setLastRemovedIndex(allFiles.length < MAX_FILES ? allFiles.length : null);
    }

    // Revoke old preview URLs
    currentPreviews.forEach((img) => URL.revokeObjectURL(img.url));

    const generatedPreview = allFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      number: `Image ${index + 1}`,
      id: `${file.name}-${Date.now()}-${index}`,
    }));

    setSelectedFile(allFiles);
    setPreview(generatedPreview);
    setResult(null);

    setFileError(allFiles.length === MAX_FILES ? null : `Please select ${MAX_FILES - allFiles.length} more image(s).`);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (!newFiles.length) return;

    const invalidFiles = newFiles.filter(
      (file) => !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );
    if (invalidFiles.length > 0) {
      setFileError("Only JPEG or PNG images under 10MB are allowed.");
      return;
    }

    const availableSlots = MAX_FILES - (selectedFile?.length || 0);
    if (availableSlots <= 0) {
      setFileError("Maximum of 4 images reached.");
      return;
    }

    updateFilesAndPreviews(newFiles.slice(0, availableSlots), lastRemovedIndex + newFiles.length);
  };

  const handleRemoveImage = (index) => {
    if (isRemoving) return;
    setIsRemoving(true);

    try {
      const newFiles = selectedFile.filter((_, i) => i !== index);
      const newPreviews = preview.filter((_, i) => i !== index);

      if (preview[index]) {
        URL.revokeObjectURL(preview[index].url); // Revoke URL for removed image
      }

      setSelectedFile(newFiles);
      setPreview(newPreviews);
      setResult(null);
      setLastRemovedIndex(index);

      setFileError(newFiles.length === 0 ? "Please select exactly 4 images to analyze." : `Please select ${MAX_FILES - newFiles.length} more image(s).`);
    } catch (err) {
      console.error("Error removing image:", err);
      setFileError("Failed to remove image. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setCameraStream(null);
  };

  const openCamera = async () => {
    if (selectedFile?.length >= MAX_FILES) {
      setFileError("Maximum of 4 images reached.");
      return;
    }

    if (!window.isSecureContext) {
      setFileError("Camera access requires HTTPS. Please use a secure connection.");
      return;
    }

    if (!isCameraAvailable) {
      setFileError("Your device or browser does not support camera access. Please upload images manually.");
      return;
    }

    setFileError(null);
    setLoading(true);

    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { min: 640, max: 1920 },
          height: { min: 360, max: 1080 },
        },
      }).catch(async (err) => {
        console.warn("Rear camera failed, trying front camera:", err);
        return navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { min: 640, max: 1920 },
            height: { min: 360, max: 1080 },
          },
        });
      });

      stream.getVideoTracks().forEach((track) => {
        console.log("Camera track:", {
          label: track.label,
          enabled: track.enabled,
          state: track.readyState,
        });
      });

      setCameraStream(stream);
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err.name, err.message);
      let errorMessage = "Unable to access camera. Please try again or upload images manually.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Camera access denied. Please enable camera permissions in your browser settings and try again.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "No camera found on this device. Please upload images manually.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Camera is in use by another app. Please close it and try again.";
      } else if (err.name === "SecurityError") {
        errorMessage = "Camera access requires HTTPS. Please use a secure connection.";
      }
      setFileError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      setFileError("Camera not ready. Please try again.");
      return;
    }

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setFileError("Camera not rendering. Please try again.");
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setFileError("Failed to capture image. Please try again.");
          return;
        }
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        updateFilesAndPreviews([file], lastRemovedIndex + 1);
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  const handleSubmit = async () => {
    if (!selectedFile || selectedFile.length !== MAX_FILES) {
      setFileError("Please select exactly 4 images.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      selectedFile.forEach((file) => formData.append("files", file));

      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      if (response.data.status === "error") {
        setFileError(response.data.message || "Failed to analyze images.");
        setResult({ status: "error", individual_results: [] });
        return;
      }

      setResult(response.data);
      setFileError(null);
      updateMangoData({
        status: response.data.final_result?.disease || "unknown",
        individualResults: response.data.individual_results,
      });
    } catch (err) {
      console.error("Upload error:", err);
      setFileError(err.response?.data?.message || "Network error. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // Revoke all preview URLs on refresh
    preview?.forEach((img) => URL.revokeObjectURL(img.url));
    setSelectedFile([]);
    setPreview([]);
    setResult(null);
    setFileError("Please select exactly 4 images to analyze.");
    fileInputRef.current.value = null;
    setLastRemovedIndex(null);
  };

  const handleSkipPopup = () => {
    setShowPopup(false);
    localStorage.setItem("hasSeenGuidelinesPopup", "true");
  };

  const handleReadGuidelines = () => {
    setShowPopup(false);
    localStorage.setItem("hasSeenGuidelinesPopup", "true");
    navigate("/guidelines", { state: { savedFiles: selectedFile, savedPreview: preview } });
  };

  const detectedDiseases = result?.individual_results
    ? [...new Set(result.individual_results.map((item) => item.disease?.toLowerCase()))].filter(
        (disease) => ["anthracnose", "sap-burn"].includes(disease)
      )
    : [];

  const diseaseImageMap = result?.individual_results
    ? result.individual_results.reduce((acc, item) => {
        const disease = item.disease?.toLowerCase();
        if (["anthracnose", "sap-burn"].includes(disease)) {
          acc[disease] = acc[disease] || [];
          acc[disease].push(item.image_number);
        }
        return acc;
      }, {})
    : {};

  const allHealthy = result?.individual_results
    ? result.individual_results
        .filter((item) => item.status === "mango")
        .every((item) => item.disease?.toLowerCase() === "healthy")
    : false;

  const finalPrediction = allHealthy
    ? "🟢 Healthy"
    : detectedDiseases.length === 1
    ? `🔴 ${detectedDiseases[0].charAt(0).toUpperCase() + detectedDiseases[0].slice(1)} detected`
    : detectedDiseases.length > 1
    ? "🔴 Conclusion"
    : "";

  const cleanPrediction = (prediction) => prediction.replace(/ – severity: \d+(\.\d+)?%/, "").trim();

  return (
    <div className="w-[80%] px-6 py-10 m-auto bg-white shadow-inner border-white rounded">
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">Image Guidelines</h2>
            <p className="text-gray-600 mb-6 text-center">Please review our image upload guidelines for accurate mango disease detection.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReadGuidelines}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                aria-label="Read image guidelines"
              >
                Read
              </button>
              <button
                onClick={handleSkipPopup}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                aria-label="Skip image guidelines"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-label="Camera capture modal">
          <div className="bg-white rounded-2xl p-8 max-w-[800px] sm:max-w-[600px] w-full h-[70vh] sm:h-[60vh] max-h-[600px] shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">Capture Image</h2>
            <div className="relative w-full h-[60vh] max-h-[450px] bg-black rounded-lg overflow-hidden aspect-[16/9]">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="animate-spin w-8 h-8 text-yellow-600" />
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={captureImage}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 disabled:bg-gray-400"
                aria-label="Capture image from camera"
                disabled={loading}
              >
                Capture
              </button>
              <button
                onClick={stopCamera}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                aria-label="Cancel camera"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-10 flex justify-between items-center">
        <Link
          to="/guidelines"
          state={{ savedFiles: selectedFile, savedPreview: preview }}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          aria-label="View image upload guidelines"
        >
          <Info className="w-5 h-5 mr-2" />
          Guidelines
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center gap-10">
        <h1 className="text-center text-5xl font-extrabold text-yellow-600 drop-shadow md:text-4xl">
          🥭 Mango <span className="text-yellow-500">Fortune</span>
        </h1>
        <div className="md:flex gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center"
            aria-label="Upload mango images"
            disabled={loading}
          >
            <Camera className="w-10 h-10 text-yellow-600" />
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </button>
          {isCameraAvailable && (
            <button
              onClick={openCamera}
              className="md:mt-0 mt-2 w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center"
              aria-label="Open camera to capture image"
              disabled={loading}
            >
              <Video className="w-10 h-10 text-yellow-600" />
            </button>
          )}
        </div>

        {fileError && (
          <div className="flex items-center text-red-600 mt-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <div dangerouslySetInnerHTML={{ __html: fileError }} />
          </div>
        )}

        {preview?.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {preview.map((img, index) => (
              <div
                key={img.id}
                className="relative w-32 h-32 border-2 border-yellow-300 rounded-xl overflow-hidden shadow-md group"
              >
                <button
                  onClick={() => handleRemoveImage(index)}
                  disabled={isRemoving || loading}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                  aria-label={`Remove ${img.number}`}
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={img.url}
                  alt={`${img.number} Preview`}
                  className={`w-full h-full object-cover transition-all duration-500 ${loading ? "blur-sm" : ""}`}
                  onError={(e) => {
                    console.error(`Error loading image ${img.number}:`, e);
                    setFileError(`Failed to load ${img.number}. Please try uploading again.`);
                    e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                  }}
                />
                <div className="absolute top-1 left-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded shadow">
                  {img.number}
                </div>
                {loading && (
                  <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
                    <Loader2 className="animate-spin w-4 h-4 text-yellow-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center space-y-4">
        <button
          onClick={handleSubmit}
          disabled={loading || selectedFile?.length !== MAX_FILES}
          className={`w-full max-w-xs px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
            loading || selectedFile?.length !== MAX_FILES
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 hover:scale-[1.02]"
          }`}
          aria-label="Upload and analyze images"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Analyzing...
            </span>
          ) : (
            "Upload & Analyze"
          )}
        </button>

        {preview?.length > 0 && (
          <button
            onClick={handleRefresh}
            className="w-full max-w-xs px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] transition duration-300"
            aria-label="Clear all images and reset"
          >
            <RefreshCw className="inline-block w-5 h-4 mr-2" />
            Refresh
          </button>
        )}
      </div>

      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

      {result?.status === "success" && result.individual_results?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-center text-gray-700 mb-4">📸 Individual Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {result.individual_results.map((item, index) => (
              <div key={index} className="bg-white p-4 border rounded-xl shadow text-left space-y-2">
                <h4 className="text-lg font-semibold text-yellow-600">{item.image_number}</h4>
                <p>{cleanPrediction(item.prediction)}</p>
                <p className="text-sm text-gray-600">
                  Confidence: <span className="font-medium">{Number(item.confidence).toFixed(2)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result?.status === "success" && result?.final_result && (
        <div className="mt-10 w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-2xl border border-yellow-300 px-6 py-6 text-center">
          <h3 className="text-3xl font-bold text-yellow-700 mb-4 flex items-center justify-center gap-2">
            🧠 Final Result
          </h3>
          <div className="p-4 rounded-xl bg-white shadow-lg border border-gray-200">
            <p className="text-lg font-semibold text-green-700 mb-2">
              <CheckCircle className="inline-block w-5 h-5 mr-2" />
              {finalPrediction}
            </p>
            {detectedDiseases.length >= 1 && (
              <div className="mt-4 text-sm text-gray-700">
                <ul className="list-none space-y-1">
                  {Object.entries(diseaseImageMap).map(([disease, images]) => (
                    <li key={disease}>
                      {disease.charAt(0).toUpperCase() + disease.slice(1)}: {images.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detectedDiseases.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Based on {Object.values(diseaseImageMap).flat().length} mango images
              </p>
            )}
          </div>

          {detectedDiseases.length > 0 && (
            <div className="mt-6 space-y-2">
              {detectedDiseases.map((disease) => (
                <Link
                  key={disease}
                  to={{
                    pathname: disease.toLowerCase() === "anthracnose" ? "/anthracnose" : "/sap",
                    state: { selectedDisease: disease, savedFiles: selectedFile, savedPreview: preview },
                  }}
                  className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 hover:scale-[1.02] transition duration-300 w-full max-w-xs"
                  aria-label={`Learn more about ${disease}`}
                >
                  Learn More About {disease.charAt(0).toUpperCase() + disease.slice(1)}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

// import React, { useRef, useContext, useEffect, useState } from "react";
// import axios from "axios"; // Added missing import
// import { Camera, Loader2, CheckCircle, AlertCircle, X, RefreshCw, Info, Video } from "lucide-react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext";

// // Constants
// const MAX_FILES = 4;
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];
// const API_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/analyze/";

// const Home = () => {
//   const { updateMangoData, error, selectedFile, setSelectedFile, preview, setPreview, result, setResult } =
//     useContext(AppContext);

//   const [loading, setLoading] = useState(false);
//   const [fileError, setFileError] = useState("Please select exactly 4 images to analyze.");
//   const [isRemoving, setIsRemoving] = useState(false);
//   const [lastRemovedIndex, setLastRemovedIndex] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const [cameraStream, setCameraStream] = useState(null);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isCameraAvailable = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

//   // Cleanup URLs and camera stream on unmount
//   useEffect(() => {
//     const hasSeenPopup = localStorage.getItem("hasSeenGuidelinesPopup");
//     if (!hasSeenPopup) {
//       setShowPopup(true);
//     }

//     // Restore state from location.state or sessionStorage
//     const state = location.state || {};
//     const savedFiles = state.savedFiles || [];
//     const savedPreview = state.savedPreview || [];

//     if (savedFiles.length && savedPreview.length) {
//       setSelectedFile(savedFiles);
//       setPreview(savedPreview);
//       setFileError(savedFiles.length === MAX_FILES ? null : `Please select ${MAX_FILES - savedFiles.length} more image(s).`);
//       updateSessionStorage(savedFiles, savedPreview);
//     } else {
//       const previewFromStorage = sessionStorage.getItem("savedPreview");
//       const filesFromStorage = sessionStorage.getItem("savedFiles");
//       if (previewFromStorage && filesFromStorage) {
//         try {
//           const parsedPreview = JSON.parse(previewFromStorage);
//           if (Array.isArray(parsedPreview) && parsedPreview.every((img) => img.url && img.number && img.id)) {
//             setPreview(parsedPreview);
//             setFileError(parsedPreview.length === MAX_FILES ? null : `Please select ${MAX_FILES - parsedPreview.length} more image(s).`);
//           } else {
//             throw new Error("Invalid sessionStorage data");
//           }
//         } catch (err) {
//           console.error("Error parsing sessionStorage:", err);
//           clearSessionStorage();
//         }
//       }
//     }

//     return () => {
//       // Cleanup URLs and camera stream
//       preview?.forEach((img) => URL.revokeObjectURL(img.url));
//       if (cameraStream) {
//         cameraStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // Handle camera stream assignment
//   useEffect(() => {
//     if (showCamera && cameraStream && videoRef.current) {
//       videoRef.current.srcObject = cameraStream;
//       videoRef.current.play().catch((err) => {
//         console.error("Error playing video:", err);
//         setFileError("Failed to access camera. Please try again or upload images manually.");
//         stopCamera();
//       });
//     }
//   }, [showCamera, cameraStream]);

//   // Helper function to update sessionStorage
//   const updateSessionStorage = (files, previews) => {
//     sessionStorage.setItem("savedFiles", JSON.stringify(files.map((f) => ({
//       name: f.name,
//       type: f.type,
//       size: f.size,
//     }))));
//     sessionStorage.setItem("savedPreview", JSON.stringify(previews));
//   };

//   // Helper function to clear sessionStorage
//   const clearSessionStorage = () => {
//     sessionStorage.removeItem("savedFiles");
//     sessionStorage.removeItem("savedPreview");
//   };

//   // Helper function to update files and previews
//   const updateFilesAndPreviews = (newFiles, newIndex) => {
//     const currentFiles = selectedFile || [];
//     const currentPreviews = preview || [];
//     let allFiles = [...currentFiles];

//     if (lastRemovedIndex !== null && lastRemovedIndex < MAX_FILES && newFiles.length > 0) {
//       allFiles.splice(lastRemovedIndex, 0, ...newFiles);
//       allFiles = allFiles.slice(0, MAX_FILES);
//       setLastRemovedIndex(allFiles.length < MAX_FILES && newIndex < MAX_FILES ? newIndex : null);
//     } else {
//       allFiles = [...currentFiles, ...newFiles].slice(0, MAX_FILES);
//       setLastRemovedIndex(allFiles.length < MAX_FILES ? allFiles.length : null);
//     }

//     currentPreviews.forEach((img) => URL.revokeObjectURL(img.url));
//     const generatedPreview = allFiles.map((file, index) => ({
//       url: URL.createObjectURL(file),
//       number: `Image ${index + 1}`,
//       id: `${file.name}-${Date.now()}-${index}`,
//     }));

//     setSelectedFile(allFiles);
//     setPreview(generatedPreview);
//     setResult(null);
//     updateSessionStorage(allFiles, generatedPreview);

//     setFileError(allFiles.length === MAX_FILES ? null : `Please select ${MAX_FILES - allFiles.length} more image(s).`);
//   };

//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files);
//     if (!newFiles.length) return;

//     const invalidFiles = newFiles.filter(
//       (file) => !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
//     );
//     if (invalidFiles.length > 0) {
//       setFileError("Only JPEG or PNG images under 10MB are allowed.");
//       return;
//     }

//     const availableSlots = MAX_FILES - (selectedFile?.length || 0);
//     if (availableSlots <= 0) {
//       setFileError("Maximum of 4 images reached.");
//       return;
//     }

//     updateFilesAndPreviews(newFiles.slice(0, availableSlots), lastRemovedIndex + newFiles.length);
//   };

//   const handleRemoveImage = (index) => {
//     if (isRemoving) return;
//     setIsRemoving(true);

//     try {
//       const newFiles = selectedFile.filter((_, i) => i !== index);
//       const newPreviews = preview.filter((_, i) => i !== index);

//       if (preview[index]) {
//         URL.revokeObjectURL(preview[index].url);
//       }

//       setSelectedFile(newFiles);
//       setPreview(newPreviews);
//       setResult(null);
//       setLastRemovedIndex(index);
//       updateSessionStorage(newFiles, newPreviews);

//       setFileError(newFiles.length === 0 ? "Please select exactly 4 images to analyze." : `Please select ${MAX_FILES - newFiles.length} more image(s).`);
//     } catch (err) {
//       console.error("Error removing image:", err);
//       setFileError("Failed to remove image. Please try again.");
//     } finally {
//       setIsRemoving(false);
//     }
//   };

//   const stopCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach((track) => track.stop());
//     }
//     setShowCamera(false);
//     setCameraStream(null);
//   };

//   const openCamera = async () => {
//     if (selectedFile?.length >= MAX_FILES) {
//       setFileError("Maximum of 4 images reached.");
//       return;
//     }

//     if (!window.isSecureContext) {
//       setFileError("Camera access requires HTTPS. Please use a secure connection.");
//       return;
//     }

//     if (!isCameraAvailable) {
//       setFileError("Your device or browser does not support camera access. Please upload images manually.");
//       return;
//     }

//     setFileError(null);
//     setLoading(true);

//     try {
//       let stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "environment",
//           width: { min: 640, max: 1920 },
//           height: { min: 360, max: 1080 },
//         },
//       }).catch(async (err) => {
//         console.warn("Rear camera failed, trying front camera:", err);
//         return navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: "user",
//             width: { min: 640, max: 1920 },
//             height: { min: 360, max: 1080 },
//           },
//         });
//       });

//       stream.getVideoTracks().forEach((track) => {
//         console.log("Camera track:", {
//           label: track.label,
//           enabled: track.enabled,
//           state: track.readyState,
//         });
//       });

//       setCameraStream(stream);
//       setShowCamera(true);
//     } catch (err) {
//       console.error("Error accessing camera:", err.name, err.message);
//       let errorMessage = "Unable to access camera. Please try again or upload images manually.";
//       if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
//         errorMessage = "Camera access denied. Please enable camera permissions in your browser settings and try again.";
//       } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
//         errorMessage = "No camera found on this device. Please upload images manually.";
//       } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
//         errorMessage = "Camera is in use by another app. Please close it and try again.";
//       } else if (err.name === "SecurityError") {
//         errorMessage = "Camera access requires HTTPS. Please use a secure connection.";
//       }
//       setFileError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const captureImage = () => {
//     if (!videoRef.current || !canvasRef.current) {
//       setFileError("Camera not ready. Please try again.");
//       return;
//     }

//     const video = videoRef.current;
//     if (video.videoWidth === 0 || video.videoHeight === 0) {
//       setFileError("Camera not rendering. Please try again.");
//       return;
//     }

//     const canvas = canvasRef.current;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob(
//       (blob) => {
//         if (!blob) {
//           setFileError("Failed to capture image. Please try again.");
//           return;
//         }
//         const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
//         updateFilesAndPreviews([file], lastRemovedIndex + 1);
//         stopCamera();
//       },
//       "image/jpeg",
//       0.9
//     );
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile || selectedFile.length !== MAX_FILES) {
//       setFileError("Please select exactly 4 images.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       selectedFile.forEach((file) => formData.append("files", file));

//       const response = await axios.post(API_URL, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         timeout: 30000,
//       });

//       if (response.data.status === "error") {
//         setFileError(response.data.message || "Failed to analyze images.");
//         setResult({ status: "error", individual_results: [] });
//         return;
//       }

//       setResult(response.data);
//       setFileError(null);
//       updateMangoData({
//         status: response.data.final_result?.disease || "unknown",
//         individualResults: response.data.individual_results,
//       });
//     } catch (err) {
//       console.error("Upload error:", err);
//       setFileError(err.response?.data?.message || "Network error. Please try again.");
//       setResult(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     preview?.forEach((img) => URL.revokeObjectURL(img.url));
//     setSelectedFile([]);
//     setPreview([]);
//     setResult(null);
//     setFileError("Please select exactly 4 images to analyze.");
//     fileInputRef.current.value = null;
//     clearSessionStorage();
//     setLastRemovedIndex(null);
//   };

//   const handleSkipPopup = () => {
//     setShowPopup(false);
//     localStorage.setItem("hasSeenGuidelinesPopup", "true");
//   };

//   const handleReadGuidelines = () => {
//     setShowPopup(false);
//     localStorage.setItem("hasSeenGuidelinesPopup", "true");
//     navigate("/guidelines", { state: { savedFiles: selectedFile, savedPreview: preview } });
//   };

//   const detectedDiseases = result?.individual_results
//     ? [...new Set(result.individual_results.map((item) => item.disease?.toLowerCase()))].filter(
//         (disease) => ["anthracnose", "sap-burn"].includes(disease)
//       )
//     : [];

//   const diseaseImageMap = result?.individual_results
//     ? result.individual_results.reduce((acc, item) => {
//         const disease = item.disease?.toLowerCase();
//         if (["anthracnose", "sap-burn"].includes(disease)) {
//           acc[disease] = acc[disease] || [];
//           acc[disease].push(item.image_number);
//         }
//         return acc;
//       }, {})
//     : {};

//   const allHealthy = result?.individual_results
//     ? result.individual_results
//         .filter((item) => item.status === "mango")
//         .every((item) => item.disease?.toLowerCase() === "healthy")
//     : false;

//   const finalPrediction = allHealthy
//     ? "🟢 Healthy"
//     : detectedDiseases.length === 1
//     ? `🔴 ${detectedDiseases[0].charAt(0).toUpperCase() + detectedDiseases[0].slice(1)} detected`
//     : detectedDiseases.length > 1
//     ? "🔴 Conclusion"
//     : "";

//   const cleanPrediction = (prediction) => prediction.replace(/ – severity: \d+(\.\d+)?%/, "").trim();

//   return (
//     <div className="w-[80%] px-6 py-10 m-auto bg-white shadow-inner border-white rounded">
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//             <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">Image Guidelines</h2>
//             <p className="text-gray-600 mb-6 text-center">Please review our image upload guidelines for accurate mango disease detection.</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleReadGuidelines}
//                 className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
//                 aria-label="Read image guidelines"
//               >
//                 Read
//               </button>
//               <button
//                 onClick={handleSkipPopup}
//                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
//                 aria-label="Skip image guidelines"
//               >
//                 Skip
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showCamera && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-label="Camera capture modal">
//           <div className="bg-white rounded-2xl p-8 max-w-[800px] sm:max-w-[600px] w-full h-[70vh] sm:h-[60vh] max-h-[600px] shadow-2xl">
//             <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">Capture Image</h2>
//             <div className="relative w-full h-[60vh] max-h-[450px] bg-black rounded-lg overflow-hidden aspect-[16/9]">
//               {loading ? (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//                   <Loader2 className="animate-spin w-8 h-8 text-yellow-600" />
//                 </div>
//               ) : (
//                 <>
//                   <video
//                     ref={videoRef}
//                     className="w-full h-full object-cover"
//                     autoPlay
//                     playsInline
//                   />
//                   <canvas ref={canvasRef} className="hidden" />
//                 </>
//               )}
//             </div>
//             <div className="flex justify-center gap-4 mt-6">
//               <button
//                 onClick={captureImage}
//                 className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 disabled:bg-gray-400"
//                 aria-label="Capture image from camera"
//                 disabled={loading}
//               >
//                 Capture
//               </button>
//               <button
//                 onClick={stopCamera}
//                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
//                 aria-label="Cancel camera"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="text-center mb-10 flex justify-between items-center">
//         <Link
//           to="/guidelines"
//           state={{ savedFiles: selectedFile, savedPreview: preview }}
//           className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
//           aria-label="View image upload guidelines"
//         >
//           <Info className="w-5 h-5 mr-2" />
//           Guidelines
//         </Link>
//       </div>

//       <div className="flex flex-col items-center justify-center gap-10">
//         <h1 className="text-center text-5xl font-extrabold text-yellow-600 drop-shadow md:text-4xl">
//           🥭 Mango <span className="text-yellow-500">Fortune</span>
//         </h1>
//         <div className="md:flex  gap-4">
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center"
//             aria-label="Upload mango images"
//             disabled={loading}
//           >
//             <Camera className="w-10 h-10 text-yellow-600" />
//             <input
//               type="file"
//               accept="image/jpeg,image/png"
//               multiple
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//               disabled={loading}
//             />
//           </button>
//           {isCameraAvailable && (
//             <button
//               onClick={openCamera}
//               className="md:mt-0  mt-2 w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center"
//               aria-label="Open camera to capture image"
//               disabled={loading}
//             >
//               <Video className="w-10 h-10 text-yellow-600" />
//             </button>
//           )}
//         </div>

//         {fileError && (
//           <div className="flex items-center text-red-600 mt-4">
//             <AlertCircle className="w-5 h-5 mr-2" />
//             <div dangerouslySetInnerHTML={{ __html: fileError }} />
//           </div>
//         )}

//         {preview?.length > 0 && (
//           <div className="flex flex-wrap gap-4 justify-center mt-4">
//             {preview.map((img, index) => (
//               <div
//                 key={img.id}
//                 className="relative w-32 h-32 border-2 border-yellow-300 rounded-xl overflow-hidden shadow-md group"
//               >
//                 <button
//                   onClick={() => handleRemoveImage(index)}
//                   disabled={isRemoving || loading}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
//                   aria-label={`Remove ${img.number}`}
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//                 <img
//                   src={img.url}
//                   alt={`${img.number} Preview`}
//                   className={`w-full h-full object-cover transition-all duration-500 ${loading ? "blur-sm" : ""}`}
//                   onError={(e) => {
//                     console.error(`Error loading image ${img.number}:`, e);
//                     e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
//                   }}
//                 />
//                 <div className="absolute top-1 left-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded shadow">
//                   {img.number}
//                 </div>
//                 {loading && (
//                   <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
//                     <Loader2 className="animate-spin w-4 h-4 text-yellow-600" />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="mt-4 flex flex-col items-center space-y-4">
//         <button
//           onClick={handleSubmit}
//           disabled={loading || selectedFile?.length !== MAX_FILES}
//           className={`w-full max-w-xs px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
//             loading || selectedFile?.length !== MAX_FILES
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-yellow-500 hover:bg-yellow-600 hover:scale-[1.02]"
//           }`}
//           aria-label="Upload and analyze images"
//         >
//           {loading ? (
//             <span className="flex items-center justify-center gap-2">
//               <Loader2 className="animate-spin w-4 h-4" />
//               Analyzing...
//             </span>
//           ) : (
//             "Upload & Analyze"
//           )}
//         </button>

//         {preview?.length > 0 && (
//           <button
//             onClick={handleRefresh}
//             className="w-full max-w-xs px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] transition duration-300"
//             aria-label="Clear all images and reset"
//           >
//             <RefreshCw className="inline-block w-5 h-4 mr-2" />
//             Refresh
//           </button>
//         )}
//       </div>

//       {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

//       {result?.status === "success" && result.individual_results?.length > 0 && (
//         <div className="mt-10">
//           <h2 className="text-xl font-bold text-center text-gray-700 mb-4">📸 Individual Results</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {result.individual_results.map((item, index) => (
//               <div key={index} className="bg-white p-4 border rounded-xl shadow text-left space-y-2">
//                 <h4 className="text-lg font-semibold text-yellow-600">{item.image_number}</h4>
//                 <p>{cleanPrediction(item.prediction)}</p>
//                 <p className="text-sm text-gray-600">
//                   Confidence: <span className="font-medium">{Number(item.confidence).toFixed(2)}</span>
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {result?.status === "success" && result?.final_result && (
//         <div className="mt-10 w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-2xl border border-yellow-300 px-6 py-6 text-center">
//           <h3 className="text-3xl font-bold text-yellow-700 mb-4 flex items-center justify-center gap-2">
//             🧠 Final Result
//           </h3>
//           <div className="p-4 rounded-xl bg-white shadow-lg border border-gray-200">
//             <p className="text-lg font-semibold text-green-700 mb-2">
//               <CheckCircle className="inline-block w-5 h-5 mr-2" />
//               {finalPrediction}
//             </p>
//             {detectedDiseases.length >= 1 && (
//               <div className="mt-4 text-sm text-gray-700">
//                 <ul className="list-none space-y-1">
//                   {Object.entries(diseaseImageMap).map(([disease, images]) => (
//                     <li key={disease}>
//                       {disease.charAt(0).toUpperCase() + disease.slice(1)}: {images.join(", ")}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {detectedDiseases.length > 0 && (
//               <p className="text-sm text-gray-600 mt-2">
//                 Based on {Object.values(diseaseImageMap).flat().length} mango images
//               </p>
//             )}
//           </div>

//           {detectedDiseases.length > 0 && (
//             <div className="mt-6 space-y-2">
//               {detectedDiseases.map((disease) => (
//                 <Link
//                   key={disease}
//                   to={{
//                     pathname: disease.toLowerCase() === "anthracnose" ? "/anthracnose" : "/sap",
//                     state: { selectedDisease: disease, savedFiles: selectedFile, savedPreview: preview },
//                   }}
//                   className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 hover:scale-[1.02] transition duration-300 w-full max-w-xs"
//                   aria-label={`Learn more about ${disease}`}
//                 >
//                   Learn More About {disease.charAt(0).toUpperCase() + disease.slice(1)}
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


























