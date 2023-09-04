const mongoose = require('mongoose');

const userScheme = mongoose.Schema({ // 스키마 생성.
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    pic: {type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
},
{
    timestamps: true
});

const User = mongoose.model('User', userScheme); // 스키마를 기반으로 모델 생성.

module.exports = User;

