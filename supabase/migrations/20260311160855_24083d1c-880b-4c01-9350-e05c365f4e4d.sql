
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Anyone can insert players" ON public.players;
DROP POLICY IF EXISTS "Anyone can update players" ON public.players;

-- Registrations: only authenticated users can SELECT
CREATE POLICY "Authenticated can view registrations"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Players: only authenticated users can INSERT
CREATE POLICY "Authenticated can insert players"
  ON public.players
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Players: only authenticated users can UPDATE
CREATE POLICY "Authenticated can update players"
  ON public.players
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
