import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import MessageBubble from './MessageBubble';
import Loader from './Loader';

const ChatWindowContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  height: 60vh;
  min-height: 320px;
  background: var(--color-bg-chat, #fff);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(49, 46, 129, 0.08);
  padding: 1.5rem 1rem 1rem 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s, background 0.2s;
  &:hover {
    box-shadow: 0 8px 32px rgba(49, 46, 129, 0.13);
  }
  @media (max-width: 1100px) {
    max-width: 100vw;
    min-height: 200px;
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
  }
`;

const ChatWindow = ({ messages, isLoading, botAvatar, userAvatar, botPersonality }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <ChatWindowContainer
      role="log"
      aria-live="polite"
      aria-label="Chat conversation"
      tabIndex={0}
    >
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} botAvatar={botAvatar} userAvatar={userAvatar} botPersonality={botPersonality} />
      ))}
      {isLoading && <Loader />}
      <div ref={chatEndRef} />
    </ChatWindowContainer>
  );
};

export default ChatWindow; 