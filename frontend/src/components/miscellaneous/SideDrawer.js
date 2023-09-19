import { Box, Tooltip } from '@chakra-ui/react';
import React, { useState } from 'react'

const SideDrawer = () => {

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    return <>
        <Box>
            <Tooltip
                label='search Users to chat'
                hasArrow
                placement='bottem-end'
            >
                <Box>
                    SideDrawer
                </Box>
            </Tooltip>
        </Box>
    </>
    
}

export default SideDrawer;