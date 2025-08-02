
// import React, { useRef, useContext, useEffect, useState } from "react";
// import Guidelines from "./GuideLines";
// import axios from "axios";
// import {
//   Camera,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   X,
//   RefreshCw,
//   Info,
// } from "lucide-react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext";

// const Home = () => {
//   const {
//     updateMangoData,
//     error,
//     selectedFile,
//     setSelectedFile,
//     preview,
//     setPreview,
//     result,
//     setResult,
//   } = useContext(AppContext);

//   const [loading, setLoading] = useState(false);
//   const [fileError, setFileError] = useState("Please select exactly 4 images to analyze.");
//   const [isRemoving, setIsRemoving] = useState(false);
//   const [lastRemovedIndex, setLastRemovedIndex] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   const fileInputRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if popup has been shown before
//     const hasSeenPopup = localStorage.getItem("hasSeenGuidelinesPopup");
//     if (!hasSeenPopup) {
//       setShowPopup(true);
//     }

//     console.log("Home.jsx useEffect triggered", {
//       pathname: location.pathname,
//       state: location.state,
//       locationKey: location.key,
//       sessionStoragePreview: sessionStorage.getItem("savedPreview"),
//       sessionStorageFiles: sessionStorage.getItem("savedFiles"),
//     });

//     const state = location.state || {};
//     const savedFiles = state.savedFiles || null;
//     const savedPreview = state.savedPreview || null;

//     if (savedFiles && savedPreview && savedPreview.length > 0) {
//       console.log("Restoring from location.state:", {
//         savedFiles: savedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
//         savedPreview,
//       });

//       setSelectedFile(savedFiles);
//       setPreview(savedPreview);
//       setFileError(
//         savedFiles.length === 4
//           ? null
//           : `Restored ${savedFiles.length} images. Please select ${4 - savedFiles.length} more image(s) to reach 4.`
//       );

//       sessionStorage.setItem(
//         "savedFiles",
//         JSON.stringify(savedFiles.map(f => ({
//           name: f.name,
//           type: f.type,
//           size: f.size,
//         })))
//       );
//       sessionStorage.setItem("savedPreview", JSON.stringify(savedPreview));
//     } else {
//       console.log("location.state is empty or incomplete", {
//         savedFiles: savedFiles ? "present" : "null",
//         savedPreview: savedPreview ? "present" : "null",
//         rawState: state,
//       });

//       const previewFromStorage = sessionStorage.getItem("savedPreview");
//       const filesFromStorage = sessionStorage.getItem("savedFiles");

//       if (previewFromStorage && filesFromStorage) {
//         try {
//           const parsedPreview = JSON.parse(previewFromStorage);
//           const parsedFiles = JSON.parse(filesFromStorage);

//           if (
//             Array.isArray(parsedPreview) &&
//             parsedPreview.every(img => img.url && img.number && img.id) &&
//             Array.isArray(parsedFiles)
//           ) {
//             console.log("Restoring from sessionStorage:", {
//               parsedPreview,
//               parsedFiles,
//             });

//             setPreview(parsedPreview);
//             setSelectedFile([]);
//             setFileError("");

//             sessionStorage.setItem("savedFiles", JSON.stringify(parsedFiles));
//             sessionStorage.setItem("savedPreview", JSON.stringify(parsedPreview));
//           } else {
//             console.error("Invalid sessionStorage format:", {
//               parsedPreview,
//               parsedFiles,
//             });
//             throw new Error("Invalid sessionStorage data");
//           }
//         } catch (err) {
//           console.error("Error parsing sessionStorage:", err);
//           setSelectedFile([]);
//           setPreview([]);
//           setFileError("Please select exactly 4 images to analyze.");
//           sessionStorage.removeItem("savedFiles");
//           sessionStorage.removeItem("savedPreview");
//         }
//       } else {
//         console.log("No saved data in sessionStorage or location.state, initializing empty state");
//         setSelectedFile([]);
//         setPreview([]);
//         setFileError("Please select exactly 4 images to analyze.");
//       }
//     }
//   }, [location, setSelectedFile, setPreview]);

//   const handleFileChange = (e) => {
//     try {
//       const newFiles = Array.from(e.target.files);
//       console.log(
//         "Selected files:",
//         newFiles.map((f) => ({ name: f.name, type: f.type, size: f.size }))
//       );

//       const validTypes = ["image/jpeg", "image/png"];
//       const maxSize = 10 * 1024 * 1024; // 10MB

//       const invalidFiles = newFiles.filter(
//         (file) => !validTypes.includes(file.type) || file.size > maxSize
//       );
//       if (invalidFiles.length > 0) {
//         setFileError("Only JPEG/PNG images under 10MB are allowed.");
//         console.log("Invalid files:", invalidFiles);
//         return;
//       }

//       const currentFiles = selectedFile || [];
//       const currentPreviews = preview || [];
//       const availableSlots = 4 - currentFiles.length;
//       const filesToAdd = newFiles.slice(0, availableSlots);

//       if (filesToAdd.length === 0 && currentFiles.length < 4) {
//         setFileError("No new images added. Please select more images to reach 4.");
//         return;
//       }

//       let allFiles = [...currentFiles];
//       if (lastRemovedIndex !== null && lastRemovedIndex < 4 && filesToAdd.length > 0) {
//         allFiles.splice(lastRemovedIndex, 0, ...filesToAdd);
//         allFiles = allFiles.slice(0, 4);
//         const newIndex = lastRemovedIndex + filesToAdd.length;
//         setLastRemovedIndex(allFiles.length < 4 && newIndex < 4 ? newIndex : null);
//       } else {
//         allFiles = [...currentFiles, ...filesToAdd].slice(0, 4);
//         setLastRemovedIndex(allFiles.length < 4 ? allFiles.length : null);
//       }

//       currentPreviews.forEach((img) => URL.revokeObjectURL(img.url));

//       const generatedPreview = allFiles.map((file, index) => ({
//         url: URL.createObjectURL(file),
//         number: `Image ${index + 1}`,
//         id: `${file.name}-${Date.now()}-${index}`,
//       }));

//       setSelectedFile(allFiles);
//       setPreview(generatedPreview);
//       setResult(null);

