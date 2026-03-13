
ALTER TABLE public.registrations ADD CONSTRAINT batch_check CHECK (batch IN ('below_14', 'above_14'));
ALTER TABLE public.registrations ADD CONSTRAINT age_range CHECK (age BETWEEN 3 AND 50);
ALTER TABLE public.registrations ADD CONSTRAINT phone_format CHECK (phone ~ '^\+?[0-9]{7,15}$');
ALTER TABLE public.registrations ADD CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE public.registrations ADD CONSTRAINT student_name_length CHECK (char_length(student_name) BETWEEN 1 AND 100);
ALTER TABLE public.registrations ADD CONSTRAINT parent_name_length CHECK (char_length(parent_name) BETWEEN 1 AND 100);
