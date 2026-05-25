'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Save, Settings, Database, Server } from 'lucide-react';
import { getConfig, updateConfig } from '@/lib/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form states
  const [apiUrl, setApiUrl] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [dbUrl, setDbUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Load Local Storage config
    if (typeof window !== 'undefined') {
      setApiUrl(localStorage.getItem('NEXT_PUBLIC_API_URL') || 'http://localhost:8000');
    }

    // Load backend config
    const loadConfig = async () => {
      setLoading(true);
      try {
        const data = await getConfig();
        setGroqKey(data.groq_api_key || '');
        setAiModel(data.ai_model || 'llama-3.3-70b-versatile');
        setGithubToken(data.github_token || '');
        setWebhookSecret(data.github_webhook_secret || '');
        setDbUrl(data.database_url || '');
      } catch (err) {
        console.error('Failed to load settings from backend', err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      // Save local storage config
      if (typeof window !== 'undefined') {
        if (apiUrl.trim() && apiUrl !== 'http://localhost:8000') {
          localStorage.setItem('NEXT_PUBLIC_API_URL', apiUrl.trim());
        } else {
          localStorage.removeItem('NEXT_PUBLIC_API_URL');
        }
      }

      // Save backend config
      await updateConfig({
        groq_api_key: groqKey,
        ai_model: aiModel,
        github_token: githubToken,
        github_webhook_secret: webhookSecret,
      });

      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
        // Force refresh page to reload with new configuration
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      console.error('Failed to save configuration', err);
      alert(`Failed to save configuration: ${err.response?.data?.detail || err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-mono text-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="px-6 py-4 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117] rounded-t-lg">
          <h3 className="text-[#c9d1d9] font-bold text-base flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#58a6ff]" />
            Application Settings
          </h3>
          <button onClick={onClose} className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-[#58a6ff] gap-2">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span>Loading configuration from server...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* API Endpoints */}
            <fieldset className="border border-[#30363d] p-4 rounded-md space-y-3">
              <legend className="px-2 text-xs font-semibold text-[#8b949e] flex items-center gap-1 uppercase">
                <Server className="w-3.5 h-3.5" /> Frontend Network Config
              </legend>
              <div>
                <label className="block text-xs text-[#8b949e] mb-1 font-semibold">
                  NEXT_PUBLIC_API_URL (Backend Host URL)
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full tech-input py-2 px-3 text-xs"
                  required
                />
                <span className="block text-[10px] text-[#8b949e] mt-1">
                  Base URL of the FastAPI backend. Local default is `http://localhost:8000`.
                </span>
              </div>
            </fieldset>

            {/* AI Settings */}
            <fieldset className="border border-[#30363d] p-4 rounded-md space-y-3">
              <legend className="px-2 text-xs font-semibold text-[#8b949e] flex items-center gap-1 uppercase">
                🧠 Groq AI Orchestration
              </legend>
              <div>
                <label className="block text-xs text-[#8b949e] mb-1 font-semibold">
                  GROQ_API_KEY
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="Enter Groq GSK Key..."
                  className="w-full tech-input py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8b949e] mb-1 font-semibold">
                  Active LLM Model Selection
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full tech-input py-2 px-3 text-xs bg-[#161b22] text-[#c9d1d9] border border-[#30363d] rounded focus:border-[#58a6ff] outline-none"
                >
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                  <option value="llama3-70b-8192">llama3-70b-8192</option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                </select>
              </div>
            </fieldset>

            {/* GitHub Settings */}
            <fieldset className="border border-[#30363d] p-4 rounded-md space-y-3">
              <legend className="px-2 text-xs font-semibold text-[#8b949e] flex items-center gap-1 uppercase">
                🐙 GitHub Integration
              </legend>
              <div>
                <label className="block text-xs text-[#8b949e] mb-1 font-semibold">
                  GITHUB_TOKEN (Personal Access Token)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="github_pat_..."
                  className="w-full tech-input py-2 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8b949e] mb-1 font-semibold">
                  GITHUB_WEBHOOK_SECRET
                </label>
                <input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="Webhook Secret..."
                  className="w-full tech-input py-2 px-3 text-xs"
                />
              </div>
            </fieldset>

            {/* Database Stats */}
            <div className="bg-[#0d1117] border border-[#30363d] p-3.5 rounded flex items-center justify-between text-xs text-[#8b949e] shrink-0">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#3fb950]" />
                <span className="font-semibold text-[#c9d1d9]">Database URL Target</span>
              </div>
              <span className="font-mono text-[10px] max-w-[60%] truncate select-all bg-[#161b22] px-2 py-1 border border-[#30363d] rounded text-[#c9d1d9]">{dbUrl || 'sqlite:///docgen.db'}</span>
            </div>

            {/* Success message banner */}
            {successMsg && (
              <div className="text-center text-xs text-[#3fb950] font-semibold bg-[#2ea043]/10 border border-[#238636]/30 py-2.5 rounded">
                {successMsg}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-[#30363d]">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="github-btn-secondary px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="github-btn-primary flex items-center gap-1.5 px-4 py-2 text-xs"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
