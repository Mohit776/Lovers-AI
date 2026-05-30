-- Run this in Supabase Dashboard > SQL Editor
-- Tracks every crawl run for historical data and debugging

CREATE TABLE IF NOT EXISTS public.crawl_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    urls_found INTEGER DEFAULT 0,
    urls_success INTEGER DEFAULT 0,
    urls_skipped INTEGER DEFAULT 0,
    urls_error INTEGER DEFAULT 0,
    sources TEXT[],
    notes TEXT
);
