const channelmap = {
    'yotube': '유튜브',
    'blog': '블로그',
    'instagram': '인스타그램',
    'tiktok': '틱톡',
    'web': '그 외'
};

const parseChannel = (channelArray) => {
    if (!channelArray || !channelArray.length) return [];
    
    // Take the first element and split it by comma
    return channelArray[0]
        .split(',')           // Split by comma
        .map(ch => ch.trim()) // Remove whitespace
        .filter(ch => ch);    // Remove empty strings
};

export {channelmap, parseChannel};
