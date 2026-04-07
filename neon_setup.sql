-- Create schemas for tenant isolation
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS mission_statement;
CREATE SCHEMA IF NOT EXISTS brain_dump;

-- Shared Users Table (in core)
CREATE TABLE IF NOT EXISTS core.users (
  id TEXT PRIMARY KEY, -- using id from MantraCare portal
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Missions table (in mission_statement)
CREATE TABLE IF NOT EXISTS mission_statement.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES core.users(id),
  statement TEXT NOT NULL,
  "values" TEXT[], -- Matches the query "SELECT values ..."
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Brain Dump table (in brain_dump)
CREATE TABLE IF NOT EXISTS brain_dump.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES core.users(id),
  thoughts JSONB NOT NULL,
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure your environment variable DATABASE_URL is set in the platform secrets!
