import React from 'react'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const Chatpage = () => {

  const { user } = ChatState();

  return (
    <div style={{width: '100%'}}>
      {user && <SideDrawer/>}
      <Box
        d='flex'
        justifyContent={'space-between'}
        w='100%'
        h='91.5vh'
        p='10px'
      >
        {user && <MyChats style={{ color: 'black' }}/>}
        {user && <ChatBox/>}
      </Box>
    </div>
  )

}

export default Chatpage