export type PlantCategory = 
  | "all"
  | "indoor"
  | "outdoor"
  | "trees"
  | "pots"
  | "care-supplies"
  | "low-light"
  | "pet-friendly"
  | "rare"
  | "succulents";

export type CareDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type LightRequirement = "Low Light" | "Medium Indirect" | "Bright Indirect" | "Direct Sun";
export type WaterRequirement = "Every 2-3 Weeks" | "Weekly" | "Twice Weekly" | "When Top 2 Inches Dry";

export interface PlantProduct {
  id: string;
  name: string;
  botanicalName: string;
  category: PlantCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  careDifficulty: CareDifficulty;
  light: LightRequirement;
  water: WaterRequirement;
  humidity: string;
  potSize: string; // e.g. "6 inch nursery pot"
  petFriendly: boolean;
  airPurifying: boolean;
  stock: number;
  tags: string[];
  careTips: string[];
}

export interface CartItem {
  product: PlantProduct;
  quantity: number;
  selectedPotColor?: string;
}

export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskCategory = 
  | "Watering" 
  | "Fertilizing" 
  | "Repotting" 
  | "Pest Care" 
  | "Pruning" 
  | "Propagation" 
  | "Store Order";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  projectId?: string;
  projectName?: string;
  plantName?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: "Indoor Space" | "Outdoor Living" | "Urban Balcony" | "Aroid Nursery" | "Propagation Lab" | "Commercial Green";
  status: "Active" | "Planning" | "Completed";
  progress: number; // 0 - 100
  plantCount: number;
  budget: number;
  spent: number;
  targetDate: string;
  healthIndex: number; // e.g. 96%
  coverImage: string;
  assignedPlants: string[];
}

export interface CareLogEntry {
  id: string;
  plantName: string;
  action: TaskCategory;
  timestamp: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestedTasks?: Array<{
    title: string;
    priority: TaskPriority;
    category: TaskCategory;
    project?: string;
    dueDate?: string;
  }>;
}

export type AppView = "shop" | "dashboard" | "tasks" | "projects" | "priorities" | "analytics";

export interface AiSearchResultItem {
  id: string;
  reason: string;
}

export interface AiSearchResult {
  summary: string;
  matchedTasks: AiSearchResultItem[];
  matchedProjects: AiSearchResultItem[];
  matchedPlants: AiSearchResultItem[];
  matchedCareLogs: AiSearchResultItem[];
  interpretedFilters?: {
    priorities?: string[];
    categories?: string[];
    status?: string[];
    isPetFriendly?: boolean;
    budgetLimit?: number;
  };
}

