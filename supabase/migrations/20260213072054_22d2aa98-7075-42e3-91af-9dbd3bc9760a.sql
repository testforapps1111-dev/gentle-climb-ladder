-- Allow all operations on fear_ladder_sessions for now (no auth yet)
CREATE POLICY "Allow all inserts for now"
ON public.fear_ladder_sessions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all selects for now"
ON public.fear_ladder_sessions
FOR SELECT
USING (true);