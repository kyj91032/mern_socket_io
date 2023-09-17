import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Join from '../components/Authentication/Join'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Homepage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push('/chat'); // 로그인이 되어있으면 바로 채팅방으로 이동

  }, [history]); // homepage에서 경로 변경이 될 때마다 user를 확인.

  return (
    <Container maxX='xl' centerContent maxWidth='500px'>
      <Box
        d='flex'
        justifyContent='center'
        p='3'
        bg="white"
        w="100%"
        m="80px 0 15px 0"
        borderRadius="lg"
        borderWidht="1px"
      >
        <Text fontSize='2xl' fontFamily='Work sans' align='center'>TCP-IP</Text>
      </Box>
      <Box bg='white' w='100%' p='8' borderRadius='lg' borderWidth='1px'>

        <Join />
           
      </Box>
    </Container>
  )
}

export default Homepage