import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React from 'react'
import Join from '../components/Authentication/Join'

const Homepage = () => {
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