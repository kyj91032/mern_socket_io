const express = require('express');
const { joinUser, allUsers } = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router(); // 라우터 객체 생성.

router.post('/join', joinUser); // /api/user/join으로 post 요청을 보냈을 때 joinUser 함수 실행.
router.route('/').get(protect, allUsers); // /api/user로 get 요청을 보냈을 때 allUsers 함수 실행. protect 미들웨어를 먼저 실행하고 allUsers 함수 실행.

module.exports = router;