# MOSDAC FAQ Chatbot

A modern, interactive FAQ chatbot for MOSDAC, built with React and Vite. This project features a beautiful UI, customizable avatars, quick replies, file upload, emoji support, voice input, and a light/dark theme toggle.

## Features

- **Conversational UI**: Chat with the bot in a familiar, friendly interface.
- **Custom Avatars**: Choose your own and the bot's avatar from a variety of emojis.
- **Quick Replies**: Get started fast with suggested questions.
- **File Upload**: Send files to the bot (demo response only).
- **Emoji Picker**: Express yourself with emoji in your messages.
- **Voice Input**: Dictate your questions using your microphone.
- **Theme Toggle**: Switch between light and dark mode.
- **Responsive Design**: Works great on desktop and mobile.

## Screenshots

> _Add screenshots here if desired._

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Installation

```bash
cd faq-chatbot
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Project Structure

- `src/App.jsx` — Main app logic and state
- `src/components/ChatWindow.jsx` — Chat message display
- `src/components/ChatInput.jsx` — Message input, emoji, file, and voice controls
- `src/components/QuickReplies.jsx` — Suggested quick reply buttons
- `src/components/Loader.jsx` — Loading spinner
- `src/components/MessageBubble.jsx` — Individual chat bubbles
- `src/styles/` — CSS modules for styling

## API/Webhook

The chatbot sends user messages to a backend webhook for responses. Update the webhook URL in `App.jsx` as needed:

```
fetch('https://athuupandeyy.app.n8n.cloud/webhook-test/f0467dcb-1d49-4dbc-baae-84f26886a3dd', ...)
```

## Customization
- **Avatars**: Click the settings (⚙️) button to choose avatars.
- **Theme**: Use the sun/moon button to toggle theme.
- **Quick Replies**: Edit `defaultReplies` in `src/components/QuickReplies.jsx`.

## License

MIT
