import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s default timeout
});

// Dynamically override backend URL from localStorage settings if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('NEXT_PUBLIC_API_URL');
    if (localUrl) {
      config.baseURL = `${localUrl}/api/v1`;
    }
  }
  return config;
});

// API helper functions
export const getProjects = async () => {
  const response = await api.get('/search/projects');
  return response.data;
};

export const getProjectHistory = async (projectId: string) => {
  const response = await api.get(`/github/history/${projectId}`);
  return response.data;
};

export const createProject = async (name: string, repoUrl: string) => {
  const response = await api.post('/search/projects', { name, github_repo: repoUrl });
  return response.data;
};

export const analyzeRepo = async (
  projectId: string,
  repoUrl: string,
  commitSha?: string,
  sinceDate?: string,
  untilDate?: string
) => {
  const response = await api.post('/github/analyze-repo', {
    project_id: projectId,
    repo_url: repoUrl,
    commit_sha: commitSha || undefined,
    since_date: sinceDate || undefined,
    until_date: untilDate || undefined,
  });
  return response.data;
};

export const chatWithCodebase = async (projectId: string, query: string) => {
  const response = await api.post('/chat/ask', { project_id: projectId, question: query }, { timeout: 120000 });
  return response.data;
};

export const getProject = async (projectId: string) => {
  const response = await api.get(`/search/projects/${projectId}`);
  return response.data;
};

export const getDocument = async (docId: string) => {
  const response = await api.get(`/search/docs/${docId}`);
  return response.data;
};

export const getCommits = async (projectId: string) => {
  const response = await api.get(`/github/commits/${projectId}`);
  return response.data;
};

export const getPullRequests = async (projectId: string, state: string = 'open') => {
  const response = await api.get(`/pull-requests/list/${projectId}`, { params: { state } });
  return response.data;
};

export const getPRDetails = async (projectId: string, prNumber: number) => {
  const response = await api.get(`/pull-requests/details/${projectId}/${prNumber}`);
  return response.data;
};

export const generatePRDoc = async (data: {
  project_id: string;
  pr_number: number;
  title: string;
  author: string;
  head_branch: string;
  base_branch: string;
  description?: string;
  files_changed?: string;
  diff_summary?: string;
  labels?: string[];
}) => {
  const response = await api.post('/pull-requests/generate', data);
  return response.data;
};

export const getProjectPRDocs = async (projectId: string) => {
  const response = await api.get(`/pull-requests/project/${projectId}`);
  return response.data;
};

export const stopScan = async (projectId: string) => {
  const response = await api.post(`/github/stop/${projectId}`);
  return response.data;
};

export const getConfig = async () => {
  const response = await api.get('/search/config');
  return response.data;
};

export const updateConfig = async (data: {
  groq_api_key?: string;
  ai_model?: string;
  github_token?: string;
  github_webhook_secret?: string;
}) => {
  const response = await api.post('/search/config', data);
  return response.data;
};



