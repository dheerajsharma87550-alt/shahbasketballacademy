
ALTER TABLE public.players DROP CONSTRAINT IF EXISTS players_registration_id_fkey;
ALTER TABLE public.players DROP CONSTRAINT IF EXISTS players_registration_id_key;
ALTER TABLE public.players DROP COLUMN IF EXISTS registration_id;
ALTER TABLE public.players ADD COLUMN player_name text NOT NULL DEFAULT '';
