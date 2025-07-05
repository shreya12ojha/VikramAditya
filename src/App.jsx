import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import QuickReplies from './components/QuickReplies';
import VideoBackground from './components/VideoBackground';
import styled from 'styled-components';

const SettingsBtn = styled.button`
  position: absolute;
  left: 1.5rem;
  top: 1.5rem;
  background: var(--color-accent);
  color: var(--color-primary);
  border: none;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  z-index: 2;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  color: #222;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(49, 46, 129, 0.18);
`;

const AvatarGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
`;

const AvatarOption = styled.button`
  font-size: 2rem;
  background: none;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  padding: 0.3rem;
  transition: border 0.2s;
  &:focus, &.selected { border: 2px solid #6366f1; }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #e11d48;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
`;

const BOT_AVATARS = [
  { emoji: '🛰️', label: 'Satellite' },
  { emoji: '🤖', label: 'Robot' },
  { emoji: '🦉', label: 'Wise Owl' },
  { emoji: '🐧', label: 'Penguin' },
  { emoji: '🦾', label: 'AI Arm' },
  { emoji: '👩‍🚀', label: 'Astronaut' },
  { emoji: '🦄', label: 'Unicorn' },
];
const USER_AVATARS = [
  { emoji: '🧑', label: 'Person' },
  { emoji: '👩', label: 'Woman' },
  { emoji: '👨', label: 'Man' },
  { emoji: '🧑‍🎓', label: 'Student' },
  { emoji: '🧑‍💻', label: 'Coder' },
  { emoji: '🧑‍🚀', label: 'Astronaut' },
  { emoji: '🧑‍🔬', label: 'Scientist' },
  { emoji: '🧑‍🎨', label: 'Artist' },
];

function getStoredAvatar(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch { return fallback; }
}

const now = () => new Date().toISOString();

const initialMessages = [
  { text: 'Hello! I am your FAQ Chatbot. Ask me anything about MOSDAC.', sender: 'bot', timestamp: now() }
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [botAvatar, setBotAvatar] = useState(() => getStoredAvatar('bot-avatar', '🛰️'));
  const [userAvatar, setUserAvatar] = useState(() => getStoredAvatar('user-avatar', '🧑'));

  useEffect(() => { localStorage.setItem('bot-avatar', botAvatar); }, [botAvatar]);
  useEffect(() => { localStorage.setItem('user-avatar', userAvatar); }, [userAvatar]);

  // Add timestamp to new messages
  const addMessage = (text, sender) => ({ text, sender, timestamp: now() });

  const handleSend = async (userInput) => {
    if (typeof userInput === 'object' && userInput.type === 'file') {
      setMessages(prev => [...prev, { ...userInput, sender: 'user', timestamp: now() }]);
      setIsLoading(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `Received your file: ${userInput.file.name}`, sender: 'bot', timestamp: now() }]);
        setIsLoading(false);
      }, 1200);
      return;
    }
    setMessages(prev => [...prev, { text: userInput, sender: 'user', timestamp: now() }]);
    setIsLoading(true);
    try {
      const response = await fetch('https://athuupandeyy.app.n8n.cloud/webhook/f0467dcb-1d49-4dbc-baae-84f26886a3dd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
      if (!response.ok) throw new Error('Webhook error');
      const data = await response.text();
      console.log("Success:", data);
      setMessages(prev => [...prev, { text: data || 'No response from webhook.', sender: 'bot', timestamp: now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: 'Sorry, there was a problem contacting the server.', sender: 'bot', timestamp: now() }]);
    }
    setIsLoading(false);
  };

  // Quick reply handler
  const handleQuickReply = (reply) => {
    if (!isLoading) handleSend(reply);
  };

  // On reload, always reset chat messages to initial
  useEffect(() => {
    setMessages(initialMessages);
    window.scrollTo(0, 0); // Scroll to top on reload/mount
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app-container">
      <VideoBackground />
      <header className="app-header">
        <SettingsBtn onClick={() => setShowSettings(true)} aria-label="Open settings">
          ⚙️
        </SettingsBtn>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}>
          <img
            src="/logo.png"
            alt="MOSDAC Logo"
            style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; e.target.parentNode.append('🛰️'); }}
          />
          <h1 style={{ margin: 0 }}>MOSDAC FAQ Chatbot</h1>
      </div>
      </header>
      {showSettings && (
        <ModalOverlay onClick={() => setShowSettings(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseBtn onClick={() => setShowSettings(false)} aria-label="Close settings">✖️</CloseBtn>
            <h2>Choose Bot Avatar</h2>
            <AvatarGrid>
              {BOT_AVATARS.map(a => (
                <AvatarOption
                  key={a.emoji}
                  className={botAvatar === a.emoji ? 'selected' : ''}
                  onClick={() => setBotAvatar(a.emoji)}
                  aria-label={a.label}
                >
                  {a.emoji}
                </AvatarOption>
              ))}
            </AvatarGrid>
            <h2>Choose Your Avatar</h2>
            <AvatarGrid>
              {USER_AVATARS.map(a => (
                <AvatarOption
                  key={a.emoji}
                  className={userAvatar === a.emoji ? 'selected' : ''}
                  onClick={() => setUserAvatar(a.emoji)}
                  aria-label={a.label}
                >
                  {a.emoji}
                </AvatarOption>
              ))}
            </AvatarGrid>
          </ModalContent>
        </ModalOverlay>
      )}
      <main className="chat-main">
        <ChatWindow messages={messages} isLoading={isLoading} botAvatar={botAvatar} userAvatar={userAvatar} />
        <QuickReplies onQuickReply={handleQuickReply} isDisabled={isLoading} />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </main>
      <footer className="app-footer">
        <span>Powered by React & Vite | Advanced UI</span>
      </footer>
      </div>
  );
}

export default App;
