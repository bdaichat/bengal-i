-- Restore EXECUTE on helper functions used inside RLS policies.
-- RLS policy expressions are evaluated with the CALLER's privileges, so even
-- SECURITY DEFINER functions require EXECUTE to be callable from a policy.
-- Revoking it from authenticated broke all profile/project/chat reads.

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_owner(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_team_invite(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.shares_team(uuid, uuid) TO authenticated;