const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

// protect 미들웨어의 역할은 인증된 사용자만이 특정 엔드포인트에 액세스할 수 있도록 하는 것
// 이를 위해 JWT (JSON Web Token)을 사용하여 사용자를 인증하고, 유효한 토큰을 가진 사용자에게만 엔드포인트를 사용할 수 있는 권한을 부여.

const protect = asyncHandler(async(req, res, next) => {
    let token;

    if ( // 토큰이 존재하는지 확인.
        req.headers.authorization && // 헤더에 authorization이 존재하고
        req.headers.authorization.startsWith('Bearer') // authorization의 값이 Bearer로 시작하면
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Bearer 다음에 오는 토큰을 가져옴.

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password'); // password를 제외한 나머지 정보를 req.user에 넣어줌.
            // req.user는 이후 라우터에서 사용할 수 있음.

            next(); // 다음 미들웨어로 넘어감.

            // 만약 토큰이 유효하다면, 해당 사용자의 정보를 데이터베이스에서 가져와 req.user에 할당.
            // 이를 통해 라우터의 후속 미들웨어에서 해당 사용자 정보를 활용.

        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

});

module.exports = { protect };