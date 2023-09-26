import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ groupChatName, setGroupChatName ] = useState();
    const [ selectedUsers, setSelectedUsers ] = useState([]); // 초대할 유저들 선택 리스트
    const [ search, setSearch ] = useState();
    const [ searchResult, setSearchResult ] = useState([]); // 검색 결과 리스트
    const [ loading, setLoading ] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query) {
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
            setSearchResult(data);
            
        } catch (error) {
            toast({
                title: "오류!",
                description: "유저를 찾을 수 없습니다.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const handleSubmit = async () => {
      if(!groupChatName || !selectedUsers) {
        toast({
          title: "오류!",
          description: "이미 유저가 추가되었습니다",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top"
        });
        return;
      }
      try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
        
            const {data} = await axios.post('/api/chat/group', { // 그룹 채팅 생성 api 연결
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((user)=>user._id)),
            }, config);

            setChats([data, ...chats]); // 채팅방 목록에 새로운 채팅방을 추가.
            onClose();
            toast({
              title: "새로운 채팅방이 생성되었습니다!",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "bottom"
            })

      } catch (error) {
            toast({
              title: "채팅방 생성에 실패하였습니다!",
              description: error.response.data,
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "bottom"
            })
      }
    }

    const handleGroup = (userToAdd) => {
      if(selectedUsers.includes(userToAdd)) {
        toast({
                title: "오류!",
                description: "이미 유저가 추가되었습니다",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top"
            });
        return;
      }
      setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleDelete = async (delUser) => {
      setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id)) // 삭제할 유저를 제외해서 다시 리스트를 세팅
    }


    return (
    <>
      <span onClick={onOpen}>
        {children}
      </span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="20px"
            fontFamily="Work sans"
            display='flex'
            justifyContent='center'
          >그룹 채팅 만들기</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDir='column'
            alignItems='center'
          >
            <FormControl>
                <Input placeholder='채팅방 이름' mb={3} onChange={(e) => setGroupChatName(e.target.value)}></Input>
                <Input placeholder='초대할 유저 이름' mb={1} onChange={(e) => handleSearch(e.target.value)}></Input>
            </FormControl>
            <Box w='100%' display='flex' flexWrap='wrap'>
              {selectedUsers.map(user => (
                <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>
              ))}
            </Box>
            

            {loading ? <div>로딩중</div> : (
                    searchResult?.slice(0, 4).map((user) => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='linkedin' mr={3} onClick={handleSubmit}>
              채팅방 생성
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}

export default GroupChatModal