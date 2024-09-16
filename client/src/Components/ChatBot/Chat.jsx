import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./Chat.css";
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../Slice/ChatBotSlice';
import { BeatLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, IconButton, useToast } from '@chakra-ui/react';  // Chakra UI components
import { CopyIcon } from '@chakra-ui/icons';  // Copy Icon from Chakra UI

function Chat() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);

  const [input, setInput] = useState('');
  const [loader, setLoader] = useState(false);
  const toast = useToast(); // For notifications

  // Create a ref to the chat container
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setLoader(true);
    const userMessage = { sender: 'user', text: input };
    dispatch(addMessage(userMessage));

    try {
      const response = await fetch('http://localhost:5000/chat/chatBot', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input // Send the question to the backend
        }),
      });
      const data = await response.json();

      const botMessage = { sender: 'bot', text: data.answer || 'Sorry, no answer received.' };
      dispatch(addMessage(botMessage));
      setLoader(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
      dispatch(addMessage(errorMessage));
      setLoader(false);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents the default new line behavior
      sendMessage();
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const renderMessage = (msg) => {
    if (msg.sender === 'bot') {
      return (
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeText = String(children).replace(/\n$/, '');

              return !inline && match ? (
                <Box position="relative" mb={4}>
                  <SyntaxHighlighter
                    style={syntaxTheme}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {codeText}
                  </SyntaxHighlighter>
                  <IconButton
                    icon={<CopyIcon />}
                    size="sm"
                    colorScheme="teal"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => copyToClipboard(codeText)}
                    aria-label="Copy code"
                  />
                </Box>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {msg.text}
        </ReactMarkdown>
      );
    }
    return msg.text;
  };

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container flex flex-col max-w-3xl mx-auto bg-white">
      <div
        className="flex-1 overflow-y-auto scroll-slim p-4 space-y-4"
        ref={chatContainerRef}  // Attach the ref to the chat container
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-md ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'  // Ensures user messages align right
                : 'bg-gray-100 text-gray-800 self-start min-w-full'
            }`}
            style={{ wordWrap: 'break-word', overflowX: 'auto' }} // Ensures code wrapping or horizontal scroll
          >
            {renderMessage(msg)}
          </div>
        ))}
      </div>
      <div className="border-t p-4 bg-gray-200 flex items-center border rounded-lg">
        <div className="relative w-full">
          <textarea
            placeholder="Type your message..."
            className="w-full -mb-1 px-4 py-4 border pr-20 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 resize-y hide-scrollbar"
            style={{ minHeight: '60px' }}
            value={input}
            rows={2}
            disabled={loader}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress} // Handle Shift+Enter for new line
          />
          <button
            onClick={sendMessage}
            disabled={loader}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loader ? <BeatLoader color="white" size={9} /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
