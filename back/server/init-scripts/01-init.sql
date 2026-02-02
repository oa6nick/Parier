-- Initialize parier Database
-- This script runs when the PostgreSQL container starts for the first time

-- Ensure we're connected to the correct database
\c parier_db;

-- Create UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create pg_trgm extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create btree_gin extension for indexing
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE parier_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Create indexes for better performance (will be created by GORM migration, but adding here for reference)
-- These will be created automatically by GORM, but we can add custom indexes here if needed

-- Log the successful initialization
DO $$
BEGIN
    RAISE NOTICE 'parier database initialized successfully with extensions:';
    RAISE NOTICE '- uuid-ossp: UUID generation';
    RAISE NOTICE '- postgis: Geographic data support';
    RAISE NOTICE '- pg_trgm: Text search support';
    RAISE NOTICE '- btree_gin: Advanced indexing';
END $$; 