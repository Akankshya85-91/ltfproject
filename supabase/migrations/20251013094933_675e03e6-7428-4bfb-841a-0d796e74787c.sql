-- Create translation_history table
CREATE TABLE IF NOT EXISTS public.translation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  translation_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.translation_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own translation history" 
ON public.translation_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own translation history" 
ON public.translation_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own translation history" 
ON public.translation_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_translation_history_user_created ON public.translation_history(user_id, created_at DESC);
