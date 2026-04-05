'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}


interface BackendMessage {
  role: string;
  content: string;
}

interface ItemRequest {
  input: string;
  history: BackendMessage[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Welcome to Suriname Bouwtekenaar! 🏠 I'm here to help with our services. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [messages, isChatOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert full conversation history to backend format
      const historyData: BackendMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const bodyData: ItemRequest = {
        input: userMessage.content,
        history: historyData, // Send full conversation history as array
      };

      const res = await fetch('https://aroobba-fastapifirsttest.hf.space/items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.ok ? data.message : data.error || 'Something went wrong.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Landing Page Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Suriname Bouwtekenaar
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-700 mb-6 sm:mb-8 px-2">
            Professional construction drawings and designs for your project
          </p>
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-6 border border-white/20 w-full sm:w-auto max-w-xs">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-2">🏠 Construction Drawings</h3>
              <p className="text-sm sm:text-base text-gray-700">Professional drawings for residential or commercial projects</p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-6 border border-white/20 w-full sm:w-auto max-w-xs">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-2">📐 Renovation Plans</h3>
              <p className="text-sm sm:text-base text-gray-700">Detailed plans for your renovation project</p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-6 border border-white/20 w-full sm:w-auto max-w-xs">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-2">🎨 3D Visualizations</h3>
              <p className="text-sm sm:text-base text-gray-700">See your project in 3D before construction</p>
            </div>
          </div>
          <p className="text-purple-600 mt-6 sm:mt-8 text-sm sm:text-base">
            👉 Click the chat button in the bottom right to chat with us!
          </p>
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 ${
          isChatOpen ? 'rotate-90' : ''
        }`}
        title="Open chat"
      >
        {isChatOpen ? (
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 transform origin-bottom-right z-50 flex flex-col ${
          isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ height: '550px', maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-t-2xl px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm sm:text-base truncate">Suriname Bouwtekenaar</h2>
              <p className="text-purple-100 text-xs">Online • Instant Response</p>
            </div>
          </div>
          <a
            href="/data"
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1 flex-shrink-0"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <span className="hidden sm:inline">Manage</span>
          </a>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-md break-words overflow-wrap-anywhere ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white'
                    : 'bg-gradient-to-r from-violet-100 to-purple-100 text-gray-800 border border-purple-200'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {message.role === 'assistant' && (
                    <svg className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span className={`text-xs font-semibold ${message.role === 'user' ? 'text-purple-100' : 'text-purple-700'}`}>
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed break-words whitespace-pre-wrap text-black overflow-hidden">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-purple-200' : 'text-purple-500'}`}>
                  {isMounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-3 py-2 bg-gradient-to-r from-violet-100 to-purple-100 border border-purple-200 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">Typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-purple-100 p-3 sm:p-4 bg-white/50 backdrop-blur rounded-b-2xl flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm font-medium text-black placeholder-gray-400 min-w-0"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
