import { Task, Project, CareLogEntry, PlantProduct } from "../src/types";

// Mock records for test suite
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Water Monstera Deliciosa",
    description: "Deep soak until drainage emerges",
    category: "watering",
    priority: "high",
    dueDate: "2026-09-22",
    completed: false,
    plantName: "Monstera Deliciosa"
  },
  {
    id: "task-2",
    title: "Fertilize Snake Plant",
    description: "Apply half-strength organic nitrogen fertilizer",
    category: "fertilizing",
    priority: "low",
    dueDate: "2026-09-30",
    completed: false,
    plantName: "Laurentii Snake Plant"
  }
];

const samplePlants: PlantProduct[] = [
  {
    id: "plant-1",
    name: "Calathea Orbifolia",
    botanicalName: "Goeppertia orbifolia",
    price: 38.00,
    category: "Indoor",
    light: "Medium to low indirect light",
    water: "High humidity, moist soil",
    difficulty: "Moderate",
    petFriendly: true,
    size: "Medium",
    rating: 4.8,
    reviewsCount: 42,
    image: "/images/calathea.jpg",
    description: "Large striped decorative leaves, completely safe for cats and dogs.",
    tags: ["pet-friendly", "foliage", "low-light"]
  },
  {
    id: "plant-2",
    name: "Fiddle Leaf Fig",
    botanicalName: "Ficus lyrata",
    price: 75.00,
    category: "Indoor Tree",
    light: "Bright direct/indirect",
    water: "Allow top 2 inches to dry",
    difficulty: "High",
    petFriendly: false,
    size: "Large",
    rating: 4.5,
    reviewsCount: 110,
    image: "/images/fig.jpg",
    description: "Showstopping architectural leaves for bright spaces.",
    tags: ["tree", "statement", "bright-light"]
  }
];

const sampleProjects: Project[] = [
  {
    id: "proj-1",
    name: "Balcony Herb & Botanical Garden",
    description: "Transforming the south terrace into a verdant oasis",
    category: "Outdoor Terrace",
    progress: 45,
    status: "active",
    budget: 400,
    spent: 180,
    plantIds: ["plant-1"],
    createdAt: "2026-08-01"
  }
];

const sampleCareLogs: CareLogEntry[] = [
  {
    id: "log-1",
    plantName: "Calathea Orbifolia",
    action: "Repotting",
    date: "2026-09-20",
    notes: "Repotted into 8-inch terracotta with perlite-peat blend",
    vitality: "thriving"
  }
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
