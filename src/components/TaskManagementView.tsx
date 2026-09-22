import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Trash2, 
  MoreVertical, 
  Calendar, 
  Tag, 
  Folder, 
  Kanban, 
  List, 
  ArrowRight,
  Check,
  Sprout
} from "lucide-react";
import { Task, TaskPriority, TaskStatus, TaskCategory, Project } from "../types";

interface TaskManagementViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleComplete: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const TaskManagementView: React.FC<TaskManagementViewProps> = ({
  tasks = [],
  projects = [],
  onToggleComplete,
  onUpdateTaskStatus,
  onDeleteTask,
  onAddTask,
  onOpenAiWithPrompt,
}) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // New task modal state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory>("Watering");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newDueDate, setNewDueDate] = useState("Today");
  const [newProjectId, setNewProjectId] = useState<string>("");
  const [newPlantName, setNewPlantName] = useState("");

  const filteredTasks = useMemo(() => {
    return safeTasks.filter((task) => {
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && task.category !== categoryFilter) return false;
      if (projectFilter !== "all" && task.projectId !== projectFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description?.toLowerCase().includes(q);
        const matchPlant = task.plantName?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchPlant) return false;
      }
      return true;
    });
  }, [tasks, priorityFilter, categoryFilter, projectFilter, searchQuery]);

  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const matchedProject = projects.find((p) => p.id === newProjectId);

    onAddTask({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      category: newCategory,
      priority: newPriority,
      status: "todo",
      dueDate: newDueDate,
      projectId: newProjectId || undefined,
      projectName: matchedProject?.name || undefined,
      plantName: newPlantName.trim() || undefined,
    });

    // Reset form
    setNewTitle("");
    setNewDescription("");
    setNewCategory("Watering");
    setNewPriority("medium");
    setNewDueDate("Today");
    setNewProjectId("");
    setNewPlantName("");
    setIsNewTaskModalOpen(false);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "high":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2ece5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#52796f] uppercase tracking-wider mb-1">
            <span>Plant Operations & Care Flow</span>
            <span>•</span>
            <span>{tasks.filter((t) => t.status !== "completed").length} Active Tasks</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1b4332]">
            Task Management
          </h1>
          <p className="text-xs sm:text-sm text-[#405648] mt-1">
            Track hydration schedules, potting projects, pest quarantines, and nursery orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-[#f1f6f3] p-1 rounded-xl border border-[#cbd7cf]">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-[#1b4332] shadow-xs"
                  : "text-[#52796f] hover:text-[#1b4332]"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[#1b4332] shadow-xs"
                  : "text-[#52796f] hover:text-[#1b4332]"
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <button
            onClick={() => onOpenAiWithPrompt("Organize my plant care schedule and recommend tasks for the week.")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#2d6a4f] bg-[#eef4f0] hover:bg-[#e2ece5] rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Organize
          </button>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            id="create-task-btn"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2d6a4f] hover:bg-[#1b4332] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ece5] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, plant species, or care actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f8faf8] border border-[#cbd7cf] rounded-xl text-[#1b4332] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#f8faf8] border border-[#cbd7cf] rounded-xl px-3 py-2 font-medium text-[#1b4332] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#f8faf8] border border-[#cbd7cf] rounded-xl px-3 py-2 font-medium text-[#1b4332] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
          >
            <option value="all">All Categories</option>
            <option value="Watering">Watering</option>
            <option value="Fertilizing">Fertilizing</option>
            <option value="Repotting">Repotting</option>
            <option value="Pest Care">Pest Care</option>
            <option value="Pruning">Pruning</option>
            <option value="Propagation">Propagation</option>
            <option value="Store Order">Store Order</option>
          </select>

          {/* Project */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-[#f8faf8] border border-[#cbd7cf] rounded-xl px-3 py-2 font-medium text-[#1b4332] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column: To Do */}
          <div className="bg-[#f8faf8] rounded-2xl border border-[#e2ece5] p-4 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2ece5] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-bold text-sm text-[#1b4332]">To Do</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#e2ece5] text-[11px] font-bold text-[#405648]">
                  {todoTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-xl border border-[#e2ece5] shadow-xs hover:border-[#2d6a4f] transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-semibold text-xs sm:text-sm text-[#1b4332] leading-snug">
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-[#52796f] line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-gray-500">
                    <span className="bg-[#eef4f0] text-[#2d6a4f] px-2 py-0.5 rounded-md font-medium">
                      {task.category}
                    </span>
                    {task.plantName && (
                      <span className="flex items-center gap-1 text-[#405648]">
                        <Sprout className="w-3 h-3 text-[#2d6a4f]" /> {task.plantName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f1f6f3] text-[11px]">
                    <span className="text-gray-500">Due: <strong className="text-[#1b4332]">{task.dueDate}</strong></span>
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, "in-progress")}
                      className="flex items-center gap-1 text-xs font-semibold text-[#2d6a4f] hover:underline cursor-pointer"
                    >
                      Start <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {todoTasks.length === 0 && (
                <div className="text-center py-12 text-xs text-gray-400">
                  No tasks waiting to be started.
                </div>
              )}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="bg-[#f8faf8] rounded-2xl border border-[#e2ece5] p-4 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2ece5] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-sm text-[#1b4332]">In Progress</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#e2ece5] text-[11px] font-bold text-[#405648]">
                  {inProgressTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-xl border border-[#cbd7cf] shadow-xs space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-semibold text-xs sm:text-sm text-[#1b4332] leading-snug">
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-[#52796f] line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-gray-500">
                    <span className="bg-[#eef4f0] text-[#2d6a4f] px-2 py-0.5 rounded-md font-medium">
                      {task.category}
                    </span>
                    {task.plantName && (
                      <span className="flex items-center gap-1 text-[#405648]">
                        <Sprout className="w-3 h-3 text-[#2d6a4f]" /> {task.plantName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f1f6f3] text-[11px]">
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, "todo")}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Complete
                    </button>
                  </div>
                </div>
              ))}

              {inProgressTasks.length === 0 && (
                <div className="text-center py-12 text-xs text-gray-400">
                  No active tasks right now.
                </div>
              )}
            </div>
          </div>

          {/* Column: Completed */}
          <div className="bg-[#f8faf8] rounded-2xl border border-[#e2ece5] p-4 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2ece5] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="font-bold text-sm text-[#1b4332]">Completed</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#e2ece5] text-[11px] font-bold text-[#405648]">
                  {completedTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/80 p-4 rounded-xl border border-[#e2ece5] space-y-2 opacity-80 group hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Done
                    </span>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-semibold text-xs sm:text-sm text-gray-500 line-through leading-snug">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f1f6f3] text-[11px]">
                    <span className="text-gray-400">{task.category}</span>
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, "todo")}
                      className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              ))}

              {completedTasks.length === 0 && (
                <div className="text-center py-12 text-xs text-gray-400">
                  Completed tasks will appear here.
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-[#e2ece5] shadow-xs overflow-hidden">
          <div className="divide-y divide-[#f1f6f3]">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#fcfdfc] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className="w-5 h-5 rounded-md border-2 border-[#cbd7cf] hover:border-[#2d6a4f] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    {task.status === "completed" && <Check className="w-3.5 h-3.5 text-[#2d6a4f]" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-xs sm:text-sm ${task.status === "completed" ? "text-gray-400 line-through" : "text-[#1b4332]"}`}>
                        {task.title}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#eef4f0] text-[#2d6a4f]">
                        {task.category}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-[#52796f] line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <span className="text-gray-500 hidden sm:inline">
                    Due: <strong className="text-[#1b4332]">{task.dueDate}</strong>
                  </span>
                  <select
                    value={task.status}
                    onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                    className="bg-[#f8faf8] border border-[#cbd7cf] rounded-lg px-2 py-1 text-xs text-[#1b4332]"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-xs text-gray-500">
              No tasks matched your search query or filters.
            </div>
          )}
        </div>
      )}

      {/* Create Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#e2ece5] p-6 space-y-4 text-[#1b4332]">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">
                Create Botanical Task
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flush leach salts & deep water Fiddle Leaf Fig"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  placeholder="Specific soil mix ratio, nutrient dosage, or light adjustment notes..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  >
                    <option value="Watering">Watering</option>
                    <option value="Fertilizing">Fertilizing</option>
                    <option value="Repotting">Repotting</option>
                    <option value="Pest Care">Pest Care</option>
                    <option value="Pruning">Pruning</option>
                    <option value="Propagation">Propagation</option>
                    <option value="Store Order">Store Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  >
                    <option value="urgent">🚨 Urgent (Immediate)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Due Timing
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Today, Tomorrow, Saturday"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Plant Species (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monstera Deliciosa"
                    value={newPlantName}
                    onChange={(e) => setNewPlantName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Assign to Project (Optional)
                </label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                >
                  <option value="">No Project (General Studio Task)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2ece5]">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#2d6a4f] text-white rounded-xl hover:bg-[#1b4332] shadow-xs cursor-pointer"
                >
                  Add Task to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
