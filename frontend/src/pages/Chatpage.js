import axios from 'axios'; // axios는 클라이언트에서 서버로 요청을 보낼 수 있게 해주는 라이브러리
import React, { useEffect, useState } from 'react'

const Chatpage = () => {
  
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        const response = await axios.get('/api/chat'); // api/chat으로 get 요청을 보냄. proxy 설정을 했기 때문에 3000으로 보낸 후 8080으로 보내짐.
        const data = response.data; // response.data로 데이터 추출

        setChats(data); // data를 chats에 넣어줌.
    }

    useEffect(() => { // useEffect는 컴포넌트가 렌더링 될 때마다 실행된다.
        fetchChats();
    }, []);

  return (
    <div>
      {chats.map((chat) => (<div key={chat._id}>{chat.chatName}</div>))}
    </div>
  )

}

export default Chatpage