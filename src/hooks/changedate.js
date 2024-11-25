
const changeDate = (timestamp) => {
    // Original timestamp
    const timestamp = "2024-11-01T11:52:25.162Z";

    // Convert to Date object
    const date = new Date(timestamp);

    // Adjust to Korean timezone (UTC+9)
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Seoul',
    };
    const formatter = new Intl.DateTimeFormat('ko-KR', options);

    // Format the time
    const koreanTime = formatter.format(date);
    return koreanTime;
}

export default changeDate;