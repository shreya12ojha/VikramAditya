import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import QuickReplies from "./components/QuickReplies";
import VideoBackground from "./components/VideoBackground";
import styled, { keyframes } from "styled-components";

const SettingsBtn = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  background: none;
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  &:focus,
  &.selected {
    border: 2px solid #6366f1;
  }
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
  { emoji: "🛰️", label: "Satellite" },
  { emoji: "🤖", label: "Robot" },
  { emoji: "🦉", label: "Wise Owl" },
  { emoji: "🐧", label: "Penguin" },
  { emoji: "🦾", label: "AI Arm" },
  { emoji: "👩‍🚀", label: "Astronaut" },
  { emoji: "🦄", label: "Unicorn" },
];

const USER_AVATARS = [
  { emoji: "🧑", label: "Person" },
  { emoji: "👩", label: "Woman" },
  { emoji: "👨", label: "Man" },
  { emoji: "🧑‍🎓", label: "Student" },
  { emoji: "🧑‍💻", label: "Coder" },
  { emoji: "🧑‍🚀", label: "Astronaut" },
  { emoji: "🧑‍🔬", label: "Scientist" },
  { emoji: "🧑‍🎨", label: "Artist" },
];

// 🔥 Session ID for memory per tab (until refresh)
function getSessionId() {
  let id = sessionStorage.getItem("session-id");
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    sessionStorage.setItem("session-id", id);
  }
  return id;
}

const sessionId = getSessionId();
console.log("Session ID:", sessionId);

const now = () => new Date().toISOString();

const initialMessages = [
  {
    text: "Hello! I am your FAQ Chatbot. Ask me anything about MOSDAC.",
    sender: "bot",
    timestamp: now(),
  },
];

const floatVaani = keyframes`
  0% {
    transform: translateY(0);
    text-shadow: 0 2px 8px #6366f1, 0 0 0 #fff;
  }
  50% {
    transform: translateY(-18px);
    text-shadow: 0 8px 24px #6366f1, 0 0 8px #fff;
  }
  100% {
    transform: translateY(0);
    text-shadow: 0 2px 8px #6366f1, 0 0 0 #fff;
  }
`;

const floatSubtitle = keyframes`
  0% {
    transform: translateY(0);
    text-shadow: 0 1px 4px #6366f1, 0 0 0 #fff;
  }
  50% {
    transform: translateY(-8px);
    text-shadow: 0 4px 12px #6366f1, 0 0 4px #fff;
  }
  100% {
    transform: translateY(0);
    text-shadow: 0 1px 4px #6366f1, 0 0 0 #fff;
  }
`;

const FloatingTitle = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  background: linear-gradient(135deg, #ff8c00 25%, #ffffff 50%, #228b22 75%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
`;

const FloatingSubtitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #ddd;
  line-height: 1.2;
`;

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [botAvatar, setBotAvatar] = useState(() =>
    getStoredAvatar("bot-avatar", "🛰️")
  );
  const [userAvatar, setUserAvatar] = useState(() =>
    getStoredAvatar("user-avatar", "🧑")
  );

  useEffect(() => {
    localStorage.setItem("bot-avatar", botAvatar);
  }, [botAvatar]);
  useEffect(() => {
    localStorage.setItem("user-avatar", userAvatar);
  }, [userAvatar]);

  function getStoredAvatar(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }

  const handleSend = async (userInput) => {
    if (typeof userInput === "object" && userInput.type === "file") {
      setMessages((prev) => [
        ...prev,
        { ...userInput, sender: "user", timestamp: now() },
      ]);
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: `Received your file: ${userInput.file.name}`,
            sender: "bot",
            timestamp: now(),
          },
        ]);
        setIsLoading(false);
      }, 1200);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { text: userInput, sender: "user", timestamp: now() },
    ]);
    setIsLoading(true);
    console.log("Sending to webhook:", userInput);

    try {
      const response = await fetch(
        "https://athuupandeyy.app.n8n.cloud/webhook/8abe8a8d-448d-47b0-b740-8050809ae0d5",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userInput,
            sessionId: sessionId, // 🔥 Include session ID
          }),
        }
      );

      if (!response.ok) throw new Error("Webhook error");

      const data = await response.text();
      console.log("Webhook replied:", data);

      setMessages((prev) => [
        ...prev,
        {
          text: data || "No response from webhook.",
          sender: "bot",
          timestamp: now(),
        },
      ]);
    } catch (err) {
      console.error("Error contacting webhook:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was a problem contacting the server.",
          sender: "bot",
          timestamp: now(),
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleQuickReply = (reply) => {
    if (!isLoading) handleSend(reply);
  };

  useEffect(() => {
    setMessages(initialMessages);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-container">
      <VideoBackground />

      <header
        className="app-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 1.5px",
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1100,
          background:
            "linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          borderRadius: "0 0 18px 18px",
        }}
      >
        {/* Left-aligned logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="logova.jpg"
            alt="MOSDAC Logo"
            style={{
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              objectFit: "cover",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onError={(e) => {
              e.target.style.display = "none";
              /* e.target.parentNode.append("🛰️");*/
            }}
          />
        </div>

        {/* Center title and subtitle */}
        <div
          style={{
            textAlign: "center",
            flex: 1,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <FloatingTitle>V A A N I</FloatingTitle>
          <FloatingSubtitle>
            VikramAditya's Assistant for Navigation and Insight
          </FloatingSubtitle>
        </div>

        {/* Right-aligned settings button */}
        <SettingsBtn
          onClick={() => setShowSettings(true)}
          aria-label="Open settings"
        >
          ⚙️
        </SettingsBtn>
      </header>

      {showSettings && (
        <ModalOverlay onClick={() => setShowSettings(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseBtn
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
            >
              ✖️
            </CloseBtn>
            <h2>Choose Bot Avatar</h2>
            <AvatarGrid>
              {BOT_AVATARS.map((a) => (
                <AvatarOption
                  key={a.emoji}
                  className={botAvatar === a.emoji ? "selected" : ""}
                  onClick={() => setBotAvatar(a.emoji)}
                  aria-label={a.label}
                >
                  {a.emoji}
                </AvatarOption>
              ))}
            </AvatarGrid>
            <h2>Choose Your Avatar</h2>
            <AvatarGrid>
              {USER_AVATARS.map((a) => (
                <AvatarOption
                  key={a.emoji}
                  className={userAvatar === a.emoji ? "selected" : ""}
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

      <main className="chat-main" style={{ paddingTop: "5.5rem" }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          botAvatar={botAvatar}
          userAvatar={userAvatar}
        />
        <QuickReplies onQuickReply={handleQuickReply} isDisabled={isLoading} />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </main>

      <footer className="app-footer">
        <span>VAANI – Guiding Your Space Data Journey</span>
      </footer>
    </div>
  );
}

export default App;
