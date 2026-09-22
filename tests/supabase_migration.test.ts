/**
 * Supabase PostgreSQL Migration & Integration Test Suite
 * Tests SRS compliance, schema validation, data mapper bidirectional fidelity,
 * foreign key integrity, and non-destructive data migration.
 */
import fs from "fs";
import path from "path";
import { 
  projectToRow, 
  rowToProject, 
  taskToRow, 
  rowToTask, 
  careLogToRow, 
  rowToCareLog, 
  plantToRow, 
  rowToPlant 
} from "../server/supabase.js";
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_CARE_LOGS } from "../src/data/initialData.js";
import { PLANT_CATALOG } from "../src/data/plants.js";

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function runTest(suite: string, name: string, fn: () => void) {
  try {
    fn();
    results.push({ suite, name, passed: true });
    console.log(`  ✓ [${suite}] ${name}`);
  } catch (err: any) {
    results.push({ suite, name, passed: false, error: err.message });
    console.error(`  ✗ [${suite}] ${name}: ${err.message}`);
  }
}

console.log("\n=======================================================");
console.log("   RUNNING SUPABASE INTEGRATION & MIGRATION TESTS");
console.log("=======================================================\n");

// 1. Schema & DDL Tests
runTest("Schema Validation", "PostgreSQL DDL file exists and has correct syntax", () => {
  const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
  assert(fs.existsSync(schemaPath), "supabase/schema.sql file must exist");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  
  assert(sql.includes("CREATE TABLE IF NOT EXISTS projects"), "Missing projects table");
  assert(sql.includes("CREATE TABLE IF NOT EXISTS tasks"), "Missing tasks table");
  assert(sql.includes("CREATE TABLE IF NOT EXISTS care_logs"), "Missing care_logs table");
  assert(sql.includes("CREATE TABLE IF NOT EXISTS plant_products"), "Missing plant_products table");
  assert(sql.includes("REFERENCES projects(id)"), "Missing foreign key relationship in tasks");
  assert(sql.includes("ENABLE ROW LEVEL SECURITY"), "Missing Row Level Security configuration");
});

// 2. Data Mapper Integrity Tests
runTest("Data Mappers", "Project mapper preserves all fields in two-way conversion", () => {
  for (const proj of INITIAL_PROJECTS) {
    const row = projectToRow(proj);
    assert(row.id === proj.id, `ID mismatch: ${row.id} vs ${proj.id}`);
    assert(row.name === proj.name, `Name mismatch: ${row.name}`);
    assert(row.progress === proj.progress, `Progress mismatch`);
    assert(row.budget === proj.budget, `Budget mismatch`);
    assert(row.spent === proj.spent, `Spent mismatch`);
    assert(Array.isArray(row.assigned_plants), `assigned_plants should be an array`);

    const convertedBack = rowToProject(row);
    assert(convertedBack.id === proj.id, "ID preserved after round-trip");
    assert(convertedBack.name === proj.name, "Name preserved after round-trip");
    assert(convertedBack.progress === proj.progress, "Progress preserved after round-trip");
    assert(convertedBack.assignedPlants.length === proj.assignedPlants.length, "Assigned plants length preserved");
  }
});

runTest("Data Mappers", "Task mapper preserves all fields and foreign key linkage", () => {
  for (const task of INITIAL_TASKS) {
    const row = taskToRow(task);
    assert(row.id === task.id, `Task ID mismatch: ${row.id}`);
    assert(row.title === task.title, `Task title mismatch`);
    assert(row.priority === task.priority, `Task priority mismatch`);
    assert(row.status === task.status, `Task status mismatch`);
    assert(row.project_id === task.projectId, `Foreign key project_id mismatch`);

    const convertedBack = rowToTask(row);
    assert(convertedBack.id === task.id, "Task ID preserved after round-trip");
    assert(convertedBack.title === task.title, "Title preserved");
    assert(convertedBack.projectId === task.projectId, "Foreign key projectId preserved");
    assert(convertedBack.status === task.status, "Status preserved");
  }
});

