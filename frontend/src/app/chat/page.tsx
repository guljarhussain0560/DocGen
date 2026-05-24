'use client';

import { useState, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { chatWithCodebase, getProjects } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'DocGen CLI v1.0.0\nReady. Type a query to search the codebase or analyze architecture.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setActiveProjectId(data[0].id);
          setMessages(prev => [...prev, { role: 'assistant', content: `[INFO] Attached to project context: ${data[0].name}` }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: '[WARNING] No projects found in database. Please run an analysis job first.' }]);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    init();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!activeProjectId) {
      setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: '[ERROR] No active project selected. Cannot execute query.' }]);
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
      const errorMsg = e.response?.data?.detail || 'Failed to communicate with DocGen backend. Check API status.';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `[ERROR] ${errorMsg}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[800px] font-mono text-sm">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-[#c9d1d9] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#58a6ff]" />
            Terminal / Chat
          </div>
          {projects.length > 0 && (
            <select 
              value={activeProjectId || ''} 
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="tech-input text-xs py-1 px-2 rounded bg-[#0d1117]"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </h1>
      </header>

      <div className="flex-1 tech-panel flex flex-col overflow-hidden shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="text-[#8b949e] select-none shrink-0">
                {msg.role === 'user' ? 'root@local:~$' : 'docgen>'}
              </span>
              <div className={`whitespace-pre-wrap ${msg.role === 'user' ? 'text-[#c9d1d9]' : 'text-[#58a6ff]'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <span className="text-[#8b949e] select-none shrink-0">docgen&gt;</span>
              <div className="text-[#58a6ff] animate-pulse">_</div>
            </div>
          )}
        </div>

        <div className="border-t border-[#30363d] bg-[#0d1117] p-2">
          <form onSubmit={handleSend} className="flex items-center gap-2 px-2">
            <span className="text-[#3fb950] font-bold select-none">root@local:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[#c9d1d9] py-1 placeholder-[#484f58]"
              placeholder="Enter command..."
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
}
