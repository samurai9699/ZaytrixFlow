-- Create reminder_templates table
CREATE TABLE IF NOT EXISTS public.reminder_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.reminder_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminder templates"
    ON public.reminder_templates
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminder templates"
    ON public.reminder_templates
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminder templates"
    ON public.reminder_templates
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminder templates"
    ON public.reminder_templates
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_reminder_templates_updated_at
    BEFORE UPDATE ON public.reminder_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 