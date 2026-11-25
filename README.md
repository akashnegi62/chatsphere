✨ ChatSphere

Your AI-powered conversation companion.

ChatSphere is a modern AI chat application built with Next.js, React, TypeScript, Groq, and Supabase. It provides an interactive conversational experience with AI-generated responses, voice interaction, chat history, and user authentication.

🌐 Live Demo: ChatSphere

🚀 Features
AI-Powered Conversations: Get intelligent responses powered by Groq's Llama 3.1 model.
User Authentication: Sign up and log in using email and password.
Social Authentication: Sign in with Google and GitHub.
Chat History: Save and access previous conversations.
Chat Management: Create, search, rename, and delete conversations.
Voice Interaction: Interact with ChatSphere using your microphone.
Text-to-Speech: Listen to AI-generated responses using Groq's speech generation.
Speech-to-Text: Convert voice input into text for AI processing.
Code Highlighting: Display code snippets with syntax highlighting and line numbers.
Copy Responses: Easily copy AI-generated messages and code snippets.
Message Feedback: Like or dislike AI responses.
File Attachments: Select files and display attachment previews in conversations.
Responsive UI: Enjoy a clean interface across desktop and mobile devices.
Smooth Animations: Interactive UI animations powered by Motion.
🛠️ Tech Stack
Technology	Purpose
Next.js 16	React framework
React 19	UI development
TypeScript	Type safety
Tailwind CSS 4	Styling
Supabase	Authentication and database
Groq API	AI-powered responses
Llama 3.1	Language model
Groq Orpheus	Text-to-speech
LiveKit	Real-time audio connectivity
Lucide React	Icons
Motion	UI animations
React Syntax Highlighter	Code highlighting
Sonner	Notifications
📸 Application Overview

ChatSphere provides a conversational interface with:

A sidebar for managing conversations.
A central chat window for interacting with AI.
A message composer with attachment selection.
Response actions for copying, rating, and listening to messages.
A dedicated voice-chat interface.
Authentication screens for login and registration.
⚙️ Getting Started

Follow these steps to run ChatSphere locally.

1. Clone the Repository
bash
git clone https://github.com/akashnegi62/chatsphere.git

2. Navigate to the Project
bash
cd chatsphere

3. Install Dependencies

Using npm:

bash
npm install

4. Configure Environment Variables

Create a .env.local file in the root directory.

Add the following variables:

env
# Groq API
GROQ_API_KEY=your_groq_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# LiveKit Configuration
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_server_url


Important: The voice-chat and authentication API routes may require additional server-side credentials. Configure those according to the environment variables referenced in the respective API routes.

5. Configure Supabase

Create a Supabase project and configure authentication.

Enable the following authentication providers if you want social login:

Google
GitHub

Configure the required database tables:

chats

Column	Description
id	Unique chat ID
user_id	Associated user ID
title	Conversation title
created_at	Creation timestamp

messages

Column	Description
id	Unique message ID
chat_id	Associated chat ID
role	user or assistant
content	Message content
file_url	Attachment reference
file_name	Attachment name
created_at	Creation timestamp

Make sure to configure appropriate foreign keys and Row Level Security (RLS) policies so users can access only their own conversations.

6. Run the Development Server
bash
npm run dev


Open your browser and visit:

text
http://localhost:3000


ChatSphere should now be running locally!

🎙️ Voice Chat

ChatSphere includes a dedicated voice interface.

The voice interaction pipeline uses:

Microphone audio recording.
Speech-to-text processing.
Groq-powered AI response generation.
Text-to-speech audio generation.
Audio playback.

To access voice chat, use the microphone option in the main chat interface.

Note: Microphone permissions and the required API credentials must be configured for voice functionality to work correctly.

📂 Project Structure
text
chatsphere/
│
├── public/
│   ├── signin.png
│   └── signup.png
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   ├── speak/
│   │   │   ├── token/
│   │   │   ├── stt/
│   │   │   ├── tts/
│   │   │   └── groq/
│   │   │
│   │   ├── auth/
│   │   ├── voice/
│   │   ├── components/
│   │   │   ├── Chat.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── VoiceChat.tsx
│   │   │   └── UserMenu.tsx
│   │   │
│   │   └── page.tsx
│   │
│   └── utils/
│       └── supabase/
│           └── client.ts
│
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md


The structure above highlights the main application areas; some files and folders may be omitted for brevity.

📜 Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build the application
npm run start	Start production server
npm run lint	Run ESLint
🌍 Deployment

ChatSphere can be deployed using Vercel.

Steps:

Push your project to GitHub.
Import the repository into Vercel.
Configure the required environment variables.
Deploy the application.
Configure Supabase authentication redirect URLs for your deployed domain.

Your application will be live!

🔐 Security
Keep API keys and private credentials out of source control.
Never expose server-side secrets through NEXT_PUBLIC_ variables.
Configure Supabase Row Level Security policies.
Add .env.local to .gitignore.
Validate and secure API requests before deploying to production.
🤝 Contributing

Contributions are welcome!

Fork this repository.
Create a new branch:
bash
git checkout -b feature/your-feature

Make your changes.
Commit your changes:
bash
git commit -m "Add: your feature"

Push your branch:
bash
git push origin feature/your-feature

Open a Pull Request.
👨‍💻 Author

Akash Negi

GitHub: @akashnegi62
Project: ChatSphere
📄 License

No license is currently specified in this repository. Please contact the repository owner for permission before redistributing or using the project under an assumed open-source license.

⭐ If you like ChatSphere, consider giving this repository a star!

Built with ❤️ using Next.js, Groq, and Supabase.
