import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ChatInputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  max-width: 1000px;
  gap: 0.7rem;
  margin-top: 0.5rem;
  position: relative;
`;

const EmojiBtn = styled.button`
  background: var(--color-accent);
  color: #f59e42;
  border: none;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.3rem;
  cursor: pointer;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  &:focus { outline: 2px solid var(--color-primary); }
`;

const AttachBtn = styled.button`
  background: var(--color-accent);
  color: #6366f1;
  border: none;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.3rem;
  cursor: pointer;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  &:focus { outline: 2px solid var(--color-primary); }
`;

const MicBtn = styled.button`
  background: var(--color-accent);
  color: ${props => (props.listening ? '#e11d48' : '#6366f1')};
  border: none;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.3rem;
  cursor: pointer;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  box-shadow: ${props => (props.listening ? '0 0 0 3px #e11d48' : 'none')};
  &:focus { outline: 2px solid var(--color-primary); }
`;

const WaveformContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 1.2rem;
  margin-right: 0.5rem;
`;

const wave = keyframes`
  0%, 100% { height: 0.5rem; }
  50% { height: 1.2rem; }
`;

const WaveBar = styled.div`
  width: 0.2rem;
  margin: 0 0.08rem;
  background: #e11d48;
  border-radius: 2px;
  animation: ${wave} 0.8s infinite;
  animation-delay: ${props => props.delay}s;
`;

const LanguageSelect = styled.select`
  margin-right: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-secondary);
  padding: 0.2rem 0.5rem;
  font-size: 1rem;
  background: var(--color-bg-chat);
  color: var(--color-text);
  flex: 0 0 auto;
`;

const ErrorMsg = styled.div`
  color: #e11d48;
  font-size: 0.97rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
`;

const EmojiPickerPopup = styled.div`
  position: absolute;
  bottom: 3.5rem;
  left: 1rem;
  z-index: 10;
`;

const StyledTextarea = styled.textarea`
  flex: 1 1 0%;
  min-width: 350px;
  min-height: 48px;
  max-height: none;
  resize: none;
  border: 1.5px solid var(--color-secondary);
  border-radius: 12px;
  padding: 0.9rem 1.2rem;
  font-size: 1.13rem;
  outline: none;
  background: var(--color-bg-chat);
  transition: border 0.2s, background 0.2s, color 0.2s;
  color: var(--color-text);
  &:focus { border: 1.5px solid var(--color-primary); }
`;

const SendBtn = styled.button`
  background: var(--color-primary);
  color: var(--color-user-bubble-text);
  border: none;
  border-radius: 10px;
  padding: 0.9rem 1.5rem;
  font-size: 1.13rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
  align-self: flex-end;
  margin-left: 0.2rem;
  flex: 0 0 auto;
  &:disabled { background: var(--color-secondary); cursor: not-allowed; }
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-accent);
  border-radius: 8px;
  padding: 0.3rem 0.7rem;
  margin-right: 0.5rem;
  margin-bottom: 0.3rem;
  max-width: 180px;
`;

const FilePreviewImg = styled.img`
  max-width: 40px;
  max-height: 40px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid var(--color-border);
`;

