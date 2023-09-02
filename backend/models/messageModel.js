const mongoose = require('mongoose');

const messageScheme = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    // reciever는 필요없음. chat에 속해있는 user들이 reciever가 될 수 있음.
}, 
{
    timestamps: true
}
);

const Message = mongoose.model('Message', messageScheme);

module.exports = Message;