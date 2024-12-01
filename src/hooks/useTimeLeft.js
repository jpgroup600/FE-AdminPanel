import { useState, useEffect } from 'react';

const useTimeLeft = (createdAt) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        
        // Add 14 days to creation date to get end date
        const endDate = new Date(createdDate);
        endDate.setDate(endDate.getDate() + 13);  // Assuming 14 days duration
        
        // Calculate remaining days
        const diffInMilliseconds = endDate - now;
        const daysLeft = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
        
        setTimeLeft(daysLeft);
    }, [createdAt]);

    return timeLeft;
};

export default useTimeLeft;