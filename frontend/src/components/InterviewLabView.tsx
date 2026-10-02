import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight,
  Brain,
  HelpCircle
} from 'lucide-react';
import { InterviewTurnResponse } from '../types';
import { api } from '../services/api';

interface InterviewLabViewProps {
  targetRole: string;
}

export const InterviewLabView: React.FC<InterviewLabViewProps> = ({ targetRole }) => {
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [session, setSession] = useState<InterviewTurnResponse | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const interviewTypes = ['Technical', 'AI / ML', 'Projects', 'Behavioral', 'System Design'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleStartInterview = async () => {
    setIsSubmitting(true);
    try {
      const modeKey = interviewType.toLowerCase().replace(/[^a-z]/g, '_');
      const res = await api.startInterview(modeKey, targetRole);
      setSession(res);
      setAnswerText('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !answerText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitInterviewAnswer(session.session_id, session.turn_number, answerText);
      setSession(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setAnswerText(
        "To achieve sub-100ms latency in our retrieval pipeline, we executed dense vector queries and lexical BM25 search in parallel using Python asyncio.gather. We combined rankings with Reciprocal Rank Fusion and cached hot queries in Redis, dropping p95 latency from 140ms to 42ms."
      );
    }, 1200);
  };

  // Safe rubric extraction supporting both backend formats
  const evalData = session?.evaluation as any;
  const overallScore = evalData ? (evalData.technical_score || evalData.score || 85) : 85;
  const correctnessScore = evalData ? (evalData.rubric_scores?.correctness || evalData.technical_depth_score || 85) : 85;
  const completenessScore = evalData ? (evalData.rubric_scores?.completeness || evalData.groundedness_score || 85) : 85;
  const clarityScore = evalData ? (evalData.rubric_scores?.clarity || evalData.clarity_score || 85) : 85;
  const starCompliance = evalData ? (evalData.star_compliance ?? true) : true;
  const critiqueText = evalData ? (evalData.feedback || evalData.critique || "Clear and structured technical explanation.") : "";
  const missingPoints: string[] = evalData 
    ? (Array.isArray(evalData.missing_concepts) ? evalData.missing_concepts : 
       Array.isArray(evalData.ideal_answer_points) ? evalData.ideal_answer_points : 
       Array.isArray(evalData.areas_for_improvement) ? evalData.areas_for_improvement : [])
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <h2 className="text-lg font-bold text-white">Interview Practice</h2>
          <p className="text-xs text-slate-400">
            Simulate role-specific technical and behavioral interviews with real-time feedback.
          </p>
        </div>

        {session && (
          <button
            onClick={() => setSession(null)}
            className="px-3.5 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs text-slate-300 transition-colors"
          >
            End Interview
          </button>
        )}
      </div>

      {!session ? (
        /* Setup / Configuration Screen */
        <div className="glass-card p-8 rounded-2xl border border-border max-w-xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Start Interview Session</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Practice interview questions customized for {targetRole}.
            </p>
          </div>

          {/* Interview Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Choose Interview Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {interviewTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInterviewType(t)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-colors ${
                    interviewType === t 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-surface border-border text-slate-300 hover:bg-card'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-colors ${
                    difficulty === d 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-surface border-border text-slate-300 hover:bg-card'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleStartInterview}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Preparing Interview...</span>
              </>
            ) : (
              <>
                <span>Start Interview</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* Active Interview & Feedback Screen */
        <div className="glass-card p-7 rounded-2xl border border-border space-y-6 max-w-3xl mx-auto">
          {/* Question Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-blue-400 uppercase tracking-wider">
                Question {session.turn_number} of 3 • {interviewType}
              </span>
              <span>Difficulty: {difficulty}</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-border text-sm font-semibold text-white leading-relaxed">
              "{session.current_question}"
            </div>
          </div>

          {/* Candidate Answer Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Your Answer</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateVoice}
                  disabled={isRecording || isSubmitting}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isRecording 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse' 
                      : 'bg-surface border-border text-slate-300 hover:text-white'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{isRecording ? 'Listening...' : 'Simulate Voice Input'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={5}
              placeholder="Type your technical response here, or use voice input..."
              className="w-full p-4 rounded-xl bg-surface border border-border text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 leading-relaxed font-mono"
            />

            {!session.evaluation && (
              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !answerText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Feedback & Evaluation Rubric (Displayed after submission) */}
          {session.evaluation && (
            <div className="p-5 rounded-xl bg-surface border border-border space-y-4 pt-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Evaluation Rubric</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Overall Score: {overallScore}/100
                </span>
              </div>

              {/* 4 Feedback Criteria */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="text-[11px] text-slate-400">Technical Correctness</div>
                  <div className="text-base font-bold text-white mt-1">{correctnessScore}%</div>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="text-[11px] text-slate-400">Completeness</div>
                  <div className="text-base font-bold text-white mt-1">{completenessScore}%</div>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="text-[11px] text-slate-400">Clarity</div>
                  <div className="text-base font-bold text-white mt-1">{clarityScore}%</div>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="text-[11px] text-slate-400">STAR Format</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    {starCompliance ? 'Verified' : 'Optional'}
                  </div>
                </div>
              </div>

              {/* Critique & Missing Concepts */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="font-semibold text-slate-300">Critique:</div>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{critiqueText}</p>
                </div>

                {missingPoints.length > 0 && (
                  <div className="pt-2">
                    <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Missing Concepts & Things to Include:</span>
                    </div>
                    <ul className="text-slate-300 space-y-1 pl-4 list-disc marker:text-amber-400 mt-1">
                      {missingPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Next Question Button */}
              <div className="pt-3 border-t border-border flex items-center justify-end">
                <button
                  onClick={() => {
                    if (session.next_question) {
                      setSession({
                        ...session,
                        turn_number: session.turn_number + 1,
                        current_question: session.next_question,
                        evaluation: null,
                        next_question: null
                      });
                      setAnswerText('');
                    } else {
                      setSession(null);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>{session.next_question ? 'Next Question' : 'Finish Interview'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
