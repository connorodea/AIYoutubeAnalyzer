import React, { useState, useCallback, useRef } from 'react';
import type { Chat } from '@google/genai';
import { summarizeVideo, continueChat } from './services/geminiService';
import type { ChatMessage } from './types';
import UrlInputForm from './components/UrlInputForm';
import VideoPlayer from './components/VideoPlayer';
import AnalysisDisplay from './components/AnalysisDisplay';
import ChatWindow from './components/ChatWindow';
import { ErrorIcon } from './components/icons/ErrorIcon';

/**
 * Parses an error object and returns a user-friendly error message string.
 * @param error The error object, typically from a catch block.
 * @returns A string containing a user-friendly error message.
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('api key not valid')) {
      return 'Authentication Error: The provided API key is not valid. Please ensure it is configured correctly.';
    }
    if (message.includes('quota')) {
      return 'Quota Exceeded: You have exceeded your API usage limit. Please check your plan and billing details.';
    }
    if (message.includes('blocked') && message.includes('safety')) {
      return "Content Blocked: The model's response was blocked due to safety settings. This may be due to the video content or your prompt.";
    }
    if (message.includes('timed out') || message.includes('deadline_exceeded')) {
      return 'Request Timeout: The request took too long to process. Please try again.';
    }
    if (message.includes('resource has been exhausted')) {
        return 'Resource Exhausted: You have exceeded your API quota. Please check your account limits.';
    }
    if (message.includes('google.api')) {
        return 'API Error: An issue occurred while communicating with the AI service. Please try again later.';
    }
    
    // Default to a more generic message for other errors
    return 'An unexpected error occurred. Please check the console for more details.';
  }
  return 'An unknown error occurred.';
};


const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const chatInstanceRef = useRef<Chat | null>(null);

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlSubmit = useCallback(async (url: string) => {
    setVideoUrl(url);
    const id = extractVideoId(url);
    setVideoId(id);
    
    if (id) {
      setError(null);
      setSummary(null);
      setChatHistory([]);
      chatInstanceRef.current = null;
      setIsLoadingSummary(true);
      
      try {
        const { summary: newSummary, chat } = await summarizeVideo(url);
        setSummary(newSummary);
        chatInstanceRef.current = chat;
      } catch (e) {
        console.error(e);
        setError(getErrorMessage(e));
      } finally {
        setIsLoadingSummary(false);
      }
    } else {
      setError('Invalid YouTube URL. Please enter a valid URL.');
      setVideoId(null);
      setSummary(null);
      setChatHistory([]);
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatInstanceRef.current) return;

    const userMessage: ChatMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsChatting(true);
    setError(null);

    try {
      const responseText = await continueChat(chatInstanceRef.current, message);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e));
      setChatHistory(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsChatting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            YouTube Video Analyzer
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Get summaries and chat with any YouTube video.</p>
        </header>

        <main className="w-full">
          <div className="mb-8">
            <UrlInputForm onSubmit={handleUrlSubmit} isLoading={isLoadingSummary} />
          </div>
          
          {error && (
            <div className="text-red-300 text-center my-4 bg-red-900/20 p-4 rounded-lg border border-red-500/30 flex items-center justify-center gap-3">
              <ErrorIcon />
              <span className="font-medium">{error}</span>
            </div>
           )}
          
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-8">
              {videoId && <VideoPlayer videoId={videoId} />}
              <AnalysisDisplay summary={summary} isLoading={isLoadingSummary} />
            </div>
            
            <div className="xl:sticky xl:top-8">
              {summary && !isLoadingSummary && (
                <ChatWindow
                  history={chatHistory}
                  onSendMessage={handleSendMessage}
                  isSending={isChatting}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;