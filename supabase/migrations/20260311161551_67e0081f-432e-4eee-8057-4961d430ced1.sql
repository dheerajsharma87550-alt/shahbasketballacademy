
-- Announcements table
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Public can read announcements
CREATE POLICY "Anyone can view announcements"
  ON public.announcements FOR SELECT TO public USING (true);

-- Only authenticated can manage announcements
CREATE POLICY "Authenticated can insert announcements"
  ON public.announcements FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update announcements"
  ON public.announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete announcements"
  ON public.announcements FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to delete registrations
CREATE POLICY "Authenticated can delete registrations"
  ON public.registrations FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to delete players
CREATE POLICY "Authenticated can delete players"
  ON public.players FOR DELETE TO authenticated USING (true);
