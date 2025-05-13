import React, { createContext, useContext, useState } from "react";
const ContextAPI = createContext();
export const ContextProvider = ({ children }) => {
  const [countNewOrder, setCountNewOrder] = useState(0);
  return (
    <ContextAPI.Provider
      value={{
        countNewOrder,
        setCountNewOrder,
      }}
    >
      {children}
    </ContextAPI.Provider>
  );
};
export const useMyContext = () => useContext(ContextAPI);
