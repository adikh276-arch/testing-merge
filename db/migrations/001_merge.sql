-- Create shared and individual app schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS personal_mission_statement;
CREATE SCHEMA IF NOT EXISTS brain_dump_and_sort;

-- Move existing tables to the new schemas if they were in public before, or create them
-- 1. Users table (Shared across all minis)
CREATE TABLE IF NOT EXISTS core.users (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- If "users" existed in the public schema instead of core, we can migrate it (optional based on your current Neon state)
-- ALTER TABLE public.users SET SCHEMA core;

-- 2. Missions table (Specific to Mission Statement app)
CREATE TABLE IF NOT EXISTS personal_mission_statement.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    "values" TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create custom index
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON personal_mission_statement.missions(user_id);
