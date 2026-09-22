import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  X, 
  Sprout, 
  CheckSquare, 
  FolderKanban, 
  ArrowRight, 
  Sparkles,
  ClipboardList,
  Loader2,
  Bot,
  AlertCircle,
  Tag,
  Zap
} from "lucide-react";
import { PlantProduct, Task, Project, CareLogEntry, AppView, AiSearchResult } from "../types";
import { api } from "../services/api";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: PlantProduct[];
  tasks: Task[];
  projects: Project[];
  careLogs?: CareLogEntry[];
  onSelectPlant: (plant: PlantProduct) => void;
  onNavigate: (view: AppView) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  catalog,
  tasks,
  projects,
  careLogs = [],
  onSelectPlant,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"ai" | "standard">("ai");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Quick suggestion prompts for the AI assistant
  const promptSuggestions = [
    "Urgent tasks due today",
    "Pet-safe low-light plants under $50",
    "Active spaces with low progress",
    "Recent fertilizer & repotting logs",
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setAiResult(null);
      setAiError(null);
      setIsLoadingAi(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Execute AI search
  const handleExecuteAiSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsLoadingAi(true);
    setAiError(null);

    try {
      const result = await api.searchRecordsWithAi(trimmed, {
        tasks,
        projects,
        careLogs,
        plants: catalog,
      });
      setAiResult(result);
    } catch (err: any) {
      console.error("AI search failed:", err);
      setAiError("Could not complete AI natural language search. Please try again.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchMode === "ai") {
        handleExecuteAiSearch(query);
      }
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setSearchMode("ai");
    handleExecuteAiSearch(suggestion);
  };

  if (!isOpen) return null;

  // Standard keyword filtering
  const cleanQ = query.trim().toLowerCase();

  const standardMatchedPlants = cleanQ
    ? catalog.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.botanicalName.toLowerCase().includes(cleanQ) ||
          p.tags.some((t) => t.toLowerCase().includes(cleanQ))
      )
    : catalog.slice(0, 3);

  const standardMatchedTasks = cleanQ
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(cleanQ) ||
          t.description?.toLowerCase().includes(cleanQ) ||
          t.plantName?.toLowerCase().includes(cleanQ)
      )
    : tasks.slice(0, 3);

  const standardMatchedProjects = cleanQ
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.description.toLowerCase().includes(cleanQ) ||
          p.category.toLowerCase().includes(cleanQ)
      )
    : projects.slice(0, 2);

  const standardMatchedCareLogs = cleanQ
    ? careLogs.filter(
        (c) =>
          c.plantName.toLowerCase().includes(cleanQ) ||
          c.action.toLowerCase().includes(cleanQ) ||
          c.notes.toLowerCase().includes(cleanQ)
      )
    : careLogs.slice(0, 2);

  // Map AI results to entity objects with match reasons
  const aiMatchedTasks = aiResult
    ? (aiResult.matchedTasks || [])
        .map((match) => {
          const item = tasks.find((t) => t.id === match.id);
          return item ? { ...item, matchReason: match.reason } : null;
        })
        .filter(Boolean) as (Task & { matchReason: string })[]
    : [];

  const aiMatchedProjects = aiResult
    ? (aiResult.matchedProjects || [])
        .map((match) => {
          const item = projects.find((p) => p.id === match.id);
          return item ? { ...item, matchReason: match.reason } : null;
        })
        .filter(Boolean) as (Project & { matchReason: string })[]
    : [];

  const aiMatchedPlants = aiResult
    ? (aiResult.matchedPlants || [])
        .map((match) => {
          const item = catalog.find((p) => p.id === match.id);
          return item ? { ...item, matchReason: match.reason } : null;
        })
        .filter(Boolean) as (PlantProduct & { matchReason: string })[]
    : [];

  const aiMatchedCareLogs = aiResult
    ? (aiResult.matchedCareLogs || [])
        .map((match) => {
          const item = careLogs.find((c) => c.id === match.id);
          return item ? { ...item, matchReason: match.reason } : null;
        })
        .filter(Boolean) as (CareLogEntry & { matchReason: string })[]
    : [];

  const isAiActive = searchMode === "ai" && aiResult !== null;
  const totalStandardResults =
    standardMatchedPlants.length +
    standardMatchedTasks.length +
    standardMatchedProjects.length +
    standardMatchedCareLogs.length;

  const totalAiResults =
    aiMatchedPlants.length +
    aiMatchedTasks.length +
    aiMatchedProjects.length +
    aiMatchedCareLogs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#cbd7cf] overflow-hidden flex flex-col max-h-[85vh] text-[#1b4332]"
        id="global-search-modal"
      >
        {/* Top Header Mode Toggle */}
        <div className="px-4 pt-3 pb-2 bg-[#f4f7f5] border-b border-[#e2ece5] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#d8e3dc]">
            <button
              onClick={() => setSearchMode("ai")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                searchMode === "ai"
                  ? "bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white shadow-xs"
                  : "text-[#52796f] hover:text-[#1b4332]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#95d5b2]" />
              <span>AI Natural Search</span>
            </button>
            <button
              onClick={() => setSearchMode("standard")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                searchMode === "standard"
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "text-[#52796f] hover:text-[#1b4332]"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Keyword Filter</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#52796f]">
            <span className="hidden sm:inline">Press <strong>Enter</strong> to search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white border border-gray-200 rounded-md">
              ESC
            </kbd>
            <button 
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e2ece5] flex items-center gap-3 bg-white">
          {searchMode === "ai" ? (
            <Bot className="w-5 h-5 text-[#2d6a4f] shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-[#2d6a4f] shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            placeholder={
              searchMode === "ai"
                ? "Ask in natural language (e.g., 'urgent tasks due today', 'pet-safe low-light plants under $50')..."
                : "Search plant specimens, tasks, projects, care guides..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInput}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1b4332] placeholder-gray-400 focus:outline-none"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setAiResult(null);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 px-1 cursor-pointer"
            >
              Clear
            </button>
          )}

          {searchMode === "ai" && (
            <button
              onClick={() => handleExecuteAiSearch(query)}
              disabled={isLoadingAi || !query.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-all cursor-pointer shadow-xs"
            >
              {isLoadingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#95d5b2]" />
                  <span>Search AI</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {searchMode === "ai" && (
          <div className="px-4 py-2.5 bg-[#f8faf8] border-b border-[#e2ece5] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-[#52796f] font-semibold shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#2d6a4f]" /> Prompts:
            </span>
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSelectSuggestion(prompt)}
                className="px-2.5 py-1 rounded-full bg-white text-[#2d6a4f] hover:bg-[#e8f2ec] border border-[#d8e3dc] whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoadingAi && (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3 bg-[#fbfdfb]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center animate-bounce">
              <Sprout className="w-6 h-6 text-[#2d6a4f] animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1b4332]">
                Flora AI is scanning botanical records...
              </h4>
              <p className="text-xs text-[#52796f] mt-1">
                Evaluating priorities, lighting, deadlines, species care, and project milestones.
              </p>
            </div>
          </div>
        )}

        {/* AI Error Notice */}
        {aiError && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{aiError}</span>
            </div>
            <button
              onClick={() => handleExecuteAiSearch(query)}
              className="font-semibold underline hover:text-rose-900 cursor-pointer ml-3 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* AI Semantic Summary Badge */}
        {!isLoadingAi && isAiActive && (
          <div className="mx-4 mt-3 p-3.5 bg-gradient-to-r from-[#eef7f2] to-[#e4efe8] rounded-xl border border-[#c3dcce] text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#1b4332] font-semibold">
              <Sparkles className="w-4 h-4 text-[#2d6a4f] shrink-0" />
              <span>AI Search Interpretation</span>
            </div>
            <p className="text-[#2d6a4f] leading-relaxed">
              {aiResult.summary}
            </p>

            {/* Filter Badges if recognized */}
            {aiResult.interpretedFilters && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {aiResult.interpretedFilters.priorities?.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-md bg-white/80 border border-[#b7d5c4] text-[10px] font-bold text-amber-700 uppercase">
                    Priority: {p}
                  </span>
                ))}
                {aiResult.interpretedFilters.status?.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-white/80 border border-[#b7d5c4] text-[10px] font-semibold text-[#2d6a4f]">
                    Status: {s}
                  </span>
                ))}
                {aiResult.interpretedFilters.isPetFriendly && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-semibold">
                    🐾 Pet Safe
                  </span>
                )}
                {aiResult.interpretedFilters.budgetLimit && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold">
                    Budget: ≤ ${aiResult.interpretedFilters.budgetLimit}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* AI Mode Results */}
          {searchMode === "ai" && !isLoadingAi ? (
            isAiActive ? (
              totalAiResults === 0 ? (
                <div className="text-center py-12 text-xs text-gray-500 space-y-2">
                  <p className="font-semibold text-gray-700">No records matched this natural language query.</p>
                  <p>Try searching by care action ("repotting needed"), plant type ("easy indoor plants"), or priority ("urgent").</p>
                </div>
              ) : (
                <>
                  {/* AI Matched Tasks */}
                  {aiMatchedTasks.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#52796f] uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-[#2d6a4f]" /> Matched Care & Operations Tasks ({aiMatchedTasks.length})
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigate("tasks");
                          }}
                          className="text-[#2d6a4f] hover:underline normal-case text-xs font-semibold cursor-pointer"
                        >
                          View Board
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {aiMatchedTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => {
                              onClose();
                              onNavigate("tasks");
                            }}
                            className="flex items-start justify-between p-2.5 rounded-xl hover:bg-[#f1f6f3] transition-colors cursor-pointer group border border-transparent hover:border-[#d8e3dc]"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                                  {task.title}
                                </span>
                                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md bg-gray-100 text-gray-700">
                                  {task.priority}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#52796f]">
                                Due: {task.dueDate} • Category: {task.category}
                              </div>
                              {task.matchReason && (
                                <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block font-medium border border-emerald-200">
                                  Why matched: {task.matchReason}
                                </div>
                              )}
                            </div>

                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Matched Plants */}
                  {aiMatchedPlants.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#52796f] uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Sprout className="w-3.5 h-3.5 text-[#2d6a4f]" /> Matched Botanical Specimens ({aiMatchedPlants.length})
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigate("shop");
                          }}
                          className="text-[#2d6a4f] hover:underline normal-case text-xs font-semibold cursor-pointer"
                        >
                          View Shop
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {aiMatchedPlants.map((plant) => (
                          <div
                            key={plant.id}
                            onClick={() => {
                              onClose();
                              onSelectPlant(plant);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f6f3] transition-colors cursor-pointer group border border-transparent hover:border-[#d8e3dc]"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={plant.image}
                                alt={plant.name}
                                className="w-11 h-11 rounded-lg object-cover bg-gray-100"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                                  {plant.name}
                                </h4>
                                <p className="text-[11px] text-[#52796f] italic">
                                  {plant.botanicalName}
                                </p>
                                {plant.matchReason && (
                                  <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block font-medium border border-emerald-200 mt-0.5">
                                    {plant.matchReason}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-[#1b4332]">
                                ${plant.price.toFixed(2)}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Matched Projects */}
                  {aiMatchedProjects.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#52796f] uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <FolderKanban className="w-3.5 h-3.5 text-[#2d6a4f]" /> Matched Spaces & Projects ({aiMatchedProjects.length})
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigate("projects");
                          }}
                          className="text-[#2d6a4f] hover:underline normal-case text-xs font-semibold cursor-pointer"
                        >
                          View Projects
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {aiMatchedProjects.map((proj) => (
                          <div
                            key={proj.id}
                            onClick={() => {
                              onClose();
                              onNavigate("projects");
                            }}
                            className="flex items-start justify-between p-2.5 rounded-xl hover:bg-[#f1f6f3] transition-colors cursor-pointer group border border-transparent hover:border-[#d8e3dc]"
                          >
                            <div className="space-y-0.5">
                              <h4 className="text-xs sm:text-sm font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                                {proj.name}
                              </h4>
                              <span className="text-[11px] text-[#52796f]">
                                {proj.category} • {proj.progress}% progress • {proj.status}
                              </span>
                              {proj.matchReason && (
                                <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md block font-medium border border-emerald-200 mt-1">
                                  {proj.matchReason}
                                </div>
                              )}
                            </div>

                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 transition-all mt-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Matched Care Logs */}
                  {aiMatchedCareLogs.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#52796f] uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <ClipboardList className="w-3.5 h-3.5 text-[#2d6a4f]" /> Matched Care Timeline Logs ({aiMatchedCareLogs.length})
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigate("dashboard");
                          }}
                          className="text-[#2d6a4f] hover:underline normal-case text-xs font-semibold cursor-pointer"
                        >
                          View Timeline
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {aiMatchedCareLogs.map((log) => (
                          <div
                            key={log.id}
                            onClick={() => {
                              onClose();
                              onNavigate("dashboard");
                            }}
                            className="flex items-start justify-between p-2.5 rounded-xl hover:bg-[#f1f6f3] transition-colors cursor-pointer group border border-transparent hover:border-[#d8e3dc]"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                                  {log.plantName}
                                </span>
                                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                                  {log.action}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#52796f] line-clamp-1">
                                {log.notes}
                              </p>
                              {log.matchReason && (
                                <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block font-medium border border-emerald-200 mt-1">
                                  {log.matchReason}
                                </div>
                              )}
                            </div>

                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 transition-all mt-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )
            ) : (
              // Initial Prompt Guidance when AI mode has not searched yet
              <div className="text-center py-10 px-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#2d6a4f] flex items-center justify-center mx-auto shadow-xs">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1b4332]">
                    Botanical AI Natural Language Search
                  </h3>
                  <p className="text-xs text-[#52796f] max-w-md mx-auto mt-1">
                    Describe what you are looking for in everyday plain English. Flora AI understands priorities, moisture needs, pet compatibility, plant species, and project progress.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  {promptSuggestions.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSelectSuggestion(prompt)}
                      className="px-3 py-1.5 text-xs bg-[#f1f6f3] hover:bg-[#e4ede7] text-[#2d6a4f] font-medium rounded-lg border border-[#d8e3dc] transition-all cursor-pointer shadow-xs"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            // Standard Keyword Search Mode Results
            totalStandardResults === 0 ? (
              <div className="text-center py-12 text-xs text-gray-500">
                No results found for "{query}". Try searching for "Monstera", "Watering", or "Jungle".
              </div>
            ) : (
              <>
                {/* Plants Section */}
                {standardMatchedPlants.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#52796f] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-[#2d6a4f]" /> Plant Catalog ({standardMatchedPlants.length})
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate("shop");
                        }}
                        className="text-[#2d6a4f] hover:underline normal-case text-xs font-semibold cursor-pointer"
                      >
                        View All Plants
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {standardMatchedPlants.map((plant) => (
                        <div
                          key={plant.id}
                          onClick={() => {
                            onClose();
                            onSelectPlant(plant);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f6f3] transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={plant.image}
                              alt={plant.name}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="text-xs sm:text-sm font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                                {plant.name}
                              </h4>
                              <p className="text-[11px] text-[#52796f] italic">
                                {plant.botanicalName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#1b4332]">
                              ${plant.price.toFixed(2)}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks Section */}
                {standardMatchedTasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#52796f] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-[#2d6a4f]" /> Care & Operations Tasks ({standardMatchedTasks.length})
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate("tasks");
                        }}
                        className="text-[#2d6a4f] hover:underline normal-case text-xs font-semibold cursor-pointer"
                      >
                        View Board
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {standardMatchedTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => {
                            onClose();
                            onNavigate("tasks");
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f6f3] transition-colors cursor-pointer group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                                {task.title}
                              </span>
                              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md bg-gray-100 text-gray-600">
                                {task.priority}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#52796f]">
                              Due: {task.dueDate} • {task.category}
                            </span>
                          </div>

                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {standardMatchedProjects.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#52796f] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <FolderKanban className="w-3.5 h-3.5 text-[#2d6a4f]" /> Botanical Spaces ({standardMatchedProjects.length})
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate("projects");
                        }}
                        className="text-[#2d6a4f] hover:underline normal-case text-xs font-semibold cursor-pointer"
                      >
                        View Projects
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {standardMatchedProjects.map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => {
                            onClose();
                            onNavigate("projects");
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f6f3] transition-colors cursor-pointer group"
                        >
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                              {proj.name}
                            </h4>
                            <span className="text-[11px] text-[#52796f]">
                              {proj.category} • {proj.progress}% progress
                            </span>
                          </div>

                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Care Logs Section */}
                {standardMatchedCareLogs.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#52796f] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5 text-[#2d6a4f]" /> Botanical Timeline Logs ({standardMatchedCareLogs.length})
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate("dashboard");
                        }}
                        className="text-[#2d6a4f] hover:underline normal-case text-xs font-semibold cursor-pointer"
                      >
                        View Timeline
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {standardMatchedCareLogs.map((log) => (
                        <div
                          key={log.id}
                          onClick={() => {
                            onClose();
                            onNavigate("dashboard");
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f6f3] transition-colors cursor-pointer group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                                {log.plantName}
                              </span>
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                                {log.action}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#52796f]">
                              {log.notes}
                            </span>
                          </div>

                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2d6a4f] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8faf8] border-t border-[#e2ece5] text-[11px] text-gray-500 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#2d6a4f]" />
            <span>Powered by <strong>Flora AI</strong> & semantic record indexing</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#2d6a4f] font-semibold hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

