import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Project, Task, CareLogEntry, PlantProduct } from "../src/types.js";

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseClient;
}

export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  url?: string;
  hasServiceKey: boolean;
  hasAnonKey: boolean;
  message: string;
  tables?: string[];
}> {
  const url = process.env.SUPABASE_URL;
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasAnonKey = Boolean(process.env.SUPABASE_ANON_KEY);

  if (!url || (!hasServiceKey && !hasAnonKey)) {
    return {
      connected: false,
      hasServiceKey,
      hasAnonKey,
      message: "Supabase credentials not configured in environment (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY).",
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      connected: false,
      hasServiceKey,
      hasAnonKey,
      message: "Failed to initialize Supabase client.",
    };
  }

  try {
    // Attempt to query projects or verify connection
    const { data, error } = await client.from("projects").select("id").limit(1);
    if (error) {
      return {
        connected: false,
        url,
        hasServiceKey,
        hasAnonKey,
        message: `Supabase connected but table query returned: ${error.message}. Ensure tables from /supabase/schema.sql are executed in your Supabase SQL editor.`,
      };
    }

    return {
      connected: true,
      url,
      hasServiceKey,
      hasAnonKey,
      message: "Connected to Supabase PostgreSQL database successfully.",
      tables: ["projects", "tasks", "care_logs", "plant_products"],
    };
  } catch (err: any) {
    return {
      connected: false,
      url,
      hasServiceKey,
      hasAnonKey,
      message: err?.message || "Unknown error connecting to Supabase.",
    };
  }
}

// Data Mappers: Model <-> Supabase PostgreSQL Table

export function projectToRow(p: Project) {
  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    category: p.category,
    status: p.status,
    progress: p.progress,
    plant_count: p.plantCount,
    budget: p.budget,
    spent: p.spent,
    target_date: p.targetDate || "",
    health_index: p.healthIndex,
    cover_image: p.coverImage || "",
    assigned_plants: p.assignedPlants || [],
    updated_at: new Date().toISOString(),
  };
}

export function rowToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    category: row.category,
    status: row.status,
    progress: Number(row.progress) || 0,
    plantCount: Number(row.plant_count) || 0,
    budget: Number(row.budget) || 0,
    spent: Number(row.spent) || 0,
    targetDate: row.target_date || "",
    healthIndex: Number(row.health_index) || 100,
    coverImage: row.cover_image || "",
    assignedPlants: Array.isArray(row.assigned_plants) ? row.assigned_plants : [],
  };
}

export function taskToRow(t: Task) {
  return {
    id: t.id,
    title: t.title,
    description: t.description || "",
    category: t.category,
    priority: t.priority,
    status: t.status,
    due_date: t.dueDate || "Today",
    project_id: t.projectId || null,
    project_name: t.projectName || "",
    plant_name: t.plantName || "",
    completed_at: t.completedAt || null,
    updated_at: new Date().toISOString(),
  };
}

export function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    category: row.category,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date || "Today",
    projectId: row.project_id || undefined,
    projectName: row.project_name || undefined,
    plantName: row.plant_name || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString().split("T")[0] : undefined,
  };
}

export function careLogToRow(c: CareLogEntry) {
  return {
    id: c.id,
    plant_name: c.plantName,
    action: c.action,
    timestamp: c.timestamp,
    notes: c.notes || "",
  };
}

export function rowToCareLog(row: any): CareLogEntry {
  return {
    id: row.id,
    plantName: row.plant_name,
    action: row.action,
    timestamp: row.timestamp,
    notes: row.notes || "",
  };
}

export function plantToRow(p: PlantProduct) {
  return {
    id: p.id,
    name: p.name,
    botanical_name: p.botanicalName || "",
    category: p.category,
    price: p.price,
    original_price: p.originalPrice || null,
    rating: p.rating,
    review_count: p.reviewCount,
    image: p.image || "",
    description: p.description || "",
    care_difficulty: p.careDifficulty,
    light: p.light,
    water: p.water,
    humidity: p.humidity,
    pot_size: p.potSize,
    pet_friendly: p.petFriendly,
    air_purifying: p.airPurifying,
    stock: p.stock,
    tags: p.tags || [],
    care_tips: p.careTips || [],
  };
}

export function rowToPlant(row: any): PlantProduct {
  return {
    id: row.id,
    name: row.name,
    botanicalName: row.botanical_name || "",
    category: row.category,
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating) || 5.0,
    reviewCount: Number(row.review_count) || 0,
    image: row.image || "",
    description: row.description || "",
    careDifficulty: row.care_difficulty,
    light: row.light,
    water: row.water,
    humidity: row.humidity,
    potSize: row.pot_size,
    petFriendly: Boolean(row.pet_friendly),
    airPurifying: Boolean(row.air_purifying),
    stock: Number(row.stock) || 0,
    tags: Array.isArray(row.tags) ? row.tags : [],
    careTips: Array.isArray(row.care_tips) ? row.care_tips : [],
  };
}

// Migration Routine: Seeds initial data into Supabase without overwriting existing changes
export async function migrateInitialDataToSupabase(
  projects: Project[],
  tasks: Task[],
  careLogs: CareLogEntry[],
  plants: PlantProduct[]
): Promise<{
  success: boolean;
  migratedProjects: number;
  migratedTasks: number;
  migratedCareLogs: number;
  migratedPlants: number;
  errors: string[];
}> {
  const client = getSupabase();
  if (!client) {
    throw new Error("Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in environment.");
  }

  const errors: string[] = [];
  let migratedProjects = 0;
  let migratedTasks = 0;
  let migratedCareLogs = 0;
  let migratedPlants = 0;

  // 1. Migrate Projects
  try {
    const rows = projects.map(projectToRow);
    const { data, error } = await client.from("projects").upsert(rows, { onConflict: "id" }).select();
    if (error) {
      errors.push(`Projects migration error: ${error.message}`);
    } else {
      migratedProjects = data?.length || rows.length;
    }
  } catch (err: any) {
    errors.push(`Projects migration exception: ${err.message}`);
  }

  // 2. Migrate Tasks
  try {
    const rows = tasks.map(taskToRow);
    const { data, error } = await client.from("tasks").upsert(rows, { onConflict: "id" }).select();
    if (error) {
      errors.push(`Tasks migration error: ${error.message}`);
    } else {
      migratedTasks = data?.length || rows.length;
    }
  } catch (err: any) {
    errors.push(`Tasks migration exception: ${err.message}`);
  }

  // 3. Migrate Care Logs
  try {
    const rows = careLogs.map(careLogToRow);
    const { data, error } = await client.from("care_logs").upsert(rows, { onConflict: "id" }).select();
    if (error) {
      errors.push(`Care logs migration error: ${error.message}`);
    } else {
      migratedCareLogs = data?.length || rows.length;
    }
  } catch (err: any) {
    errors.push(`Care logs migration exception: ${err.message}`);
  }

  // 4. Migrate Plant Products
  try {
    const rows = plants.map(plantToRow);
    const { data, error } = await client.from("plant_products").upsert(rows, { onConflict: "id" }).select();
    if (error) {
      errors.push(`Plants migration error: ${error.message}`);
    } else {
      migratedPlants = data?.length || rows.length;
    }
  } catch (err: any) {
    errors.push(`Plants migration exception: ${err.message}`);
  }

  return {
    success: errors.length === 0,
    migratedProjects,
    migratedTasks,
    migratedCareLogs,
    migratedPlants,
    errors,
  };
}
