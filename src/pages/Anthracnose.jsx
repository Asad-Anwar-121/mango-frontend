import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Leaf, AlertTriangle, Shield, CloudRain } from 'lucide-react';

const Anthracnose = () => {
  const { mangoData, error } = useContext(AppContext);
  const { status: disease } = mangoData || {};
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDisease = 'anthracnose', savedFiles = [], savedPreview = [] } = location.state || {};
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const diseaseInfo = {
    anthracnose: {
      description:
        'Mango Anthracnose is a fungal disease caused by Colletotrichum gloeosporioides. It affects mango leaves, flowers, and fruit, especially in humid or rainy weather. This disease is most dangerous during the flowering and fruit-setting stages because it can lead to fruit drop and major crop losses.',
      symptoms: [
        'Leaves: Brown to dark brown spots, mostly near the edges; if rain coincides with new leaf growth, semi-circular lesions appear on the soft young leaves; in high humidity, twigs may also turn dark from the tip backwards and start shedding leaves.',
        'Flowers: Blossom blight and reduced fruit set.',
        'Fruits: Large black sunken lesions on young fruit (leading to drop); glossy black patches on green immature fruit (may split and ooze sap); depressed grey-black areas with pink/orange spore masses (acervuli) on ripe fruit.',
      ],
      impact: [
        'Can cause significant yield losses, potentially reaching 100% in poorly managed orchards.',
        'Affects fruit quality, leading to blemishes, reduced shelf life, and spoilage during storage and transport.',
      ],
      management: [
        'Before Harvest: Spray Mancozeb every 14 days after flowering (avoid within 14 days of harvest); apply Prochloraz carefully to prevent resistance; use copper-based sprays (1-day withholding period).',
        'After Harvest: Use cold Prochloraz spray (non-recirculating); apply hot water dips or hot Benomyl dips to control anthracnose and stem-end rot.',
      ],
      fruitImages: ['/a1.png', '/a2.png', '/a3.png', '/a4.png'],
      leafImages: ['/a_leaf1.png', '/a_leaf2.png', '/a_leaf3.png', '/a_leaf4.png'],
      flowerImages: ['/f1.png', '/f2.png', '/f3.png'],
      spread: [
        'The disease spreads through wind and rain, especially during wet conditions.',
        'It produces spores that easily move short distances.',
        'The fungus can enter young green mangoes and remain inactive (latent) until the fruit ripens.',
        'Once ripening starts, the fungus activates and spoils the fruit.',
      ],
    },
  };

  const effectiveDisease = disease?.toLowerCase() === 'anthracnose' ? disease : selectedDisease;
  const info = diseaseInfo['anthracnose'];

  useEffect(() => {
    console.log('Anthracnose.jsx state:', {
      selectedDisease,
      savedFiles: savedFiles?.map(f => ({ name: f.name, type: f.type, size: f.size })),
      savedPreview: savedPreview?.map(p => ({ number: p.number, id: p.id, url: p.url.slice(0, 50) + "..." })),
      mangoData,
      disease,
      effectiveDisease,
      info: info ? Object.keys(info) : null,
    });
  }, [mangoData, disease, selectedDisease, info, savedFiles, savedPreview]);

  const handleNavigateHome = (buttonPosition) => {
    console.log(`Navigating to Home from ${buttonPosition} button with state:`, {
      savedFiles: savedFiles?.map(f => ({ name: f.name, type: f.type, size: f.size })),
      savedPreview: savedPreview?.map(p => ({ number: p.number, id: p.id, url: p.url.slice(0, 50) + "..." })),
    });
    navigate("/", { state: { savedFiles, savedPreview } });
  };

  return (
    <>
      <div className="mb-2 mt-4 ">
  <button
    onClick={() => handleNavigateHome("top")}
    className="block w-20 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 shadow-md transition"
    aria-label="Back to home"
  >
    Home
  </button>
</div>

      <div className="min-h-screen max-w-4xl mb-10 mx-auto rounded-xl bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text">
              Anthracnose Details
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 rounded-xl p-6 text-center mb-6">
              <p className="text-red-700 text-lg">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="md:text-xl font-medium text-gray-700">
                  Status: <span className="text-green-700 font-bold">Anthracnose</span>
                </p>
              </div>
              <AlertTriangle className="w-0 md:w-12 h-12 text-red-500 opacity-75 animate-pulse" />
            </div>

            {info ? (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6 transition-all duration-300 hover:bg-green-100">
                  <h3 className="md:text-2xl font-semibold text-green-800 mb-4 flex items-center">
                    <Leaf className="w-6 h-6 mr-2 text-green-600" /> About Anthracnose
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4 text-[16px]">{info.description}</p>

                  {info.spread?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3 mt-6 flex items-center">
                        <CloudRain className="w-5 h-5 mr-2 text-gray-500" /> Occurrence
                      </h4>
                      <ul className="list-none space-y-2">
                        {info.spread.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-gray-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {info.symptoms?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-red-700 mb-3 mt-6 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-500" /> Symptoms
                      </h4>
                      <ul className="list-none space-y-2">
                        {info.symptoms.map((symptom, index) => {
                          const [heading, ...rest] = symptom.split(':');
                          const content = rest.join(':').trim();
                          return (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-red-500">•</span>
                              <span>
                                <strong>{heading}:</strong> {content}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {info.leafImages?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-green-700 mb-3 mt-6 flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-green-500" /> Leaf Images
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-[450px]:grid-cols-1">
                        {info.leafImages.map((image, index) => (
                          <div key={index} className="overflow-hidden rounded-lg shadow-md h-48 flex items-center justify-center">
                            <img
                              src={image}
                              alt={`Anthracnose leaf image ${index + 1}`}
                              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {info.flowerImages?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-green-700 mb-3 mt-6 flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-green-500" /> Flower Images
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-[450px]:grid-cols-1">
                        {info.flowerImages.map((image, index) => (
                          <div key={index} className="overflow-hidden rounded-lg shadow-md h-48 flex items-center justify-center">
                            <img
                              src={image}
                              alt={`Anthracnose flower image ${index + 1}`}
                              className="w-full h-44 object-contain transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {info.fruitImages?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-yellow-700 mb-3 mt-6 flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-yellow-500" /> Fruit Images
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-[450px]:grid-cols-1">
                        {info.fruitImages.map((image, index) => (
                          <div key={index} className="overflow-hidden rounded-lg shadow-md h-48">
                            <img
                              src={image}
                              alt={`Anthracnose fruit image ${index + 1}`}
                              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {info.impact?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-orange-700 mb-3 mt-6 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" /> Impact
                      </h4>
                      <ul className="list-none space-y-2">
                        {info.impact.map((impact, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-red-500">•</span>
                            <span>{impact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {info.management?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-blue-700 mb-3 mt-6 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-blue-500" /> Management
                      </h4>
                      <ul className="list-none space-y-2">
                        {info.management.map((line, index) => {
                          const [heading, ...rest] = line.split(':');
                          const content = rest.join(':').trim();
                          return (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-green-500">•</span>
                              <span>
                                <strong>{heading}:</strong> {content}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 rounded-xl p-6 text-center">
                <p className="text-gray-700 text-lg">
                  No detailed information available for Anthracnose.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={scrollToTop}
              className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 shadow-md transition"
              aria-label="Scroll to top"
            >
              Return To Top
            </button>
            <button
              onClick={() => handleNavigateHome("bottom")}
              onMouseDown={() => console.log("Bottom Home button clicked")}
              className="block bg-blue-500 text-white px-8 py-2 rounded-full hover:bg-blue-600 shadow-md transition z-50"
              aria-label="Back to home (bottom)"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Anthracnose;