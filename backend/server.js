const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // .env 파일에 있는 환경변수를 process.env에 넣어줌.

connectDB();

const app = express();

app.use(express.json()); // req.body에 접근할 수 있게 해줌. (미들웨어 함수

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/user', userRoutes); // /api/user로 요청이 들어오면 userRoutes로 보내줌. use 메소드는 미들웨어 함수를 사용할 때

const PORT = process.env.PORT || 8000;

app.listen(8000, () => console.log(`Server running on port ${PORT}`.yellow.bold));