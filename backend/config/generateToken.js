const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { // id를 통해 jwt 토큰 생성.
        expiresIn: '90d',
    })
}

module.exports = generateToken;