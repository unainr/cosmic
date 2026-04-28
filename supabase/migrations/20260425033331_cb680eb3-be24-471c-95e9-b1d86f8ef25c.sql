DROP POLICY IF EXISTS "Visitors can submit voyage inquiries" ON public.voyage_inquiries;

CREATE POLICY "Visitors can submit valid voyage inquiries"
ON public.voyage_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  full_name IS NOT NULL
  AND char_length(full_name) BETWEEN 2 AND 120
  AND email IS NOT NULL
  AND char_length(email) <= 255
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND mission_type IN ('Orbital Preview', 'Lunar Transfer', 'Deep Space Charter', 'Private Research')
  AND passengers BETWEEN 1 AND 12
  AND (message IS NULL OR char_length(message) <= 1000)
  AND status = 'new'
);