//       sessionStorage.setItem(
//         "savedFiles",
//         JSON.stringify(
//           allFiles.map((f) => ({
//             name: f.name,
//             type: f.type,
//             size: f.size,
//           }))
//         )
//       );
//       sessionStorage.setItem("savedPreview", JSON.stringify(generatedPreview));

//       setFileError(
//         allFiles.length === 4
//           ? null
//           : `Please select ${4 - allFiles.length} more image(s) to reach 4.`
//       );
//     } catch (err) {
//       console.error("Error in handleFileChange:", err);
//       setFileError("Error processing images. Please try again.");
//     }
//   };

//   const handleRemoveImage = (indexToRemove) => {
//     if (isRemoving) return;
//     setIsRemoving(true);

//     try {
//       const newFiles = selectedFile.filter((_, index) => index !== indexToRemove);
//       const newPreviews = preview.filter((_, index) => index !== indexToRemove);

//       if (preview[indexToRemove]) {
//         URL.revokeObjectURL(preview[indexToRemove].url);
//       }

//       setSelectedFile(newFiles);
//       setPreview(newPreviews);
//       setResult(null);
//       setLastRemovedIndex(indexToRemove);

//       if (newFiles.length > 0) {
//         sessionStorage.setItem(
//           "savedFiles",
//           JSON.stringify(
//             newFiles.map((f) => ({
//               name: f.name,
//               type: f.type,
//               size: f.size,
//             }))
//           )
//         );
//         sessionStorage.setItem("savedPreview", JSON.stringify(newPreviews));
//       } else {
//         sessionStorage.removeItem("savedFiles");
//         sessionStorage.removeItem("savedPreview");
//         setLastRemovedIndex(null);
//       }

//       setFileError(
//         newFiles.length === 0
//           ? "Please select exactly 4 images to analyze."
//           : `Please select ${4 - newFiles.length} more image(s) to reach 4.`
//       );
//     } catch (err) {
//       console.error("Error in handleRemoveImage:", err);
//       setFileError("Error removing image. Please try again.");
//     } finally {
//       setIsRemoving(false);
//     }
//   };

//   const triggerFileInput = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile || selectedFile.length !== 4) {
//       setFileError("Please select exactly 4 images.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const API_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/analyze/";
//       const formData = new FormData();

//       selectedFile.forEach((file) => {
//         formData.append("files", file);
//       });

//       const response = await axios.post(API_URL, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         timeout: 30000,
//       });

//       console.log("API response:", response.data);

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
//     } catch (error) {
//       console.error("Upload error:", error);
//       console.error("Error response:", error.response?.data);
//       const errorMsg = error.response
//         ? error.response.data?.message || error.response.data?.detail || "Server error occurred."
//         : "Network error. Please check your connection.";
//       setFileError(errorMsg);
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
//     if (fileInputRef.current) {
//       fileInputRef.current.value = null;
//     }
//     sessionStorage.removeItem("savedFiles");
//     sessionStorage.removeItem("savedPreview");
//     setLastRemovedIndex(null);
//     console.log("Cleared state on refresh");
//   };

//   const handleSkipPopup = () => {
//     setShowPopup(false);
//     localStorage.setItem("hasSeenGuidelinesPopup", "true");
//   };

//   const handleReadGuidelines = () => {
//     setShowPopup(false);
//     localStorage.setItem("hasSeenGuidelinesPopup", "true");
//     navigate("/guidelines", {
//       state: { savedFiles: selectedFile, savedPreview: preview },
//     });
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

//   let finalPrediction = "";
//   let finalConfidence = result?.final_result?.confidence || "";

//   if (allHealthy) {
//     finalPrediction = "🟢 Healthy";
//   } else if (detectedDiseases.length === 1) {
//     const disease = detectedDiseases[0];
//     finalPrediction = `🔴 ${disease.charAt(0).toUpperCase() + disease.slice(1)} detected`;
//   } else if (detectedDiseases.length > 1) {
//     finalPrediction = " Conclusion";
//   }

//   const cleanPrediction = (prediction) => {
//     return prediction.replace(/ – severity: \d+(\.\d+)?%/, '').trim();
//   };

//   console.log("Detected diseases:", detectedDiseases);
//   console.log("Disease image map:", diseaseImageMap);
//   console.log("All healthy:", allHealthy);

//   return (
//     <div className="w-[80%] px-6 py-10 m-auto bg-white shadow-inner relative border-white rounded">
//       {/* Guidelines Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//             <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">
//               Image Guidelines
//             </h2>
//             <p className="text-gray-600 mb-6 text-center">
//               Please review our image upload guidelines for accurate mango disease detection.
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleReadGuidelines}
//                 className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
//               >
//                 Read
//               </button>
//               <button
//                 onClick={handleSkipPopup}
//                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
//               >
//                 Skip
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
//         >
//           <Info className="w-5 h-5 mr-2" />
//           Guidelines
//         </Link>
//       </div>

//       <div className="flex flex-col items-center justify-center gap-10">
//         <h1 className="text-center text-5xl font-extrabold text-yellow-600 drop-shadow md:text-4xl">
//           🥭 Mango <span className="text-yellow-500">Analyzer</span>
//         </h1>
//         <div
//           onClick={triggerFileInput}
//           onKeyDown={(e) => e.key === "Enter" && triggerFileInput()}
//           role="button"
//           tabIndex={0}
//           aria-label="Click or press Enter to upload mango images"
//           className="w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center cursor-pointer"
//         >
//           <Camera className="w-10 h-10 text-yellow-600" />
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="hidden"
//             aria-label="Upload mango images"
//             disabled={loading}
//           />
//         </div>

//         {fileError && (
//           <div className="flex items-center text-red-600 mt-4">
//             <AlertCircle className="w-5 h-5 mr-2" />
//             {fileError}
//           </div>
//         )}

