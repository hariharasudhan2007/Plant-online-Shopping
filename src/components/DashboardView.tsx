import React, { useState } from "react";
import { 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sprout, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Droplets, 
  Calendar, 
  FolderKanban, 
  Activity,
  Check,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { Task, Project, CareLogEntry, AppView, TaskCategory } from "../types";

interface DashboardViewProps {
  tasks: Task[];
  projects: Project[];
  careLogs: CareLogEntry[];
  onToggleTaskComplete: (taskId: string) => void;
  onNavigate: (view: AppView) => void;
  onOpenNewTaskModal: () => void;
  onOpenAiWithPrompt: (prompt: string) => void;
  onAddCareLog: (log: Omit<CareLogEntry, "id">) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks = [],
  projects = [],
  careLogs = [],
  onToggleTaskComplete,
  onNavigate,
  onOpenNewTaskModal,
  onOpenAiWithPrompt,
  onAddCareLog,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [logPlant, setLogPlant] = useState("Monstera Deliciosa");
  const [logAction, setLogAction] = useState<TaskCategory>("Watering");
  const [logNotes, setLogNotes] = useState("Deep soak with lukewarm water and checked moisture meter.");

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeCareLogs = Array.isArray(careLogs) ? careLogs : [];

  const completedTasks = safeTasks.filter((t) => t?.status === "completed");
  const urgentTasks = safeTasks.filter((t) => t?.priority === "urgent" && t?.status !== "completed");
  const pendingTasks = safeTasks.filter((t) => t?.status !== "completed");
  const dueTodayTasks = safeTasks.filter((t) => t?.dueDate === "Today" && t?.status !== "completed");

  const avgProjectProgress = Math.round(
    safeProjects.reduce((acc, p) => acc + (p?.progress || 0), 0) / (safeProjects.length || 1)
  );

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logPlant.trim()) return;
    onAddCareLog({
      plantName: logPlant,
      action: logAction,
      timestamp: "Just now",
      notes: logNotes,
    });
    setShowLogModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2ece5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#52796f] uppercase tracking-wider mb-1">
            <span>Botanical Operations Center</span>
            <span>•</span>
            <span>Live Nursery Monitor</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1b4332]">
            Plant Sanctuary Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#405648] mt-1">
            Your plants are currently experiencing optimal growth conditions. <strong>{dueTodayTasks.length}</strong> tasks need your green touch today.
          </p>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAiWithPrompt("Summarize my plant care progress and analyze bottlenecks.")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#40916c] text-white text-xs font-semibold shadow-xs hover:from-[#1b4332] hover:to-[#2d6a4f] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#d8f3dc]" /> AI Progress Summary
          </button>
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f1f6f3] hover:bg-[#e4ede7] text-[#1b4332] text-xs font-semibold border border-[#cbd7cf] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#2d6a4f]" /> New Task
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#f8faf8] text-[#2d6a4f] text-xs font-semibold border border-[#2d6a4f] transition-colors cursor-pointer"
          >
            <Droplets className="w-4 h-4" /> Quick Care Log
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Plant Health Score */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f] block">
              Health Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#1b4332]">96%</span>
              <span className="text-[11px] font-semibold text-emerald-600">Thriving</span>
            </div>
          </div>
        </div>

        {/* Care Streak */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f] block">
              Care Streak
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#1b4332]">12 Days</span>
              <span className="text-[11px] font-semibold text-amber-600">Consistent</span>
            </div>
          </div>
        </div>

        {/* Tasks Due Today */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f] block">
              Tasks Due Today
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#1b4332]">
                {dueTodayTasks.length}
              </span>
              <span className="text-[11px] font-medium text-gray-500">
                ({pendingTasks.length} total active)
              </span>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f] block">
              Active Projects
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#1b4332]">
                {projects.length}
              </span>
              <span className="text-[11px] font-semibold text-purple-700">
                {avgProjectProgress}% avg progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Attention Alert (if any) */}
      {urgentTasks.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                Urgent Priority Alert: {urgentTasks.length} Plant Care Actions Require Attention
              </h3>
              <p className="text-xs text-rose-700 mt-0.5">
                {urgentTasks[0].title} {urgentTasks.length > 1 ? `and ${urgentTasks.length - 1} other item` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleTaskComplete(urgentTasks[0].id)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Mark Done
            </button>
            <button
              onClick={() => onNavigate("priorities")}
              className="px-3 py-1.5 rounded-lg bg-white text-rose-700 border border-rose-300 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              View Priorities
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Tasks & Projects, Right Schedule & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Tasks Section */}
          <div className="bg-white rounded-2xl border border-[#e2ece5] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2d6a4f]" />
                <h2 className="font-display font-bold text-lg text-[#1b4332]">
                  Priority Task Management
                </h2>
              </div>
              <button
                onClick={() => onNavigate("tasks")}
                className="text-xs font-semibold text-[#2d6a4f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Full Board <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tasks list */}
            <div className="divide-y divide-[#f1f6f3]">
              {pendingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="py-3.5 flex items-start gap-3 hover:bg-[#fcfdfc] transition-colors rounded-xl px-2"
                >
                  <button
                    onClick={() => onToggleTaskComplete(task.id)}
                    className="mt-0.5 w-5 h-5 rounded-md border-2 border-[#cbd7cf] hover:border-[#2d6a4f] hover:bg-[#eef5f0] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    {task.status === "completed" && <Check className="w-3.5 h-3.5 text-[#2d6a4f]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-xs sm:text-sm text-[#1b4332]">
                        {task.title}
                      </span>
                      {task.priority === "urgent" && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-rose-100 text-rose-700">
                          Urgent
                        </span>
                      )}
                      {task.priority === "high" && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-100 text-amber-700">
                          High
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#eef4f0] text-[#2d6a4f]">
                        {task.category}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-[#52796f] line-clamp-1 mb-1.5">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                      <span>Due: <strong className="text-[#1b4332]">{task.dueDate}</strong></span>
                      {task.projectName && (
                        <span>• Project: <strong>{task.projectName}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pendingTasks.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-500">
                🎉 All plant tasks completed for now! Add a new task or ask Flora AI for a seasonal routine.
              </div>
            )}
          </div>

          {/* Green Projects Snapshot */}
          <div className="bg-white rounded-2xl border border-[#e2ece5] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#2d6a4f]" />
                <h2 className="font-display font-bold text-lg text-[#1b4332]">
                  Green Projects & Plant Spaces
                </h2>
              </div>
              <button
                onClick={() => onNavigate("projects")}
                className="text-xs font-semibold text-[#2d6a4f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                All Projects <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onNavigate("projects")}
                  className="p-4 rounded-xl bg-[#f8faf8] border border-[#e2ece5] hover:border-[#2d6a4f] transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#52796f]">
                        {proj.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#1b4332] mt-0.5">
                        {proj.name}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-[#2d6a4f]">
                      {proj.progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[#e2ece5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2d6a4f] to-[#52b788] rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>{proj.plantCount} Plants</span>
                    <span>Budget: ${proj.spent} / ${proj.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-8">
          
          {/* AI Horticultural Advisory Card */}
          <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-[#d8f3dc]">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-display font-bold text-base">Flora AI Copilot</h3>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              "Your tropical foliage is thriving. Light levels will peak this afternoon; check soil hydration for moisture-sensitive aroids."
            </p>
            
            <div className="space-y-2 pt-2 border-t border-white/15">
              <button
                onClick={() => onOpenAiWithPrompt("Analyze and prioritize my pending tasks based on soil needs.")}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Prioritize my tasks</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
              <button
                onClick={() => onOpenAiWithPrompt("Organize a weekly watering schedule for my plants.")}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Organize weekly schedule</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </div>
          </div>

          {/* Upcoming 7-Day Care Schedule */}
          <div className="bg-white rounded-2xl border border-[#e2ece5] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2d6a4f]" />
              <h3 className="font-display font-bold text-base text-[#1b4332]">
                Care Schedule Timeline
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8faf8] border-l-4 border-[#2d6a4f]">
                <div>
                  <span className="font-bold text-[#1b4332] block">Today</span>
                  <span className="text-gray-500">Monstera & Calathea Deep Watering</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  Watering
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8faf8] border-l-4 border-amber-500">
                <div>
                  <span className="font-bold text-[#1b4332] block">Tomorrow</span>
                  <span className="text-gray-500">Neem Oil Foliage Pest Defense</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                  Pest Care
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8faf8] border-l-4 border-blue-500">
                <div>
                  <span className="font-bold text-[#1b4332] block">In 3 Days</span>
                  <span className="text-gray-500">Pink Princess Cutting Repotting</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">
                  Repotting
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Care Logs */}
          <div className="bg-white rounded-2xl border border-[#e2ece5] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#2d6a4f]" />
                <h3 className="font-display font-bold text-base text-[#1b4332]">
                  Recent Activity Logs
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(true)}
                className="text-xs font-semibold text-[#2d6a4f] hover:underline cursor-pointer"
              >
                + Log
              </button>
            </div>

            <div className="space-y-3">
              {careLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs border-b border-[#f1f6f3] pb-2.5 last:border-none">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[#1b4332]">{log.plantName}</span>
                    <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-600 leading-snug">{log.notes}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Quick Care Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#e2ece5] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[#1b4332]">
                Log Botanical Care Activity
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Plant Name
                </label>
                <input
                  type="text"
                  value={logPlant}
                  onChange={(e) => setLogPlant(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Action Taken
                </label>
                <select
                  value={logAction}
                  onChange={(e) => setLogAction(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                >
                  <option value="Watering">Watering</option>
                  <option value="Fertilizing">Fertilizing</option>
                  <option value="Pest Care">Pest Care</option>
                  <option value="Repotting">Repotting</option>
                  <option value="Pruning">Pruning</option>
                  <option value="Propagation">Propagation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Observations / Care Notes
                </label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#2d6a4f] text-white rounded-xl hover:bg-[#1b4332] cursor-pointer"
                >
                  Save to Care Logs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
