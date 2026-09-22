import { Task, Project, CareLogEntry } from "../types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Living Room Jungle Sanctuary",
    description: "Creating a multi-tiered indoor rainforest with statement aroids, humidification stations, and natural timber moss poles.",
    category: "Indoor Space",
    status: "Active",
    progress: 75,
    plantCount: 7,
    budget: 450,
    spent: 342,
    targetDate: "Next Month",
    healthIndex: 96,
    coverImage: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    assignedPlants: ["Monstera Deliciosa", "Fiddle Leaf Fig", "Calathea Orbifolia", "Golden Pothos"]
  },
  {
    id: "proj-2",
    name: "Aroid Rare Propagation Lab",
    description: "Selective propagation of rare variegated Philodendrons, Alocasias, and Monstera cultivars in perlite-pumice humidity cloches.",
    category: "Propagation Lab",
    status: "Active",
    progress: 50,
    plantCount: 5,
    budget: 320,
    spent: 215,
    targetDate: "In 2 Months",
    healthIndex: 92,
    coverImage: "https://images.unsplash.com/photo-1612363148436-a3e4210c441b?auto=format&fit=crop&w=800&q=80",
    assignedPlants: ["Philodendron Pink Princess", "Alocasia Polly", "Monstera Albo Cuttings"]
  },
  {
    id: "proj-3",
    name: "Balcony Herb & Wellness Garden",
    description: "Vertical culinary and pollinator haven featuring organic herbs, flowering companion plants, and eco drip irrigation.",
    category: "Urban Balcony",
    status: "Planning",
    progress: 25,
    plantCount: 4,
    budget: 200,
    spent: 60,
    targetDate: "Spring Peak",
    healthIndex: 100,
    coverImage: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    assignedPlants: ["Organic Lavender", "Sweet Basil", "Rosemary", "Peppermint"]
  },
  {
    id: "proj-4",
    name: "Sunlit Courtyard & Specimen Trees",
    description: "Architectural outdoor terrace sanctuary combining weeping Japanese Maples, ancient Tuscan Olive standards, and fragrant dwarf citrus trees.",
    category: "Outdoor Living",
    status: "Active",
    progress: 60,
    plantCount: 6,
    budget: 650,
    spent: 410,
    targetDate: "Summer Solstice",
    healthIndex: 98,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    assignedPlants: ["Japanese Red Laceleaf Maple", "Tuscan Mission Olive Tree", "Meyer Lemon Patio Tree", "Windmill Fan Palm Tree"]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-0",
    title: "Deep root drench & organic citrus feed for Meyer Lemon Tree",
    description: "Support heavy fruit set and continuous summer fragrant flowering with slow-release organic citrus nutrients.",
    category: "Fertilizing",
    priority: "urgent",
    status: "todo",
    dueDate: "Today",
    projectId: "proj-4",
    projectName: "Sunlit Courtyard & Specimen Trees",
    plantName: "Meyer Lemon Patio Tree",
    createdAt: "2026-09-15"
  },
  {
    id: "task-0b",
    title: "Hydrate organic cocopeat block & blend chunky aroid mix",
    description: "Expand 5kg compressed coco coir with 4 gallons warm water. Blend with pumice, perlite, and coarse coco husk chips for repotting.",
    category: "Repotting",
    priority: "high",
    status: "todo",
    dueDate: "Today",
    projectId: "proj-2",
    projectName: "Aroid Rare Propagation Lab",
    plantName: "Organic Cocopeat & Substrate",
    createdAt: "2026-09-16"
  },
  {
    id: "task-1",
    title: "Deep water & nutrient feed Monstera Deliciosa",
    description: "Soil meter reads 15% moisture. Dilute seaweed concentrate at half-strength and flush through until runoff drains.",
    category: "Watering",
    priority: "urgent",
    status: "todo",
    dueDate: "Today",
    projectId: "proj-1",
    projectName: "Living Room Jungle Sanctuary",
    plantName: "Monstera Deliciosa",
    createdAt: "2026-09-15"
  },
  {
    id: "task-2",
    title: "Foliage dusting & neem oil preventative wipe",
    description: "Inspect underside of Calathea and Alocasia leaves for early spider mites and clear microscopic dust.",
    category: "Pest Care",
    priority: "high",
    status: "todo",
    dueDate: "Tomorrow",
    projectId: "proj-1",
    projectName: "Living Room Jungle Sanctuary",
    plantName: "Calathea Orbifolia",
    createdAt: "2026-09-14"
  },
  {
    id: "task-3",
    title: "Transfer rooted Pink Princess cutting into chunky aroid mix",
    description: "Water propagation roots reached 2.5 inches. Move into chunky mix of orchid bark, perlite, pumice, and coco chips.",
    category: "Repotting",
    priority: "high",
    status: "in-progress",
    dueDate: "In 2 days",
    projectId: "proj-2",
    projectName: "Aroid Rare Propagation Lab",
    plantName: "Philodendron Pink Princess",
    createdAt: "2026-09-13"
  },
  {
    id: "task-4",
    title: "Rotate Fiddle Leaf Fig 90 degrees clockwise",
    description: "Encourages straight columnar trunk growth and prevents the upper canopy from leaning toward southwest window.",
    category: "Pruning",
    priority: "medium",
    status: "in-progress",
    dueDate: "In 3 days",
    projectId: "proj-1",
    projectName: "Living Room Jungle Sanctuary",
    plantName: "Fiddle Leaf Fig",
    createdAt: "2026-09-12"
  },
  {
    id: "task-5",
    title: "Check water reservoir in Self-Watering Planters",
    description: "Refill bottom reservoir for the trailing Pothos and Peperomia on the office bookshelf.",
    category: "Watering",
    priority: "medium",
    status: "completed",
    dueDate: "Yesterday",
    projectId: "proj-1",
    projectName: "Living Room Jungle Sanctuary",
    plantName: "Golden Pothos",
    createdAt: "2026-09-11",
    completedAt: "2026-09-15T18:30:00Z"
  },
  {
    id: "task-6",
    title: "Order organic worm castings and horticultural perlite",
    description: "Stock up on soil aerators and organic amendments before the scheduled weekend repotting session.",
    category: "Store Order",
    priority: "low",
    status: "completed",
    dueDate: "2 days ago",
    projectId: "proj-2",
    projectName: "Aroid Rare Propagation Lab",
    createdAt: "2026-09-10",
    completedAt: "2026-09-14T14:15:00Z"
  },
  {
    id: "task-7",
    title: "Inspect humidity levels in propagation cloche (target 70%+)",
    description: "Monitor digital hygrometer inside glass dome cloche and ventilate for 10 minutes to prevent fungal mold.",
    category: "Propagation",
    priority: "high",
    status: "todo",
    dueDate: "Today",
    projectId: "proj-2",
    projectName: "Aroid Rare Propagation Lab",
    plantName: "Philodendron Pink Princess",
    createdAt: "2026-09-15"
  }
];

export const INITIAL_CARE_LOGS: CareLogEntry[] = [
  {
    id: "log-1",
    plantName: "Golden Pothos",
    action: "Watering",
    timestamp: "Today at 09:15 AM",
    notes: "Bottom watered with distilled water, reservoir refilled."
  },
  {
    id: "log-2",
    plantName: "Sansevieria Laurentii",
    action: "Pest Care",
    timestamp: "Yesterday at 04:30 PM",
    notes: "Foliage wiped with gentle eco neem spray; zero pests observed."
  },
  {
    id: "log-3",
    plantName: "Philodendron Pink Princess",
    action: "Propagation",
    timestamp: "2 days ago",
    notes: "New secondary leaf unfurling with 40% neon pink variegation."
  },
  {
    id: "log-4",
    plantName: "Fiddle Leaf Fig",
    action: "Fertilizing",
    timestamp: "4 days ago",
    notes: "Applied balanced 3-1-2 organic plant food."
  }
];
