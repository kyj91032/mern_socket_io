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
        <Text fontSize='2xl' fontFamily='Work sans' align='center'>OpenCommunity</Text>
      </Box>
      <Box bg='white' w='100%' p='4' borderRadius='lg' borderWidth='1px'>
        <Tabs variant='soft-rounded' colorScheme='facebook'>
          <TabList mb='1em'>
            <Tab width='100%'>로그인 및 회원가입</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Join />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage