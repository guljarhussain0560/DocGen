export const dynamic = 'force-dynamic';

export default function ApiDocs() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const docsUrl = `${apiBase}/api/docs`;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[800px] font-mono text-sm">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-[#c9d1d9] flex items-center gap-2">
          API Documentation
        </h1>
      </header>

      <div className="flex-1 tech-panel flex flex-col overflow-hidden shadow-lg bg-white">
        <iframe 
          src={docsUrl} 
          className="w-full h-full border-none"
          title="FastAPI Swagger UI"
        />
      </div>
    </div>
  );
}