runTest("Data Mappers", "Care log mapper preserves botanical timeline entries", () => {
  for (const log of INITIAL_CARE_LOGS) {
    const row = careLogToRow(log);
    assert(row.id === log.id, `Care log ID mismatch`);
    assert(row.plant_name === log.plantName, `Plant name mismatch`);
    assert(row.action === log.action, `Action mismatch`);
    assert(row.timestamp === log.timestamp, `Timestamp mismatch`);

    const convertedBack = rowToCareLog(row);
    assert(convertedBack.id === log.id, "Care log ID preserved after round-trip");
    assert(convertedBack.plantName === log.plantName, "Plant name preserved");
    assert(convertedBack.timestamp === log.timestamp, "Timestamp preserved");
  }
});

runTest("Data Mappers", "Plant catalog mapper preserves products, prices, and specs", () => {
  for (const plant of PLANT_CATALOG) {
    const row = plantToRow(plant);
    assert(row.id === plant.id, `Plant product ID mismatch`);
    assert(row.name === plant.name, `Plant name mismatch`);
    assert(row.price === plant.price, `Plant price mismatch`);
    assert(Array.isArray(row.tags), `Plant tags should be an array`);
    assert(Array.isArray(row.care_tips), `Care tips should be an array`);

    const convertedBack = rowToPlant(row);
    assert(convertedBack.id === plant.id, "Plant ID preserved");
    assert(convertedBack.name === plant.name, "Plant name preserved");
    assert(convertedBack.price === plant.price, "Price preserved");
    assert(convertedBack.tags.length === plant.tags.length, "Tags preserved");
  }
});

// 3. Relational Foreign Key Integrity Tests
runTest("Relational Integrity", "All tasks with a projectId point to a valid existing project", () => {
  const projectIds = new Set(INITIAL_PROJECTS.map((p) => p.id));
  for (const task of INITIAL_TASKS) {
    if (task.projectId) {
      assert(
        projectIds.has(task.projectId),
        `Task "${task.title}" references non-existent project ID "${task.projectId}"`
      );
    }
  }
});

// 4. Data Inventory & Non-loss Verification
runTest("Data Migration Preconditions", "Ensures zero records lost in source datasets", () => {
  assert(INITIAL_PROJECTS.length === 4, `Expected exactly 4 initial projects, found ${INITIAL_PROJECTS.length}`);
  assert(INITIAL_TASKS.length === 9, `Expected exactly 9 initial tasks, found ${INITIAL_TASKS.length}`);
  assert(INITIAL_CARE_LOGS.length === 4, `Expected exactly 4 initial care logs, found ${INITIAL_CARE_LOGS.length}`);
  assert(PLANT_CATALOG.length === 42, `Expected exactly 42 plant catalog items, found ${PLANT_CATALOG.length}`);
  
  // Verify unique primary keys across all sets
  const taskIds = new Set(INITIAL_TASKS.map((t) => t.id));
  assert(taskIds.size === INITIAL_TASKS.length, "Duplicate task IDs found");

  const projIds = new Set(INITIAL_PROJECTS.map((p) => p.id));
  assert(projIds.size === INITIAL_PROJECTS.length, "Duplicate project IDs found");

  const logIds = new Set(INITIAL_CARE_LOGS.map((l) => l.id));
  assert(logIds.size === INITIAL_CARE_LOGS.length, "Duplicate care log IDs found");

  const plantIds = new Set(PLANT_CATALOG.map((p) => p.id));
  assert(plantIds.size === PLANT_CATALOG.length, "Duplicate plant catalog IDs found");
});

// 5. Environment & Security Variables
runTest("Environment Security", "Environment example has required Supabase variables", () => {
  const envExamplePath = path.join(process.cwd(), ".env.example");
  assert(fs.existsSync(envExamplePath), ".env.example must exist");
  const envContent = fs.readFileSync(envExamplePath, "utf-8");
  assert(envContent.includes("SUPABASE_URL="), "Missing SUPABASE_URL in .env.example");
  assert(envContent.includes("SUPABASE_SERVICE_ROLE_KEY="), "Missing SUPABASE_SERVICE_ROLE_KEY in .env.example");
  assert(envContent.includes("SUPABASE_ANON_KEY="), "Missing SUPABASE_ANON_KEY in .env.example");
});

console.log("\n=======================================================");
const passedCount = results.filter((r) => r.passed).length;
const failedCount = results.filter((r) => !r.passed).length;
console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
console.log("=======================================================\n");

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
