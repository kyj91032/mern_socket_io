import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

const Join = () => {

    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handlePasswordVisibility = () => {
        setShow(!show);
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !password) {
            toast({
                title: '닉네임과 비밀번호를 모두 입력해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
                colorScheme: 'white'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',

                }
            };

            const { data } = await axios.post('/api/user/join', { name, password }, config); // req.body.name, req.body.password 로 들어감.
            toast({
                title: '참가 완료되었습니다.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
                colorScheme: 'white'
            })

            localStorage.setItem('userInfo', JSON.stringify(data)); // 로컬 스토리지에 userInfo라는 키로 data를 저장.
            // 브라우저에서 제공하는 로컬 스토리지
            // 자동 로그인을 구현하기 위해 사용.

            setLoading(false);

            history.push('/chats') // /chats로 이동.

        } catch (error) {
            toast({
                title: '참가에 실패했습니다.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
            })
            setLoading(false);
        }

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