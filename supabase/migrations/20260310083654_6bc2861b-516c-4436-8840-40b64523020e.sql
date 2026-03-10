
CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES public.registrations(id) ON DELETE CASCADE NOT NULL UNIQUE,
  player_id text NOT NULL UNIQUE,
  fee_status text NOT NULL DEFAULT 'unpaid' CHECK (fee_status IN ('paid', 'unpaid')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view players" ON public.players FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert players" ON public.players FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE TO public USING (true) WITH CHECK (true);
