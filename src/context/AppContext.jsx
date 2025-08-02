import React, { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [mangoData, setMangoData] = useState({
    type: "",
    status: "",
    individualResults: [],
  });
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [preview, setPreview] = useState([]);
  const [result, setResult] = useState(null);

  const updateMangoData = (newData) => {
    setMangoData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <AppContext.Provider
      value={{
        mangoData,
        updateMangoData,
        error,
        setError,
        selectedFile,
        setSelectedFile,
        preview,
        setPreview,
        result,
        setResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;