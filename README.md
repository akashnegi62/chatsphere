✨ ChatSphere – AI-Powered Chat Application

<p align="center">
<img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
<img src="https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase" />
<img src="https://img.shields.io/badge/Groq-AI-orange" />
<img src="https://img.shields.io/badge/LiveKit-Voice%20Technology-purple" />
</p>

<p align="center">
<strong>Your intelligent AI companion for conversations, coding, and voice interaction.</strong>
</p>

<p align="center">
<a href="https://chatsphere-user.vercel.app/">🌐 Live Demo</a> •
<a href="https://github.com/akashnegi62/chatsphere">📂 GitHub Repository</a>
</p>

🚀 About ChatSphere

ChatSphere is a modern AI-powered chat application designed to provide an interactive and intelligent conversational experience.

Built using Next.js, React, and TypeScript, ChatSphere combines AI-powered conversations with persistent chat history, file attachments, voice interaction, and an intuitive user interface.

The application integrates Groq for AI capabilities, Supabase for authentication and data persistence, and LiveKit for real-time voice functionality.

Whether you want to ask questions, generate code, explore ideas, or interact using voice, ChatSphere provides a unified conversational experience.

✨ Features

<table>
<tr>
<td width="50%" valign="top">
<h3>🤖 AI-Powered Conversations</h3>
<p>Interact with an AI assistant and receive intelligent responses using Groq-powered AI integration.</p>
</td>
<td width="50%" valign="top">
<h3>💬 Chat Management</h3>
<p>Create new conversations, switch between chats, and access previously saved chat history.</p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>📎 File Attachments</h3>
<p>Attach files and images to messages and display file previews in conversations.</p>
</td>
<td width="50%" valign="top">
<h3>🎙️ Voice Interaction</h3>
<p>Access voice interaction through the LiveKit-powered voice experience.</p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>🔊 Text-to-Speech</h3>
<p>Listen to AI-generated responses through audio playback.</p>
</td>
<td width="50%" valign="top">
<h3>💻 Code Highlighting</h3>
<p>Display code blocks with syntax highlighting, line numbers, and copy functionality.</p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>👍 Message Feedback</h3>
<p>Like or dislike AI-generated responses.</p>
</td>
<td width="50%" valign="top">
<h3>🔐 Authentication</h3>
<p>Integrate Supabase authentication and user-specific conversation persistence.</p>
</td>
</tr>
</table>

🛠️ Tech Stack
Frontend

<p>
<img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind" />
</p>

Next.js 16
React 19
TypeScript
Tailwind CSS 4
Motion
Lucide React
Backend & Services

<p>
<img src="https://skillicons.dev/icons?i=supabase" />
</p>

Supabase – Authentication and database management
Groq SDK – AI integration
LiveKit – Real-time voice infrastructure
Next.js API Routes – Server-side API endpoints
Additional Libraries
Sonner – Notifications
React Syntax Highlighter – Code highlighting
Copy to Clipboard – Copy functionality
LiveKit Client SDK – Voice communication
🏗️ Application Architecture
text
              ┌──────────────────────┐
              │       USER           │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │    Next.js UI        │
              │   React + TypeScript │
              └──────────┬───────────┘
                         │
             ┌───────────┼───────────┐
             │           │           │
             ▼           ▼           ▼
        ┌─────────┐ ┌──────────┐ ┌──────────┐
        │ Groq AI │ │ Supabase │ │ LiveKit  │
        │         │ │          │ │          │
        │ Chat    │ │ Auth     │ │ Voice    │
        │         │ │ Database │ │ Calls    │
        └─────────┘ └──────────┘ └──────────┘

📂 Project Structure
text
chatsphere/
│
├── public/
│   └── Static assets and images
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   └── speak/
│   │   │
│   │   ├── components/
│   │   │   ├── Chat.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── auth/
│   │   ├── voice/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   └── utils/
│       └── Supabase client utilities
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md

⚙️ Getting Started

Follow these steps to run ChatSphere locally.

Prerequisites

Make sure you have installed:

Node.js (LTS recommended)
npm
Git
Supabase account
Groq API access
LiveKit account for voice functionality
1. Clone the Repository
bash
git clone https://github.com/akashnegi62/chatsphere.git

2. Navigate to the Project
bash
cd chatsphere

3. Install Dependencies
bash
npm install

4. Configure Environment Variables

Create a .env.local file in the project root.

Add the required credentials for your integrations:

env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# LiveKit
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret


Note: These are illustrative configuration names. Verify the exact environment variable names against the API routes and voice implementation before running the application.

5. Run the Development Server
bash
npm run dev

6. Open in Browser

Visit:

text
http://localhost:3000


You're ready to explore ChatSphere!

📜 Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build production application
npm run start	Start production server
npm run lint	Run ESLint
🔐 Security Best Practices
Never expose API keys or service secrets.
Keep private environment variables on the server.
Use Supabase Row Level Security (RLS) to protect user data.
Validate uploaded files and API requests.
Never commit .env.local to GitHub.
Use secure authentication and authorization practices.
🚀 Deployment

ChatSphere can be deployed using the Vercel platform.

Deployment Steps
Push your code to GitHub.
Import the repository into Vercel.
Configure the required environment variables.
Deploy the application.
Verify authentication, AI responses, and voice functionality.

<p align="center">
<a href="https://vercel.com/new">
<img src="https://img.shields.io/badge/Deploy%20with-Vercel-black?style=for-the-badge&logo=vercel" />
</a>
</p>

🤝 Contributing

Contributions, suggestions, and improvements are welcome!

Fork the repository.
Create a new feature branch.
Make your changes.
Commit and push your changes.
Open a Pull Request.
bash
git checkout -b feature/new-feature

git add .

git commit -m "Add: new feature"

git push origin feature/new-feature

👨‍💻 Author

<p align="center">
<strong>Akash Negi</strong>
<br/>
<a href="https://github.com/akashnegi62">
<img src="https://img.shields.io/badge/GitHub-Akash%20Negi-181717?style=for-the-badge&logo=github" />
</a>
</p>

🌐 Live Application

<p align="center">
<a href="https://chatsphere-user.vercel.app/">
<img src="https://img.shields.io/badge/Explore-ChatSphere-blue?style=for-the-badge&logo=vercel" />
</a>
</p>

<p align="center">
<strong>⭐ If you like ChatSphere, don't forget to star the repository!</strong>
<br/><br/>
Made with ❤️ by Akash Negi
</p>
