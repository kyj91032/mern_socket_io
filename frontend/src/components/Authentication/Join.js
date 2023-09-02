import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Join = () => {

    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);
    const [pic, setPic] = useState();

    const handlePasswordVisibility = () => {
        setShow(!show);
    };

    const submitHandler = () => {

    };
    
    return (
        <VStack spacing='5px'>
            <FormControl id='name' isRequired>
                <FormLabel>닉네임</FormLabel>
                <Input 
                    placeholder='닉네임을 입력하세요.'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>비밀번호</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='비밀번호를 입력하세요.'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handlePasswordVisibility}>
                            {show ? '숨기기' : '보이기'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme='facebook'
                width='100%'
                style={{marginTop: 15}}
                onClick={submitHandler}
            >
                참가하기
            </Button>
        </VStack>
    )
}

export default Join