-- Supabase PostgreSQL Schema for Verdant Management System
-- Generated based on System Requirements Specification (SRS) & Data Models

-- Enable UUID extension if needed
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

-- Allow read & write access for authenticated and anon roles
DROP POLICY IF EXISTS "Public access for projects" ON projects;
CREATE POLICY "Public access for projects" ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for tasks" ON tasks;
CREATE POLICY "Public access for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for care_logs" ON care_logs;
CREATE POLICY "Public access for care_logs" ON care_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for plant_products" ON plant_products;
CREATE POLICY "Public access for plant_products" ON plant_products FOR ALL USING (true) WITH CHECK (true);
