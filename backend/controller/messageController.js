const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log('invalid data');
        res.status(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        var message = await Message.create(newMessage); // 객체와 db의 스키마를 매핑해줌.

        message = await message.populate('sender', 'name pic');
        message = await message.populate('chat');
        message = await User.populate(message, { 
            path: 'chat.users' ,
            select: 'name pic email'
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }


});

module.exports = { sendMessage };