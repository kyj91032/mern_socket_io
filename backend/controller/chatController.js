const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler( async (req, res) => {

    // 요청으로 보낸 userid를 가진 채팅이 있는지 확인하기 위함.
    const { userId } = req.body; 
    
    if (!userId) {
        console.log("요청에 유저 아이디가 없습니다.");
        return res.status(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage"); // populate란 참조하는 다른 컬렉션의 document를 불러오는 것.

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender", // latestMessage의 sender를 불러옴.
        select: "name pic", // sender의 name과 pic만 불러옴.
    });
    // 채팅을 위한 모든 데이터가 확보.

    if(isChat.length > 0) { // 채팅이 이미 존재하는 경우.
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat : false,
            users: [req.user._id, userId],
        }

        try {
            // 채팅이 존재하지 않는 경우 채팅 생성.
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password");
            res.status(201).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});


const fetchChats = asyncHandler( async (req, res) => {
    try {
        // 현재 로그인한 유저가 속한 채팅방을 모두 불러옴.
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 }) // 최근에 업데이트된 순서대로 정렬.
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic",
            });
            res.status(200).send(results);
        });
    } catch (error) {
        
    }
});

const createGroupChat = asyncHandler( async (req, res) => {

    if (!req.body.users || !req.body.name) { // front에서 보낸 데이터가 없는 경우.
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var users = JSON.parse(req.body.users); // front에서 보낸 users 데이터를 javascript object로 변환.
    // JSON.stringify()와 대응

    if (users.length < 2) {
        return res
            .status(400)
            .send({ message: "Please add more than 2 users to create a group" });
    }

    users.push(req.user); // 현재 로그인한 유저도 그룹에 추가.

    try {
        const groupChat = await Chat.create({ // 채팅 생성.
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }) // 추가적인 정보를 넣어줌.
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).send(fullGroupChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});

module.exports = { accessChat, fetchChats, createGroupChat };