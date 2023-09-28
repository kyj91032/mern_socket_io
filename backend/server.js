const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config(); // .env 파일에 있는 환경변수를 process.env에 넣어줌.

connectDB(); // db 연결

const app = express();

app.use(express.json()); // http 요청의 body를 json 형태로 파싱해줌.

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/user', userRoutes); // /api/user로 요청이 들어오면 userRoutes로 보내줌. use 메소드는 요청에 대한 미들웨어 함수를 사용하는 메소드.
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound); // 경로가 존재하지 않을 때 에러 처리 미들웨어 함수.
app.use(errorHandler); // 일반적인 에러 처리 미들웨어 함수.

const PORT = process.env.PORT || 8000;

app.listen(8000, () => console.log(`Server running on port ${PORT}`.yellow.bold));