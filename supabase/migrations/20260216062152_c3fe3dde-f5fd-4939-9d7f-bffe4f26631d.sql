
-- Allow users to update their own sessions
CREATE POLICY "Users can update their own sessions"
ON public.fear_ladder_sessions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow users to update their own steps
CREATE POLICY "Users can update their own steps"
ON public.fear_ladder_steps
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow users to delete their own steps
CREATE POLICY "Users can delete their own steps"
ON public.fear_ladder_steps
FOR DELETE
USING (true);
