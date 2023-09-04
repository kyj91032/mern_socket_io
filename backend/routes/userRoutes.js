const express = require('express');
const { registerUser } = require('../controller/userController');

const router = express.Router(); // 라우터 객체 생성.

router.route('/').post(registerUser); // /api/user로 post 요청을 보냈을 때 registerUser 함수 실행.
// router.post('/login', authUser);

module.exports = router;