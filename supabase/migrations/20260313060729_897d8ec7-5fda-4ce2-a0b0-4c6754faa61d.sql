
CREATE OR REPLACE FUNCTION public.auto_create_player_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_player_id TEXT;
  v_name TEXT;
  v_rand INT;
BEGIN
  -- Use first name (no spaces), lowercase
  v_name := split_part(NEW.student_name, ' ', 1);
  
  -- Generate unique player_id
  LOOP
    v_rand := floor(random() * 9000 + 1000)::int; -- 4-digit number 1000-9999
    v_player_id := v_name || '@shah' || v_rand::text;
    
    -- Check uniqueness
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.players WHERE player_id = v_player_id);
  END LOOP;
  
  INSERT INTO public.players (player_id, player_name, fee_status)
  VALUES (v_player_id, NEW.student_name, 'unpaid');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_create_player_id
AFTER INSERT ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_player_id();
