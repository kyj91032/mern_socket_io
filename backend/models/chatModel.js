const mongoose = require('mongoose');

const chatScheme = mongoose.Schema({
    chatName: {type: String, trim: true},
    isGroupChat: {type: Boolean, default: false},
    users: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }], // User 스키마의 id를 참조함. mongoose에서 지원하는 외래키.
    // 결국 필드의 실제 데이터는 populate해서 불러옴.
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
},
{
    timestamps: true // createdAt, updatedAt 필드를 자동으로 생성함.
}   
); // 스키마 생성.

const Chat = mongoose.model('Chat', chatScheme); // 스키마를 기반으로 모델 생성.

module.exports = Chat;