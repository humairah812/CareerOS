import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Map, 
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { LearningPlanResponse, RoadmapDay, TaskItem } from '../types';
import { api } from '../services/api';

interface LearningRoadmapViewProps {
  targetRole: string;
}

export const LearningRoadmapView: React.FC<LearningRoadmapViewProps> = ({ targetRole }) => {
  const [plan, setPlan] = useState<LearningPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLearningPlan();
      setPlan(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!plan) return;
    const newStatus = !currentStatus;

    // Optimistic UI update
    setPlan({
      ...plan,
      roadmap: plan.roadmap.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: newStatus } : task
        )
      }))
    });

    try {
      await api.toggleTask(taskId, newStatus);
    } catch (e) {
      console.error(e);
    }
  };

  const allTasks = plan?.roadmap.flatMap((d) => d.tasks) || [];
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <h2 className="text-lg font-bold text-white">My Learning Roadmap</h2>
          <p className="text-xs text-slate-400">
            A 5-day structured progression to close your skill gaps for {targetRole}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Progress</div>
            <div className="text-lg font-bold text-white">{completedTasks} of {allTasks.length} Completed</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-blue-400 font-bold text-xs">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4 rounded-xl border border-border space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Overall Progression</span>
          <span className="font-mono text-blue-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Days Progression List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading roadmap...</div>
      ) : plan && (
        <div className="space-y-4">
          {plan.roadmap.map((day) => (
            <div key={day.day} className="glass-card p-5 rounded-2xl border border-border space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-600/20 text-blue-400 text-[11px]">
                    DAY {day.day}
                  </span>
                  <span className="font-bold text-white">{day.topic}</span>
                </div>
                <span className="text-[11px] text-slate-400">{day.objective}</span>
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2">
                {day.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-colors ${
                      task.completed
                        ? 'bg-card/40 border-border text-slate-400'
                        : 'bg-surface border-border hover:border-blue-500/50 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-blue-400 flex-shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                      <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{task.estimated_hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
