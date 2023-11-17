import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogic'
import { ChatState } from '../context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'


const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={prism}>
      {value}
    </SyntaxHighlighter>
  );
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: 'flex' }} key={m._id}>
            {isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id) ? (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                ></Avatar>
              </Tooltip>
            ) : (
              <div style={{ width: '32px' }}></div> // 이전과 동일한 간격을 유지하기 위해 빈 div 추가
            )}
            {m.content.startsWith('```') ? (
              <div // 변경된 부분: div로 감싸기
                style={{
                backgroundColor: `${
                    m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
                }`,
                fontSize: '12px',
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
                display: 'inline-block', // 코드 블록의 경우 전체 너비로 표시
                }}
            >
                <ReactMarkdown
                  children={m.content}
                  components={{
                    code: ({ node, inline, className, children, ...props }) => {
                      const language = className ? className.replace('language-', 'jsx') : 'jsx';

                      if (inline) {
                        return <code>{children}</code>;
                      }

                      return (
                        <pre>
                          <CodeBlock language={language} value={children} {...props} />
                        </pre>
                      );
                    },
                  }}
                />
            </div>
            ) : (
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: '20px',
                  padding: '5px 15px',
                  maxWidth: '75%',
                }}
              >
                {m.content}
              </span>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};


export default ScrollableChat