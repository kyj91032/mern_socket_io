const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');


const accessChat = asyncHandler( async (req, res) => {

    const { userId } = req.body;

    if (!userId) {
        console.log("유저 아이디가 없습니다.");
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
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if(isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatNaem: "sender",
            isGroupChat : false,
            users: [req.user._id, userId],
        }

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password");
            res.status(201).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});


module.exports = { accessChat };