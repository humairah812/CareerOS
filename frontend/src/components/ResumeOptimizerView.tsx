import React, { useState } from 'react';
import { 
  Wand2, 
  Check, 
  X, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Copy, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';
import { ResumeOptimizationBullet } from '../types';
import { api } from '../services/api';

interface ResumeOptimizerViewProps {
  bullets: ResumeOptimizationBullet[];
  onBulletUpdated: () => void;
}

export const ResumeOptimizerView: React.FC<ResumeOptimizerViewProps> = ({
  bullets,
  onBulletUpdated
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (bulletId: string, action: 'accept' | 'reject' | 'edit', customText?: string) => {
    setIsProcessing(true);
    try {
      await api.takeBulletAction(bulletId, action, customText);
      if (action === 'edit') setEditingId(null);
      onBulletUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <h2 className="text-lg font-bold text-white">Resume Optimizer</h2>
          <p className="text-xs text-slate-400">
            Actionable suggestions to transform vague resume bullet points into verified, high-impact statements.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs text-slate-300">
          <span>{bullets.length} Improvement Suggestions</span>
        </div>
      </div>

      {/* Bullets List */}
      <div className="space-y-5">
        {bullets.map((bullet) => {
          const isAccepted = bullet.status === 'accepted';
          const isRejected = bullet.status === 'rejected';
          const isEdited = bullet.status === 'edited';
          const isCurrentlyEditing = editingId === bullet.id;

          return (
            <div 
              key={bullet.id}
              className={`p-6 rounded-2xl glass-card border transition-all ${
                isAccepted 
                  ? 'border-emerald-500/40 bg-emerald-950/10' 
                  : isRejected 
                  ? 'border-slate-800 opacity-50' 
                  : 'border-border'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                <span className="font-semibold text-slate-300">{bullet.section}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  isAccepted ? 'bg-emerald-500/15 text-emerald-400' :
                  isRejected ? 'bg-slate-800 text-slate-400' :
                  isEdited ? 'bg-blue-500/15 text-blue-400' :
                  'bg-amber-500/15 text-amber-400'
                }`}>
                  {bullet.status}
                </span>
              </div>

              {/* Three-part structure: CURRENT → PROBLEM → SUGGESTED */}
              <div className="space-y-4 my-4 text-xs">
                {/* 1. CURRENT */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Current Resume Bullet
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-border text-slate-300">
                    "{bullet.original_text}"
                  </div>
                </div>

                {/* 2. PROBLEM */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Identified Weakness</span>
                  </div>
                  <ul className="text-slate-300 space-y-1 pl-4 list-disc marker:text-rose-400">
                    {bullet.detected_problems.map((prob, i) => (
                      <li key={i}>{prob}</li>
                    ))}
                  </ul>
                </div>

                {/* 3. SUGGESTED */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Suggested Improved Version (Verified Only)</span>
                    <button
                      onClick={() => handleCopy(bullet.suggested_rewrite, bullet.id)}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono normal-case text-[10px]"
                    >
                      {copiedId === bullet.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === bullet.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {isCurrentlyEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-xl bg-surface border border-blue-500 text-xs text-white outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(bullet.id, 'edit', editText)}
                          disabled={isProcessing}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Custom Edit</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-lg bg-card border border-border text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-surface border border-emerald-500/30 text-emerald-200 leading-relaxed font-mono">
                      "{bullet.edited_text || bullet.suggested_rewrite}"
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Based strictly on verified project evidence — zero fictional numbers.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: [ Accept ] [ Edit ] [ Reject ] */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <button
                  onClick={() => {
                    setEditingId(bullet.id);
                    setEditText(bullet.edited_text || bullet.suggested_rewrite);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleAction(bullet.id, 'reject')}
                  disabled={isProcessing || isRejected}
                  className="px-3 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs text-rose-300 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleAction(bullet.id, 'accept')}
                  disabled={isProcessing || isAccepted}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAccepted ? 'Accepted' : 'Accept'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
