import { createContext, useContext, useState } from "react";

// Create Context
const AutographOrdersCostContext = createContext();

// Create Provider Component
export const AutographOrdersCostProvider = ({ children }) => {
    const [autographGlobalOrdersCost, setAutographGlobalOrdersCost] = useState(0); // Initial value
    // console.log("AutographOrdersCostProvider");

    return (
        <AutographOrdersCostContext.Provider value={{autographGlobalOrdersCost, setAutographGlobalOrdersCost}}>
            {children}
        </AutographOrdersCostContext.Provider>

    );
};

// Custom Hook to use the context
export const useAutographGlobalOrdersCost = () => {
    return useContext(AutographOrdersCostContext);
}
