const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data/data');

const app = express();
dotenv.config(); // .env 파일에 있는 환경변수를 process.env에 넣어줌.

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/chat', (req, res) => { // /api/chat으로 get 요청을 보냈을 때. (RESTful API)
    res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
    // console.log(req.params.id);
    const singleChat = chats.find(c => c._id === req.params.id); // find 순환함수. c는 chats의 각각의 요소를 의미함. 요청 id와 같은 id를 가진 chat 데이터를 찾음.
    res.send(singleChat);
});

const PORT = process.env.PORT || 8080;

app.listen(8080, () => console.log(`Server running on port ${PORT}`));