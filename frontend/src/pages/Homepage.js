import { Box, Container, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Join from '../components/Authentication/Join'
import { useNavigate } from 'react-router-dom';

const Homepage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate('/chat'); // 로그인이 되어있으면 바로 채팅방으로 이동

  }, [navigate]); // homepage에서 경로 변경이 될 때마다 user를 확인.

  return (
    <Container centerContent maxWidth='500px'>
      <Box
        display='flex'
        justifyContent='center'
        p='3'
        bg="white"
        w="100%"
        m="80px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize='2xl' fontFamily='Work sans' align='center'>Open Study Chat</Text>
      </Box>
      <Box bg='white' w='100%' p='8' borderRadius='lg' borderWidth='1px'>

        <Join/>
           
      </Box>
    </Container>
  )
}

export default Homepage