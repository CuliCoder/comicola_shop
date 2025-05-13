import React, { createContext, useCallback, useContext, useState } from "react";
const ContextAPI = createContext();
export const ContextProvider = ({ children }) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  return (
    <ContextAPI.Provider
      value={{
        openConfirmModal,
        setOpenConfirmModal,
      }}
    >
      {children}
    </ContextAPI.Provider>
  );
};
export const useMyContext = () => useContext(ContextAPI);
