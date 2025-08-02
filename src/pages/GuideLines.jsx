import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, AlertTriangle } from 'lucide-react';

const GuidelinesPage = () => {
  const location = useLocation();
  const { savedFiles, savedPreview } = location.state || {};

  return (
    <div className="min-h-screen max-w-4xl mb-10 mx-auto rounded-xl bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          to="/"
          state={{ savedFiles, savedPreview }}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Home
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text">
            Image Upload Guidelines
          </h2>
          <p className="mt-4 md:text-lg text-gray-600">
            Follow these instructions for accurate disease detection
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
          <div className="bg-yellow-50 rounded-xl p-6 mb-6">
            <h3 className="md:text-xl font-semibold text-yellow-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" /> Note
            </h3>
            <p className="text-gray-700 leading-relaxed text-[16px]">
              The model is currently in the learning phase and may make mistakes. Please verify results with a professional if needed.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 transition-all duration-300 hover:bg-green-100">
            <h3 className="md:text-xl font-semibold text-green-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-green-600" /> Image Guidelines
            </h3>
            <ul className="list-none space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Keep the distance neither too far nor too close when capturing images.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Capture images from 4 different angles: front, back, left, and right. Avoid top and bottom images.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Ensure images are not blurry for accurate detection.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesPage;