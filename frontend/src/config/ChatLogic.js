export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    // 유저가 2명이라는 가정하에, 내가 아니라면 상대방의 이름을 리턴
}

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
    // 유저가 2명이라는 가정하에, 내가 아니라면 상대방의 이름을 리턴
}

