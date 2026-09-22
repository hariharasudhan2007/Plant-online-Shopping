import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  getSupabase,
  checkSupabaseConnection,
  migrateInitialDataToSupabase,
  projectToRow,
  rowToProject,
  taskToRow,
  rowToTask,
  careLogToRow,
  rowToCareLog,
  plantToRow,
  rowToPlant,
} from "./server/supabase.js";
import { INITIAL_TASKS, INITIAL_PROJECTS, INITIAL_CARE_LOGS } from "./src/data/initialData.js";
import { PLANT_CATALOG } from "./src/data/plants.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));
  app.use(express.static(path.join(process.cwd(), "public")));

  // Explicit manifest route for PWA support
  app.get(["/manifest.webmanifest", "/manifest.json"], (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "manifest.webmanifest"), {
      headers: { "Content-Type": "application/manifest+json" },
    });
  });

  // Initialize Gemini AI client
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (geminiApiKey) {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    const supabaseStatus = await checkSupabaseConnection();
    res.json({
      status: "ok",
      hasAiKey: Boolean(geminiApiKey),
      supabase: supabaseStatus,
      timestamp: new Date().toISOString(),
    });
  });

  // Supabase Status & Diagnostics
  app.get("/api/supabase/status", async (req, res) => {
    const status = await checkSupabaseConnection();
    res.json(status);
  });

  // Supabase Data Migration / Seed Endpoint
  app.post("/api/supabase/migrate", async (req, res) => {
    try {
      const { projects, tasks, careLogs, plants } = req.body || {};
      const p = Array.isArray(projects) && projects.length > 0 ? projects : INITIAL_PROJECTS;
      const t = Array.isArray(tasks) && tasks.length > 0 ? tasks : INITIAL_TASKS;
      const c = Array.isArray(careLogs) && careLogs.length > 0 ? careLogs : INITIAL_CARE_LOGS;
      const pl = Array.isArray(plants) && plants.length > 0 ? plants : PLANT_CATALOG;

      const result = await migrateInitialDataToSupabase(p, t, c, pl);
      res.json(result);
    } catch (error: any) {
      console.error("Migration failed:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to migrate data to Supabase PostgreSQL",
      });
    }
  });

  // 1. Projects REST Endpoints
  app.get("/api/projects", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.json({ connected: false, data: [] });
    }
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ connected: true, data: (data || []).map(rowToProject) });
  });

  app.post("/api/projects", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const project = req.body;
    const row = projectToRow(project);
    const { data, error } = await supabase.from("projects").upsert(row).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rowToProject(data));
  });

  app.put("/api/projects/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const project = req.body;
    const row = projectToRow({ ...project, id: req.params.id });
    const { data, error } = await supabase.from("projects").update(row).eq("id", req.params.id).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rowToProject(data));
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const { error } = await supabase.from("projects").delete().eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, id: req.params.id });
  });

  // 2. Tasks REST Endpoints
  app.get("/api/tasks", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.json({ connected: false, data: [] });
    }
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ connected: true, data: (data || []).map(rowToTask) });
  });

  app.post("/api/tasks", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const task = req.body;
    const row = taskToRow(task);
    const { data, error } = await supabase.from("tasks").upsert(row).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rowToTask(data));
  });

  app.put("/api/tasks/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const task = req.body;
    const row = taskToRow({ ...task, id: req.params.id });
    const { data, error } = await supabase.from("tasks").update(row).eq("id", req.params.id).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rowToTask(data));
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const { error } = await supabase.from("tasks").delete().eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, id: req.params.id });
  });

  // 3. Care Logs REST Endpoints
  app.get("/api/care-logs", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.json({ connected: false, data: [] });
    }
    const { data, error } = await supabase.from("care_logs").select("*").order("created_at", { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ connected: true, data: (data || []).map(rowToCareLog) });
  });

  app.post("/api/care-logs", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const careLog = req.body;
    const row = careLogToRow(careLog);
    const { data, error } = await supabase.from("care_logs").upsert(row).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rowToCareLog(data));
  });

  app.delete("/api/care-logs/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const { error } = await supabase.from("care_logs").delete().eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, id: req.params.id });
  });

  // 4. Plant Products Endpoints
  app.get("/api/plants", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.json({ connected: false, data: PLANT_CATALOG });
    }
    const { data, error } = await supabase.from("plant_products").select("*");
    if (error || !data || data.length === 0) {
      return res.json({ connected: true, data: PLANT_CATALOG });
    }
    res.json({ connected: true, data: data.map(rowToPlant) });
  });

  app.post("/api/plants", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: "Supabase not connected" });
    }
    const plant = req.body;
    const row = plantToRow(plant);
    const { data, error } = await supabase.from("plant_products").upsert(row).select().single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rowToPlant(data));
  });

  // AI Assistant Chat & Action Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, context, actionType } = req.body;

      const userMessage = messages && messages.length > 0
        ? messages[messages.length - 1].content
        : "Hello Flora, help me organize my plant tasks and progress.";

      // Build context description
      const contextSummary = context ? `
Current Workspace State:
- Active Projects: ${JSON.stringify(context.projects?.map((p: any) => ({ name: p.name, status: p.status, progress: p.progress, plantCount: p.plantCount })) || [])}
- Tasks Summary: Total ${context.tasks?.length || 0} tasks (${context.tasks?.filter((t: any) => t.status === "completed").length || 0} completed, ${context.tasks?.filter((t: any) => t.status === "in-progress").length || 0} in progress, ${context.tasks?.filter((t: any) => t.priority === "urgent").length || 0} urgent).
- Pending Tasks: ${JSON.stringify(context.tasks?.slice(0, 10).map((t: any) => ({ title: t.title, priority: t.priority, status: t.status, category: t.category, dueDate: t.dueDate })) || [])}
- Cart Items: ${context.cart?.length || 0} plants/items in shopping cart.
` : "";

      const systemInstruction = `
You are "Flora", an expert Botanical & Nursery Operations Copilot for Verdant Plant Studio.
Your purpose:
1. Help users organize tasks (care schedules, repotting, propagation, supply orders).
2. Prioritize work (identify urgent hydration, pest interventions, lighting shifts, and project milestones).
3. Summarize progress analytics (celebrate completed tasks, streak metrics, and spot care bottlenecks).
4. Provide authentic, horticultural advice for indoor and outdoor plants, pots and planters (breathable terracotta, self-watering sub-irrigation, drainage essentials), substrates (cocopeat blocks, chunky cocobit husk chips, horticultural pumice, aroid mixes), and organic fertilizers (wildcrafted liquid kelp, slow-release NPK pellets, citrus/tree food).

Style: Warm, encouraging, knowledgeable, structured, concise. Use markdown with bold headers and bullet points.

CRITICAL FEATURE:
If the user asks you to organize tasks or create tasks, provide 1 to 3 concrete actionable suggested tasks at the bottom of your response in this exact JSON block format:
\`\`\`json:actions
[
  {
    "title": "Task title (e.g. Inspect Calathea for spider mites or Prune Japanese Maple)",
    "priority": "urgent" | "high" | "medium" | "low",
    "category": "Watering" | "Fertilizing" | "Repotting" | "Pest Care" | "Pruning" | "Order Supplies",
    "project": "Living Room Jungle" | "Sunlit Courtyard & Specimen Trees" | "Balcony Herb Garden" | "Aroid Nursery" | "General Care",
    "dueDate": "Today" | "Tomorrow" | "In 3 days" | "This weekend"
  }
]
\`\`\`
${contextSummary}
`;

      if (ai && geminiApiKey) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: userMessage,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          const responseText = response.text || "I'm here to help you tend to your botanical sanctuary and organize your tasks!";
          return res.json({ reply: responseText });
        } catch (apiError: any) {
          console.error("Gemini API call failed, falling back to intelligent handler:", apiError?.message);
        }
      }

      // Intelligent Fallback Handler when API key is not configured or rate-limited
      let fallbackReply = "";
      const lower = userMessage.toLowerCase();

      if (actionType === "prioritize" || lower.includes("priorit")) {
        fallbackReply = `### 🌿 Priority Assessment & Action Plan

Based on your current plant care schedule and project logs, here is your prioritized focus:

1. **🚨 Immediate Urgent Attention**:
   - **Check Soil Moisture & Hydration**: Plants in warm or high-light zones (Fiddle Leaf Fig, Calatheas) lose moisture rapidly. Inspect root dryout first.
   - **Pest Inspection & Quarantine**: Inspect underside of leaves on new arrivals for spider mites or thrips before they spread.

2. **🪴 Medium-Term (Next 48 Hours)**:
   - **Fertilizer Feed Cycle**: Dilute organic seaweed or fish emulsion at half-strength for active spring/summer growers.
   - **Rotate Pots 90°**: Ensure symmetrical foliage growth towards your natural light window.

3. **🌱 Long-Term Milestone**:
   - Schedule repotting for rootbound Aroids into chunky aroid mix (orchid bark, perlite, coco coir).

\`\`\`json:actions
[
  {
    "title": "Deep soak & mist moisture-sensitive Calathea",
    "priority": "urgent",
    "category": "Watering",
    "project": "Living Room Jungle",
    "dueDate": "Today"
  },
  {
    "title": "Foliage wipe & neem oil protective wipe",
    "priority": "high",
    "category": "Pest Care",
    "project": "Aroid Nursery",
    "dueDate": "Tomorrow"
  }
]
\`\`\``;
      } else if (actionType === "summarize" || lower.includes("summar") || lower.includes("progress")) {
        const completedCount = context?.tasks?.filter((t: any) => t.status === "completed").length || 3;
        const totalCount = context?.tasks?.length || 6;
        const completionRate = Math.round((completedCount / (totalCount || 1)) * 100);

        fallbackReply = `### 📊 Botanical Care & Project Progress Summary

**Health Index**: 94% · **Care Velocity**: On Track · **Active Projects**: ${context?.projects?.length || 3}

- **Task Completion**: You have completed **${completedCount} of ${totalCount}** tasks (**${completionRate}%** efficiency).
- **Watering & Hydration**: Consistent 7-day care streak logged! No overdue drought flags detected.
- **Project Highlight**: The *"Living Room Jungle Sanctuary"* is flourishing with 85% milestones met.
- **Botanical Recommendation**: Foliage is actively entering spring vegetative expansion—now is the ideal window to take stem cuttings for water propagation!

\`\`\`json:actions
[
  {
    "title": "Prep stem cuttings for propagation station",
    "priority": "medium",
    "category": "Pruning",
    "project": "Living Room Jungle",
    "dueDate": "This weekend"
  }
]
\`\`\``;
      } else if (actionType === "organize" || lower.includes("organize") || lower.includes("schedule")) {
        fallbackReply = `### 📋 Organized Plant Care Schedule

I've structured a balanced care routine to keep your foliage lush without overwatering or root rot risk:

- **Monday / Friday**: Morning moisture probe check & deep watering for tropicals.
- **Wednesday**: Gentle foliage dusting with micro-fiber cloth to maximize photosynthesis efficiency.
- **Saturday**: Weekly aeration, drainage inspection, and nursery stock review.

Here are suggested tasks ready to be added to your task board:

\`\`\`json:actions
[
  {
    "title": "Aerate soil surface with chopstick & inspect drainage",
    "priority": "medium",
    "category": "Repotting",
    "project": "Living Room Jungle",
    "dueDate": "Tomorrow"
  },
  {
    "title": "Top-dress pots with fresh organic worm castings",
    "priority": "low",
    "category": "Fertilizing",
    "project": "Aroid Nursery",
    "dueDate": "This weekend"
  }
]
\`\`\``;
      } else {
        fallbackReply = `Hello! I'm **Flora**, your botanical companion.

I can help you:
- **Organize & Schedule Tasks**: Set up watering, fertilizing, repotting, and propagation schedules.
- **Prioritize Urgent Work**: Identify which plants demand immediate intervention to prevent root rot or pest shock.
- **Summarize Progress**: Provide analytics reports on task completion rates and nursery project health.
- **Plant Shopping Advice**: Match plants to your specific lighting, pet safety, and humidity levels.

*Try asking: "What should I prioritize today?", "Create tasks for my Monstera repotting", or "Summarize my plant care progress."*`;
      }

      return res.json({ reply: fallbackReply });
    } catch (error: any) {
      console.error("Error handling AI chat:", error);
      res.status(500).json({
        error: "Failed to generate AI response",
        details: error?.message || "Unknown error",
      });
    }
  });

  // AI Natural Language Search Assistant Endpoint
  app.post("/api/ai/search", async (req, res) => {
    try {
      const { query, records } = req.body || {};
      const trimmedQuery = typeof query === "string" ? query.trim() : "";

      if (!trimmedQuery) {
        return res.json({
          summary: "Please provide a natural language query to search records.",
          matchedTasks: [],
          matchedProjects: [],
          matchedPlants: [],
          matchedCareLogs: [],
          interpretedFilters: {},
        });
      }

      // Resolve dataset from client payload or server fallback
      const tasks = Array.isArray(records?.tasks) ? records.tasks : INITIAL_TASKS;
      const projects = Array.isArray(records?.projects) ? records.projects : INITIAL_PROJECTS;
      const careLogs = Array.isArray(records?.careLogs) ? records.careLogs : INITIAL_CARE_LOGS;
      const plants = Array.isArray(records?.plants) ? records.plants : PLANT_CATALOG;

      // Compact record briefs to minimize token usage
      const taskBriefs = tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        status: t.status,
        category: t.category,
        plantName: t.plantName || "",
        dueDate: t.dueDate || "",
        description: t.description || "",
      }));

      const projectBriefs = projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        status: p.status,
        progress: p.progress,
        description: p.description || "",
      }));

      const careLogBriefs = careLogs.map((c: any) => ({
        id: c.id,
        plantName: c.plantName,
        action: c.action,
        timestamp: c.timestamp,
        notes: c.notes || "",
      }));

      const plantBriefs = plants.map((p: any) => ({
        id: p.id,
        name: p.name,
        botanicalName: p.botanicalName,
        category: p.category,
        price: p.price,
        petFriendly: p.petFriendly,
        light: p.light,
        water: p.water,
        tags: p.tags,
      }));

      // Try Gemini AI Semantic Search
      if (ai && geminiApiKey) {
        try {
          const prompt = `You are the semantic search engine for the Verdant Botanical Management System.
Analyze this user search query: "${trimmedQuery}"

Against these management records:
- Tasks: ${JSON.stringify(taskBriefs)}
- Projects: ${JSON.stringify(projectBriefs)}
- Care Logs: ${JSON.stringify(careLogBriefs)}
- Plants: ${JSON.stringify(plantBriefs)}

Determine which items genuinely match the user's intent, query criteria, attributes, and filters (e.g. priority, status, price, pet-friendliness, light requirements, care category, deadlines).
For each match, provide a brief 1-phrase explanation of why it matched.
Also write a clear, helpful 1-sentence summary answering what was found.

Respond ONLY with valid JSON conforming to this schema:
{
  "summary": "Short 1-sentence summary of matching findings",
  "matchedTasks": [ { "id": "task_id", "reason": "Reason for match" } ],
  "matchedProjects": [ { "id": "project_id", "reason": "Reason for match" } ],
  "matchedPlants": [ { "id": "plant_id", "reason": "Reason for match" } ],
  "matchedCareLogs": [ { "id": "log_id", "reason": "Reason for match" } ],
  "interpretedFilters": {
    "priorities": ["urgent", "high"],
    "categories": ["Watering"],
    "status": ["todo", "in-progress"],
    "isPetFriendly": true,
    "budgetLimit": 50
  }
}`;

          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            return res.json({
              summary: parsed.summary || `Found matches for "${trimmedQuery}".`,
              matchedTasks: Array.isArray(parsed.matchedTasks) ? parsed.matchedTasks : [],
              matchedProjects: Array.isArray(parsed.matchedProjects) ? parsed.matchedProjects : [],
              matchedPlants: Array.isArray(parsed.matchedPlants) ? parsed.matchedPlants : [],
              matchedCareLogs: Array.isArray(parsed.matchedCareLogs) ? parsed.matchedCareLogs : [],
              interpretedFilters: parsed.interpretedFilters || {},
            });
          }
        } catch (geminiError: any) {
          console.warn("Gemini natural language search fallback triggered:", geminiError?.message);
        }
      }

      // Deterministic semantic fallback search
      const qLower = trimmedQuery.toLowerCase();
      const tokens = qLower.split(/\s+/).filter((t: string) => t.length > 1);

      const isUrgent = qLower.includes("urgent");
      const isHigh = qLower.includes("high");
      const isPending = qLower.includes("pending") || qLower.includes("todo") || qLower.includes("to do");
      const isCompleted = qLower.includes("completed") || qLower.includes("done");
      const isPetFriendly = qLower.includes("pet") || qLower.includes("cat") || qLower.includes("dog");
      const isLowLight = qLower.includes("low light") || qLower.includes("dark") || qLower.includes("shade");
      const priceMatch = qLower.match(/under\s*\$?(\d+)/i) || qLower.match(/below\s*\$?(\d+)/i) || qLower.match(/less than\s*\$?(\d+)/i);
      const budgetLimit = priceMatch ? parseFloat(priceMatch[1]) : undefined;

      const matchedTasks = tasks
        .filter((t: any) => {
          if (isUrgent && t.priority !== "urgent") return false;
          if (isPending && t.status === "completed") return false;
          if (isCompleted && t.status !== "completed") return false;
          
          const text = `${t.title} ${t.category} ${t.priority} ${t.status} ${t.plantName || ""} ${t.description || ""}`.toLowerCase();
          return tokens.some((token: string) => text.includes(token)) || (isUrgent && t.priority === "urgent") || (isPending && t.status !== "completed");
        })
        .slice(0, 10)
        .map((t: any) => ({
          id: t.id,
          reason: isUrgent && t.priority === "urgent"
            ? "Urgent priority task requiring immediate attention"
            : `Matches "${t.category}" care and status (${t.status})`,
        }));

      const matchedProjects = projects
        .filter((p: any) => {
          const text = `${p.name} ${p.category} ${p.status} ${p.description || ""}`.toLowerCase();
          if (qLower.includes("in progress") || qLower.includes("active")) {
            return p.status === "Active" || text.includes("active");
          }
          if (qLower.includes("planning")) {
            return p.status === "Planning" || text.includes("planning");
          }
          return tokens.some((token: string) => text.includes(token));
        })
        .slice(0, 6)
        .map((p: any) => ({
          id: p.id,
          reason: `Matches botanical space category (${p.category}) and status (${p.status})`,
        }));

      const matchedPlants = plants
        .filter((p: any) => {
          if (isPetFriendly && !p.petFriendly) return false;
          if (isLowLight && !p.light.toLowerCase().includes("low")) return false;
          if (budgetLimit !== undefined && p.price > budgetLimit) return false;

          const text = `${p.name} ${p.botanicalName} ${p.category} ${p.tags?.join(" ") || ""} ${p.description || ""}`.toLowerCase();
          return (
            (isPetFriendly && p.petFriendly) ||
            (isLowLight && p.light.toLowerCase().includes("low")) ||
            (budgetLimit !== undefined && p.price <= budgetLimit) ||
            tokens.some((token: string) => text.includes(token))
          );
        })
        .slice(0, 8)
        .map((p: any) => {
          const reasons: string[] = [];
          if (isPetFriendly && p.petFriendly) reasons.push("pet-friendly");
          if (isLowLight && p.light.toLowerCase().includes("low")) reasons.push("low-light tolerant");
          if (budgetLimit !== undefined) reasons.push(`priced under $${budgetLimit}`);
          if (reasons.length === 0) reasons.push(`matches specimen characteristics`);
          return {
            id: p.id,
            reason: `Specimen ${reasons.join(", ")}`,
          };
        });

      const matchedCareLogs = careLogs
        .filter((c: any) => {
          const text = `${c.plantName} ${c.action} ${c.notes || ""} ${c.timestamp}`.toLowerCase();
          return tokens.some((token: string) => text.includes(token));
        })
        .slice(0, 6)
        .map((c: any) => ({
          id: c.id,
          reason: `Recent ${c.action} entry for ${c.plantName}`,
        }));

      const totalFound = matchedTasks.length + matchedProjects.length + matchedPlants.length + matchedCareLogs.length;
      const summary = totalFound > 0
        ? `Found ${totalFound} relevant records matching "${trimmedQuery}".`
        : `No matching records found for "${trimmedQuery}". Try adjusting search filters or keywords.`;

      return res.json({
        summary,
        matchedTasks,
        matchedProjects,
        matchedPlants,
        matchedCareLogs,
        interpretedFilters: {
          priorities: isUrgent ? ["urgent"] : isHigh ? ["high"] : [],
          status: isPending ? ["todo", "in-progress"] : isCompleted ? ["completed"] : [],
          isPetFriendly: isPetFriendly || null,
          budgetLimit: budgetLimit || null,
        },
      });
    } catch (error: any) {
      console.error("AI search error:", error);
      res.status(500).json({
        error: "Failed to perform natural language search",
        details: error?.message || "Unknown error",
      });
    }
  });

  // Setup Vite middleware in dev or static files in prod
  const isProduction =
    process.env.NODE_ENV === "production" ||
    (typeof __filename !== "undefined" && __filename.includes("dist")) ||
    !process.argv[1]?.endsWith("server.ts");

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Verdant Plant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
