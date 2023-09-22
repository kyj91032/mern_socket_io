import { Box, Button, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘을 추가합니다.
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from "../../context/ChatProvider"
import ProfileModal from './ProfileModal';

const SideDrawer = () => {

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user } = ChatState();

    return <>
        <Box
            d='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            // bg='rgb(177, 197, 233)'
            bg='gray.200'
            w='100%'
            p='5px 10px 5px 10px'
            borderRadius='10px'
        >
            <Tooltip label='초대할 유저 검색' hasArrow placement='top'>
                <Button variant='ghost' >
                    <FontAwesomeIcon icon={faSearch} />
                    <Text d={{base:'none', md:'flex'}} px='4'>
                        유저 검색
                    </Text>
                </Button>
            </Tooltip>
            
            <Text display="inline" fontSize='2xl' fontFamily='Work sans'>
                TCP-IP
            </Text>
            
            <span>
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
                        <MenuItem>로그아웃</MenuItem>
                    </MenuList>
                </Menu>
            </span>

        </Box>
    </>
    
}

export default SideDrawer