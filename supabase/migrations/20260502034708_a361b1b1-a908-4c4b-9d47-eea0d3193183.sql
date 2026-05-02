
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.sync_usuario_from_profile() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.recalc_producto(TEXT) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.formulas_after_iud() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.dc_after_iud() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.recalc_quema(TEXT) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.quemas_after_iu() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.firing_logs_after_iud() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.qdp_before_iu() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.qdp_after_iud() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.recalc_cliente(TEXT) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.ventas_after_iud() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.tx_after_iud() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_any_role(UUID, app_role[]) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.current_usuario_id() FROM anon, public;

GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_any_role(UUID, app_role[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_usuario_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.recalc_producto(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.recalc_quema(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.recalc_cliente(TEXT) TO authenticated;
