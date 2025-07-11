import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import QuickReplies from "./components/QuickReplies";
import VideoBackground from "./components/VideoBackground";
import "./styles/App.css";

// Removed styled-components and keyframes

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

// Removed floatVaani and floatSubtitle

// Removed FloatingTitle and FloatingSubtitle

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

      <header className="app-header app-header-flex">
        {/* Left-aligned logo */}
        <div className="logo-container">
          <img
            src="logova.jpg"
            alt="MOSDAC Logo"
            className="logo-img"
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Center title and subtitle */}
        <div className="header-center">
          <h1 className="floating-title">V A A N I</h1>
          <p className="floating-subtitle">
            VikramAditya's Assistant for Navigation and Insight
          </p>
        </div>

        {/* Right-aligned settings button */}
        <button
          className="settings-btn"
          onClick={() => setShowSettings(true)}
          aria-label="Open settings"
        >
          ⚙️
        </button>
      </header>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
            >
              ✖️
            </button>
            <h2>Choose Bot Avatar</h2>
            <div className="avatar-grid">
              {BOT_AVATARS.map((a) => (
                <button
                  key={a.emoji}
                  className={`avatar-option${botAvatar === a.emoji ? " selected" : ""}`}
                  onClick={() => setBotAvatar(a.emoji)}
                  aria-label={a.label}
                >
                  {a.emoji}
                </button>
              ))}
            </div>
            <h2>Choose Your Avatar</h2>
            <div className="avatar-grid">
              {USER_AVATARS.map((a) => (
                <button
                  key={a.emoji}
                  className={`avatar-option${userAvatar === a.emoji ? " selected" : ""}`}
                  onClick={() => setUserAvatar(a.emoji)}
                  aria-label={a.label}
                >
                  {a.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
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
