// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppContextProvider from './context/AppContext';
import Home from './pages/Home';
import Sap from './pages/Sap';
import Anthracnose from './pages/Anthracnose';
import Guidelines from './pages/GuideLines';

const App = () => {
  return (
    <AppContextProvider>
      <div className="min-h-screen flex items-center justify-center">
  <div className="flex-1 px-6 mt-[20px] max-w-6xl w-full">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/anthracnose" element={<Anthracnose />} />
      <Route path="/sap" element={<Sap />} />
      <Route path="/guidelines" element={<Guidelines />} />
    </Routes>
  </div>
</div>

    </AppContextProvider>
  );
};

export default App;