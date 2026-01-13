import { createContext, useContext, useState } from "react";

// Create context for autograph product data
const AutographProductDataContext = createContext();

// Create Autograph Product Data Provider Components
export const AutographProductDataProvider = ({ children, initialData }) => {
    // console.log("initialData :", initialData);

    // Provider State to manage globally data
    const [autographProductDataGlobally, setAutographProductDataGlobally] = useState(initialData);
    // console.log("autographProductDataGlobally :", autographProductDataGlobally);


    // console.log("children :", children);
    return (
        // Context Provider
        <AutographProductDataContext.Provider value={{autographProductDataGlobally, setAutographProductDataGlobally}}>
            {children}
        </AutographProductDataContext.Provider>
    );
};

// Custom Hook to use the context
export const useAutographProductDataHook = () => {
    return useContext(AutographProductDataContext);
};



// Notes
// 1. Context: A context in React represents a shared state that can be accessed by any component within the provider's scope. It's created using the createContext function.

// 2. Provider: The Provider component allows consuming components to subscribe to the context's changes. It wraps the part of your component tree where you want the context to be available.
// The Provider component makes a context value available to all components in its subtree. It accepts a value prop, which represents the context's state or value to be shared.

// 3. Consumer: A Consumer is used to access the context's value in the component tree. However, React provides a useContext hook to simplify context consumption, making the Consumer component less commonly used in modern React.
// The useContext hook provides a simpler way to consume context in functional components. It eliminates the need for a Consumer component and allows direct access to the context's value.



