


const filterUserStatus = (product, email) => {

    const filterMap = {
        "pending": "대기중",
        "approved": "승인됨",
        "rejected": "거절됨"
    }

    const FilterStatus = product?.registeredUsers?.filter(user => user.email === email);
    const userStatus = FilterStatus[0]?.status;
    return userStatus;
}

export default filterUserStatus;