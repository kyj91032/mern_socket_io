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
import Lottie from "react-lottie";
import animationData from "./animations/typing.json";

const ENDPOINT = "http://localhost:8000" // socket.io 서버 주소
var socket, selectedChatCompare;



const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]); // 전체 메시지
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState(""); // 보낼 메시지
    const [socketConnected, setSocketConnected] = useState(false); 
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptinos = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    }

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    useEffect(() => { 
        socket = io(ENDPOINT); // socket.io 서버에 연결 (클라이언트의 io)
        socket.emit('setup', user); // 서버에 setup 이벤트 발생. user 넘겨줌.
        socket.on('connected', () => {
            setSocketConnected(true); // 서버와 연결되면 socketConnected를 true로 바꿔줌.
        })
        socket.on('typing', () => setIsTyping(true)); // 서버에서 typing 이벤트 발생하면 setIsTyping을 true로 바꿔줌.
        socket.on('stop typing', () => setIsTyping(false)); // 서버에서 stop typing 이벤트 발생하면 setIsTyping을 false로 바꿔줌.

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
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else { // 메세지가 온 채팅방이 현재 채팅방일때
                setMessages([...messages, newMessageRecieved]);
            }
        });
    }); // 아무것도 없으면 렌더링 될 때마다 실행됨.

    const toast = useToast();

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage) {
            socket.emit('stop Typing', selectedChat._id);
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

        if(!socketConnected) return;

        if(!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id); // 서버에 typing 이벤트 발생시킴. 채팅방 id 넘겨줌.

        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false);
            }
        }, timerLength);

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
                                <Text fontSize={{ base : "20px"}}>
                                    {getSender(user, selectedChat.users)} 님과의 채팅
                                </Text>
                                <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                            </>
                        ) : (
                            <>
                                <Text fontSize={{ base : "20px"}}>
                                    {selectedChat.chatName.toUpperCase()}
                                </Text>
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
                        {isTyping ? <div>
                            <Lottie options={defaultOptinos} width={70} style={{marginBottom: 15, marginLeft: 0}} />
                        </div>:<> </>}
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
                    시작할 채팅을 왼쪽에서 선택하세요
                </Text>
                </Box>
            )}

        </>
    )
}

export default SingleChat