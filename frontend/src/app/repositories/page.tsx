'use client';

import { useState, useEffect } from 'react';
import { FolderGit2, CheckCircle2, Clock } from 'lucide-react';
import { getProjects } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Repositories() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (e) {
        console.error('Failed to fetch projects:', e);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      <header className="border-b border-[#30363d] pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#c9d1d9] flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[#58a6ff]" />
            Indexed Repositories
          </h1>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-6 h-6 border-2 border-[#58a6ff]/30 border-t-[#58a6ff] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="tech-panel overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#161b22] border-b border-[#30363d] text-[#8b949e]">
              <tr>
                <th className="px-4 py-2 font-medium">Repository</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">GitHub Repo</th>
                <th className="px-4 py-2 font-medium text-right">Docs</th>
                <th className="px-4 py-2 font-medium text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#8b949e]">
                    No repositories analyzed yet.
                  </td>
                </tr>
              ) : (
                projects.map((repo, i) => (
                  <tr 
                    key={i} 
                    onClick={() => router.push(`/repositories/${repo.id}`)}
                    className="hover:bg-[#161b22] transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3 font-medium text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-[#8b949e]" />
                      {repo.name}
                    </td>
                    <td className="px-4 py-3">
                      {repo.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2ea043]/15 text-[#3fb950] border border-[#238636]/30">
                          Ready
                        </span>
                      ) : repo.status === 'scanning' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#a371f7]/15 text-[#d2a8ff] border border-[#8957e5]/30 animate-pulse">
                          Scanning
                        </span>
                      ) : repo.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#da3633]/15 text-[#f85149] border border-[#da3633]/30">
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#30363d]/30 text-[#8b949e] border border-[#30363d]">
                          {repo.status ? (repo.status.charAt(0).toUpperCase() + repo.status.slice(1)) : 'Idle'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#8b949e]">{repo.github_repo || '—'}</td>
                    <td className="px-4 py-3 text-right text-[#8b949e]">{repo.doc_count ?? 0}</td>
                    <td className="px-4 py-3 text-right text-[#8b949e]">{repo.created_at ? new Date(repo.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
