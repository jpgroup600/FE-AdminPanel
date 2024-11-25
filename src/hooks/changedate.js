
const changeDate = (time) => {
    // Original timestamp
    const timestamp = time;

    // Convert to Date object
    const date = new Date(timestamp);

    // Adjust to Korean timezone (UTC+9)
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
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