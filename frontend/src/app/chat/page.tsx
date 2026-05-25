'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { chatWithCodebase, getProjects } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hi! I am DocGen Copilot, your AI codebase assistant. Ask me anything about the architecture, endpoints, or code inside your project.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const init = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setActiveProjectId(data[0].id);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    init();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isMounted) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!activeProjectId) {
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: input }, 
        { role: 'assistant', content: '❌ **Error**: No active repository selected. Please select a project first.' }
      ]);
      setInput('');
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithCodebase(activeProjectId, userMessage);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.answer || JSON.stringify(response)
      }]);
    } catch (e: any) {
      console.error(e);
      let errorMsg: string;
      if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) {
        errorMsg = 'Request timed out. The context is very large—please try a shorter question or wait and retry.';
      } else {
        errorMsg = e.response?.data?.detail || 'Failed to communicate with DocGen backend. Check API status.';
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ **Error**: ${errorMsg}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const suggestions = [
    "Explain the project structure",
    "What API endpoints are available?",
    "How does the database connection work?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[850px] font-mono text-sm">
      <header className="mb-4 flex justify-between items-center shrink-0">
        <h1 className="text-xl font-bold text-[#c9d1d9] flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#58a6ff]" />
          DocGen Copilot
        </h1>
        {projects.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b949e] uppercase font-semibold">Repository Context:</span>
            <select 
              value={activeProjectId || ''} 
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="tech-input text-xs py-1.5 px-3 rounded bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] focus:border-[#58a6ff] outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </header>

      <div className="flex-1 tech-panel flex flex-col overflow-hidden bg-[#161b22]/20 shadow-lg">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {/* Copilot Avatar (Left) */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#1f6feb]/15 border border-[#1f6feb]/35 flex items-center justify-center shrink-0 text-[#58a6ff]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-lg border p-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#1f6feb]/15 border-[#1f6feb]/40 text-[#c9d1d9]'
                  : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
              }`}>
                {/* Header info */}
                <div className="flex items-center gap-2 mb-2 text-xs text-[#8b949e]">
                  <span className="font-semibold">{msg.role === 'user' ? 'You' : 'DocGen Copilot'}</span>
                </div>
                
                {/* Content */}
                <div className="prose prose-invert max-w-none prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-[#30363d] prose-a:text-[#58a6ff] text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>

              {/* User Avatar (Right) */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#30363d] border border-[#8b949e]/30 flex items-center justify-center shrink-0 text-[#c9d1d9]">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loader */}
          {isLoading && (
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#1f6feb]/15 border border-[#1f6feb]/35 flex items-center justify-center shrink-0 text-[#58a6ff]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 shadow-sm max-w-[85%]">
                <div className="flex items-center gap-2 text-xs text-[#8b949e] mb-1">
                  <span className="font-semibold">DocGen Copilot</span>
                </div>
                <div className="flex items-center gap-2 text-[#58a6ff] text-xs py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && !isLoading && (
          <div className="px-6 pb-2 pt-1 flex flex-wrap gap-2 shrink-0 animate-fade-in">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="github-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1 hover:border-[#58a6ff] transition-all"
              >
                {suggestion} <ArrowRight className="w-3 h-3 text-[#8b949e]" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-[#30363d] bg-[#0d1117] p-4 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 tech-input py-2.5 px-4 text-xs font-mono"
              placeholder="Ask DocGen Copilot about the codebase..."
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="github-btn-primary px-5 py-2.5 text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
