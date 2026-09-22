import React, { useState } from "react";
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  DollarSign, 
  Sprout, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  HeartHandshake, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";
import { Project, Task, AppView } from "../types";

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onAddProject: (project: Omit<Project, "id">) => void;
  onNavigate: (view: AppView) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onAddProject,
  onNavigate,
  onOpenAiWithPrompt,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Project["category"]>("Indoor Space");
  const [budget, setBudget] = useState<number>(350);
  const [targetDate, setTargetDate] = useState("In 2 Months");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProject({
      name: name.trim(),
      description: description.trim() || "Botanical living sanctuary space.",
      category,
      status: "Active",
      progress: 15,
      plantCount: 2,
      budget: Number(budget) || 250,
      spent: 0,
      targetDate,
      healthIndex: 98,
      coverImage: coverImage || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
      assignedPlants: ["Monstera Deliciosa"],
    });

    setName("");
    setDescription("");
    setIsNewProjectModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2ece5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#52796f] uppercase tracking-wider mb-1">
            <span>Botanical Collections & Spaces</span>
            <span>•</span>
            <span>{projects.length} Active Environments</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1b4332]">
            Botanical Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#405648] mt-1">
            Organize living green zones, rare propagation laboratories, and urban balcony ecosystems.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenAiWithPrompt("Help me design a new indoor aroid project with lighting & budget recommendations.")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eef4f0] text-[#2d6a4f] text-xs font-semibold hover:bg-[#e2ece5] transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> AI Project Plan
          </button>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            id="create-project-btn"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const linkedTasks = tasks.filter((t) => t.projectId === proj.id || t.projectName === proj.name);
          const completedTasksCount = linkedTasks.filter((t) => t.status === "completed").length;

          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group bg-white rounded-2xl border border-[#e2ece5] overflow-hidden hover:shadow-lg hover:border-[#2d6a4f] transition-all flex flex-col justify-between cursor-pointer"
            >
              {/* Cover Image & Category */}
              <div className="relative h-44 bg-[#eef4f0] overflow-hidden">
                <img
                  src={proj.coverImage}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-white/90 backdrop-blur-xs text-[#1b4332]">
                    {proj.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-700 text-white shadow-xs">
                    {proj.status}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-display font-bold text-lg leading-tight line-clamp-1">
                    {proj.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#405648] leading-relaxed line-clamp-2">
                  {proj.description}
                </p>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#1b4332]">Milestone Completion</span>
                    <span className="text-[#2d6a4f]">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#f1f6f3] rounded-full overflow-hidden border border-[#e2ece5]">
                    <div
                      className="h-full bg-gradient-to-r from-[#2d6a4f] to-[#52b788] rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Plants Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#52796f]">
                    Specimens in Space ({proj.assignedPlants.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proj.assignedPlants.map((plantName, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#f4f7f5] text-[#2d6a4f] text-[11px] font-medium border border-[#e2ece5]"
                      >
                        {plantName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="pt-3 border-t border-[#e2ece5] flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    <span>{completedTasksCount}/{linkedTasks.length} Tasks Done</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-[#1b4332]">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    <span>${proj.spent} / ${proj.budget}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#e2ece5] p-6 space-y-6 text-[#1b4332]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-[#eef4f0] text-[#2d6a4f] inline-block mb-2">
                {selectedProject.category}
              </span>
              <h2 className="font-display font-bold text-2xl text-[#1b4332]">
                {selectedProject.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#405648] mt-1 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 bg-[#f8faf8] p-4 rounded-xl border border-[#e2ece5] text-center">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Health Score</span>
                <span className="text-lg font-bold text-emerald-700 block">{selectedProject.healthIndex}%</span>
              </div>
              <div className="border-x border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Budget Status</span>
                <span className="text-lg font-bold text-[#1b4332] block">${selectedProject.spent} / ${selectedProject.budget}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Target Date</span>
                <span className="text-lg font-bold text-[#2d6a4f] block">{selectedProject.targetDate}</span>
              </div>
            </div>

            {/* Assigned Plants in this Project */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#52796f] flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-[#2d6a4f]" /> Plants In This Project
                </h4>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onNavigate("shop");
                  }}
                  className="text-xs font-semibold text-[#2d6a4f] hover:underline cursor-pointer"
                >
                  + Add Plants from Shop
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProject.assignedPlants.map((plant, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#eef4f0] text-[#1b4332] text-xs font-medium border border-[#cbd7cf]"
                  >
                    🪴 {plant}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked Tasks */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#52796f] mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" /> Associated Care Tasks
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tasks
                  .filter((t) => t.projectId === selectedProject.id || t.projectName === selectedProject.name)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-2.5 rounded-lg bg-[#f8faf8] border border-[#e2ece5] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${task.status === "completed" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span className={task.status === "completed" ? "line-through text-gray-400" : "font-medium text-[#1b4332]"}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {task.dueDate}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2ece5] flex justify-end gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#e2ece5] p-6 space-y-4 text-[#1b4332]">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">
                Create Botanical Project
              </h3>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Project Space Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Bedroom Monstera Wall"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description & Goal
                </label>
                <textarea
                  placeholder="Lighting parameters, target plant varieties, automated irrigation plans..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  >
                    <option value="Indoor Space">Indoor Space</option>
                    <option value="Outdoor Living">Outdoor Living & Trees</option>
                    <option value="Urban Balcony">Urban Balcony</option>
                    <option value="Aroid Nursery">Aroid Nursery</option>
                    <option value="Propagation Lab">Propagation Lab</option>
                    <option value="Commercial Green">Commercial Green</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. In 2 Months, Summer 2026"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2ece5]">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#2d6a4f] text-white rounded-xl hover:bg-[#1b4332] shadow-xs cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
