import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Textarea, Button, Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

const CodeBlockModal = ({ isOpen, onClose, onSubmit }) => {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    onSubmit(code);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>코드 블록 입력</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea placeholder="코드를 입력하세요" fontSize={14} value={code} onChange={(e) => setCode(e.target.value)} />
        </ModalBody>
        <Box textAlign="right" p={4}>
          <Button colorScheme="teal" onClick={handleSubmit}>
            전송
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default CodeBlockModal;
