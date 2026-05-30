-- Run this in Supabase Dashboard > SQL Editor
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT,
    country TEXT,
    deadline DATE,
    category TEXT,
    description TEXT,
    funding_amount TEXT,
    application_link TEXT,
    remote BOOLEAN DEFAULT FALSE,
    women_friendly BOOLEAN DEFAULT FALSE,
    student_eligible BOOLEAN DEFAULT FALSE,
    indian_eligible BOOLEAN DEFAULT FALSE,
    application_fee TEXT,
    tags TEXT,
    source_url TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
