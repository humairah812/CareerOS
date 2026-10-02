import React, { useState } from 'react';
import { Terminal, Play, RefreshCw, Code2, Copy, Check } from 'lucide-react';
import { api } from '../../services/api';

export const MCPConsoleView: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('search_skills');
  const [paramInput, setParamInput] = useState('{\n  "query": "FastAPI"\n}');
  const [rpcResponse, setRpcResponse] = useState<any>({
    jsonrpc: "2.0",
    id: 1,
    result: {
      content: [
        { name: "FastAPI", category: "Backend Frameworks", aliases: ["fast-api", "fastapi"] }
      ],
      isError: false
    }
  });
  const [isCalling, setIsCalling] = useState(false);
  const [copied, setCopied] = useState(false);

  const availableTools = [
    {
      name: "search_skills",
      description: "Query canonical skill ontology and taxonomy relationships",
      defaultParams: '{\n  "query": "FastAPI"\n}'
    },
    {
      name: "get_resume",
      description: "Retrieve parsed candidate resume sections and metadata",
      defaultParams: '{\n  "resume_id": 1\n}'
    },
    {
      name: "evaluate_groundedness",
      description: "Execute RAG hybrid verification on a candidate claim",
      defaultParams: '{\n  "claim": "Architected RAG pipeline with FastAPI and pgvector",\n  "top_k": 2\n}'
    },
    {
      name: "optimize_bullet",
      description: "Transform weak resume bullet into quantified STAR achievement",
      defaultParams: '{\n  "bullet_text": "Built scalable AI systems across cloud infrastructure."\n}'
    },
    {
      name: "generate_interview_question",
      description: "Generate tailored technical or behavioral interview prompt",
      defaultParams: '{\n  "role": "Staff AI Systems Engineer",\n  "mode": "technical"\n}'
    }
  ];

  const handleSelectTool = (toolName: string) => {
    setSelectedTool(toolName);
    const tool = availableTools.find((t) => t.name === toolName);
    if (tool) setParamInput(tool.defaultParams);
  };

  const handleExecute = async () => {
    setIsCalling(true);
    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(paramInput);
      } catch (e) {
        setRpcResponse({
          jsonrpc: "2.0",
          error: { code: -32700, message: "Parse error: Invalid JSON parameters" },
          id: null
        });
        setIsCalling(false);
        return;
      }

      const res = await api.callMCP("tools/call", {
        name: selectedTool,
        arguments: parsedParams
      });
      setRpcResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalling(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(rpcResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              Protocol Gateway
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Model Context Protocol (MCP) Console</h2>
          <p className="text-xs text-slate-400">
            Standardized JSON-RPC 2.0 tool execution endpoint for autonomous agents.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-surface border border-border font-mono text-xs text-blue-400">
          Endpoint: /api/v1/mcp
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-border space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Available Tools
          </h3>
          <div className="space-y-2">
            {availableTools.map((t) => (
              <div
                key={t.name}
                onClick={() => handleSelectTool(t.name)}
                className={`p-3 rounded-xl cursor-pointer border transition-colors ${
                  selectedTool === t.name 
                    ? 'bg-blue-600/20 border-blue-500 text-white' 
                    : 'bg-surface border-border text-slate-300 hover:bg-card'
                }`}
              >
                <div className="text-xs font-bold font-mono text-blue-300">{t.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{t.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold text-white">Execute Tool ({selectedTool})</span>
              <button
                onClick={handleExecute}
                disabled={isCalling}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                {isCalling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>Send Request</span>
              </button>
            </div>

            <textarea
              value={paramInput}
              onChange={(e) => setParamInput(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-surface border border-border font-mono text-xs text-blue-300 outline-none"
            />
          </div>

          <div className="glass-card p-5 rounded-2xl border border-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold text-white">JSON-RPC 2.0 Response</span>
              <button
                onClick={handleCopyResponse}
                className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-surface border border-border font-mono text-xs text-emerald-300 overflow-x-auto max-h-60">
              {JSON.stringify(rpcResponse, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
