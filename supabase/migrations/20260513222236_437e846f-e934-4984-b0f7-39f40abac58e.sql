WITH matches AS (
  SELECT DISTINCT ON (p.id) p.id AS project_id, c.id AS chat_id
  FROM public.projects p
  JOIN public.chats c ON c.user_id = p.user_id
  WHERE p.chat_id IS NULL
    AND ABS(EXTRACT(EPOCH FROM (c.updated_at - p.created_at))) < 600
  ORDER BY p.id, ABS(EXTRACT(EPOCH FROM (c.updated_at - p.created_at))) ASC
)
UPDATE public.projects p
SET chat_id = m.chat_id
FROM matches m
WHERE p.id = m.project_id;