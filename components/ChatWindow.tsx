import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatWindowProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ history, onSendMessage, isSending }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history, isSending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSending) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg flex flex-col h-[75vh] max-h-[800px] min-h-[500px]">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-center text-slate-200">Chat with Video AI</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {history.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <BotIcon />}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-fuchsia-700 text-white rounded-br-none shadow-md'
                    : 'bg-slate-700 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                 <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                </div>
              </div>
               {msg.role === 'user' && <UserIcon />}
            </div>
          ))}
          {isSending && (
            <div className="flex items-start gap-3 justify-start">
              <BotIcon />
              <div className="bg-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-bl-none inline-flex items-center gap-2">
                <LoaderIcon />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-700 bg-slate-800/60 rounded-b-xl">
        <form onSubmit={handleSend} className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the video..."
            className="flex-grow bg-slate-700 text-slate-200 border border-slate-600 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-200"
            disabled={isSending}
          />
          <button
            type="submit"
            className="bg-cyan-600 text-white rounded-full p-3 hover:bg-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-600 transform enabled:hover:scale-110"
            disabled={isSending || !input.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;