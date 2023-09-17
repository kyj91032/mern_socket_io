import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from './context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root')); // root div가 최상위 컴포넌트가 된다.
root.render(
  <ChatProvider>
    {/* context API 내부에서 생성한 모든 상태를 앱 전체에서 접근 가능 */}
    <BrowserRouter>
      <ChakraProvider>
        <App />
        {/* App.js의 App 컴포넌트가 렌더링 된다. */}
      </ChakraProvider>
    </BrowserRouter>
  </ChatProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

