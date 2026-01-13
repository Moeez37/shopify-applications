import { DatePicker } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useDateRangeAutograph } from "../../../../context/AutographDateRangeProvider";

export const DataPickerRangeShow = () => {
    const {startDate, endDate, setDateRange} = useDateRangeAutograph();

    const [month, setMonth] = useState(11);
    const [year, setYear] = useState(2024);

    const [selectedDates, setSelectedDates] = useState({
        start: new Date('Wed Dec 18 2024 00:00:00 GMT-0500 (EST)'),
        end: new Date('Mon Dec 16 2024 00:00:00 GMT-0500 (EST)'),
    });

    const handleMonthChange = useCallback( (month, year) => {
        setMonth(month);
        setYear(year);
    }, []);

    // // Function to get week number for a date
    // const getWeekNumber = (date) => {
    //     return getISOWeek(date); // Using date-fns to calculate the ISO week number
    // };


    return (
        <>
            <DatePicker
                month={month}
                year={year}
                onChange={({ start }) => setSelectedDates(start)}
                // onChange={({ start }) => {
                //     setDate(start); // Update the global date in context
                //   }}
                onMonthChange={handleMonthChange}
                selected={selectedDates}
                disableDatesBefore={new Date('Sun Dec 15 2024 00:00:00 GMT-0500 (EST)')}
                disableDatesAfter={new Date('Sun Dec 22 2024 00:00:00 GMT-0500 (EST)')}
                allowRange
            />
            {/* Display Week Number for Selected Date */}
            {/* <Text variant="bodyMd">Selected Week: {getWeekNumber(selectedDate)}</Text> */}
        </>
    );

};

