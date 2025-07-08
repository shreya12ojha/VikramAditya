import React, { useState } from 'react';
import styled, { css } from 'styled-components';

function getFileTypeIcon(fileName) {
  if (!fileName) return '📄';
  const ext = fileName.split('.').pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return '🖼️';
  if (["pdf"].includes(ext)) return '📄';
  if (["doc", "docx"].includes(ext)) return '📝';
  if (["xls", "xlsx", "csv"].includes(ext)) return '📊';
  if (["ppt", "pptx"].includes(ext)) return '📈';
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return '🗜️';
  return '📄';
}

function formatFileSize(size) {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.2rem;
  flex-direction: ${props => (props.isUser ? 'row-reverse' : 'row')};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 0.5rem;
  background: ${props => (props.isUser ? '#c7d2fe' : '#f1f5f9')};
  box-shadow: 0 2px 8px rgba(49, 46, 129, 0.08);
`;

const Bubble = styled.div`
  max-width: 70%;
  padding: 0.7rem 1.1rem;
  border-radius: 18px;
  font-size: 1.05rem;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.13);
  word-break: break-word;
  color: ${props => (props.isUser ? '#fff' : '#312e81')};
  background: ${props => (props.isUser ? '#6366f1' : '#e0e7ff')};
  border: ${props => (props.isUser ? '1.5px solid #4f46e5' : '1.5px solid #a5b4fc')};
  border-bottom-right-radius: ${props => (props.isUser ? '4px' : '18px')};
  border-bottom-left-radius: ${props => (props.isUser ? '18px' : '4px')};
  animation: slideInBounce 0.6s cubic-bezier(0.23, 1.15, 0.32, 1) both;

  @keyframes slideInBounce {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    60% {
      opacity: 1;
      transform: translateY(-8px) scale(1.03);
    }
    80% {
      transform: translateY(2px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Timestamp = styled.div`
  display: block;
  font-size: 0.78rem;
  color: #888;
  margin-top: 0.2rem;
  text-align: right;
  opacity: 0.7;
`;

const FilePreviewImg = styled.img`
  border: 2px solid #6366f1;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.13);
  border-radius: 8px;
  max-width: 120px;
  max-height: 120px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
  &:hover, &:focus {
    box-shadow: 0 4px 24px rgba(99, 102, 241, 0.22);
    border: 2.5px solid #6366f1;
  }
`;

const FileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.97rem;
  margin-top: 0.2rem;
  color: #312e81;
`;

const FileSize = styled.span`
  color: #888;
  font-size: 0.93rem;
  margin-left: 0.2rem;
`;

const FileDownloadBtn = styled.a`
  background: none;
  border: none;
  color: #6366f1;
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 0.3rem;
  text-decoration: none;
  transition: color 0.2s;
  &:hover, &:focus {
    color: #312e81;
    text-decoration: underline;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalImg = styled.img`
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(49, 46, 129, 0.22);
  background: #fff;
`;

const MessageBubble = ({ message, botAvatar, userAvatar }) => {
  const { text, sender, timestamp, type, file, preview } = message;
  const isUser = sender === 'user';
  const [showModal, setShowModal] = useState(false);

  // Format timestamp as HH:MM
  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MessageRow isUser={isUser}>
      {!isUser && <Avatar>{botAvatar || '🛰️'}</Avatar>}
      <Bubble isUser={isUser}>
        {type === 'file' && preview ? (
          <>
            <FilePreviewImg
              src={preview}
              alt={file?.name || 'file'}
              onClick={() => setShowModal(true)}
              tabIndex={0}
              aria-label="View image larger"
            />
            {showModal && (
              <ModalOverlay onClick={() => setShowModal(false)}>
                <ModalImg
                  src={preview}
                  alt={file?.name || 'file'}
                  onClick={e => e.stopPropagation()}
                />
              </ModalOverlay>
            )}
            <FileMeta>{getFileTypeIcon(file?.name)} {file?.name} <FileSize>{formatFileSize(file?.size)}</FileSize></FileMeta>
          </>
        ) : type === 'file' && file ? (
          <FileMeta>
            {getFileTypeIcon(file.name)} {file.name} <FileSize>{formatFileSize(file.size)}</FileSize>
            <FileDownloadBtn
              href={URL.createObjectURL(file)}
              download={file.name}
              aria-label={`Download ${file.name}`}
              tabIndex={0}
            >
              ⬇️
            </FileDownloadBtn>
          </FileMeta>
        ) : (
          <div>{text}</div>
        )}
        {timestamp && (
          <Timestamp>{formatTime(timestamp)}</Timestamp>
        )}
      </Bubble>
      {isUser && <Avatar isUser>{userAvatar || '🧑'}</Avatar>}
    </MessageRow>
  );
};

export default MessageBubble; 