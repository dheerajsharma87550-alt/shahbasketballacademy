-- Allow anyone to select registrations (admin uses password gate, not auth)
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON public.registrations;
CREATE POLICY "Anyone can view registrations" ON public.registrations FOR SELECT USING (true);