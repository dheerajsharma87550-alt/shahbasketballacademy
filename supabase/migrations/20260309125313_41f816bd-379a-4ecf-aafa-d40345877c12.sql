
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  batch TEXT NOT NULL CHECK (batch IN ('below_14', 'above_14')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public registration form)
CREATE POLICY "Anyone can register" ON public.registrations FOR INSERT WITH CHECK (true);

-- Only authenticated users (academy staff) can view registrations
CREATE POLICY "Authenticated users can view registrations" ON public.registrations FOR SELECT TO authenticated USING (true);
