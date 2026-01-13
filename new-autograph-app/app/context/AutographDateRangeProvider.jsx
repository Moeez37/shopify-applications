import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AutographDateRangeContext = createContext();

// Create Provider Component
export const AutographDateRangeProvider = ({ children }) => {
    const [timeStampContext, setTimeStampContext] = useState(null);
    const [startDate, setStartDate] = useState(null); 
    const [endDate, setEndDate] = useState(null); 

    // Function to update date range
    const setDateRange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };


    //_______________________________________________________________________________
    // Function to calculate the start of the current week (Monday)
    const getStartOfCurrentWeek = () => {
        console.log("Calculating Start of Current Week...");
        const now = new Date();
        const dayOfAWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
        // Calculate difference to Monday (if today is Sunday, go back 6 days)
        const diffToMonday = (dayOfAWeek === 0 ? 6 : dayOfAWeek - 1); 
        // Adjust to the start of the current week (Monday)
        now.setDate(now.getDate() - diffToMonday); // Set to previous Monday
        now.setHours(0, 0, 0, 0); // Set time to 00:00:00 (start of the day)
        // console.log("startOfCurrentWeek (Local Time) :", now);
        // console.log("startOfCurrentWeek (Local Time) toISOString :", now.toISOString());
        return now.toISOString();
    };

    // Function to calculate the fixedDateTime (startDate) and currentDateTime (endDate)
    const calculateDateRange = (fixedTimestamp) => {
        let fixedDateTime = null;

        if (fixedTimestamp) {
            fixedDateTime = new Date(fixedTimestamp * 1000).toISOString(); // Convert fixed timestamp to ISO string
        } else {
            fixedDateTime = getStartOfCurrentWeek(); // If no fixedTimestamp, calculate start of the current week
        }

        const currentDateTime = new Date().toISOString(); // Current date-time in ISO 8601

        // console.log("fixedDateTime11:", fixedDateTime);
        // console.log("currentDateTime11:", currentDateTime);

        // Set the date range
        setStartDate(fixedDateTime);
        setEndDate(currentDateTime);
    };

    // Automatically set the date range when the provider is initialized
    useEffect(() => {
        // console.log("Timestamp Context Changed:", timeStampContext); 
        calculateDateRange(timeStampContext);
    }, [timeStampContext]);


    return (
        <AutographDateRangeContext.Provider 
            value={{
                startDate,
                endDate,
                setDateRange,
                timeStampContext,
                setTimeStampContext,
            }}
        >
            {children}
        </AutographDateRangeContext.Provider>
    );
};

// Custom Hook to use the context
export const useDateRangeAutograph = () => {
    return useContext(AutographDateRangeContext);
};