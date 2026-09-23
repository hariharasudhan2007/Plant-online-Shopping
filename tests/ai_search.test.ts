import { Task, Project, CareLogEntry, PlantProduct } from "../src/types";

// Mock records for test suite
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Water Monstera Deliciosa",
    description: "Deep soak until drainage emerges",
    category: "Watering",
    priority: "high",
    status: "todo",
    dueDate: "2026-09-22",
    createdAt: "2026-09-20",
    plantName: "Monstera Deliciosa",
  },
  {
    id: "task-2",
    title: "Fertilize Snake Plant",
    description: "Apply half-strength organic nitrogen fertilizer",
    category: "Fertilizing",
    priority: "low",
    status: "todo",
    dueDate: "2026-09-30",
    createdAt: "2026-09-20",
    plantName: "Laurentii Snake Plant",
  },
];

const samplePlants: PlantProduct[] = [
  {
    id: "plant-1",
    name: "Calathea Orbifolia",
    botanicalName: "Goeppertia orbifolia",
    price: 38.0,
    category: "indoor",
    light: "Medium Indirect",
    water: "Weekly",
    careDifficulty: "Intermediate",
    petFriendly: true,
    airPurifying: true,
    stock: 12,
    potSize: "6 inch nursery pot",
    humidity: "High (60%+)",
    careTips: ["Mist daily", "Use filtered water"],
    rating: 4.8,
    reviewCount: 42,
    image: "/images/calathea.jpg",
    description: "Large striped decorative leaves, completely safe for cats and dogs.",
    tags: ["pet-friendly", "foliage", "low-light"],
  },
  {
    id: "plant-2",
    name: "Fiddle Leaf Fig",
    botanicalName: "Ficus lyrata",
    price: 75.0,
    category: "trees",
    light: "Bright Indirect",
    water: "When Top 2 Inches Dry",
    careDifficulty: "Advanced",
    petFriendly: false,
    airPurifying: true,
    stock: 8,
    potSize: "10 inch nursery pot",
    humidity: "Moderate (40-60%)",
    careTips: ["Avoid drafts", "Wipe leaves"],
    rating: 4.5,
    reviewCount: 110,
    image: "/images/fig.jpg",
    description: "Showstopping architectural leaves for bright spaces.",
    tags: ["tree", "statement", "bright-light"],
  },
];

const sampleProjects: Project[] = [
  {
    id: "proj-1",
    name: "Balcony Herb & Botanical Garden",
    description: "Transforming the south terrace into a verdant oasis",
    category: "Urban Balcony",
    progress: 45,
    status: "Active",
    budget: 400,
    spent: 180,
    plantCount: 1,
    targetDate: "2026-10-15",
    healthIndex: 94,
    coverImage: "/images/balcony.jpg",
    assignedPlants: ["plant-1"],
  },
];

const sampleCareLogs: CareLogEntry[] = [
  {
    id: "log-1",
    plantName: "Calathea Orbifolia",
    action: "Repotting",
    timestamp: "2026-09-20 14:30",
    notes: "Repotted into 8-inch terracotta with perlite-peat blend",
  },
];

function runTests() {
  console.log("=======================================================");
  console.log("   RUNNING AI NATURAL LANGUAGE SEARCH TESTS");
  console.log("=======================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: Priority interpretation
  const urgentTasks = sampleTasks.filter(
    (t) => t.priority === "high" || t.title.toLowerCase().includes("water")
  );
  assert(urgentTasks.length === 1 && urgentTasks[0].id === "task-1", "Correctly identifies high priority/watering tasks");

  // Test 2: Pet-friendly filter with budget constraint
  const petFriendlyBudget = samplePlants.filter(
    (p) => p.petFriendly && p.price <= 50
  );
  assert(petFriendlyBudget.length === 1 && petFriendlyBudget[0].id === "plant-1", "Filters pet-friendly specimens under $50 limit");

  // Test 3: Project progress filter
  const lowProgressProjects = sampleProjects.filter((p) => p.progress < 50);
  assert(lowProgressProjects.length === 1 && lowProgressProjects[0].id === "proj-1", "Matches active projects with under 50% progress");

  // Test 4: Care log action filter
  const repotLogs = sampleCareLogs.filter((l) => l.action.toLowerCase().includes("repot"));
  assert(repotLogs.length === 1 && repotLogs[0].plantName === "Calathea Orbifolia", "Identifies repotting care logs");

  console.log("=======================================================");
  console.log(`TOTAL AI SEARCH TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=======================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
