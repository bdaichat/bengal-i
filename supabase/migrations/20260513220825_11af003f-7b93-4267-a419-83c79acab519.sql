ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS chat_id uuid REFERENCES public.chats(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_chat_id ON public.projects(chat_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_chat ON public.projects(user_id, chat_id);