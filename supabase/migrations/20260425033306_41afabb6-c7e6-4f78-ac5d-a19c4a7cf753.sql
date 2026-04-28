CREATE TABLE public.voyage_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 255),
  mission_type TEXT NOT NULL CHECK (mission_type IN ('Orbital Preview', 'Lunar Transfer', 'Deep Space Charter', 'Private Research')),
  passengers INTEGER NOT NULL CHECK (passengers BETWEEN 1 AND 12),
  message TEXT CHECK (char_length(message) <= 1000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.voyage_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit voyage inquiries"
ON public.voyage_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE INDEX idx_voyage_inquiries_created_at ON public.voyage_inquiries (created_at DESC);
CREATE INDEX idx_voyage_inquiries_status ON public.voyage_inquiries (status);