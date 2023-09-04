const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler( async (req, res) => { // asyncHandler는 에러를 처리해주는 미들웨어 함수.
    const { name, password } = req.body; // req.body에 있는 name과 password를 가져옴.

    // Service에서 처리해야 할 것들.

    if (!name || !password) { // 유효성 검사
        res.status(400);
        throw new Error('Please provide name and password');
    }

    const userExists = await User.findOne({ name }); // 존재하지 않으면 null 반환, 존재하면 해당 유저 반환.

    if (userExists) {
        res.status(400); // Bad request
        throw new Error('User already exists');
    } else { // 존재하지 않으면 새로운 유저 생성.
        const user = await User.create({ // scheme -> model -> create
            name,
            password,
        }) // 새로운 유저 생성.

        console.log("success to create user");

        if (user) {
            res.status(201).json({
                _id: user._id, // user._id는 mongodb에서 자동으로 생성해줌. auto increment. usertable의 primary key와 같은 역할.
                name: user.name,
                password: user.password,
                token: generateToken(user._id), // user._id를 인자로 넣어줌. token을 생성하는 함수.
            })
        } else {
            res.status(400);
            throw new Error('Failed to create user');
        }
    }
});

const authUser = asyncHandler( async (req, res) => {
    const {name, password} = req.body;

    const user = await User.findOne({name});

    if (user && (await user.matchPassword(password))) { // user가 존재하고, password가 일치하면
        res.json({
            _id: user._id,
            name: user.name,
            password: user.password,
            token: generateToken(user._id),
        })
    } else {
        res.status(401);
        throw new Error('Invalid name or password');
    }
});




module.exports = { registerUser, authUser };