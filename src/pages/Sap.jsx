import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Leaf, AlertTriangle, Shield, CloudRain } from 'lucide-react';

const Sap = () => {
  const { mangoData, error } = useContext(AppContext);
  const { status: disease } = mangoData || {};
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDisease = 'sap-burn', savedFiles = [], savedPreview = [] } = location.state || {};
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const diseaseInfo = {
    'sap-burn': {
      description:
        'Mango Sap Burn is a post-harvest physiological disorder caused by the acidic mango sap released during harvesting. When sap contacts the peel in hot, dry, or sunny weather, it burns the skin, leaving black or brown patches, reducing market value without affecting taste or internal quality.',
      symptoms: [
        'Fruits: Black or dark brown spots around the stem-end area; burnt, blistered, or shriveled skin; severe cases may spread over the peel but spare the pulp; visible burn signs appear shortly after harvest.',
      ],
      prevention: [
        'Before Harvest: Harvest during cool hours (early morning or late evening); use de-sapping techniques (hold stem-down for 30 seconds); avoid dropping fruit—place gently on grass, trays, or plastic crates; use plastic de-sapping collars or foam pads.',
        'After Harvest: Rinse fruits with clean running water; dip in lime water or soda ash solution to neutralize sap acidity; dry in a cool, shaded area; use gentle handling during packing and transport.',
      ],
      fruitImages: ['/s1.png', '/s2.png', '/s3.png', '/s4.png'],
      spread: [
        'It occurs immediately after harvesting, when sap oozes from the fruit stem.',
        'The risk increases if fruit is harvested during midday heat or under strong sunlight.',
        'Rough handling or improper picking leads to more sap exposure.',
        'Even a few seconds of contact with skin can cause permanent burn marks.',
      ],
    },
  };

  const effectiveDisease = disease?.toLowerCase() === 'sap-burn' ? disease : selectedDisease;
  const info = diseaseInfo['sap-burn'];

  useEffect(() => {
    console.log('Sap.jsx state:', {
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
              Sap Burn Details
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
                  Status: <span className="text-green-700 font-bold">Sap Burn</span>
                </p>
              </div>
              <AlertTriangle className="w-0 md:w-12 h-12 text-red-500 opacity-75 animate-pulse" />
            </div>

            {info ? (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6 transition-all duration-300 hover:bg-green-100">
                  <h3 className="md:text-2xl font-semibold text-green-800 mb-4 flex items-center">
                    <Leaf className="w-6 h-6 mr-2 text-green-600" /> About Sap Burn
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
                              alt={`Sap Burn fruit image ${index + 1}`}
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

                  {info.prevention?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-purple-700 mb-3 mt-6 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-purple-500" /> Prevention
                      </h4>
                      <ul className="list-none space-y-2">
                        {info.prevention.map((prevention, index) => {
                          const [heading, ...rest] = prevention.split(':');
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
                  No detailed information available for Sap Burn.
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

export default Sap;