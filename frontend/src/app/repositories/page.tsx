'use client';

import { useState, useEffect } from 'react';
import { FolderGit2, CheckCircle2, Clock, GitPullRequest, ArrowUpRight } from 'lucide-react';
import { getProjects } from '@/lib/api';

export default function Repositories() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
                <th className="px-4 py-2 font-medium">HEAD Commit</th>
                <th className="px-4 py-2 font-medium text-right">Active PRs</th>
                <th className="px-4 py-2 font-medium text-right">Last Sync</th>
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
                  <tr key={i} className="hover:bg-[#161b22] transition-colors cursor-pointer group">
                    <td className="px-4 py-3 font-medium text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-[#8b949e]" />
                      {repo.name}
                    </td>
                    <td className="px-4 py-3">
                      {repo.status === 'completed' ? (
                        <span className="text-[#3fb950] flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>
                      ) : (
                        <span className="text-[#d2a8ff] flex items-center gap-1.5 animate-pulse"><Clock className="w-3.5 h-3.5" /> Syncing</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#8b949e]">{repo.commit || 'unknown'}</td>
                    <td className="px-4 py-3 text-right text-[#8b949e]">{repo.prs || 0}</td>
                    <td className="px-4 py-3 text-right text-[#8b949e]">{repo.lastSync || 'Never'}</td>
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
