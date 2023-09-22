import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'

const ProfileModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure(); // 모달창을 열고 닫는 기능을 제공하는 useDisclosure hook

    return ( <>
        {children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton
                d={{base:'flex'}}
                icon={<ViewIcon/>}
                onClick={onOpen}
            />
        )}
        <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='25px'
            fontFamily='Work Sans'
            d='flex'
            justifyContent='center'
          >프로필 조회</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='space-between'
          >
            <Image
                borderRadius='full'
                boxSize='150px'
                src={user.pic}
            />
            <Text
                fontSize={{ base: '28px', md: '20px' }}
                fontFamily='Work Sans'
            >
                닉네임: {user.name} 님
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='gray' mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
        </Modal>
        </>
    )
}

export default ProfileModal