'use client';

import { useState, useEffect, useRef } from 'react';
import { GitBranch, Code2, Activity } from 'lucide-react';
import { analyzeRepo, getProjects, createProject } from '@/lib/api';

interface ProjectData {
  id: string;
  name: string;
  status: string;
  github_repo?: string;
  description?: string;
  tech_stack?: string;
  doc_count?: number;
}

export default function Dashboard() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState({ indexed: 0, parsing: 0, webhooks: 0 });
  const [logs, setLogs] = useState<string[]>([]);

  const [isMounted, setIsMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sseRef.current) sseRef.current.close();
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setIsMounted(true);
      try {
        const projects = await getProjects();
        setStats({
          indexed: projects.filter((p: ProjectData) => p.status === 'completed').length,
          parsing: projects.filter((p: ProjectData) => p.status === 'scanning').length,
          webhooks: projects.length, // Assume 1 webhook per project
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    };
    fetchStats();
  }, []);

  if (!isMounted) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;
    setIsAnalyzing(true);
    
    // Extract a basic name from the github repo url
    const repoParts = repoUrl.split('/');
    const repoName = repoParts[repoParts.length - 1].replace('.git', '') || 'New Project';
    
    setLogs(prev => [...prev, `[${new Date().toISOString()}] INFO: Creating project for ${repoUrl}...`]);
    try {
      // Create Project first
      const project = await createProject(repoName, repoUrl);
      
      setLogs(prev => [...prev, `[${new Date().toISOString()}] INFO: Sending analyze request for ${repoUrl}...`]);
      // Run Analyze Job
      await analyzeRepo(project.id, repoUrl);
      
      setLogs(prev => [...prev, `[${new Date().toISOString()}] SUCCESS: Analysis job started for ${repoUrl}.`]);
      setRepoUrl('');

      // Clear any existing interval or stream
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }

      // Connect to SSE stream for live logs
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const eventSource = new EventSource(`${apiBase}/api/v1/github/stream/${project.id}`);
      sseRef.current = eventSource;
      eventSource.onmessage = (event) => {
        setLogs(prev => [...prev, `[${new Date().toISOString()}] WORKER: ${event.data}`]);
      };
      eventSource.onerror = () => {
        if (sseRef.current) {
          sseRef.current.close();
          sseRef.current = null;
        }
      };

      // Poll stats every 5 seconds while a job might be running
      const intervalId = setInterval(() => {
        getProjects().then((projects: ProjectData[]) => {
          setStats({
            indexed: projects.filter((p: ProjectData) => p.status === 'completed').length,
            parsing: projects.filter((p: ProjectData) => p.status === 'scanning').length,
            webhooks: projects.length,
          });
          // Stop polling if current project completes, fails, or is not found
          const currentProject = projects.find((p: ProjectData) => p.id === project.id);
          if (!currentProject || currentProject.status === 'completed' || currentProject.status === 'failed') {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            if (sseRef.current) {
              sseRef.current.close();
              sseRef.current = null;
            }
          }
        }).catch(console.error);
      }, 5000);
      intervalRef.current = intervalId;

    } catch (e: unknown) {
      let errorMsg = 'Unknown error';
      if (e && typeof e === 'object') {
        const errObj = e as { response?: { data?: { detail?: string } }; message?: string };
        errorMsg = errObj.response?.data?.detail || errObj.message || errorMsg;
      }
      setLogs(prev => [...prev, `[${new Date().toISOString()}] ERROR: Failed to start analysis job: ${errorMsg}`]);
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-[#30363d] pb-4 mb-6">
        <h1 className="text-2xl font-bold text-[#c9d1d9] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#58a6ff]" />
          DocGen Pipeline Status
        </h1>
      </header>

      <section className="tech-panel p-4">
        <h2 className="text-sm font-semibold text-[#8b949e] mb-4 uppercase tracking-wider">Execute Analysis Job</h2>
        <form onSubmit={handleAnalyze} className="flex gap-2">
          <div className="flex-1 relative">
            <GitBranch className="w-4 h-4 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full tech-input py-2 pl-9 pr-3 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="github-btn-primary px-4 py-2 text-sm flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4" />
                Run Job
              </>
            )}
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Indexed Repos', value: stats.indexed.toString(), change: 'Ready', color: 'text-[#58a6ff]' },
          { title: 'Jobs In Progress', value: stats.parsing.toString(), change: 'Syncing', color: 'text-[#d2a8ff]' },
          { title: 'Monitored Webhooks', value: stats.webhooks.toString(), change: 'Online', color: 'text-[#3fb950]' },
        ].map((stat, i) => (
          <div key={i} className="tech-panel p-4">
            <h3 className="text-[#8b949e] text-xs font-semibold mb-2 uppercase tracking-wider">{stat.title}</h3>
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[#8b949e] mt-1">{stat.change}</p>
          </div>
        ))}
      </div>
      
      <section className="tech-panel overflow-hidden">
        <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d]">
          <h2 className="text-sm font-semibold text-[#8b949e]">Recent Worker Logs</h2>
        </div>
        <div className="p-4 font-mono text-xs text-[#8b949e] space-y-1 h-48 overflow-y-auto flex flex-col">
          {logs.map((log, idx) => (
            <p key={idx} className={log.includes('SUCCESS') ? 'text-[#3fb950]' : log.includes('ERROR') ? 'text-red-400' : ''}>
              {log}
            </p>
          ))}
          <p className="animate-pulse">_</p>
        </div>
      </section>
    </div>
  );
}
