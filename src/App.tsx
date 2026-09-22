import React, { useState, useEffect } from "react";
import { AppView, PlantProduct, Task, Project, CareLogEntry, CartItem, TaskPriority, TaskStatus } from "./types";
import { PLANT_CATALOG } from "./data/plants";
import { INITIAL_TASKS, INITIAL_PROJECTS, INITIAL_CARE_LOGS } from "./data/initialData";

import { Navbar } from "./components/Navbar";
import { ShopView } from "./components/ShopView";
import { DashboardView } from "./components/DashboardView";
import { TaskManagementView } from "./components/TaskManagementView";
import { ProjectsView } from "./components/ProjectsView";
import { PrioritiesView } from "./components/PrioritiesView";
import { AnalyticsView } from "./components/AnalyticsView";
import { CartDrawer } from "./components/CartDrawer";
import { PlantDetailModal } from "./components/PlantDetailModal";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { AiChatbot } from "./components/AiChatbot";
import { SupabaseModal } from "./components/SupabaseModal";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { api, SupabaseStatus, MigrationResult } from "./services/api";

import { Sparkles, Check, Info } from "lucide-react";

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>("shop");

  // Core Data States (with safe localStorage recovery)
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem("verdant_tasks");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem("verdant_projects");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [careLogs, setCareLogs] = useState<CareLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem("verdant_care_logs");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_CARE_LOGS;
    } catch {
      return INITIAL_CARE_LOGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("verdant_cart");
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [
        { product: PLANT_CATALOG[0], quantity: 1 },
      ];
    } catch {
      return [{ product: PLANT_CATALOG[0], quantity: 1 }];
    }
  });

  // Modal / Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [selectedPlantDetail, setSelectedPlantDetail] = useState<PlantProduct | null>(null);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);

  // Supabase Status State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Check Supabase status and optionally hydrate from PostgreSQL
  const refreshSupabaseStatus = async () => {
    try {
      const st = await api.getSupabaseStatus();
      setSupabaseStatus(st);
      if (st.connected) {
        const [projRes, taskRes, logRes] = await Promise.all([
          api.getProjects(),
          api.getTasks(),
          api.getCareLogs(),
        ]);
        if (projRes.connected && projRes.data && projRes.data.length > 0) {
          setProjects(projRes.data);
        }
        if (taskRes.connected && taskRes.data && taskRes.data.length > 0) {
          setTasks(taskRes.data);
        }
        if (logRes.connected && logRes.data && logRes.data.length > 0) {
          setCareLogs(logRes.data);
        }
      }
    } catch (err) {
      console.warn("Could not query Supabase status:", err);
    }
  };

  useEffect(() => {
    refreshSupabaseStatus();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("verdant_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("verdant_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("verdant_care_logs", JSON.stringify(careLogs));
  }, [careLogs]);

  useEffect(() => {
    localStorage.setItem("verdant_cart", JSON.stringify(cart));
  }, [cart]);

  // Cart Handlers
  const handleAddToCart = (plant: PlantProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = (prev || []).find((item) => item.product.id === plant.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === plant.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...(prev || []), { product: plant, quantity }];
    });
    showToast(`Added "${plant.name}" (${quantity}) to nursery cart!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutSuccess = (generatedTasks: Task[]) => {
    setTasks((prev) => [...generatedTasks, ...prev]);
    setCart([]);
    generatedTasks.forEach((t) => api.saveTask(t));
    showToast(`Order placed! ${generatedTasks.length} unboxing & care tasks created.`);
  };

  // Task Handlers
  const handleToggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const nextStatus: TaskStatus = task.status === "completed" ? "todo" : "completed";
          const updated = { 
            ...task, 
            status: nextStatus,
            completedAt: nextStatus === "completed" ? new Date().toISOString() : undefined
          };
          api.saveTask(updated);
          return updated;
        }
        return task;
      })
    );
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updated = { 
            ...task, 
            status,
            completedAt: status === "completed" ? new Date().toISOString() : undefined
          };
          api.saveTask(updated);
          return updated;
        }
        return task;
      })
    );
  };

  const handleUpdateTaskPriority = (taskId: string, priority: TaskPriority) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updated = { ...task, priority };
          api.saveTask(updated);
          return updated;
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    api.deleteTask(taskId);
    showToast("Task removed from board.");
  };

  const handleAddTask = (newTaskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    api.saveTask(newTask);
    showToast(`Task "${newTask.title}" added to board!`);
  };

  // Project Handlers
  const handleAddProject = (newProjectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...newProjectData,
      id: `proj-${Date.now()}`,
    };
    setProjects((prev) => [...prev, newProject]);
    api.saveProject(newProject);
    showToast(`Project "${newProject.name}" created!`);
  };

  const handleAssignPlantToProject = (plantId: string, projectId: string) => {
    const plant = PLANT_CATALOG.find((p) => p.id === plantId);
    if (!plant) return;

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          if (!proj.assignedPlants.includes(plant.name)) {
            const updated = {
              ...proj,
              plantCount: proj.plantCount + 1,
              assignedPlants: [...proj.assignedPlants, plant.name],
            };
            api.saveProject(updated);
            return updated;
          }
        }
        return proj;
      })
    );
    showToast(`Assigned ${plant.name} to project!`);
  };

  // Care Log Handler
  const handleAddCareLog = (logData: Omit<CareLogEntry, "id">) => {
    const newLog: CareLogEntry = {
      ...logData,
      id: `log-${Date.now()}`,
    };
    setCareLogs((prev) => [newLog, ...prev]);
    api.saveCareLog(newLog);
    showToast("Care activity successfully logged.");
  };

  // AI Assistant Trigger with Prompt
  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiPrompt(prompt);
    setIsAiOpen(true);
  };

  const totalCartCount = (cart || []).reduce((acc, item) => acc + (item?.quantity || 0), 0);
  const urgentTasksCount = (tasks || []).filter((t) => t?.priority === "urgent" && t?.status !== "completed").length;

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-[#1b4332] flex flex-col font-sans selection:bg-[#2d6a4f]/20 selection:text-[#1b4332]">
      {/* Offline Connectivity Status Toast */}
      <OfflineIndicator />

      {/* Top Main Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        cartCount={totalCartCount}
        cartItems={cart}
        urgentTaskCount={urgentTasksCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={Boolean(supabaseStatus?.connected)}
      />

      {/* Main Content Area (with mobile bottom padding for safe area and tab bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-8">
        {/* Mobile PWA Install Banner */}
        <PWAInstallButton variant="banner" className="mb-4" />

        {currentView === "shop" && (
          <ShopView
            catalog={PLANT_CATALOG}
            plants={PLANT_CATALOG}
            onAddToCart={handleAddToCart}
            onSelectPlant={(plant) => setSelectedPlantDetail(plant)}
            projects={projects}
            onAssignToProject={handleAssignPlantToProject}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === "dashboard" && (
          <DashboardView
            tasks={tasks}
            projects={projects}
            careLogs={careLogs}
            onToggleTaskComplete={handleToggleTaskComplete}
            onNavigate={(view) => setCurrentView(view)}
            onOpenNewTaskModal={() => {
              setCurrentView("tasks");
              setTimeout(() => {
                document.getElementById("create-task-btn")?.click();
              }, 100);
            }}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
            onAddCareLog={handleAddCareLog}
          />
        )}

        {currentView === "tasks" && (
          <TaskManagementView
            tasks={tasks}
            projects={projects}
            onToggleComplete={handleToggleTaskComplete}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
          />
        )}

        {currentView === "projects" && (
          <ProjectsView
            projects={projects}
            tasks={tasks}
            onAddProject={handleAddProject}
            onNavigate={(view) => setCurrentView(view)}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
          />
        )}

        {currentView === "priorities" && (
          <PrioritiesView
            tasks={tasks}
            onToggleComplete={handleToggleTaskComplete}
            onUpdatePriority={handleUpdateTaskPriority}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
          />
        )}

        {currentView === "analytics" && (
          <AnalyticsView
            tasks={tasks}
            projects={projects}
            careLogs={careLogs}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
          />
        )}
      </main>

      {/* Floating AI Launcher Button (Desktop only - mobile has central button in bottom nav) */}
      <button
        onClick={() => setIsAiOpen(true)}
        id="floating-ai-button"
        aria-label="Ask Flora AI Assistant"
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-700/50 cursor-pointer group"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-[#d8f3dc] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="font-semibold text-xs sm:text-sm tracking-wide">
          Ask Flora AI
        </span>
      </button>

      {/* Mobile App Bottom Tab Bar (Fixed at bottom on phones / small tablets) */}
      <MobileBottomNav
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        cartCount={totalCartCount}
        urgentTaskCount={urgentTasksCount}
        projectCount={projects.length}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        onCheckoutSuccess={handleCheckoutSuccess}
        onOrderCompleted={(task) => handleCheckoutSuccess([task])}
        onNavigateToShop={() => {
          setIsCartOpen(false);
          setCurrentView("shop");
        }}
      />

      {/* Plant Details & Project Assignment Modal */}
      {selectedPlantDetail && (
        <PlantDetailModal
          plant={selectedPlantDetail}
          onClose={() => setSelectedPlantDetail(null)}
          onAddToCart={handleAddToCart}
          projects={projects}
          onAssignToProject={handleAssignPlantToProject}
          onAskAiAboutPlant={(plantName) => {
            handleOpenAiWithPrompt(`What are the optimal light, watering, and soil care requirements for ${plantName}?`);
          }}
        />
      )}

      {/* Global Spotlight Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        catalog={PLANT_CATALOG}
        tasks={tasks}
        projects={projects}
        careLogs={careLogs}
        onSelectPlant={(plant) => setSelectedPlantDetail(plant)}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Flora AI Copilot Chatbot */}
      <AiChatbot
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        tasks={tasks}
        projects={projects}
        cart={cart}
        onAddTask={handleAddTask}
        initialPrompt={aiPrompt}
        onClearInitialPrompt={() => setAiPrompt(undefined)}
      />

      {/* Supabase PostgreSQL Database & Migration Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        status={supabaseStatus}
        onRefreshStatus={refreshSupabaseStatus}
        projects={projects}
        tasks={tasks}
        careLogs={careLogs}
        plants={PLANT_CATALOG}
        onDataMigrated={(result) => {
          showToast(`Migrated ${result.migratedProjects} projects, ${result.migratedTasks} tasks, ${result.migratedCareLogs} care logs to Supabase!`);
          refreshSupabaseStatus();
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#1b4332] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg border border-emerald-600/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-[90vw] text-center">
          <Check className="w-4 h-4 text-[#d8f3dc] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#e2ece5] bg-white py-8 mt-12 text-xs text-[#52796f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-[#1b4332]">Verdant Botanical</span>
            <span>•</span>
            <span>Living Plant Commerce & Operations Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Guaranteed Healthy Nursery Arrival</span>
            <span>Eco-Friendly Organic Soil Blends</span>
            <span>Flora AI Integrated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
