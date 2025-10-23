-- Add support for image and video translations in history
ALTER TABLE translation_history 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS grammar_corrections JSONB;

-- Update translation_type to support new types
COMMENT ON COLUMN translation_history.translation_type IS 'Type of translation: text, image, video, or audio';