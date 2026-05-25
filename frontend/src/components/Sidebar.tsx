'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderGit2, BookOpen, MessageSquare, Settings, GitPullRequest, ChevronLeft, ChevronRight } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Codebase Chat', href: '/chat', icon: MessageSquare },
  { name: 'Repositories', href: '/repositories', icon: FolderGit2 },
  { name: 'Pull Requests', href: '/pull-requests', icon: GitPullRequest },
  { name: 'API Docs', href: '/api-docs', icon: BookOpen },
];

interface SidebarProps {
  onSettingsClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ onSettingsClick, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`flex h-full flex-col bg-[#0d1117] font-mono text-sm transition-all duration-300 shrink-0 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-[#30363d]">
        <div className="flex items-center gap-2 overflow-hidden select-none">
          {!isCollapsed && (
            <span className="font-bold text-[#c9d1d9] tracking-tight">DocGen</span>
          )}
        </div>
        <button 
          onClick={onToggleCollapse}
          className="p-1 rounded text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22] transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-4 px-2">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`
                  group flex items-center px-2 py-1.5 rounded transition-all duration-200
                  ${isCollapsed ? 'justify-center' : ''}
                  ${isActive 
                    ? 'bg-[#1f6feb]/10 text-[#58a6ff]' 
                    : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'}
                `}
              >
                <item.icon
                  className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? '' : 'mr-2'} ${
                    isActive ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-[#c9d1d9]'
                  }`}
                  aria-hidden="true"
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-2 border-t border-[#30363d]">
        <button 
          onClick={onSettingsClick}
          title={isCollapsed ? "Settings" : undefined}
          className={`flex items-center w-full px-2 py-1.5 text-[#8b949e] rounded hover:bg-[#161b22] hover:text-[#c9d1d9] transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Settings className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
}
