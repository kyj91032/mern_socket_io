const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

userScheme.methods.matchPassword = async function(enteredPassword) { // 입력받은 password와 db에 저장된 password가 일치하는지 확인하는 함수.
    return await bcrypt.compare(enteredPassword, this.password); // this.password는 db에 저장된 password.
};

userScheme.pre('save', async function(next) { // save(create, update)하기 전에 실행되는 함수.
   if(!this.isModified('password')) { // password가 변경되지 않았으면
    next();
   }
   const salt = await bcrypt.genSalt(10); // salt 생성. bcrypt는 비밀번호를 hash로 변환해주는 라이브러리.
   this.password = await bcrypt.hash(this.password, salt); // password를 hash로 변환.
});



const User = mongoose.model('User', userScheme); // 스키마를 기반으로 모델 생성.

module.exports = User;

