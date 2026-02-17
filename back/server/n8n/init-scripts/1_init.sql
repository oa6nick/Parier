create extension if not exists pgvector;
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;
create extension if not exists btree_gin;

CREATE TABLE public.n8n_chat_histories (
	id bigserial NOT NULL,
	session_id varchar(255) NOT NULL,
	message jsonb NOT NULL,
	CONSTRAINT n8n_chat_histories_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE public.n8n_chat_histories IS 'Chat histories';
COMMENT ON COLUMN public.n8n_chat_histories.id IS 'ID';
COMMENT ON COLUMN public.n8n_chat_histories.session_id IS 'Session ID';
COMMENT ON COLUMN public.n8n_chat_histories.message IS 'Message';

CREATE INDEX idx_n8n_chat_histories_session_id ON public.n8n_chat_histories (session_id);

CREATE TABLE public.n8n_vectors (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536)
);

COMMENT ON TABLE public.n8n_vectors IS 'Vectors';
COMMENT ON COLUMN public.n8n_vectors.id IS 'ID';
COMMENT ON COLUMN public.n8n_vectors.content IS 'Content';
COMMENT ON COLUMN public.n8n_vectors.embedding IS 'Embedding';

CREATE INDEX idx_n8n_vectors_embedding ON public.n8n_vectors USING ivfflat (embedding);