import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function AppContent() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <Header onChatToggle={() => setShowChat(!showChat)} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {showChat ? <ChatInterface /> : <Dashboard />}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
