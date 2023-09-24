import { Box, Button, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem, Avatar, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘을 추가합니다.
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from "../../context/ChatProvider"
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user , setSelectedChat, chats, setChats} = ChatState();

    const navigate = useNavigate();

    const { isOpen, onOpen, onClose } = useDisclosure(); // 사이드바를 열고 닫는 기능을 위한 훅

    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    }

    const handleSearch = async () => {
        if(!search) {
            toast({
                title: '검색어를 입력해주세요.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-left',
                colorScheme: 'blackAlpha'   
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            toast({
                title: '오류 발생.',
                status: '검색 실패',
                duration: 2000,
                isClosable: true,
                position: 'bottom-left',
                colorScheme: 'blackAlpha'
            });
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };

            const {data} = await axios.post('/api/chat', {userId}, config); // 이미 있으면 해당 채팅방을 가져옴. 없으면 새로운 채팅방을 만듦.

            if (!chats.find((c) => c._id === data._id)) { // 채팅방 목록에 이미 있는 채팅방인지 확인. 없으면 새로운 채팅방을 추가.
                setChats([data, ...chats]); // 채팅방 목록에 새로운 채팅방을 추가.
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: '채팅 불러오기 실패',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'bottom-left',
            });

        }
    };


    return <>
        <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            bg='gray.200'
            w='100%'    
            p='5px 10px 5px 10px'
            borderRadius='10px'
        >
            <Tooltip label='초대할 유저 검색' hasArrow placement='bottom-end'>
                <Button variant='ghost' onClick={onOpen}>
                    <FontAwesomeIcon icon={faSearch} />
                    <Text d={{base:'none', md:'flex'}} px='4'>
                        유저 검색   
                    </Text>
                </Button>
            </Tooltip>
            
            <Text fontSize='2xl' fontFamily='Work sans'>
                TCP-IP
            </Text>
            
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <BellIcon fontSize='2xl' m={1}/>
                    </MenuButton>
                    {/* <MenuList>

                    </MenuList> */}
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                        <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}  />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>내 프로필</MenuItem>
                        </ProfileModal>
                        <MenuItem onClick={logoutHandler}>로그아웃</MenuItem>
                    </MenuList>
                </Menu>
            </div>

        </Box>


        <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth='1px'>유저 검색하기</DrawerHeader>
                <DrawerBody>
                    <Box display='flex' pb={2}>
                        <Input placeholder='유저 이름 검색하기' mr={2} value={search} onChange={(e) => setSearch(e.target.value)}/>
                        <Button onClick={handleSearch}>검색</Button>
                    </Box>
                    {loading ? (
                        <ChatLoading/>
                    ) : (
                        searchResults?.map(user => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={()=>accessChat(user._id)}
                            />
                        ))
                    )}
                    {loadingChat && <Spinner ml='auto' display='flex'/>}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    </>
    
}

export default SideDrawer