const FilePreviewName = styled.span`
  font-size: 0.97rem;
  color: var(--color-bot);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveFileBtn = styled.button`
  background: none;
  border: none;
  color: #e11d48;
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 0.2rem;
  padding: 0;
  transition: color 0.2s;
  &:focus { outline: 2px solid #e11d48; }
`;

const LANGUAGES_BY_CONTINENT = [
  {
    label: 'Asia',
    options: [
      { code: 'en-IN', label: 'English (India)' },
      { code: 'hi-IN', label: 'Hindi' },
      { code: 'zh-CN', label: 'Chinese (Mandarin)' },
      { code: 'ja-JP', label: 'Japanese' },
      { code: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
      { code: 'ko-KR', label: 'Korean' },
      { code: 'th-TH', label: 'Thai' },
      { code: 'id-ID', label: 'Indonesian' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { code: 'en-GB', label: 'English (UK)' },
      { code: 'fr-FR', label: 'French' },
      { code: 'de-DE', label: 'German' },
      { code: 'es-ES', label: 'Spanish' },
      { code: 'it-IT', label: 'Italian' },
      { code: 'ru-RU', label: 'Russian' },
      { code: 'nl-NL', label: 'Dutch' },
      { code: 'pt-PT', label: 'Portuguese (Portugal)' },
    ],
  },
  {
    label: 'Americas',
    options: [
      { code: 'en-US', label: 'English (US)' },
      { code: 'es-MX', label: 'Spanish (Mexico)' },
      { code: 'pt-BR', label: 'Portuguese (Brazil)' },
      { code: 'fr-CA', label: 'French (Canada)' },
    ],
  },
  {
    label: 'Africa',
    options: [
      { code: 'ar-EG', label: 'Arabic (Egypt)' },
      { code: 'sw-KE', label: 'Swahili' },
      { code: 'af-ZA', label: 'Afrikaans' },
    ],
  },
  {
    label: 'Oceania',
    options: [
      { code: 'en-AU', label: 'English (Australia)' },
      { code: 'mi-NZ', label: 'Maori' },
    ],
  },
];

const ChatInput = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState('en-US');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleSend = () => {
    if (file) {
      onSend({ type: 'file', file, preview: filePreview });
      setFile(null);
      setFilePreview(null);
    } else if (input.trim()) {
      onSend(input);
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    const cursorPos = textareaRef.current.selectionStart;
    const newText =
      input.slice(0, cursorPos) + emoji.native + input.slice(cursorPos);
    setInput(newText);
    setShowEmoji(false);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionEnd = cursorPos + emoji.native.length;
    }, 0);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setFilePreview(ev.target.result);
        reader.readAsDataURL(selected);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Voice input logic
  const handleMicClick = () => {
    setError('');
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Sorry, your browser does not support speech recognition.');
      return;
    }
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      setListening(false);
      setError('Voice input error: ' + (e.error || 'Unknown error'));
    };
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  return (
    <ChatInputContainer role="form" aria-label="Send a message">
      <LanguageSelect value={lang} onChange={e => setLang(e.target.value)} disabled={isLoading || listening}>
        {LANGUAGES_BY_CONTINENT.map(group => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </optgroup>
        ))}
      </LanguageSelect>
      <EmojiBtn
        type="button"
        onClick={() => setShowEmoji((v) => !v)}
        aria-label="Open emoji picker"
        disabled={isLoading}
        tabIndex={0}
      >
        😊
      </EmojiBtn>
      <AttachBtn
        type="button"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        aria-label="Attach file or image"
        disabled={isLoading}
        tabIndex={0}
      >
        📎
      </AttachBtn>
      <MicBtn
        type="button"
        onClick={handleMicClick}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
        disabled={isLoading}
        listening={listening}
        tabIndex={0}
      >
        {listening ? '🎤' : '🎙️'}
      </MicBtn>
      {listening && (
        <WaveformContainer aria-label="Listening...">
          {[0, 0.2, 0.4, 0.1, 0.3].map((delay, i) => (
            <WaveBar key={i} delay={delay} />
          ))}
        </WaveformContainer>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,application/pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx"
      />
      {showEmoji && (
        <EmojiPickerPopup>
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="auto" />
        </EmojiPickerPopup>
      )}
      {file && (
        <FilePreview>
          {filePreview ? (
            <FilePreviewImg src={filePreview} alt="preview" />
          ) : (
            <FilePreviewName>{file.name}</FilePreviewName>
          )}
          <RemoveFileBtn onClick={handleRemoveFile} type="button" aria-label="Remove file">✖️</RemoveFileBtn>
        </FilePreview>
      )}
      <StyledTextarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your question..."
        disabled={isLoading}
        rows={1}
        aria-label="Type your question"
        ref={textareaRef}
      />
      <SendBtn
        onClick={handleSend}
        disabled={isLoading || (!input.trim() && !file)}
        aria-label="Send message"
      >
        Send
      </SendBtn>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </ChatInputContainer>
  );
};

export default ChatInput; 