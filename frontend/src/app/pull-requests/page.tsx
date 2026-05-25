'use client';

import { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  Loader2, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  RefreshCw,
  Send,
  HelpCircle
} from 'lucide-react';
import { 
  getProjects, 
  getPullRequests, 
  getPRDetails, 
  generatePRDoc, 
  getProjectPRDocs,
  getDocument,
  createProject
} from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProjectItem {
  id: string;
  name: string;
  github_repo: string | null;
}

interface PRListItem {
  number: number;
  title: string;
  state: string;
  user: string;
  head_ref: string;
  base_ref: string;
  body: string;
  created_at: string;
}

interface PastPRDoc {
  id: string;
  title: string;
  pr_ref: string;
  summary: string;
  status: string;
  created_at: string;
}

export default function PullRequestsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'generate' | 'past'>('generate');
  const [mode, setMode] = useState<'fetch' | 'manual'>('fetch');
  
  // Pull requests list from GitHub
  const [pullRequests, setPullRequests] = useState<PRListItem[]>([]);
  const [isLoadingPRs, setIsLoadingPRs] = useState(false);
  const [selectedPRNumber, setSelectedPRNumber] = useState<number | ''>('');
  
  // Form fields
  const [prNumber, setPrNumber] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [headBranch, setHeadBranch] = useState('');
  const [baseBranch, setBaseBranch] = useState('main');
  const [description, setDescription] = useState('');
  const [filesChanged, setFilesChanged] = useState('');
  const [diffSummary, setDiffSummary] = useState('');
  const [labels, setLabels] = useState('');
  
  // Loading states
  const [prDetailsLoading, setPrDetailsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Past documents list
  const [pastDocs, setPastDocs] = useState<PastPRDoc[]>([]);
  const [isLoadingPast, setIsLoadingPast] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  
  // Active markdown results
  const [activeMarkdown, setActiveMarkdown] = useState<string | null>(null);
  const [activeDocTitle, setActiveDocTitle] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Connection states for new repo
  const [repoType, setRepoType] = useState<'active' | 'new'>('active');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchProjectsList = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setActiveProjectId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };
    fetchProjectsList();
  }, []);

  // Fetch GitHub PRs for active project
  useEffect(() => {
    if (!activeProjectId || mode !== 'fetch') return;
    
    const fetchPRs = async () => {
      setIsLoadingPRs(true);
      try {
        const prs = await getPullRequests(activeProjectId);
        setPullRequests(prs);
      } catch (err) {
        console.error('Failed to fetch pulls:', err);
        setPullRequests([]);
      } finally {
        setIsLoadingPRs(false);
      }
    };
    fetchPRs();
  }, [activeProjectId, mode]);

  // Fetch past PR docs for active project
  useEffect(() => {
    if (!activeProjectId) return;
    
    const fetchPast = async () => {
      setIsLoadingPast(true);
      try {
        const docs = await getProjectPRDocs(activeProjectId);
        setPastDocs(docs);
      } catch (err) {
        console.error('Failed to fetch past PR docs:', err);
        setPastDocs([]);
      } finally {
        setIsLoadingPast(false);
      }
    };
    fetchPast();
  }, [activeProjectId, activeTab]);

  // Fetch single PR details and populate form
  const handlePRChange = async (prNum: number) => {
    if (!activeProjectId) return;
    setSelectedPRNumber(prNum);
    setPrDetailsLoading(true);
    try {
      const details = await getPRDetails(activeProjectId, prNum);
      setPrNumber(details.number);
      setTitle(details.title || '');
      setAuthor(details.author || '');
      setHeadBranch(details.head_branch || '');
      setBaseBranch(details.base_branch || 'main');
      setDescription(details.description || '');
      setFilesChanged(details.files_changed || '');
      setDiffSummary(details.diff_summary || '');
    } catch (err) {
      console.error('Failed to fetch PR details:', err);
      alert('Failed to fetch PR details from GitHub.');
    } finally {
      setPrDetailsLoading(false);
    }
  };

  const handleConnectNewRepo = async () => {
    if (!newRepoUrl) {
      alert('Please enter a GitHub repository URL');
      return;
    }
    
    setIsConnecting(true);
    try {
      const repoParts = newRepoUrl.trim().replace(/\/$/, '').split('/');
      const repoName = repoParts[repoParts.length - 1].replace('.git', '') || 'New Project';
      
      const newProj = await createProject(repoName, newRepoUrl);
      
      const data = await getProjects();
      setProjects(data);
      
      setActiveProjectId(newProj.id);
      setRepoType('active');
      setNewRepoUrl('');
    } catch (err: any) {
      console.error('Failed to connect repository:', err);
      const errMsg = err.response?.data?.detail || err.message || 'Unknown error';
      alert(`Failed to connect repository: ${errMsg}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId) return;
    if (!prNumber) {
      alert('Please enter a PR number');
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generatePRDoc({
        project_id: activeProjectId,
        pr_number: Number(prNumber),
        title,
        author,
        head_branch: headBranch,
        base_branch: baseBranch,
        description,
        files_changed: filesChanged,
        diff_summary: diffSummary,
        labels: labels ? labels.split(',').map(l => l.trim()) : []
      });
      
      setActiveMarkdown(result.markdown);
      setActiveDocTitle(result.title);
      // Refresh list
      const docs = await getProjectPRDocs(activeProjectId);
      setPastDocs(docs);
    } catch (err: any) {
      console.error('Failed to generate PR docs:', err);
      const errMsg = err.response?.data?.detail || err.message || 'Error occurred';
      alert(`Generation failed: ${errMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!activeMarkdown) return;
    navigator.clipboard.writeText(activeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeMarkdown) return;
    const element = document.createElement("a");
    const file = new Blob([activeMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeDocTitle?.replace(/[^a-zA-Z0-9_-]/g, '_') || 'PR_Documentation'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const viewPastDoc = async (docId: string, titleStr: string) => {
    setIsLoadingDoc(true);
    try {
      const doc = await getDocument(docId);
      setActiveMarkdown(doc.content_markdown);
      setActiveDocTitle(titleStr);
    } catch (err) {
      console.error('Failed to load past doc:', err);
      alert('Failed to load document content.');
    } finally {
      setIsLoadingDoc(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[850px] font-mono text-sm">
      <header className="mb-4 flex justify-between items-center shrink-0">
        <h1 className="text-xl font-bold text-[#c9d1d9] flex items-center gap-2">
          <GitPullRequest className="w-5 h-5 text-[#58a6ff]" />
          Pull Request Documentation
        </h1>
        <div className="flex items-center gap-4">
          {/* Sliding toggle button */}
          <div className="relative flex rounded-full border border-[#30363d] bg-[#161b22] p-0.5 shrink-0" style={{ width: '220px' }}>
            <div 
              className="absolute top-0.5 bottom-0.5 rounded-full bg-[#1f6feb]/20 border border-[#1f6feb]/35 transition-all duration-200"
              style={{
                left: repoType === 'active' ? '2px' : 'calc(50% + 1px)',
                width: 'calc(50% - 3px)',
              }}
            />
            <button
              onClick={() => setRepoType('active')}
              className={`relative flex-1 py-1 text-center rounded-full text-xs font-semibold tracking-wider transition-colors duration-200 z-10 outline-none ${
                repoType === 'active' ? 'text-[#58a6ff]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              Active Repo
            </button>
            <button
              onClick={() => setRepoType('new')}
              className={`relative flex-1 py-1 text-center rounded-full text-xs font-semibold tracking-wider transition-colors duration-200 z-10 outline-none ${
                repoType === 'new' ? 'text-[#58a6ff]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              New Repo
            </button>
          </div>

          {repoType === 'active' && (
            <div className="flex items-center gap-2 animate-fade-in">
              <span className="text-xs text-[#8b949e] uppercase font-semibold">Active Project:</span>
              <select 
                value={activeProjectId || ''} 
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="tech-input text-xs py-1.5 px-3 rounded bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] focus:border-[#58a6ff] outline-none"
              >
                <option value="">-- Select Project --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      {repoType === 'new' && (
        <div className="mb-4 p-4 border border-[#30363d] bg-[#161b22]/85 rounded-lg flex items-end gap-3 animate-fade-in shrink-0">
          <div className="flex-1 space-y-1.5">
            <label className="block text-xs font-semibold text-[#8b949e] uppercase">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={newRepoUrl}
              onChange={(e) => setNewRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full tech-input py-1.5 px-3 text-xs font-mono"
            />
          </div>
          <button
            type="button"
            onClick={handleConnectNewRepo}
            disabled={isConnecting}
            className="github-btn-primary px-4 py-1.5 text-xs flex items-center gap-1.5"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Repo'
            )}
          </button>
        </div>
      )}

      {/* Main Grid split layout */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Side: Generator Control Panel */}
        <div className="w-5/12 tech-panel flex flex-col shadow-lg overflow-hidden bg-[#161b22]/40">
          {/* Tab Switcher */}
          <div className="flex border-b border-[#30363d] bg-[#161b22] shrink-0">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'generate' 
                  ? 'border-[#58a6ff] text-[#c9d1d9] bg-[#0d1117]/40' 
                  : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#0d1117]/20'
              }`}
            >
              Generate Doc
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'past' 
                  ? 'border-[#58a6ff] text-[#c9d1d9] bg-[#0d1117]/40' 
                  : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#0d1117]/20'
              }`}
            >
              History ({pastDocs.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'generate' ? (
              <div className="space-y-4">
                {/* Mode Selector */}
                <div className="flex rounded border border-[#30363d] overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setMode('fetch')}
                    className={`flex-1 py-1.5 text-xs font-medium transition-all ${
                      mode === 'fetch' 
                        ? 'bg-[#1f6feb]/20 text-[#58a6ff]' 
                        : 'text-[#8b949e] bg-transparent hover:text-[#c9d1d9]'
                    }`}
                  >
                    Fetch from GitHub
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={`flex-1 py-1.5 text-xs font-medium transition-all ${
                      mode === 'manual' 
                        ? 'bg-[#1f6feb]/20 text-[#58a6ff]' 
                        : 'text-[#8b949e] bg-transparent hover:text-[#c9d1d9]'
                    }`}
                  >
                    Enter Manually
                  </button>
                </div>

                {/* Fetch Mode Dropdown */}
                {mode === 'fetch' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#8b949e] uppercase">
                      Select Open Pull Request
                    </label>
                    {isLoadingPRs ? (
                      <div className="flex items-center gap-2 text-xs text-[#58a6ff] py-1.5">
                        <Loader2 className="w-4 h-4 animate-spin" /> Fetching pull requests...
                      </div>
                    ) : pullRequests.length === 0 ? (
                      <div className="text-xs text-[#8b949e] italic py-1 border border-dashed border-[#30363d] rounded p-2 text-center">
                        No open pull requests found.
                      </div>
                    ) : (
                      <select
                        value={selectedPRNumber}
                        onChange={(e) => handlePRChange(Number(e.target.value))}
                        className="w-full tech-input py-2 px-3 text-xs bg-[#161b22] text-[#c9d1d9] border border-[#30363d] rounded focus:border-[#58a6ff] outline-none"
                      >
                        <option value="">-- Select a pull request --</option>
                        {pullRequests.map((pr) => (
                          <option key={pr.number} value={pr.number}>
                            #{pr.number}: {pr.title.substring(0, 40)}{pr.title.length > 40 ? '...' : ''} ({pr.user})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Form fields */}
                <form onSubmit={handleGenerate} className="space-y-3">
                  {prDetailsLoading && (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-[#58a6ff] bg-[#161b22] rounded border border-[#30363d]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading PR data from GitHub...
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1">
                        PR Number
                      </label>
                      <input
                        type="number"
                        value={prNumber}
                        onChange={(e) => setPrNumber(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 14"
                        className="w-full tech-input py-1.5 px-2.5 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1">
                        Author
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. username"
                        className="w-full tech-input py-1.5 px-2.5 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1">
                        Labels (comma-sep)
                      </label>
                      <input
                        type="text"
                        value={labels}
                        onChange={(e) => setLabels(e.target.value)}
                        placeholder="bug, docs"
                        className="w-full tech-input py-1.5 px-2.5 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1">
                      Pull Request Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Add integration support for Webhooks"
                      className="w-full tech-input py-1.5 px-2.5 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1">
                        Head Branch (Source)
                      </label>
                      <input
                        type="text"
                        value={headBranch}
                        onChange={(e) => setHeadBranch(e.target.value)}
                        placeholder="feat/webhooks"
                        className="w-full tech-input py-1.5 px-2.5 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1">
                        Base Branch (Target)
                      </label>
                      <input
                        type="text"
                        value={baseBranch}
                        onChange={(e) => setBaseBranch(e.target.value)}
                        placeholder="main"
                        className="w-full tech-input py-1.5 px-2.5 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1">
                      Files Changed (One per line)
                    </label>
                    <textarea
                      value={filesChanged}
                      onChange={(e) => setFilesChanged(e.target.value)}
                      placeholder="backend/app/routes.py&#10;backend/app/webhook_handler.py"
                      className="w-full tech-input py-1.5 px-2.5 text-xs h-16 font-mono resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1 col-span-full">
                      Diff Summary or Lines Modified
                    </label>
                    <input
                      type="text"
                      value={diffSummary}
                      onChange={(e) => setDiffSummary(e.target.value)}
                      placeholder="Lines changed: +120 -40, files: 2"
                      className="w-full tech-input py-1.5 px-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b949e] uppercase mb-1">
                      PR Description / Comments
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what this PR changes..."
                      className="w-full tech-input py-1.5 px-2.5 text-xs h-20 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full github-btn-primary flex items-center justify-center gap-2 py-2 mt-2 text-xs font-semibold"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating Changelog & PR Doc...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Generate PR Documentation
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Past docs list */
              <div className="space-y-2">
                {isLoadingPast ? (
                  <div className="flex items-center justify-center text-[#58a6ff] py-12">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : pastDocs.length === 0 ? (
                  <p className="text-xs text-[#8b949e] py-6 text-center italic">No PR documentation history found for this project.</p>
                ) : (
                  <div className="space-y-2">
                    {pastDocs.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => viewPastDoc(doc.id, doc.title)}
                        className="p-3 border border-[#30363d] bg-[#161b22] hover:border-[#58a6ff] rounded cursor-pointer transition-all space-y-1.5"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-[#c9d1d9] line-clamp-1">{doc.title}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#30363d]/50 text-[#8b949e] shrink-0">{doc.pr_ref}</span>
                        </div>
                        {doc.summary && (
                          <p className="text-[11px] text-[#8b949e] line-clamp-2 leading-relaxed">{doc.summary}</p>
                        )}
                        <div className="text-[9px] text-[#484f58] flex justify-between">
                          <span>Created: {new Date(doc.created_at).toLocaleDateString()}</span>
                          <span className="text-[#3fb950]">Status: {doc.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Markdown Documentation Viewer */}
        <div className="flex-1 tech-panel flex flex-col shadow-lg overflow-hidden bg-[#0d1117]">
          {isLoadingDoc ? (
            <div className="flex-1 flex items-center justify-center text-[#58a6ff]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : activeMarkdown ? (
            <>
              {/* Header options */}
              <div className="p-4 border-b border-[#30363d] bg-[#161b22] flex justify-between items-center shrink-0">
                <div className="min-w-0">
                  <h2 className="text-[#c9d1d9] font-bold text-sm truncate">{activeDocTitle || 'Generated Documentation'}</h2>
                  <p className="text-[#8b949e] text-[10px] uppercase mt-0.5">Format: Keep a Changelog & Migration Guide</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={handleCopyToClipboard}
                    className="github-btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#3fb950]" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="github-btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .md
                  </button>
                </div>
              </div>
              
              {/* Markdown Display */}
              <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-[#30363d] prose-a:text-[#58a6ff]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeMarkdown}
                </ReactMarkdown>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#8b949e] space-y-3 p-8 border border-dashed border-[#30363d]/60 rounded-lg m-4">
              <Sparkles className="w-12 h-12 text-[#30363d]" />
              <div className="text-center space-y-1">
                <h3 className="text-[#c9d1d9] font-semibold">PR Documentation Preview</h3>
                <p className="text-xs text-[#484f58] max-w-xs leading-relaxed">
                  Select a project and fetch a pull request from GitHub (or enter manually), then click generate.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