//         {preview && preview.length > 0 && (
//           <div className="flex flex-wrap gap-4 justify-center mt-4">
//             {preview.map((img, index) => (
//               <div
//                 key={img.id}
//                 className="relative w-32 h-32 border-2 border-yellow-300 rounded-xl overflow-hidden shadow-md group"
//               >
//                 <button
//                   onClick={() => handleRemoveImage(index)}
//                   disabled={isRemoving}
//                   aria-label={`Remove ${img.number}`}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//                 <img
//                   src={img.url}
//                   alt={`${img.number} Preview`}
//                   className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${
//                     loading ? "blur-sm brightness-110 contrast-125" : ""
//                   }`}
//                   onError={(e) => {
//                     console.error(`Error loading image ${img.number}:`, e);
//                     e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
//                   }}
//                 />
//                 <div className="absolute top-1 left-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded shadow">
//                   {img.number}
//                 </div>
//                 {loading && (
//                   <>
//                     <div className="absolute inset-0 bg-white/30 animate-scanner z-10" />
//                     <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded shadow z-20">
//                       Preprocessing...
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
// <div className="mt-4 flex flex-col items-center space-y-4">
//   <button
//     onClick={handleSubmit}
//     disabled={loading || selectedFile?.length !== 4}
//     className={`w-full max-w-xs px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
//       loading || selectedFile?.length !== 4
//         ? "bg-gray-400 cursor-not-allowed"
//         : "bg-yellow-500 hover:bg-yellow-600 hover:scale-[1.02]"
//     }`}
//   >
//     {loading ? (
//       <span className="flex items-center justify-center gap-2">
//         <Loader2 className="animate-spin w-4 h-4" />
//         Analyzing...
//       </span>
//     ) : (
//       "Upload & Analyze"
//     )}
//   </button>

//   {preview?.length > 0 && (
//     <button
//       onClick={handleRefresh}
//       className="w-full max-w-xs px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] transition duration-300"
//     >
//       <RefreshCw className="inline-block w-5 h-4 mr-2" />
//       Refresh
//     </button>
//   )}
// </div>


//       {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

