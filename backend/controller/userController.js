const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');


const joinUser = asyncHandler( async (req, res) => {
    const {name, password} = req.body; // express.json() 미들웨어를 사용했기 때문에 req.body에 접근 가능.

    if (!name || !password) { // 유효성 검사 (name과 password가 존재하는지)
        res.status(400);
        throw new Error('Please provide name and password');
    }

    const user = await User.findOne({ name }); // 존재하지 않으면 null 반환, 존재하면 해당 유저 반환.

    if(user) { // user가 존재하면 (로그인)
        if(user.matchPassword(password)) { // password가 일치하면
            res.json({ // 기본으로 200 상태코드가 반환됨.
                _id: user._id,
                name: user.name,
                password: user.password,
                token: generateToken(user._id),
            })
            console.log("로그인 성공");
        } else {
            res.status(401);
            throw new Error('Invalid name or password'); // asyncHandler가 에러를 next로 넘겨줌. 그 후 errorHandler가 에러를 받아서 처리.
        }

    } else { // user가 존재하지 않으면 (회원가입)
        const user = await User.create({ // scheme -> model -> create
            name,
            password,
        }) // 새로운 유저 생성.

        if (user) { // create 에 대한 response
            res.status(201).json({
                _id: user._id, // user._id는 mongodb에서 자동으로 생성해줌. auto increment. usertable의 primary key와 같은 역할.
                name: user.name,
                password: user.password,
                token: generateToken(user._id), // user._id를 인자로 넣어줌. token을 생성하는 함수.
            })
            console.log("회원가입 성공");
        } else {
            res.status(400);
            throw new Error('Failed to create user');
        }
    }
});


module.exports = { joinUser };