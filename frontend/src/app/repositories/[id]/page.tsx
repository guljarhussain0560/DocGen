'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Download, ArrowLeft, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { getProject, getDocument, analyzeRepo, getCommits, stopScan } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface DocItem {
  id: string;
  title: string;
  doc_type: string;
  status: string;
  updated_at: string | null;
}

interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  github_repo: string | null;
  tech_stack: string | null;
  status: string;
  created_at: string;
  docs: DocItem[];
}

interface DocDetail {
  id: string;
  project_id: string;
  title: string;
  doc_type: string;
  status: string;
  source_ref: string | null;
  content_markdown: string;
  ai_summary: string | null;
  version: string;
  updated_at: string | null;
}

interface CommitItem {
  sha: string;
  message: string;
  author_name: string;
  date: string;
}

export default function RepositoryDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [activeDocContent, setActiveDocContent] = useState<DocDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDocLoading, setIsDocLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [scope, setScope] = useState<'all' | 'commit' | 'date_range'>('all');
  const [commitSha, setCommitSha] = useState('');
  const [sinceDate, setSinceDate] = useState('');
  const [untilDate, setUntilDate] = useState('');
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [commitsError, setCommitsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsMounted(true);
      try {
        const data = await getProject(id as string);
        setProject(data);
        if (data.docs && data.docs.length > 0) {
          setActiveDocId(data.docs[0].id);
        }
      } catch (e) {
        console.error('Failed to fetch project details:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (!isRegenerateModalOpen || !id) return;
    
    const fetchCommits = async () => {
      setIsLoadingCommits(true);
      setCommitsError(null);
      try {
        const data = await getCommits(id as string);
        setCommits(data);
      } catch (err: unknown) {
        console.error('Failed to fetch commits:', err);
        setCommitsError('Failed to load recent commits.');
      } finally {
        setIsLoadingCommits(false);
      }
    };
    
    fetchCommits();
  }, [isRegenerateModalOpen, id]);

  useEffect(() => {
    if (!project || project.status !== 'scanning') return;

    const interval = setInterval(async () => {
      try {
        const data = await getProject(id as string);
        setProject(data);
        if (data.docs && data.docs.length > 0 && !activeDocId) {
          setActiveDocId(data.docs[0].id);
        }
      } catch (e) {
        console.error('Failed to poll scanning progress:', e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, project?.status, activeDocId, project]);

  const handleRegenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl) return;
    setIsRegenerating(true);

    let finalCommitSha = undefined;
    let finalSince = undefined;
    let finalUntil = undefined;

    if (scope === 'commit') {
      if (!commitSha) {
        alert('Please enter a commit SHA.');
        setIsRegenerating(false);
        return;
      }
      finalCommitSha = commitSha.trim();
    } else if (scope === 'date_range') {
      if (!sinceDate && !untilDate) {
        alert('Please specify at least a start or end date.');
        setIsRegenerating(false);
        return;
      }
      if (sinceDate) {
        finalSince = new Date(sinceDate).toISOString();
      }
      if (untilDate) {
        finalUntil = new Date(untilDate + 'T23:59:59').toISOString();
      }
    }

    try {
      await analyzeRepo(
        id as string, 
        newRepoUrl, 
        finalCommitSha, 
        finalSince, 
        finalUntil
      );
      setIsRegenerateModalOpen(false);
      // Instantly show scanning state and update repository url locally
      setProject(prev => prev ? { 
        ...prev, 
        status: 'scanning', 
        github_repo: newRepoUrl.replace('https://github.com/', '').replace('.git', '') 
      } : null);
    } catch (err: unknown) {
      let errorMsg = 'Unknown error';
      if (err && typeof err === 'object') {
        const errObj = err as { response?: { data?: { detail?: string } }; message?: string };
        errorMsg = errObj.response?.data?.detail || errObj.message || errorMsg;
      }
      alert(`Failed to start regeneration: ${errorMsg}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleStopScan = async () => {
    if (!id) return;
    try {
      await stopScan(id as string);
      setProject(prev => prev ? { ...prev, status: 'idle' } : null);
    } catch (err: unknown) {
      console.error('Failed to stop scan:', err);
      alert('Failed to stop scan.');
    }
  };

  useEffect(() => {
    if (!activeDocId) return;
    const fetchDocContent = async () => {
      setIsDocLoading(true);
      try {
        const data = await getDocument(activeDocId);
        setActiveDocContent(data);
      } catch (e) {
        console.error('Failed to fetch document:', e);
      } finally {
        setIsDocLoading(false);
      }
    };
    fetchDocContent();
  }, [activeDocId]);

  const handleDownload = () => {
    if (!activeDocContent?.content_markdown) return;
    
    const element = document.createElement("a");
    const file = new Blob([activeDocContent.content_markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeDocContent.title || 'document'}.md`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center p-12 text-[#58a6ff]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return <div className="text-red-400">Project not found.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[850px] font-mono text-sm">
      <header className="mb-4 flex justify-between items-start">
        <div>
          <Link href="/repositories" className="text-[#8b949e] hover:text-[#58a6ff] flex items-center gap-2 mb-2 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Repositories
          </Link>
          <h1 className="text-xl font-bold text-[#c9d1d9] flex items-center gap-2">
            {project.name} <span className="text-xs font-normal text-[#8b949e] px-2 py-0.5 rounded bg-[#21262d]">{project.github_repo}</span>
          </h1>
        </div>
        <div className="flex gap-2">
          {project.status === 'scanning' ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#d2a8ff] bg-[#d2a8ff]/10 border border-[#d2a8ff]/20 rounded font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning Repository...
              </div>
              <button 
                onClick={handleStopScan}
                className="github-btn-danger flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono"
              >
                <XCircle className="w-3.5 h-3.5" /> Stop Scan
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                const fullUrl = project.github_repo ? (project.github_repo.startsWith('http') ? project.github_repo : `https://github.com/${project.github_repo}`) : '';
                setNewRepoUrl(fullUrl);
                setIsRegenerateModalOpen(true);
              }}
              className="github-btn-secondary flex items-center gap-2 px-3 py-1.5 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate Docs
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Sidebar: Document List */}
        <div className="w-64 tech-panel flex flex-col shadow-lg overflow-y-auto">
          <div className="p-3 border-b border-[#30363d] bg-[#161b22] sticky top-0 font-semibold text-[#8b949e]">
            Documents ({project.docs?.length || 0})
          </div>
          <div className="flex-1">
            {project.docs?.length === 0 ? (
              <p className="p-4 text-[#8b949e] text-xs">No documents available.</p>
            ) : (
              <ul className="divide-y divide-[#30363d]/50">
                {project.docs?.map((doc) => (
                  <li 
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    className={`p-3 cursor-pointer transition-colors flex items-start gap-2 ${
                      activeDocId === doc.id ? 'bg-[#1f2428] border-l-2 border-[#58a6ff]' : 'hover:bg-[#161b22] border-l-2 border-transparent'
                    }`}
                  >
                    <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${activeDocId === doc.id ? 'text-[#58a6ff]' : 'text-[#8b949e]'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`truncate font-medium ${activeDocId === doc.id ? 'text-[#c9d1d9]' : 'text-[#8b949e]'}`}>
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-[#484f58] uppercase">{doc.doc_type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Main Content: Markdown Viewer */}
        <div className="flex-1 tech-panel flex flex-col shadow-lg overflow-hidden bg-[#0d1117]">
          {isDocLoading ? (
            <div className="flex-1 flex items-center justify-center text-[#58a6ff]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : activeDocContent ? (
            <>
              <div className="p-4 border-b border-[#30363d] bg-[#161b22] flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-[#c9d1d9] font-bold text-lg">{activeDocContent.title}</h2>
                  <p className="text-[#8b949e] text-xs">Source: {activeDocContent.source_ref}</p>
                </div>
                <button 
                  onClick={handleDownload}
                  className="github-btn-secondary flex items-center gap-2 px-3 py-1.5 text-xs"
                >
                  <Download className="w-4 h-4" /> Download .md
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-[#30363d] prose-a:text-[#58a6ff]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeDocContent.content_markdown}
                </ReactMarkdown>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#8b949e]">
              Select a document from the left to view
            </div>
          )}
        </div>
      </div>

      {isRegenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg w-full max-w-md p-6 shadow-2xl relative font-mono text-sm">
            <h3 className="text-[#c9d1d9] font-bold text-lg mb-2">Regenerate Documentation</h3>
            <p className="text-[#8b949e] text-xs mb-4">
              Re-scan the repository to generate up-to-date documentation. You can optionally update the GitHub repository URL below.
            </p>
            
            <form onSubmit={handleRegenerateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full tech-input py-2 px-3 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase">
                  Regeneration Scope
                </label>
                <div className="space-y-2 mt-1">
                  <label className="flex items-center gap-2 text-xs text-[#c9d1d9] cursor-pointer font-mono">
                    <input
                      type="radio"
                      name="scope"
                      value="all"
                      checked={scope === 'all'}
                      onChange={() => setScope('all')}
                      className="accent-[#58a6ff]"
                    />
                    Full Scan (All Files)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#c9d1d9] cursor-pointer font-mono">
                    <input
                      type="radio"
                      name="scope"
                      value="commit"
                      checked={scope === 'commit'}
                      onChange={() => setScope('commit')}
                      className="accent-[#58a6ff]"
                    />
                    Specific Commit SHA
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#c9d1d9] cursor-pointer font-mono">
                    <input
                      type="radio"
                      name="scope"
                      value="date_range"
                      checked={scope === 'date_range'}
                      onChange={() => setScope('date_range')}
                      className="accent-[#58a6ff]"
                    />
                    Date Range of Changes
                  </label>
                </div>
              </div>

              {scope === 'commit' && (
                <div className="animate-fade-in space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase">
                      Select Recent Commit
                    </label>
                    {isLoadingCommits ? (
                      <div className="flex items-center gap-2 text-xs text-[#58a6ff]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching commits...
                      </div>
                    ) : commitsError ? (
                      <div className="text-xs text-red-400">{commitsError}</div>
                    ) : (
                      <select
                        onChange={(e) => setCommitSha(e.target.value)}
                        value={commitSha}
                        className="w-full tech-input py-2 px-3 text-xs bg-[#161b22] text-[#c9d1d9] border border-[#30363d] rounded focus:border-[#58a6ff] outline-none"
                      >
                        <option value="">-- Select a commit --</option>
                        {commits.map((c) => (
                          <option key={c.sha} value={c.sha}>
                            {c.sha.substring(0, 7)} - {c.message.split('\n')[0]} ({c.author_name})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase font-mono">
                      Commit SHA (or type custom)
                    </label>
                    <input
                      type="text"
                      value={commitSha}
                      onChange={(e) => setCommitSha(e.target.value)}
                      placeholder="e.g. a1b2c3d4"
                      className="w-full tech-input py-2 px-3 text-xs font-mono"
                      required={scope === 'commit'}
                    />
                  </div>
                </div>
              )}

              {scope === 'date_range' && (
                <div className="grid grid-cols-2 gap-2 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase">
                      Since Date
                    </label>
                    <input
                      type="date"
                      value={sinceDate}
                      onChange={(e) => setSinceDate(e.target.value)}
                      className="w-full tech-input py-2 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 uppercase">
                      Until Date
                    </label>
                    <input
                      type="date"
                      value={untilDate}
                      onChange={(e) => setUntilDate(e.target.value)}
                      className="w-full tech-input py-2 px-3 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegenerateModalOpen(false)}
                  disabled={isRegenerating}
                  className="github-btn-secondary px-4 py-2 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegenerating}
                  className="github-btn-primary flex items-center gap-2 px-4 py-2 text-xs"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    'Start Scan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
