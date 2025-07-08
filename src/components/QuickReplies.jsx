import React from 'react';
import '../styles/QuickReplies.css';

const defaultReplies = [
  'What is MOSDAC?',
  'List recent satellite launches.',
  'Who are the key scientists at MOSDAC?',
  'Show latest news.',
  'How to access data from MOSDAC?',
  'How do I request custom data from MOSDAC?'
];

const QuickReplies = ({ onQuickReply, isDisabled, replies = defaultReplies }) => (
  <div className="quick-replies" role="group" aria-label="Quick reply suggestions">
    <div className="quick-replies-inner">
      {replies.map((reply, idx) => (
        <button
          key={idx}
          className="quick-reply-btn"
          onClick={() => onQuickReply(reply)}
          disabled={isDisabled}
          tabIndex={0}
          aria-label={`Quick reply: ${reply}`}
          type="button"
        >
          {reply}
        </button>
      ))}
    </div>
  </div>
);

export default QuickReplies; 