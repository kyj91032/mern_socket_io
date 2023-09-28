import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import { set } from 'mongoose';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState(); // rename을 위한 state
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove = () => {
         
    }

    const handleRename = async () => {
        if(!groupChatName) return

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('/api/chat/rename', { // 채팅방 이름 변경 api
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "오류!",
                description: "채팅방 이름을 변경할 수 없습니다.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom"
            })
            setRenameLoading(false);
        }

        setGroupChatName("");
    }

    const handleSearch = () => {

    }

    return (
    <>
      <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center" 
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display='flex' flexWrap='wrap' pb={3}>
                {selectedChat.users.map((user) => (
                    <UserBadgeItem
                        key={user._id}
                        user={user}
                        admin={selectedChat.groupAdmin}
                        handleFunction={() => handleRemove(user)}
                    />
                ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="채팅방 이름"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                수정
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="초대할 유저 이름"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              채팅방 나가기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal