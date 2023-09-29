import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './style.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:8000" // socket.io 서버 주소
var socket, selectedChatCompare;



const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]); // 전체 메시지
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState(""); // 보낼 메시지
    const [socketConnected, setSocketConnected] = useState(false); 

    const { user, selectedChat, setSelectedChat } = ChatState();

    useEffect(() => { 
        socket = io(ENDPOINT); // socket.io 서버에 연결 (클라이언트의 io)
        socket.emit('setup', user); // 서버에 setup 이벤트 발생. user 넘겨줌.
        socket.on('connection', () => {
            setSocketConnected(true); // 서버와 연결되면 socketConnected를 true로 바꿔줌.
        })
    }, []);

    const fetchMessages = async () => {
        if(!selectedChat) return;

        try {
            setLoading(true);

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config); // 채팅방 id로 전체 메시지 가져오기

            console.log(data);

            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id); // 서버에 join chat 이벤트 발생. 채팅방 id 넘겨줌.
        } catch (error) {
            toast({
                title: "오류!",
                description: "메시지를 가져오는데 실패했습니다.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom"
            })
        }
    }

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // 메세지가 온 채팅방이 현재 채팅방이 아닐때
                
            } else { // 메세지가 온 채팅방이 현재 채팅방일때
                setMessages([...messages, newMessageRecieved]);
            }
        });
    }); // 아무것도 없으면 렌더링 될 때마다 실행됨.

    const toast = useToast();

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage(""); // 메시지 보내고 나면 메시지 창 비워줌. 비동기 처리를 위해 먼저 비워줌.

                const { data } = await axios.post('/api/message', { // 채팅 저장 api 연결
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config); 
                
                console.log(data);
            
                socket.emit('new message', data); // 서버에 new message 이벤트 발생. data 넘겨줌.

                setMessages([...messages, data]); // 전체 메세지에 추가

            } catch (error) {
                
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);


    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("") // 화면 작을때만 보이고, 누르면 채팅방 목록으로 돌아감(selectedChat이 ""이 되면서)
                        }
                        />
                        {!selectedChat.isGroupChat ? ( // 그룹 채팅이 아니면
                            <>
                                {getSender(user, selectedChat.users)} 님과의 채팅
                                <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()} 채팅방
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>

                    <Box 
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                    {loading ? (
                        <Spinner 
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto"
                        />
                    ) : (
                        <div className='messages'>
                            <ScrollableChat messages={messages}/>
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input
                            variant="filled"
                            bg="#E0E0E0"
                            placeholder="메시지를 입력하세요"
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>

                  </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
                </Box>
            )}

        </>
    )
}

export default SingleChat