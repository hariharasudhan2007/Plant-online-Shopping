import React from "react";
import { 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Check, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2,
  Sprout,
  ShieldAlert,
  Flame,
  Calendar
} from "lucide-react";
import { Task, TaskPriority } from "../types";

interface PrioritiesViewProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onUpdatePriority: (taskId: string, priority: TaskPriority) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const PrioritiesView: React.FC<PrioritiesViewProps> = ({
  tasks = [],
  onToggleComplete,
  onUpdatePriority,
  onOpenAiWithPrompt,
}) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const pendingTasks = safeTasks.filter((t) => t?.status !== "completed");

  const urgentTasks = pendingTasks.filter((t) => t?.priority === "urgent");
  const highTasks = pendingTasks.filter((t) => t?.priority === "high");
  const mediumTasks = pendingTasks.filter((t) => t?.priority === "medium");
  const lowTasks = pendingTasks.filter((t) => t?.priority === "low");

  const totalPending = pendingTasks.length || 1;
  const urgentPct = Math.round((urgentTasks.length / totalPending) * 100);
  const highPct = Math.round((highTasks.length / totalPending) * 100);
  const mediumPct = Math.round((mediumTasks.length / totalPending) * 100);
  const lowPct = Math.round((lowTasks.length / totalPending) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2ece5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#52796f] uppercase tracking-wider mb-1">
            <span>Dynamic Botanical Triage</span>
            <span>•</span>
            <span>{urgentTasks.length} Urgent Interventions</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1b4332]">
            Care Priorities Matrix
          </h1>
          <p className="text-xs sm:text-sm text-[#405648] mt-1">
            Prioritize plant hydration, quarantine interventions, and scheduled fertilizer feeds based on biological urgency.
          </p>
        </div>

        <button
          onClick={() => onOpenAiWithPrompt("Analyze all my active tasks and prioritize them with exact biological justifications.")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#40916c] text-white text-xs font-semibold shadow-xs hover:from-[#1b4332] hover:to-[#2d6a4f] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#d8f3dc]" /> AI Smart Prioritize
        </button>
      </div>

      {/* Priority Distribution Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold text-[#1b4332]">
          <span>Priority Distribution ({pendingTasks.length} Active Tasks)</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Urgent ({urgentTasks.length})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> High ({highTasks.length})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Medium ({mediumTasks.length})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> Low ({lowTasks.length})</span>
          </div>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${urgentPct}%` }} className="bg-rose-500 transition-all" title={`Urgent: ${urgentPct}%`} />
          <div style={{ width: `${highPct}%` }} className="bg-amber-500 transition-all" title={`High: ${highPct}%`} />
          <div style={{ width: `${mediumPct}%` }} className="bg-blue-500 transition-all" title={`Medium: ${mediumPct}%`} />
          <div style={{ width: `${lowPct}%` }} className="bg-gray-400 transition-all" title={`Low: ${lowPct}%`} />
        </div>
      </div>

      {/* 4 Quadrants / Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tier 1: Urgent & Critical */}
        <div className="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-200">
              <div className="flex items-center gap-2 text-rose-800">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm sm:text-base font-display">
                  Urgent & Immediate Attention
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-xs font-bold">
                {urgentTasks.length}
              </span>
            </div>
            <p className="text-[11px] text-rose-700 mt-2 mb-3">
              Action required within 24 hours to prevent permanent drought damage or pest proliferation.
            </p>

            <div className="space-y-2.5">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-0.5 w-4 h-4 rounded-md border-2 border-rose-400 hover:bg-rose-100 flex items-center justify-center cursor-pointer shrink-0"
                    >
                      {task.status === "completed" && <Check className="w-3 h-3 text-rose-600" />}
                    </button>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-900 leading-snug">
                        {task.title}
                      </h4>
                      {task.plantName && (
                        <span className="text-[11px] text-rose-700 font-medium block">
                          🌿 {task.plantName}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500">
                        Due: <strong>{task.dueDate}</strong> • {task.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdatePriority(task.id, "high")}
                    className="text-[11px] text-gray-400 hover:text-amber-600 p-1 cursor-pointer shrink-0"
                    title="Demote to High"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {urgentTasks.length === 0 && (
                <div className="text-center py-8 text-xs text-rose-600 font-medium">
                  ✓ No urgent emergency interventions currently pending!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: High Priority */}
        <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <div className="flex items-center gap-2 text-amber-900">
                <Flame className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm sm:text-base font-display">
                  High Priority (Active Health)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
                {highTasks.length}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 mt-2 mb-3">
              Scheduled tasks vital for peak leaf expansion, root aeration, and humidity management.
            </p>

            <div className="space-y-2.5">
              {highTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-0.5 w-4 h-4 rounded-md border-2 border-amber-400 hover:bg-amber-100 flex items-center justify-center cursor-pointer shrink-0"
                    >
                      {task.status === "completed" && <Check className="w-3 h-3 text-amber-600" />}
                    </button>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-900 leading-snug">
                        {task.title}
                      </h4>
                      {task.plantName && (
                        <span className="text-[11px] text-amber-800 font-medium block">
                          🌿 {task.plantName}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500">
                        Due: <strong>{task.dueDate}</strong> • {task.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onUpdatePriority(task.id, "urgent")}
                      className="text-[11px] text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Promote to Urgent"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdatePriority(task.id, "medium")}
                      className="text-[11px] text-gray-400 hover:text-blue-600 p-1 cursor-pointer"
                      title="Demote to Medium"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {highTasks.length === 0 && (
                <div className="text-center py-8 text-xs text-amber-700">
                  No high priority tasks right now.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier 3: Medium Priority */}
        <div className="bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-blue-200">
              <div className="flex items-center gap-2 text-blue-900">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm sm:text-base font-display">
                  Medium Priority (Maintenance)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 text-xs font-bold">
                {mediumTasks.length}
              </span>
            </div>
            <p className="text-[11px] text-blue-700 mt-2 mb-3">
              Standard maintenance routines: pot rotation, leaf dusting, cloche checks, supply review.
            </p>

            <div className="space-y-2.5">
              {mediumTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-0.5 w-4 h-4 rounded-md border-2 border-blue-400 hover:bg-blue-100 flex items-center justify-center cursor-pointer shrink-0"
                    >
                      {task.status === "completed" && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-900 leading-snug">
                        {task.title}
                      </h4>
                      <span className="text-[10px] text-gray-500">
                        Due: <strong>{task.dueDate}</strong> • {task.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onUpdatePriority(task.id, "high")}
                      className="text-[11px] text-gray-400 hover:text-amber-600 p-1 cursor-pointer"
                      title="Promote to High"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdatePriority(task.id, "low")}
                      className="text-[11px] text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      title="Demote to Low"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {mediumTasks.length === 0 && (
                <div className="text-center py-8 text-xs text-blue-600">
                  No medium priority tasks right now.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier 4: Low Priority & Backlog */}
        <div className="bg-gray-50/90 border-2 border-gray-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-800">
                <Layers className="w-5 h-5 text-gray-500" />
                <h3 className="font-bold text-sm sm:text-base font-display">
                  Low Priority / Backlog
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                {lowTasks.length}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-2 mb-3">
              Longer-term items, aesthetic changes, future propagation station prep, and supply reorders.
            </p>

            <div className="space-y-2.5">
              {lowTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-0.5 w-4 h-4 rounded-md border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center cursor-pointer shrink-0"
                    >
                      {task.status === "completed" && <Check className="w-3 h-3 text-gray-600" />}
                    </button>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-700 leading-snug">
                        {task.title}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        Due: <strong>{task.dueDate}</strong> • {task.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdatePriority(task.id, "medium")}
                    className="text-[11px] text-gray-400 hover:text-blue-600 p-1 cursor-pointer shrink-0"
                    title="Promote to Medium"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {lowTasks.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">
                  No low priority tasks in the backlog.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
