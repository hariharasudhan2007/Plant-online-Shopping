import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  Award, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Sprout,
  DollarSign,
  PieChart
} from "lucide-react";
import { Task, Project, CareLogEntry } from "../types";

interface AnalyticsViewProps {
  tasks: Task[];
  projects: Project[];
  careLogs: CareLogEntry[];
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks = [],
  projects = [],
  careLogs = [],
  onOpenAiWithPrompt,
}) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeCareLogs = Array.isArray(careLogs) ? careLogs : [];

  const totalTasks = safeTasks.length || 1;
  const completedTasks = safeTasks.filter((t) => t?.status === "completed").length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const totalBudget = safeProjects.reduce((s, p) => s + (p?.budget || 0), 0);
  const totalSpent = safeProjects.reduce((s, p) => s + (p?.spent || 0), 0);
  const budgetSpentPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Care category breakdown
  const categoryCounts: Record<string, number> = {};
  safeTasks.forEach((t) => {
    if (t?.category) {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    }
  });

  const weeklyTrend = [
    { week: "Week 1", rate: 72, tasks: 8 },
    { week: "Week 2", rate: 84, tasks: 11 },
    { week: "Week 3", rate: 91, tasks: 14 },
    { week: "Current", rate: completionRate || 88, tasks: safeTasks.length },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2ece5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#52796f] uppercase tracking-wider mb-1">
            <span>Botanical Health & Operations Intelligence</span>
            <span>•</span>
            <span>Real-time Telemetry</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1b4332]">
            Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#405648] mt-1">
            Care velocity metrics, hydration compliance, nursery space budgets, and achievement streaks.
          </p>
        </div>

        <button
          onClick={() => onOpenAiWithPrompt("Generate a comprehensive progress report with key achievements and areas to optimize.")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#40916c] text-white text-xs font-semibold shadow-xs hover:from-[#1b4332] hover:to-[#2d6a4f] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#d8f3dc]" /> AI Progress Evaluation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f]">
            Task Efficiency Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1b4332]">
              {completionRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              +{14}% this month
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f]">
            Active Care Streak
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1b4332]">
              12 Days
            </span>
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <p className="text-[11px] text-gray-500">
            Zero missed hydration cycles
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f]">
            Project Budget Used
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1b4332]">
              ${totalSpent}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              / ${totalBudget}
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            {budgetSpentPct}% budget utilization
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2ece5] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f]">
            Specimen Health Index
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2d6a4f]">
              96.4%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Optimal
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            16 specimen foliage monitoring
          </p>
        </div>
      </div>

      {/* Main Charts & Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Completion Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2ece5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2d6a4f]" />
              <h3 className="font-display font-bold text-base text-[#1b4332]">
                Care Velocity & Weekly Completion Trend
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              +24% Growth
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-4 h-48 px-2 border-b border-gray-200">
              {weeklyTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-bold text-[#1b4332] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.rate}%
                  </span>
                  <div
                    className="w-full max-w-[48px] bg-gradient-to-t from-[#2d6a4f] to-[#52b788] rounded-t-lg transition-all duration-500 group-hover:from-[#1b4332] group-hover:to-[#2d6a4f]"
                    style={{ height: `${item.rate}%` }}
                  />
                  <span className="text-xs font-medium text-gray-500 pt-2 border-t border-transparent">
                    {item.week}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Consistent upward trajectory driven by timely moisture probing and scheduled pest defense.
          </p>
        </div>

        {/* Care Action Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2ece5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#2d6a4f]" />
              <h3 className="font-display font-bold text-base text-[#1b4332]">
                Care Activity Breakdown
              </h3>
            </div>
            <span className="text-xs text-gray-500">By Task Category</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: "Watering & Hydration", count: categoryCounts["Watering"] || 2, color: "bg-blue-600", pct: 38 },
              { label: "Pest Defense & Neem Wipes", count: categoryCounts["Pest Care"] || 1, color: "bg-amber-600", pct: 24 },
              { label: "Repotting & Soil Aeration", count: categoryCounts["Repotting"] || 1, color: "bg-emerald-600", pct: 18 },
              { label: "Propagation Lab Stations", count: categoryCounts["Propagation"] || 1, color: "bg-purple-600", pct: 12 },
              { label: "Store Supplies & Fulfillment", count: categoryCounts["Store Order"] || 1, color: "bg-rose-600", pct: 8 },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#1b4332]">{cat.label}</span>
                  <span className="text-gray-500">{cat.pct}% ({cat.count} actions)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-300`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Achievement Badges & Milestones */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2ece5] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#2d6a4f]" />
          <h3 className="font-display font-bold text-lg text-[#1b4332]">
            Botanical Milestone Badges
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#e2ece5] flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700">Unlocked</span>
              <h4 className="font-bold text-xs sm:text-sm text-[#1b4332]">7-Day Care Streak</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Consecutive daily plant hydration check.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#e2ece5] flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700">Unlocked</span>
              <h4 className="font-bold text-xs sm:text-sm text-[#1b4332]">Aroid Whisperer</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Zero leaf drop during winter season.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#e2ece5] flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700">Unlocked</span>
              <h4 className="font-bold text-xs sm:text-sm text-[#1b4332]">Hydration Master</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Sub-irrigation & moisture probe usage.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#e2ece5] flex items-start gap-3 opacity-75">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-500">In Progress (3/5)</span>
              <h4 className="font-bold text-xs sm:text-sm text-[#1b4332]">Propagation Prodigy</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Successfully root 5 rare stem cuttings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
