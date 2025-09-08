CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE polls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);
