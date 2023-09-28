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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]); // 전체 메시지
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState(""); // 보낼 메시지

    const { user, selectedChat, setSelectedChat } = ChatState();

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
    }, [selectedChat]);

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