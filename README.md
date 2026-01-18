# AutoBiz AI - Business Intelligence Chatbot

AutoBiz AI is a modern, privacy-focused business intelligence dashboard and chatbot integrated with **Google Gemini**. It allows users to track stock market trends, visualize business metrics, and analyze financial data through a natural language interface.

## 🚀 Features

-   **AI-Powered Analyst**: Integrated with Google Gemini (Pro/Flash) to answer queries about stocks, markets, and business strategies.
-   **Real-Time Dashboard**: Visualizes Key Performance Indicators (KPIs), stock trends, and revenue metrics.
-   **Dynamic Greetings**: Personalizes the experience based on the time of day.
-   **Voice Interaction**: Supports speech-to-text for querying the AI and text-to-speech for responses.
-   **Privacy-First Architecture**: Built on the structure of the Internet Computer (ICP) for secure, decentralized deployment (currently using a mocked backend for local dev).
-   **Modern UI**: Sleek, dark-mode design using **Shadcn UI**, **Tailwind CSS**, and **Framer Motion** for smooth animations.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, TypeScript
-   **Styling**: Tailwind CSS, Shadcn UI
-   **AI Integration**: Google Gemini API (`gemini-1.5-flash`, `gemini-pro`)
-   **State Management**: React Query (TanStack Query)
-   **Backend (Architecture)**: Motoko (Internet Computer) - *Currently mocked for frontend-only development*

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js (v16 or higher)
-   npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/HNS-06/autobiz-ai-business-intelligence-chatbot.git
cd autobiz-ai-business-intelligence-chatbot
```

### 2. Install Dependencies
Navigate to the frontend directory:
```bash
cd frontend
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the `frontend` directory to store your API key:
```bash
# frontend/.env.local
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```
*Note: You can get a free API key from [Google AI Studio](https://aistudio.google.com/).*

### 4. Run the Application
Start the development server:
```bash
npm run start
```
The application will be available at `http://localhost:3000`.

## 🤖 Usage

1.  **Dashboard**: View the summary of market data and business health.
2.  **AI Assistant**: Click the "AI Assistant" button in the header or the chat floating action button.
3.  **Ask Questions**: Type queries like "Analyze the tech sector trends" or "How can I improve my ROI?"
4.  **Voice Mode**: Click the microphone icon to speak your query.

## 📂 Project Structure

-   `frontend/`: React application source code.
    -   `src/components/`: UI components (Charts, ChatInterface, Dashboard).
    -   `src/hooks/`: Custom hooks, including `useActor.ts` which handles the AI API integration.
    -   `src/backend/`: Type definitions and mock data providers.
-   `backend/`: (Optional) Motoko source code for ICP deployment.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