//       {result?.status === "success" && result.individual_results && result.individual_results.length > 0 && (
//         <div className="mt-10">
//           <h2 className="text-xl font-bold text-center text-gray-700 mb-4">📸 Individual Results</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {result.individual_results.map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-4 border rounded-xl shadow text-left space-y-2"
//               >
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
//         <div className="mt-10 w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-2xl border border-yellow-300 px-6 py-6 text-center animate-fade-in">
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
//                 {/* <p className="font-semibold">Conclusion</p> */}
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
import React, { useRef, useContext, useEffect, useState } from "react";
import Guidelines from "./GuideLines";
import axios from "axios";
import {
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Info,
  Video,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const {
    updateMangoData,
    error,
    selectedFile,
    setSelectedFile,
    preview,
    setPreview,
    result,
    setResult,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("Please select exactly 4 images to analyze.");
  const [isRemoving, setIsRemoving] = useState(false);
  const [lastRemovedIndex, setLastRemovedIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [renderKey, setRenderKey] = useState(0); // Added for mobile re-render
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isCameraAvailable = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  useEffect(() => {
    console.log("Home.jsx useEffect triggered", {
      pathname: location.pathname,
      state: location.state,
      selectedFile: selectedFile?.map((f) => f.name),
      preview: preview?.map((p) => p.number),
    });

    const hasSeenPopup = localStorage.getItem("hasSeenGuidelinesPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
    }

    const state = location.state || {};
    const savedFiles = state.savedFiles || [];
    const savedPreview = state.savedPreview || [];

    if (savedFiles.length > 0 && savedPreview.length > 0) {
      console.log("Restoring from location.state:", {
        savedFiles: savedFiles.map((f) => ({ name: f.name, type: f.type, size: f.size })),
        savedPreview,
      });
      setSelectedFile(savedFiles);
      setPreview(savedPreview);
      setFileError(
        savedFiles.length === 4
          ? null
          : `Restored ${savedFiles.length} images. Please select ${4 - savedFiles.length} more image(s) to reach 4.`
      );
    } else {
      console.log("No valid location.state, initializing empty state");
      setSelectedFile([]);
      setPreview([]);
      setFileError("Please select exactly 4 images to analyze.");
      sessionStorage.removeItem("savedFiles");
      sessionStorage.removeItem("savedPreview");
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [location, setSelectedFile, setPreview, cameraStream]);

  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      console.log("Assigning stream to video element");
      videoRef.current.srcObject = cameraStream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch((playError) => {
          console.error("Error playing video:", playError);
          setFileError("Failed to play camera stream. Please try again.");
          cameraStream.getTracks().forEach((track) => track.stop());
          setShowCamera(false);
          setCameraStream(null);
        });
      };
    }
  }, [showCamera, cameraStream]);

  useEffect(() => {
    console.log("Current state after render:", {
      selectedFile: selectedFile?.map((f) => f.name),
      preview: preview?.map((p) => p.number),
    });
  }, [selectedFile, preview]);

  const handleFileChange = (e) => {
    try {
      const newFiles = Array.from(e.target.files);
      console.log("handleFileChange input:", newFiles.map((f) => f.name));

      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      const invalidFiles = newFiles.filter(
        (file) => !validTypes.includes(file.type) || file.size > maxSize
      );
      if (invalidFiles.length > 0) {
        setFileError("Only JPEG/PNG images under 10MB are allowed.");
        console.log("Invalid files:", invalidFiles);
        return;
      }

      setSelectedFile((prev) => {
        const currentFiles = prev || [];
        const availableSlots = 4 - currentFiles.length;
        const filesToAdd = newFiles.slice(0, availableSlots);

        if (filesToAdd.length === 0 && currentFiles.length < 4) {
          setFileError("No new images added. Please select more images to reach 4.");
          return prev;
        }

        const allFiles = [...currentFiles, ...filesToAdd].slice(0, 4);
        console.log("handleFileChange new files:", allFiles.map((f) => f.name));

        setPreview((prevPreview) => {
          prevPreview?.forEach((img) => URL.revokeObjectURL(img.url));
          const generatedPreview = allFiles.map((file, index) => ({
            url: URL.createObjectURL(file),
            number: `Image ${index + 1}`,
            id: `${file.name}-${Date.now()}-${index}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
          }));
          console.log("handleFileChange new preview:", generatedPreview.map((p) => p.number));

          sessionStorage.setItem(
            "savedFiles",
            JSON.stringify(allFiles.map((f) => ({
              name: f.name,
              type: f.type,
              size: f.size,
            })))
          );
          sessionStorage.setItem("savedPreview", JSON.stringify(generatedPreview));

          setFileError(
            allFiles.length === 4
              ? null
              : `Please select ${4 - allFiles.length} more image(s) to reach 4.`
          );
          setResult(null);
          setLastRemovedIndex(allFiles.length < 4 ? allFiles.length : null);
          setRenderKey((prev) => prev + 1); // Force re-render

          return generatedPreview;
        });

        return allFiles;
      });
    } catch (err) {
      console.error("Error in handleFileChange:", err);
      setFileError("Error processing images. Please try again.");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    if (isRemoving) return;
    setIsRemoving(true);

    try {
      setSelectedFile((prev) => {
        const newFiles = prev.filter((_, index) => index !== indexToRemove);
        setPreview((prevPreview) => {
          const newPreviews = prevPreview.filter((_, index) => index !== indexToRemove);
          if (prevPreview[indexToRemove]) {
            URL.revokeObjectURL(prevPreview[indexToRemove].url);
          }

          if (newFiles.length > 0) {
            sessionStorage.setItem(
              "savedFiles",
              JSON.stringify(
                newFiles.map((f) => ({
                  name: f.name,
                  type: f.type,
                  size: f.size,
                }))
              )
            );
            sessionStorage.setItem("savedPreview", JSON.stringify(newPreviews));
          } else {
            sessionStorage.removeItem("savedFiles");
            sessionStorage.removeItem("savedPreview");
          }

          setFileError(
            newFiles.length === 0
              ? "Please select exactly 4 images to analyze."
              : `Please select ${4 - newFiles.length} more image(s) to reach 4.`
          );
          setResult(null);
          setLastRemovedIndex(indexToRemove);
          setRenderKey((prev) => prev + 1); // Force re-render

          console.log("After remove:", {
            newFiles: newFiles.map((f) => f.name),
            newPreviews: newPreviews.map((p) => p.number),
          });

          return newPreviews;
        });

        return newFiles;
      });
    } catch (err) {
      console.error("Error in handleRemoveImage:", err);
      setFileError("Error removing image. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openCamera = async () => {
    if (selectedFile.length >= 4) {
      setFileError("Cannot add more images. Maximum of 4 images reached.");
      return;
    }

    if (!window.isSecureContext) {
      setFileError("Camera access requires a secure context (HTTPS). Please access the site via HTTPS.");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setFileError("Camera is not supported on this device. Please upload images manually.");
      return;
    }

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
      } catch (envError) {
        console.warn("Environment camera not available, trying default camera:", envError);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
      }

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
      let errorMessage = "Could not access camera. Please select images manually.";
      if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "No camera found on this device. Please upload images manually.";
      } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Camera access denied. Please grant camera permissions and try again.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Camera is in use by another application. Please close it and try again.";
      } else if (err.name === "SecurityError") {
        errorMessage = "Camera access requires a secure context (HTTPS). Please contact support.";
      }
      setFileError(errorMessage);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      setFileError("Camera is not ready. Please try again.");
      console.log("captureImage: Video or canvas ref missing");
      return;
    }

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setFileError("Camera stream is not rendering. Please try again.");
      console.log("captureImage: Invalid video dimensions");
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    console.log("captureImage: Capturing image from canvas");

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setFileError("Failed to capture image. Please try again.");
          console.log("captureImage: Blob creation failed");
          return;
        }

        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        console.log("captureImage: Created file", { name: file.name, size: file.size });

        setSelectedFile((prev) => {
          const currentFiles = prev || [];
          const currentPreviews = preview || [];
          const availableSlots = 4 - currentFiles.length;

          console.log("captureImage Before:", {
            currentFiles: currentFiles.map((f) => f.name),
            currentPreviews: currentPreviews.map((p) => p.number),
            availableSlots,
          });

          if (availableSlots === 0) {
            setFileError("Cannot add more images. Maximum of 4 images reached.");
            console.log("captureImage: Max images reached");
            return prev;
          }

          // Clear sessionStorage to prevent stale data
          sessionStorage.removeItem("savedFiles");
          sessionStorage.removeItem("savedPreview");

          const allFiles = [...currentFiles, file].slice(0, 4);
          currentPreviews.forEach((img) => URL.revokeObjectURL(img.url));
          const generatedPreview = allFiles.map((f, index) => ({
            url: URL.createObjectURL(f),
            number: `Image ${index + 1}`,
            id: `${f.name}-${Date.now()}-${index}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
          }));

          console.log("captureImage After:", {
            allFiles: allFiles.map((f) => f.name),
            generatedPreview: generatedPreview.map((p) => p.number),
          });

          // Update sessionStorage
          sessionStorage.setItem(
            "savedFiles",
            JSON.stringify(allFiles.map((f) => ({
              name: f.name,
              type: f.type,
              size: f.size,
            })))
          );
          sessionStorage.setItem("savedPreview", JSON.stringify(generatedPreview));

          // Update state with delay for mobile browsers
          setTimeout(() => {
            setPreview(generatedPreview);
            setSelectedFile(allFiles);
            setFileError(
              allFiles.length === 4
                ? null
                : `Please select ${4 - allFiles.length} more image(s) to reach 4.`
            );
            setResult(null);
            setLastRemovedIndex(allFiles.length < 4 ? allFiles.length : null);
            setRenderKey((prev) => prev + 1); // Force re-render
          }, 0);

          return allFiles;
        });

        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
        }
        setShowCamera(false);
        setCameraStream(null);
      },
      "image/jpeg",
      0.9
    );
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setCameraStream(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile || selectedFile.length !== 4) {
      setFileError("Please select exactly 4 images.");
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/analyze/";
      const formData = new FormData();

      selectedFile.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      console.log("API response:", response.data);

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
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg = error.response
        ? error.response.data?.message || error.response.data?.detail || "Server error occurred."
        : "Network error. Please check your connection.";
      setFileError(errorMsg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    preview?.forEach((img) => URL.revokeObjectURL(img.url));
    setSelectedFile([]);
    setPreview([]);
    setResult(null);
    setFileError("Please select exactly 4 images to analyze.");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    sessionStorage.removeItem("savedFiles");
    sessionStorage.removeItem("savedPreview");
    setLastRemovedIndex(null);
    setRenderKey((prev) => prev + 1);
    console.log("Cleared state on refresh");
  };

  const handleSkipPopup = () => {
    setShowPopup(false);
    localStorage.setItem("hasSeenGuidelinesPopup", "true");
  };

  const handleReadGuidelines = () => {
    setShowPopup(false);
    localStorage.setItem("hasSeenGuidelinesPopup", "true");
    navigate("/guidelines", {
      state: { savedFiles: selectedFile, savedPreview: preview },
    });
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

  let finalPrediction = "";
  let finalConfidence = result?.final_result?.confidence || "";

  if (allHealthy) {
    finalPrediction = "🟢 Healthy";
  } else if (detectedDiseases.length === 1) {
    const disease = detectedDiseases[0];
    finalPrediction = `🔴 ${disease.charAt(0).toUpperCase() + disease.slice(1)} detected`;
  } else if (detectedDiseases.length > 1) {
    finalPrediction = "🔴 Conclusion";
  }

  const cleanPrediction = (prediction) => {
    return prediction.replace(/ – severity: \d+(\.\d+)?%/, "").trim();
  };

  console.log("Detected diseases:", detectedDiseases);
  console.log("Disease image map:", diseaseImageMap);
  console.log("All healthy:", allHealthy);

  return (
    <div className="w-[80%] px-6 py-10 m-auto bg-white shadow-inner relative border-white rounded">
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">
              Image Guidelines
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Please review our image upload guidelines for accurate mango disease detection.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReadGuidelines}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
              >
                Read
              </button>
              <button
                onClick={handleSkipPopup}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-yellow-600 mb-4 text-center">
              Capture Image
            </h2>
            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={captureImage}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
              >
                Capture
              </button>
              <button
                onClick={closeCamera}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
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
        >
          <Info className="w-5 h-5 mr-2" />
          Guidelines
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center gap-10">
        <h1 className="text-center text-5xl font-extrabold text-yellow-600 drop-shadow md:text-4xl">
          🥭 Mango <span className="text-yellow-500">Analyzer</span>
        </h1>
        <div className="flex gap-4">
          <div
            onClick={triggerFileInput}
            onKeyDown={(e) => e.key === "Enter" && triggerFileInput()}
            role="button"
            tabIndex={0}
            aria-label="Click or press Enter to upload mango images"
            className="w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            <Camera className="w-10 h-10 text-yellow-600" />
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload mango images"
              disabled={loading}
            />
          </div>
          {isCameraAvailable && (
            <div
              onClick={openCamera}
              onKeyDown={(e) => e.key === "Enter" && openCamera()}
              role="button"
              tabIndex={0}
              aria-label="Click or press Enter to open camera"
              className="w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <Video className="w-10 h-10 text-yellow-600" />
            </div>
          )}
        </div>

        {fileError && (
          <div className="flex items-center text-red-600 mt-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            {fileError}
          </div>
        )}

        {preview && preview.length > 0 && (
          <div key={renderKey} className="flex flex-wrap gap-4 justify-center mt-4">
            {preview.map((img, index) => (
              <div
                key={img.id}
                className="relative w-32 h-32 border-2 border-yellow-300 rounded-xl overflow-hidden shadow-md group"
              >
                <button
                  onClick={() => handleRemoveImage(index)}
                  disabled={isRemoving}
                  aria-label={`Remove ${img.number}`}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={img.url}
                  alt={`${img.number} Preview`}
                  className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${
                    loading ? "blur-sm brightness-110 contrast-125" : ""
                  }`}
                  onError={(e) => {
                    console.error(`Error loading image ${img.number}:`, e);
                    e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                  }}
                />
                <div className="absolute top-1 left-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded shadow">
                  {img.number}
                </div>
                {loading && (
                  <>
                    <div className="absolute inset-0 bg-white/30 animate-scanner z-10" />
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded shadow z-20">
                      Preprocessing...
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center space-y-4">
        <button
          onClick={handleSubmit}
          disabled={loading || selectedFile?.length !== 4}
          className={`w-full max-w-xs px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
            loading || selectedFile?.length !== 4
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 hover:scale-[1.02]"
          }`}
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
          >
            <RefreshCw className="inline-block w-5 h-4 mr-2" />
            Refresh
          </button>
        )}
      </div>

      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

      {result?.status === "success" && result.individual_results && result.individual_results.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-center text-gray-700 mb-4">📸 Individual Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {result.individual_results.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 border rounded-xl shadow text-left space-y-2"
              >
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
        <div className="mt-10 w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-2xl border border-yellow-300 px-6 py-6 text-center animate-fade-in">
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
// import Guidelines from "./GuideLines";
// import axios from "axios";
// import {
//   Camera,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   X,
//   RefreshCw,
//   Info,
//   Video,
// } from "lucide-react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext";

// const Home = () => {
//   const {
//     updateMangoData,
//     error,
//     selectedFile,
//     setSelectedFile,
//     preview,
//     setPreview,
//     result,
//     setResult,
//   } = useContext(AppContext);

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

//   useEffect(() => {
//     // Check if popup has been shown before
//     const hasSeenPopup = localStorage.getItem("hasSeenGuidelinesPopup");
//     if (!hasSeenPopup) {
//       setShowPopup(true);
//     }

//     console.log("Home.jsx useEffect triggered", {
//       pathname: location.pathname,
//       state: location.state,
//       locationKey: location.key,
//       sessionStoragePreview: sessionStorage.getItem("savedPreview"),
//       sessionStorageFiles: sessionStorage.getItem("savedFiles"),
//     });

//     const state = location.state || {};
//     const savedFiles = state.savedFiles || null;
//     const savedPreview = state.savedPreview || null;

//     if (savedFiles && savedPreview && savedPreview.length > 0) {
//       console.log("Restoring from location.state:", {
//         savedFiles: savedFiles.map((f) => ({ name: f.name, type: f.type, size: f.size })),
//         savedPreview,
//       });

//       setSelectedFile(savedFiles);
//       setPreview(savedPreview);
//       setFileError(
//         savedFiles.length === 4
//           ? null
//           : `Restored ${savedFiles.length} images. Please select ${4 - savedFiles.length} more image(s) to reach 4.`
//       );

//       sessionStorage.setItem(
//         "savedFiles",
//         JSON.stringify(savedFiles.map((f) => ({
//           name: f.name,
//           type: f.type,
//           size: f.size,
//         })))
//       );
//       sessionStorage.setItem("savedPreview", JSON.stringify(savedPreview));
//     } else {
//       console.log("location.state is empty or incomplete", {
//         savedFiles: savedFiles ? "present" : "null",
//         savedPreview: savedPreview ? "present" : "null",
//         rawState: state,
//       });

//       const previewFromStorage = sessionStorage.getItem("savedPreview");
//       const filesFromStorage = sessionStorage.getItem("savedFiles");

//       if (previewFromStorage && filesFromStorage) {
//         try {
//           const parsedPreview = JSON.parse(previewFromStorage);
//           const parsedFiles = JSON.parse(filesFromStorage);

//           if (
//             Array.isArray(parsedPreview) &&
//             parsedPreview.every((img) => img.url && img.number && img.id) &&
//             Array.isArray(parsedFiles)
//           ) {
//             console.log("Restoring from sessionStorage:", {
//               parsedPreview,
//               parsedFiles,
//             });

//             setPreview(parsedPreview);
//             setSelectedFile([]);
//             setFileError("");

//             sessionStorage.setItem("savedFiles", JSON.stringify(parsedFiles));
//             sessionStorage.setItem("savedPreview", JSON.stringify(parsedPreview));
//           } else {
//             console.error("Invalid sessionStorage format:", {
//               parsedPreview,
//               parsedFiles,
//             });
//             throw new Error("Invalid sessionStorage data");
//           }
//         } catch (err) {
//           console.error("Error parsing sessionStorage:", err);
//           setSelectedFile([]);
//           setPreview([]);
//           setFileError("Please select exactly 4 images to analyze.");
//           sessionStorage.removeItem("savedFiles");
//           sessionStorage.removeItem("savedPreview");
//         }
//       } else {
//         console.log("No saved data in sessionStorage or location.state, initializing empty state");
//         setSelectedFile([]);
//         setPreview([]);
//         setFileError("Please select exactly 4 images to analyze.");
//       }
//     }

//     // Cleanup camera stream on component unmount
//     return () => {
//       if (cameraStream) {
//         cameraStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [location, setSelectedFile, setPreview, cameraStream]);

//   // New useEffect to handle stream assignment after showCamera is true
//   useEffect(() => {
//     if (showCamera && cameraStream && videoRef.current) {
//       console.log("Assigning stream to video element");
//       videoRef.current.srcObject = cameraStream;
//       videoRef.current.onloadedmetadata = () => {
//         videoRef.current.play().catch((playError) => {
//           console.error("Error playing video:", playError);
//           setFileError("Failed to play camera stream. Please try again.");
//           cameraStream.getTracks().forEach((track) => track.stop());
//           setShowCamera(false);
//           setCameraStream(null);
//         });
//       };
//     }
//   }, [showCamera, cameraStream]);

//   const handleFileChange = (e) => {
//     try {
//       const newFiles = Array.from(e.target.files);
//       console.log(
//         "Selected files:",
//         newFiles.map((f) => ({ name: f.name, type: f.type, size: f.size }))
//       );

//       const validTypes = ["image/jpeg", "image/png"];
//       const maxSize = 10 * 1024 * 1024; // 10MB

//       const invalidFiles = newFiles.filter(
//         (file) => !validTypes.includes(file.type) || file.size > maxSize
//       );
//       if (invalidFiles.length > 0) {
//         setFileError("Only JPEG/PNG images under 10MB are allowed.");
//         console.log("Invalid files:", invalidFiles);
//         return;
//       }

//       const currentFiles = selectedFile || [];
//       const currentPreviews = preview || [];
//       const availableSlots = 4 - currentFiles.length;
//       const filesToAdd = newFiles.slice(0, availableSlots);

//       if (filesToAdd.length === 0 && currentFiles.length < 4) {
//         setFileError("No new images added. Please select more images to reach 4.");
//         return;
//       }

//       let allFiles = [...currentFiles];
//       if (lastRemovedIndex !== null && lastRemovedIndex < 4 && filesToAdd.length > 0) {
//         allFiles.splice(lastRemovedIndex, 0, ...filesToAdd);
//         allFiles = allFiles.slice(0, 4);
//         const newIndex = lastRemovedIndex + filesToAdd.length;
//         setLastRemovedIndex(allFiles.length < 4 && newIndex < 4 ? newIndex : null);
//       } else {
//         allFiles = [...currentFiles, ...filesToAdd].slice(0, 4);
//         setLastRemovedIndex(allFiles.length < 4 ? allFiles.length : null);
//       }

//       currentPreviews.forEach((img) => URL.revokeObjectURL(img.url));

//       const generatedPreview = allFiles.map((file, index) => ({
//         url: URL.createObjectURL(file),
//         number: `Image ${index + 1}`,
//         id: `${file.name}-${Date.now()}-${index}`,
//       }));

//       setSelectedFile(allFiles);
//       setPreview(generatedPreview);
//       setResult(null);

//       sessionStorage.setItem(
//         "savedFiles",
//         JSON.stringify(
//           allFiles.map((f) => ({
//             name: f.name,
//             type: f.type,
//             size: f.size,
//           }))
//         )
//       );
//       sessionStorage.setItem("savedPreview", JSON.stringify(generatedPreview));

//       setFileError(
//         allFiles.length === 4
//           ? null
//           : `Please select ${4 - allFiles.length} more image(s) to reach 4.`
//       );
//     } catch (err) {
//       console.error("Error in handleFileChange:", err);
//       setFileError("Error processing images. Please try again.");
//     }
//   };

//   const handleRemoveImage = (indexToRemove) => {
//     if (isRemoving) return;
//     setIsRemoving(true);

//     try {
//       const newFiles = selectedFile.filter((_, index) => index !== indexToRemove);
//       const newPreviews = preview.filter((_, index) => index !== indexToRemove);

//       if (preview[indexToRemove]) {
//         URL.revokeObjectURL(preview[indexToRemove].url);
//       }

//       setSelectedFile(newFiles);
//       setPreview(newPreviews);
//       setResult(null);
//       setLastRemovedIndex(indexToRemove);

//       if (newFiles.length > 0) {
//         sessionStorage.setItem(
//           "savedFiles",
//           JSON.stringify(
//             newFiles.map((f) => ({
//               name: f.name,
//               type: f.type,
//               size: f.size,
//             }))
//           )
//         );
//         sessionStorage.setItem("savedPreview", JSON.stringify(newPreviews));
//       } else {
//         sessionStorage.removeItem("savedFiles");
//         sessionStorage.removeItem("savedPreview");
//         setLastRemovedIndex(null);
//       }

//       setFileError(
//         newFiles.length === 0
//           ? "Please select exactly 4 images to analyze."
//           : `Please select ${4 - newFiles.length} more image(s) to reach 4.`
//       );
//     } catch (err) {
//       console.error("Error in handleRemoveImage:", err);
//       setFileError("Error removing image. Please try again.");
//     } finally {
//       setIsRemoving(false);
//     }
//   };

//   const triggerFileInput = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const openCamera = async () => {
//     if (selectedFile.length >= 4) {
//       setFileError("Cannot add more images. Maximum of 4 images reached.");
//       return;
//     }

//     if (!window.isSecureContext) {
//       setFileError("Camera access requires a secure context (HTTPS). Please access the site via HTTPS.");
//       return;
//     }

//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       setFileError("Camera is not supported on this device. Please upload images manually.");
//       return;
//     }

//     try {
//       let stream;
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: "environment",
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//         });
//       } catch (envError) {
//         console.warn("Environment camera not available, trying default camera:", envError);
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//         });
//       }

//       // Log stream details for debugging
//       stream.getVideoTracks().forEach((track) => {
//         console.log("Camera track:", {
//           label: track.label,
//           enabled: track.enabled,
//           state: track.readyState,
//         });
//       });

//       setCameraStream(stream);
//       setShowCamera(true); // This triggers the useEffect to assign the stream
//     } catch (err) {
//       console.error("Error accessing camera:", err.name, err.message);
//       let errorMessage = "Could not access camera. Please select images manually.";
//       if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
//         errorMessage = "No camera found on this device. Please upload images manually.";
//       } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
//         errorMessage = "Camera access denied. Please grant camera permissions and try again.";
//       } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
//         errorMessage = "Camera is in use by another application. Please close it and try again.";
//       } else if (err.name === "SecurityError") {
//         errorMessage = "Camera access requires a secure context (HTTPS). Please contact support.";
//       }
//       setFileError(errorMessage);
//     }
//   };

//   const captureImage = () => {
//     if (!videoRef.current || !canvasRef.current) {
//       setFileError("Camera is not ready. Please try again.");
//       return;
//     }

//     const video = videoRef.current;
//     if (video.videoWidth === 0 || video.videoHeight === 0) {
//       setFileError("Camera stream is not rendering. Please try again.");
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
//         const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
//           type: "image/jpeg",
//         });
//         const currentFiles = selectedFile || [];
//         const currentPreviews = preview || [];
//         const availableSlots = 4 - currentFiles.length;

//         if (availableSlots === 0) {
//           setFileError("Cannot add more images. Maximum of 4 images reached.");
//           return;
//         }

//         let allFiles = [...currentFiles];
//         if (lastRemovedIndex !== null && lastRemovedIndex < 4) {
//           allFiles.splice(lastRemovedIndex, 0, file);
//           allFiles = allFiles.slice(0, 4);
//           const newIndex = lastRemovedIndex + 1;
//           setLastRemovedIndex(allFiles.length < 4 && newIndex < 4 ? newIndex : null);
//         } else {
//           allFiles = [...currentFiles, file].slice(0, 4);
//           setLastRemovedIndex(allFiles.length < 4 ? allFiles.length : null);
//         }

//         currentPreviews.forEach((img) => URL.revokeObjectURL(img.url));

//         const generatedPreview = allFiles.map((f, index) => ({
//           url: URL.createObjectURL(f),
//           number: `Image ${index + 1}`,
//           id: `${f.name}-${Date.now()}-${index}`,
//         }));

//         setSelectedFile(allFiles);
//         setPreview(generatedPreview);
//         setResult(null);

//         sessionStorage.setItem(
//           "savedFiles",
//           JSON.stringify(
//             allFiles.map((f) => ({
//               name: f.name,
//               type: f.type,
//               size: f.size,
//             }))
//           )
//         );
//         sessionStorage.setItem("savedPreview", JSON.stringify(generatedPreview));

//         setFileError(
//           allFiles.length === 4
//             ? null
//             : `Please select ${4 - allFiles.length} more image(s) to reach 4.`
//         );

//         // Stop camera stream
//         if (cameraStream) {
//           cameraStream.getTracks().forEach((track) => track.stop());
//         }
//         setShowCamera(false);
//         setCameraStream(null);
//       },
//       "image/jpeg",
//       0.9
//     );
//   };

//   const closeCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach((track) => track.stop());
//     }
//     setShowCamera(false);
//     setCameraStream(null);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile || selectedFile.length !== 4) {
//       setFileError("Please select exactly 4 images.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const API_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/analyze/";
//       const formData = new FormData();

//       selectedFile.forEach((file) => {
//         formData.append("files", file);
//       });

//       const response = await axios.post(API_URL, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         timeout: 30000,
//       });

//       console.log("API response:", response.data);

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
//     } catch (error) {
//       console.error("Upload error:", error);
//       console.error("Error response:", error.response?.data);
//       const errorMsg = error.response
//         ? error.response.data?.message || error.response.data?.detail || "Server error occurred."
//         : "Network error. Please check your connection.";
//       setFileError(errorMsg);
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
//     if (fileInputRef.current) {
//       fileInputRef.current.value = null;
//     }
//     sessionStorage.removeItem("savedFiles");
//     sessionStorage.removeItem("savedPreview");
//     setLastRemovedIndex(null);
//     console.log("Cleared state on refresh");
//   };

//   const handleSkipPopup = () => {
//     setShowPopup(false);
//     localStorage.setItem("hasSeenGuidelinesPopup", "true");
//   };

//   const handleReadGuidelines = () => {
//     setShowPopup(false);
//     localStorage.setItem("hasSeenGuidelinesPopup", "true");
//     navigate("/guidelines", {
//       state: { savedFiles: selectedFile, savedPreview: preview },
//     });
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

//   let finalPrediction = "";
//   let finalConfidence = result?.final_result?.confidence || "";

//   if (allHealthy) {
//     finalPrediction = "🟢 Healthy";
//   } else if (detectedDiseases.length === 1) {
//     const disease = detectedDiseases[0];
//     finalPrediction = `🔴 ${disease.charAt(0).toUpperCase() + disease.slice(1)} detected`;
//   } else if (detectedDiseases.length > 1) {
//     finalPrediction = "🔴 Conclusion";
//   }

//   const cleanPrediction = (prediction) => {
//     return prediction.replace(/ – severity: \d+(\.\d+)?%/, "").trim();
//   };

//   console.log("Detected diseases:", detectedDiseases);
//   console.log("Disease image map:", diseaseImageMap);
//   console.log("All healthy:", allHealthy);

//   return (
//     <div className="w-[80%] px-6 py-10 m-auto bg-white shadow-inner relative border-white rounded">
//       {/* Guidelines Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//             <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">
//               Image Guidelines
//             </h2>
//             <p className="text-gray-600 mb-6 text-center">
//               Please review our image upload guidelines for accurate mango disease detection.
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleReadGuidelines}
//                 className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
//               >
//                 Read
//               </button>
//               <button
//                 onClick={handleSkipPopup}
//                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
//               >
//                 Skip
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Camera Modal */}
//       {showCamera && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
//             <h2 className="text-xl font-bold text-yellow-600 mb-4 text-center">
//               Capture Image
//             </h2>
//             <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
//               <video
//                 ref={videoRef}
//                 className="w-full h-full object-cover"
//                 autoPlay
//                 playsInline
//               />
//               <canvas ref={canvasRef} className="hidden" />
//             </div>
//             <div className="flex justify-center gap-4 mt-4">
//               <button
//                 onClick={captureImage}
//                 className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
//               >
//                 Capture
//               </button>
//               <button
//                 onClick={closeCamera}
//                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
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
//         >
//           <Info className="w-5 h-5 mr-2" />
//           Guidelines
//         </Link>
//       </div>

//       <div className="flex flex-col items-center justify-center gap-10">
//         <h1 className="text-center text-5xl font-extrabold text-yellow-600 drop-shadow md:text-4xl">
//           🥭 Mango <span className="text-yellow-500">Analyzer</span>
//         </h1>
//         <div className="flex gap-4">
//           <div
//             onClick={triggerFileInput}
//             onKeyDown={(e) => e.key === "Enter" && triggerFileInput()}
//             role="button"
//             tabIndex={0}
//             aria-label="Click or press Enter to upload mango images"
//             className="w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center cursor-pointer"
//           >
//             <Camera className="w-10 h-10 text-yellow-600" />
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//               aria-label="Upload mango images"
//               disabled={loading}
//             />
//           </div>
//           {isCameraAvailable && (
//             <div
//               onClick={openCamera}
//               onKeyDown={(e) => e.key === "Enter" && openCamera()}
//               role="button"
//               tabIndex={0}
//               aria-label="Click or press Enter to open camera"
//               className="w-48 h-48 border-4 border-dashed border-yellow-400 bg-white shadow-lg hover:bg-yellow-50 transition-all duration-300 flex items-center justify-center cursor-pointer"
//             >
//               <Video className="w-10 h-10 text-yellow-600" />
//             </div>
//           )}
//         </div>

//         {fileError && (
//           <div className="flex items-center text-red-600 mt-4">
//             <AlertCircle className="w-5 h-5 mr-2" />
//             {fileError}
//           </div>
//         )}

//         {preview && preview.length > 0 && (
//           <div className="flex flex-wrap gap-4 justify-center mt-4">
//             {preview.map((img, index) => (
//               <div
//                 key={img.id}
//                 className="relative w-32 h-32 border-2 border-yellow-300 rounded-xl overflow-hidden shadow-md group"
//               >
//                 <button
//                   onClick={() => handleRemoveImage(index)}
//                   disabled={isRemoving}
//                   aria-label={`Remove ${img.number}`}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//                 <img
//                   src={img.url}
//                   alt={`${img.number} Preview`}
//                   className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${
//                     loading ? "blur-sm brightness-110 contrast-125" : ""
//                   }`}
//                   onError={(e) => {
//                     console.error(`Error loading image ${img.number}:`, e);
//                     e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
//                   }}
//                 />
//                 <div className="absolute top-1 left-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded shadow">
//                   {img.number}
//                 </div>
//                 {loading && (
//                   <>
//                     <div className="absolute inset-0 bg-white/30 animate-scanner z-10" />
//                     <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded shadow z-20">
//                       Preprocessing...
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <div className="mt-4 flex flex-col items-center space-y-4">
//         <button
//           onClick={handleSubmit}
//           disabled={loading || selectedFile?.length !== 4}
//           className={`w-full max-w-xs px-4 py-2 rounded-lg font-semibold text-white transition duration-300 ${
//             loading || selectedFile?.length !== 4
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-yellow-500 hover:bg-yellow-600 hover:scale-[1.02]"
//           }`}
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
//           >
//             <RefreshCw className="inline-block w-5 h-4 mr-2" />
//             Refresh
//           </button>
//         )}
//       </div>

//       {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

//       {result?.status === "success" && result.individual_results && result.individual_results.length > 0 && (
//         <div className="mt-10">
//           <h2 className="text-xl font-bold text-center text-gray-700 mb-4">📸 Individual Results</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {result.individual_results.map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-4 border rounded-xl shadow text-left space-y-2"
//               >
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
//         <div className="mt-10 w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-white rounded-2xl shadow-2xl border border-yellow-300 px-6 py-6 text-center animate-fade-in">
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


