import React, { useState } from "react";
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Server
} from "lucide-react";
import { SupabaseStatus, MigrationResult, api } from "../services/api";
import { Project, Task, CareLogEntry, PlantProduct } from "../types";

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SupabaseStatus | null;
  onRefreshStatus: () => void;
  projects: Project[];
  tasks: Task[];
  careLogs: CareLogEntry[];
  plants: PlantProduct[];
  onDataMigrated?: (result: MigrationResult) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
  projects,
  tasks,
  careLogs,
  plants,
  onDataMigrated,
}) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "tables" | "sql">("overview");

  if (!isOpen) return null;

  const sqlSchema = `-- Supabase PostgreSQL Schema for Verdant Management System
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('Indoor Space', 'Outdoor Living', 'Urban Balcony', 'Aroid Nursery', 'Propagation Lab', 'Commercial Green')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Planning', 'Completed')),
  progress NUMERIC NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  plant_count INTEGER NOT NULL DEFAULT 0,
  budget NUMERIC NOT NULL DEFAULT 0,
  spent NUMERIC NOT NULL DEFAULT 0,
  target_date TEXT DEFAULT '',
  health_index NUMERIC NOT NULL DEFAULT 100 CHECK (health_index >= 0 AND health_index <= 100),
  cover_image TEXT DEFAULT '',
  assigned_plants TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tasks Table (with foreign key relation to projects)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('Watering', 'Fertilizing', 'Repotting', 'Pruning', 'Pest Care', 'Propagation', 'Rotation', 'Order Supplies')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed')),
  due_date TEXT NOT NULL DEFAULT 'Today',
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT DEFAULT '',
  plant_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Care Logs Table
CREATE TABLE IF NOT EXISTS care_logs (
  id TEXT PRIMARY KEY,
  plant_name TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Plant Products & Catalog Table
CREATE TABLE IF NOT EXISTS plant_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  botanical_name TEXT DEFAULT '',
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INTEGER DEFAULT 0,
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  care_difficulty TEXT DEFAULT 'Beginner' CHECK (care_difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  light TEXT DEFAULT 'Bright Indirect',
  water TEXT DEFAULT 'Weekly',
  humidity TEXT DEFAULT 'Medium',
  pot_size TEXT DEFAULT '6" Nursery Pot',
  pet_friendly BOOLEAN DEFAULT false,
  air_purifying BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 10,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  care_tips TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_care_logs_timestamp ON care_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_plant_products_category ON plant_products(category);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access for projects" ON projects;
CREATE POLICY "Public access for projects" ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for tasks" ON tasks;
CREATE POLICY "Public access for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for care_logs" ON care_logs;
CREATE POLICY "Public access for care_logs" ON care_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for plant_products" ON plant_products;
CREATE POLICY "Public access for plant_products" ON plant_products FOR ALL USING (true) WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    setMigrationError(null);
    try {
      const result = await api.migrateData({
        projects,
        tasks,
        careLogs,
        plants,
      });
      setMigrationResult(result);
      if (onDataMigrated) onDataMigrated(result);
      onRefreshStatus();
    } catch (err: any) {
      setMigrationError(err.message || "Migration request failed");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#d8e3dc] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1b4332] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Database className="w-5 h-5 text-[#95d5b2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Supabase PostgreSQL Integration</h2>
              <p className="text-xs text-[#b7e4c7]">Database Architecture & Data Migration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-[#f8faf8] px-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-[#2d6a4f] text-[#1b4332]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Connection & Migration
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "tables"
                ? "border-[#2d6a4f] text-[#1b4332]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Database Schema & Tables
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "sql"
                ? "border-[#2d6a4f] text-[#1b4332]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            PostgreSQL DDL Script
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Status Card */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                status?.connected 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}>
                {status?.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {status?.connected ? "Connected to Supabase PostgreSQL" : "Supabase Configuration Status"}
                    </span>
                    <button
                      onClick={onRefreshStatus}
                      className="text-xs font-medium text-[#2d6a4f] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Re-check
                    </button>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {status?.message || "Checking Supabase connection..."}
                  </p>
                  {status?.url && (
                    <div className="mt-2 text-[11px] font-mono bg-white/70 px-2 py-1 rounded-sm border border-emerald-200 inline-block">
                      Project URL: {status.url}
                    </div>
                  )}
                </div>
              </div>

              {/* Data Record Inventory */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Records Ready for Migration
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#f8faf8] border border-[#e2ece5] rounded-xl text-center">
                    <span className="text-xl font-bold text-[#1b4332] block">{projects.length}</span>
                    <span className="text-[11px] text-gray-500 font-medium">Projects</span>
                  </div>
                  <div className="p-3 bg-[#f8faf8] border border-[#e2ece5] rounded-xl text-center">
                    <span className="text-xl font-bold text-[#1b4332] block">{tasks.length}</span>
                    <span className="text-[11px] text-gray-500 font-medium">Tasks</span>
                  </div>
                  <div className="p-3 bg-[#f8faf8] border border-[#e2ece5] rounded-xl text-center">
                    <span className="text-xl font-bold text-[#1b4332] block">{careLogs.length}</span>
                    <span className="text-[11px] text-gray-500 font-medium">Care Logs</span>
                  </div>
                  <div className="p-3 bg-[#f8faf8] border border-[#e2ece5] rounded-xl text-center">
                    <span className="text-xl font-bold text-[#1b4332] block">{plants.length}</span>
                    <span className="text-[11px] text-gray-500 font-medium">Catalog Items</span>
                  </div>
                </div>
              </div>

              {/* Migration Action Section */}
              <div className="p-4 bg-[#f0f7f2] border border-[#c8e1d0] rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1b4332]">Automated Data Migration</h4>
                    <p className="text-xs text-[#3c5545] mt-1 leading-relaxed">
                      Syncs all existing plant projects, tasks, care logs, and catalog items into your Supabase PostgreSQL database using non-destructive upserts.
                    </p>
                  </div>
                  <button
                    onClick={handleMigrate}
                    disabled={isMigrating}
                    className="shrink-0 px-4 py-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isMigrating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Migrating...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-3.5 h-3.5" />
                        Migrate Now
                      </>
                    )}
                  </button>
                </div>

                {/* Migration Result Banner */}
                {migrationResult && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-emerald-300 text-xs text-emerald-900">
                    <div className="font-semibold flex items-center gap-1.5 text-emerald-700">
                      <Check className="w-4 h-4" /> Migration Executed Successfully:
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-2 text-[11px]">
                      <div>Projects Synced: <b>{migrationResult.migratedProjects}</b></div>
                      <div>Tasks Synced: <b>{migrationResult.migratedTasks}</b></div>
                      <div>Care Logs Synced: <b>{migrationResult.migratedCareLogs}</b></div>
                      <div>Catalog Items Synced: <b>{migrationResult.migratedPlants}</b></div>
                    </div>
                  </div>
                )}

                {/* Migration Error */}
                {migrationError && (
                  <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-800">
                    <div className="font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" /> Migration Notice:
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed">{migrationError}</p>
                    <p className="mt-1 text-[11px] text-gray-600">
                      If tables do not exist yet, copy the SQL in the "PostgreSQL DDL Script" tab and run it in your Supabase SQL Editor.
                    </p>
                  </div>
                )}
              </div>

              {/* Secure Credentials Note */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-800">Secure Server-Side Architecture: </span>
                  Supabase keys are managed server-side via environment variables (<code className="bg-gray-200 px-1 py-0.2 rounded font-mono">SUPABASE_URL</code> and <code className="bg-gray-200 px-1 py-0.2 rounded font-mono">SUPABASE_SERVICE_ROLE_KEY</code>) to protect credentials from browser exposure.
                </div>
              </div>
            </div>
          )}

          {activeTab === "tables" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                The database schema reflects the System Requirements Specification (SRS) for the Verdant Management Platform, organizing projects, task schedules, botanical logs, and inventory with strict relational constraints:
              </p>

              {/* Table List */}
              <div className="space-y-3">
                <div className="border border-[#e2ece5] rounded-xl p-3 bg-[#fbfdfc]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#2d6a4f]" />
                      <span className="font-bold text-xs text-[#1b4332] font-mono">projects</span>
                    </div>
                    <span className="text-[10px] bg-[#e2ece5] text-[#1b4332] font-semibold px-2 py-0.5 rounded-full">Primary Entity</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Stores plant sanctuary projects, budgets, expense tracking, target dates, health indices, and assigned plant varieties.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                    Keys: id (PK), name, category, status, progress, plant_count, budget, spent, target_date, health_index, cover_image, assigned_plants, created_at, updated_at
                  </div>
                </div>

                <div className="border border-[#e2ece5] rounded-xl p-3 bg-[#fbfdfc]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#2d6a4f]" />
                      <span className="font-bold text-xs text-[#1b4332] font-mono">tasks</span>
                    </div>
                    <span className="text-[10px] bg-[#d8f3dc] text-[#1b4332] font-semibold px-2 py-0.5 rounded-full">Foreign Key → projects(id)</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Care schedule and operations tasks with category enums, priorities (urgent, high, medium, low), and project linking.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                    Keys: id (PK), title, description, category, priority, status, due_date, project_id (FK), project_name, plant_name, created_at, completed_at, updated_at
                  </div>
                </div>

                <div className="border border-[#e2ece5] rounded-xl p-3 bg-[#fbfdfc]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#2d6a4f]" />
                      <span className="font-bold text-xs text-[#1b4332] font-mono">care_logs</span>
                    </div>
                    <span className="text-[10px] bg-[#e2ece5] text-[#1b4332] font-semibold px-2 py-0.5 rounded-full">Audit & Timeline</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Horticultural log book recording watering, fertilizing, pest checks, and propagation notes with timestamps.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                    Keys: id (PK), plant_name, action, timestamp, notes, created_at
                  </div>
                </div>

                <div className="border border-[#e2ece5] rounded-xl p-3 bg-[#fbfdfc]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#2d6a4f]" />
                      <span className="font-bold text-xs text-[#1b4332] font-mono">plant_products</span>
                    </div>
                    <span className="text-[10px] bg-[#e2ece5] text-[#1b4332] font-semibold px-2 py-0.5 rounded-full">Catalog & Supplies</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Botanical nursery catalog including indoor/outdoor specimens, pots, soil amendments, lighting specs, and care tips.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-gray-500 bg-white p-2 rounded border border-gray-200">
                    Keys: id (PK), name, botanical_name, category, price, rating, care_difficulty, light, water, humidity, pot_size, stock, tags, care_tips, created_at
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sql" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Execute this script in your <b>Supabase SQL Editor</b> to create all tables and RLS security policies:
                </span>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d6a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#1b4332] transition-colors cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy SQL
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-gray-900 text-gray-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[350px] border border-gray-800 leading-relaxed select-all">
                {sqlSchema}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f8faf8] border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#2d6a4f]" /> Schema Version: 1.0 (PostgreSQL)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
