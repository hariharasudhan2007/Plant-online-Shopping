import { Project, Task, CareLogEntry, PlantProduct, AiSearchResult } from "../types";

export interface SupabaseStatus {
  connected: boolean;
  url?: string;
  hasServiceKey?: boolean;
  hasAnonKey?: boolean;
  message: string;
  tables?: string[];
}

export interface MigrationResult {
  success: boolean;
  migratedProjects: number;
  migratedTasks: number;
  migratedCareLogs: number;
  migratedPlants: number;
  errors: string[];
}

export const api = {
  async getSupabaseStatus(): Promise<SupabaseStatus> {
    try {
      const res = await fetch("/api/supabase/status");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return {
        connected: false,
        message: err.message || "Failed to query backend Supabase status",
      };
    }
  },

  async getProjects(): Promise<{ connected: boolean; data: Project[] }> {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return { connected: false, data: [] };
    }
  },

  async saveProject(project: Project): Promise<Project | null> {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Could not save project to Supabase backend, keeping in local storage:", err);
      return null;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getTasks(): Promise<{ connected: boolean; data: Task[] }> {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return { connected: false, data: [] };
    }
  },

  async saveTask(task: Task): Promise<Task | null> {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Could not save task to Supabase backend, keeping in local storage:", err);
      return null;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getCareLogs(): Promise<{ connected: boolean; data: CareLogEntry[] }> {
    try {
      const res = await fetch("/api/care-logs");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return { connected: false, data: [] };
    }
  },

  async saveCareLog(log: CareLogEntry): Promise<CareLogEntry | null> {
    try {
      const res = await fetch("/api/care-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Could not save care log to Supabase backend, keeping in local storage:", err);
      return null;
    }
  },

  async deleteCareLog(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/care-logs/${id}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getPlants(): Promise<{ connected: boolean; data: PlantProduct[] }> {
    try {
      const res = await fetch("/api/plants");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return { connected: false, data: [] };
    }
  },

  async migrateData(payload: {
    projects: Project[];
    tasks: Task[];
    careLogs: CareLogEntry[];
    plants: PlantProduct[];
  }): Promise<MigrationResult> {
    const res = await fetch("/api/supabase/migrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Migration failed with status ${res.status}`);
    }
    return await res.json();
  },

  async searchRecordsWithAi(
    query: string,
    records: {
      tasks?: Task[];
      projects?: Project[];
      careLogs?: CareLogEntry[];
      plants?: PlantProduct[];
    }
  ): Promise<AiSearchResult> {
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, records }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Search failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.warn("AI search request failed:", err);
      throw err;
    }
  },
};
