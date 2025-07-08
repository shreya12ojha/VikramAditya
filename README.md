# FAQ Chatbot – VAANI

VikramAditya's Assistant for Navigation and Insight (VAANI) is an interactive FAQ chatbot designed to help users with queries about MOSDAC. It features a modern UI, customizable avatars, quick replies, and a persistent chat experience.

## Features

- Conversational chatbot interface
- Customizable bot and user avatars (emoji-based)
- Quick reply suggestions
- File upload support (simulated)
- Animated video background
- Persistent session per browser tab
- Responsive and modern design

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd faq-chatbot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

## Usage

- Open your browser and navigate to `http://localhost:3000` (or the port shown in your terminal).
- Start chatting with VAANI about MOSDAC.
- Use the ⚙️ settings button (top right) to choose your avatar and the bot's avatar.
- Use quick replies for common questions.
- Upload a file to simulate file handling.

## Project Structure

```
faq-chatbot/
├── src/
│   ├── App.jsx            # Main React component
│   ├── components/        # ChatWindow, ChatInput, Loader, etc.
│   ├── styles/            # CSS files for styling
│   └── assets/            # Static assets (e.g., images)
├── public/                # Static public files
├── index.html             # Main HTML file
├── package.json           # Project metadata and dependencies
└── ...
```

## Customization

- **Avatars:**
  - Click the ⚙️ button to open settings and select from a variety of emoji avatars for both the bot and user.
  - Avatars are stored in localStorage for persistence.
- **Session:**
  - Each browser tab gets a unique session ID for chat continuity.
- **Webhook:**
  - The chatbot sends user messages to a remote webhook for processing. Update the webhook URL in `src/App.jsx` if needed.

## Technologies Used

- React (functional components, hooks)
- Styled-components for CSS-in-JS
- JavaScript (ES6+)
- HTML5 & CSS3

## License

[MIT](LICENSE) (or specify your license here)

---

*Guiding Your Space Data Journey with VAANI!*
