
-- ENUMS
CREATE TYPE app_role AS ENUM ('SU','Administrador','Maestro Ceramista','Ceramista','Vendedor','Bodegero');
CREATE TYPE tipo_producto AS ENUM ('Arcilla','Energía','Esmalte','Materia prima','Otro','Óxido','Pasta','Pigmento','Renta','Mano de Obra');
CREATE TYPE categoria_esmaltes AS ENUM ('Esmalte Media','Esmalte Baja','Engobe','Raku','Esmalte Media Semi Mate','Esmalte Alta','Wash','Esmalte Alta Satín');
CREATE TYPE unidad_producto AS ENUM ('kg','lt','u','m');
CREATE TYPE tipo_cliente AS ENUM ('Empleado','Preferente','Casual','Superior','Especial');
CREATE TYPE etiqueta_proveedor AS ENUM ('Arcilla','Energía','Esmalte','Materia prima','Otro','Óxido','Pasta','Pigmento','Herramientas','Servicios');
CREATE TYPE status_produccion AS ENUM ('En proceso','Terminada','Merma','Cancelada');
CREATE TYPE status_quema AS ENUM ('Programada','En curso','Terminada','Cancelada');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT, nombre TEXT, apellido_paterno TEXT, apellido_materno TEXT,
  useremail TEXT UNIQUE, telefono TEXT, direccion TEXT, foto TEXT,
  useractive BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = ANY(_roles))
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count INT; v_role app_role;
BEGIN
  INSERT INTO public.profiles (id, useremail, nombre, foto) VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  SELECT COUNT(*) INTO v_count FROM public.user_roles;
  v_role := CASE WHEN v_count = 0 THEN 'SU'::app_role ELSE 'Ceramista'::app_role END;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role);
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE SEQUENCE usuarios_seq START 1;
CREATE TABLE public.usuarios (
  id TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('usuarios_seq'),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT, nombre TEXT, apellido_paterno TEXT, apellido_materno TEXT,
  useremail TEXT UNIQUE NOT NULL, telefono TEXT, direccion TEXT, foto TEXT,
  userrole app_role, useractive BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_usuarios_updated BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_usuarios_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id IS NULL OR NEW.id = '' THEN NEW.id := 'USF-' || lpad(NEW.contadorid::text,4,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_usuarios_id BEFORE INSERT ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.set_usuarios_id();

CREATE OR REPLACE FUNCTION public.sync_usuario_from_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_role app_role;
BEGIN
  SELECT role INTO v_role FROM public.user_roles WHERE user_id = NEW.id ORDER BY created_at LIMIT 1;
  INSERT INTO public.usuarios (user_id, useremail, username, nombre, apellido_paterno, apellido_materno, telefono, direccion, foto, userrole, useractive)
  VALUES (NEW.id, NEW.useremail, NEW.username, NEW.nombre, NEW.apellido_paterno, NEW.apellido_materno, NEW.telefono, NEW.direccion, NEW.foto, v_role, NEW.useractive)
  ON CONFLICT (user_id) DO UPDATE SET
    useremail=EXCLUDED.useremail, username=EXCLUDED.username, nombre=EXCLUDED.nombre,
    apellido_paterno=EXCLUDED.apellido_paterno, apellido_materno=EXCLUDED.apellido_materno,
    telefono=EXCLUDED.telefono, direccion=EXCLUDED.direccion, foto=EXCLUDED.foto,
    userrole=COALESCE(EXCLUDED.userrole, usuarios.userrole), useractive=EXCLUDED.useractive;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_sync_usuario AFTER INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.sync_usuario_from_profile();

CREATE OR REPLACE FUNCTION public.current_usuario_id() RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.usuarios WHERE user_id = auth.uid() LIMIT 1
$$;

CREATE SEQUENCE proveedores_seq START 1;
CREATE TABLE public.proveedores (
  proveedorid TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('proveedores_seq'),
  nombre_proveedor TEXT NOT NULL, logo TEXT, url TEXT, telefono TEXT, whatsapp TEXT,
  email TEXT, direccion TEXT, descripcion TEXT,
  etiquetas etiqueta_proveedor[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_prov_updated BEFORE UPDATE ON public.proveedores FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_proveedor_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.proveedorid IS NULL OR NEW.proveedorid='' THEN NEW.proveedorid := 'PROV-' || lpad(NEW.contadorid::text,3,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_prov_id BEFORE INSERT ON public.proveedores FOR EACH ROW EXECUTE FUNCTION public.set_proveedor_id();

CREATE SEQUENCE clientes_seq START 1;
CREATE TABLE public.clientes (
  id TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('clientes_seq'),
  foto TEXT, cliente_activo BOOLEAN NOT NULL DEFAULT true, rfc TEXT,
  nombre TEXT NOT NULL, apellido_paterno TEXT, apellido_materno TEXT,
  telefono TEXT, email TEXT, direccion TEXT,
  tipo_de_cliente tipo_cliente DEFAULT 'Casual',
  ajuste_de_deuda NUMERIC(14,4) NOT NULL DEFAULT 0,
  ajuste_de_abonos NUMERIC(14,4) NOT NULL DEFAULT 0,
  deuda NUMERIC(14,4) NOT NULL DEFAULT 0,
  abonos NUMERIC(14,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_cli_updated BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_cliente_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id IS NULL OR NEW.id='' THEN NEW.id := 'CL-' || lpad(NEW.contadorid::text,6,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_cli_id BEFORE INSERT ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.set_cliente_id();

CREATE SEQUENCE productos_seq START 1;
CREATE TABLE public.productos (
  productoid TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('productos_seq'),
  nombre TEXT NOT NULL, imagen TEXT, tipo tipo_producto NOT NULL DEFAULT 'Otro',
  categoria_esmaltes categoria_esmaltes, unidad unidad_producto NOT NULL DEFAULT 'kg',
  costo_de_formula NUMERIC(14,4) NOT NULL DEFAULT 0,
  precio_de_compra NUMERIC(14,4) NOT NULL DEFAULT 0,
  precio_manual NUMERIC(14,4) NOT NULL DEFAULT 0,
  valor_en_bodega NUMERIC(14,4) NOT NULL DEFAULT 0,
  precio_de_venta NUMERIC(14,4) GENERATED ALWAYS AS (valor_en_bodega * 3) STORED,
  entrantes NUMERIC(14,4) NOT NULL DEFAULT 0,
  salientes NUMERIC(14,4) NOT NULL DEFAULT 0,
  en_bodega NUMERIC(14,4) GENERATED ALWAYS AS (entrantes - salientes) STORED,
  ficha_tecnica TEXT, notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_prod_updated BEFORE UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_producto_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.productoid IS NULL OR NEW.productoid='' THEN NEW.productoid := 'PR-' || lpad(NEW.contadorid::text,5,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_prod_id BEFORE INSERT ON public.productos FOR EACH ROW EXECUTE FUNCTION public.set_producto_id();

CREATE SEQUENCE formulas_seq START 1;
CREATE TABLE public.formulas (
  fmlid TEXT PRIMARY KEY, contadorfmlid INT NOT NULL DEFAULT nextval('formulas_seq'),
  productoid TEXT NOT NULL REFERENCES public.productos(productoid) ON DELETE CASCADE,
  componente_id TEXT NOT NULL REFERENCES public.productos(productoid),
  cantidad NUMERIC(14,4) NOT NULL DEFAULT 0,
  valor_de_gasto NUMERIC(14,4) NOT NULL DEFAULT 0,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  quien_modifica TEXT REFERENCES public.usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_formulas_producto ON public.formulas(productoid);
ALTER TABLE public.formulas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_fml_updated BEFORE UPDATE ON public.formulas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_formula_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.fmlid IS NULL OR NEW.fmlid='' THEN NEW.fmlid := 'FML-' || lpad(NEW.contadorfmlid::text,6,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_fml_id BEFORE INSERT ON public.formulas FOR EACH ROW EXECUTE FUNCTION public.set_formula_id();

CREATE SEQUENCE oc_seq START 1;
CREATE TABLE public.ordenes_de_compra (
  id TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('oc_seq'),
  proveedorid TEXT REFERENCES public.proveedores(proveedorid),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE, total NUMERIC(14,4) NOT NULL DEFAULT 0,
  notas TEXT, quien_modifica TEXT REFERENCES public.usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ordenes_de_compra ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_oc_updated BEFORE UPDATE ON public.ordenes_de_compra FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_oc_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id IS NULL OR NEW.id='' THEN NEW.id := 'OC-' || lpad(NEW.contadorid::text,5,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_oc_id BEFORE INSERT ON public.ordenes_de_compra FOR EACH ROW EXECUTE FUNCTION public.set_oc_id();

CREATE SEQUENCE dc_seq START 1;
CREATE TABLE public.detalles_de_compra (
  id TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('dc_seq'),
  ordenid TEXT REFERENCES public.ordenes_de_compra(id) ON DELETE CASCADE,
  productoid TEXT NOT NULL REFERENCES public.productos(productoid),
  cantidad NUMERIC(14,4) NOT NULL DEFAULT 0,
  precio_unidad NUMERIC(14,4) NOT NULL DEFAULT 0,
  subtotal NUMERIC(14,4) GENERATED ALWAYS AS (cantidad * precio_unidad) STORED,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_dc_producto ON public.detalles_de_compra(productoid);
ALTER TABLE public.detalles_de_compra ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.set_dc_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id IS NULL OR NEW.id='' THEN NEW.id := 'DC-' || lpad(NEW.contadorid::text,6,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_dc_id BEFORE INSERT ON public.detalles_de_compra FOR EACH ROW EXECUTE FUNCTION public.set_dc_id();

CREATE SEQUENCE hornos_seq START 1;
CREATE TABLE public.lista_de_hornos (
  id_horno TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('hornos_seq'),
  nombre TEXT,
  alto_interno NUMERIC(10,2) NOT NULL DEFAULT 0,
  largo_interno NUMERIC(10,2) NOT NULL DEFAULT 0,
  ancho_interno NUMERIC(10,2) NOT NULL DEFAULT 0,
  volumen_interno NUMERIC(14,4) GENERATED ALWAYS AS ((alto_interno * largo_interno * ancho_interno) / 1000.0) STORED,
  cantidad_de_quemadores INT DEFAULT 0,
  tipo_de_energia TEXT REFERENCES public.productos(productoid),
  tamano_tanque NUMERIC(14,4) DEFAULT 0,
  foto TEXT, plano TEXT, descripcion TEXT, notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lista_de_hornos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_hornos_updated BEFORE UPDATE ON public.lista_de_hornos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_horno_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id_horno IS NULL OR NEW.id_horno='' THEN NEW.id_horno := 'Horno-' || lpad(NEW.contadorid::text,2,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_horno_id BEFORE INSERT ON public.lista_de_hornos FOR EACH ROW EXECUTE FUNCTION public.set_horno_id();

CREATE SEQUENCE prods_seq START 1;
CREATE TABLE public.producciones (
  produccionid TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('prods_seq'),
  productoid TEXT REFERENCES public.productos(productoid),
  nombre TEXT, cantidad_de_piezas INT NOT NULL DEFAULT 0,
  volumen_de_pieza NUMERIC(14,4) NOT NULL DEFAULT 0,
  status status_produccion NOT NULL DEFAULT 'En proceso',
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE, fecha_fin DATE,
  encargado TEXT REFERENCES public.usuarios(id),
  notas TEXT, imagen TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.producciones ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_prods_updated BEFORE UPDATE ON public.producciones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_prod_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.produccionid IS NULL OR NEW.produccionid='' THEN NEW.produccionid := 'PROD-' || lpad(NEW.contadorid::text,5,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_prod_pid BEFORE INSERT ON public.producciones FOR EACH ROW EXECUTE FUNCTION public.set_prod_id();

CREATE SEQUENCE pcli_seq START 1;
CREATE TABLE public.produccion_clientes (
  produccioncliid TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('pcli_seq'),
  cliente_id TEXT REFERENCES public.clientes(id),
  productoid TEXT REFERENCES public.productos(productoid),
  cantidad_de_piezas INT NOT NULL DEFAULT 0,
  volumen_de_pieza NUMERIC(14,4) NOT NULL DEFAULT 0,
  status status_produccion NOT NULL DEFAULT 'En proceso',
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE, fecha_fin DATE,
  precio_total NUMERIC(14,4) NOT NULL DEFAULT 0, notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.produccion_clientes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_pcli_updated BEFORE UPDATE ON public.produccion_clientes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_pcli_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.produccioncliid IS NULL OR NEW.produccioncliid='' THEN NEW.produccioncliid := 'PCLI-' || lpad(NEW.contadorid::text,5,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_pcli_id BEFORE INSERT ON public.produccion_clientes FOR EACH ROW EXECUTE FUNCTION public.set_pcli_id();

CREATE TABLE public.esm_prod_cer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produccionid TEXT REFERENCES public.producciones(produccionid) ON DELETE CASCADE,
  esmalte_id TEXT REFERENCES public.productos(productoid),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.esm_prod_cer ENABLE ROW LEVEL SECURITY;

CREATE SEQUENCE quemas_seq START 1;
CREATE TABLE public.quemas (
  id_quema TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('quemas_seq'),
  inicio_de_quema TIMESTAMPTZ NOT NULL DEFAULT now(),
  fin_de_quema TIMESTAMPTZ,
  id_horno TEXT NOT NULL REFERENCES public.lista_de_hornos(id_horno),
  encargado_de_quema TEXT REFERENCES public.usuarios(id),
  porc_inicio_gas NUMERIC(7,4) NOT NULL DEFAULT 0,
  porc_fin_gas NUMERIC(7,4) NOT NULL DEFAULT 0,
  porc_usado NUMERIC(7,4) NOT NULL DEFAULT 0,
  cantidad_usado_en_lt NUMERIC(14,4) NOT NULL DEFAULT 0,
  costo_de_la_quema NUMERIC(14,4) NOT NULL DEFAULT 0,
  tipo_de_quema TEXT,
  temperatura_estimada NUMERIC(7,2) NOT NULL DEFAULT 0,
  temperatura_alcanzada NUMERIC(7,2) NOT NULL DEFAULT 0,
  cantidad_de_piezas INT NOT NULL DEFAULT 0,
  energia_usada TEXT REFERENCES public.productos(productoid),
  tiempo_total_de_quema NUMERIC(10,4) NOT NULL DEFAULT 0,
  status status_quema NOT NULL DEFAULT 'Programada',
  notas TEXT,
  cerrar_al_ultimo_log BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_quema_fin CHECK (fin_de_quema IS NULL OR inicio_de_quema IS NULL OR fin_de_quema >= inicio_de_quema)
);
CREATE INDEX idx_quemas_inicio ON public.quemas(inicio_de_quema);
CREATE INDEX idx_quemas_horno ON public.quemas(id_horno);
ALTER TABLE public.quemas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_quemas_updated BEFORE UPDATE ON public.quemas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_quema_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id_quema IS NULL OR NEW.id_quema='' THEN NEW.id_quema := 'Q-' || lpad(NEW.contadorid::text,4,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_quema_id BEFORE INSERT ON public.quemas FOR EACH ROW EXECUTE FUNCTION public.set_quema_id();

CREATE SEQUENCE bq_seq START 1;
CREATE TABLE public.firing_logs (
  id_bq TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('bq_seq'),
  id_quema TEXT NOT NULL REFERENCES public.quemas(id_quema) ON DELETE CASCADE,
  tiempo TIMESTAMPTZ NOT NULL DEFAULT now(),
  temperatura_c NUMERIC(7,2) NOT NULL DEFAULT 0,
  consumo_energia NUMERIC(14,4) DEFAULT 0,
  observaciones TEXT, imagen TEXT, apertura_de_chimenea TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_logs_quema_tiempo ON public.firing_logs(id_quema, tiempo);
ALTER TABLE public.firing_logs ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.set_bq_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id_bq IS NULL OR NEW.id_bq='' THEN NEW.id_bq := 'BQ-' || lpad(NEW.contadorid::text,5,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_bq_id BEFORE INSERT ON public.firing_logs FOR EACH ROW EXECUTE FUNCTION public.set_bq_id();

CREATE SEQUENCE qdp_seq START 1;
CREATE TABLE public.quemadepieza (
  quemadepiezaid TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('qdp_seq'),
  id_quema TEXT NOT NULL REFERENCES public.quemas(id_quema) ON DELETE CASCADE,
  produccionid TEXT REFERENCES public.producciones(produccionid),
  produccioncliid TEXT REFERENCES public.produccion_clientes(produccioncliid),
  id_horno TEXT,
  cantidad_de_piezas INT NOT NULL DEFAULT 0,
  volumen_de_pieza NUMERIC(14,4) NOT NULL DEFAULT 0,
  volumen_total NUMERIC(14,4) NOT NULL DEFAULT 0,
  porcentaje_espacio_en_horno NUMERIC(7,4) NOT NULL DEFAULT 0,
  costo_de_quema_unidad NUMERIC(14,4) NOT NULL DEFAULT 0,
  costo_de_quema NUMERIC(14,4) NOT NULL DEFAULT 0,
  tipo_de_quema TEXT, status_de_produccion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_qdp_quema ON public.quemadepieza(id_quema);
ALTER TABLE public.quemadepieza ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_qdp_updated BEFORE UPDATE ON public.quemadepieza FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_qdp_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.quemadepiezaid IS NULL OR NEW.quemadepiezaid='' THEN NEW.quemadepiezaid := 'QDP-' || lpad(NEW.contadorid::text,6,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_qdp_id BEFORE INSERT ON public.quemadepieza FOR EACH ROW EXECUTE FUNCTION public.set_qdp_id();

CREATE SEQUENCE ventas_seq START 1;
CREATE TABLE public.ventas (
  id TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('ventas_seq'),
  cliente_id TEXT REFERENCES public.clientes(id),
  productoid TEXT REFERENCES public.productos(productoid),
  tipo tipo_producto, cantidad NUMERIC(14,4) NOT NULL DEFAULT 0,
  precio_unidad NUMERIC(14,4) NOT NULL DEFAULT 0,
  total NUMERIC(14,4) GENERATED ALWAYS AS (cantidad * precio_unidad) STORED,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE, notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_ventas_updated BEFORE UPDATE ON public.ventas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE FUNCTION public.set_venta_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id IS NULL OR NEW.id='' THEN NEW.id := 'V-' || lpad(NEW.contadorid::text,6,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_venta_id BEFORE INSERT ON public.ventas FOR EACH ROW EXECUTE FUNCTION public.set_venta_id();

CREATE SEQUENCE tx_seq START 1;
CREATE TABLE public.transacciones_contabilidad (
  id TEXT PRIMARY KEY, contadorid INT NOT NULL DEFAULT nextval('tx_seq'),
  cliente_id TEXT REFERENCES public.clientes(id),
  ingreso NUMERIC(14,4) NOT NULL DEFAULT 0, egreso NUMERIC(14,4) NOT NULL DEFAULT 0,
  concepto TEXT, fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transacciones_contabilidad ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.set_tx_id() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN IF NEW.id IS NULL OR NEW.id='' THEN NEW.id := 'TX-' || lpad(NEW.contadorid::text,6,'0'); END IF; RETURN NEW; END $$;
CREATE TRIGGER trg_tx_id BEFORE INSERT ON public.transacciones_contabilidad FOR EACH ROW EXECUTE FUNCTION public.set_tx_id();

-- BUSINESS FUNCTIONS
CREATE OR REPLACE FUNCTION public.tipo_de_quema_from_temp(temp NUMERIC)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN temp IS NULL OR temp = 0 THEN NULL
    WHEN temp < 900 THEN 'Bizcocho Baja'
    WHEN temp < 1050 THEN 'Baja'
    WHEN temp < 1180 THEN 'Media'
    WHEN temp < 1240 THEN 'Media Alta'
    WHEN temp < 1300 THEN 'Alta'
    ELSE 'Especial / Raku'
  END
$$;

CREATE OR REPLACE FUNCTION public.recalc_producto(_pid TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_cf NUMERIC(14,4); v_pc NUMERIC(14,4); v_pm NUMERIC(14,4); v_v NUMERIC(14,4);
BEGIN
  SELECT COALESCE(SUM(valor_de_gasto),0) INTO v_cf FROM public.formulas WHERE productoid=_pid;
  SELECT COALESCE(MAX(precio_unidad),0) INTO v_pc FROM public.detalles_de_compra WHERE productoid=_pid;
  SELECT COALESCE(precio_manual,0) INTO v_pm FROM public.productos WHERE productoid=_pid;
  v_v := CASE
    WHEN v_cf > v_pm AND v_cf > 0 THEN v_cf
    WHEN v_pm > 0 THEN v_pm
    ELSE v_pc
  END;
  UPDATE public.productos SET costo_de_formula=v_cf, precio_de_compra=v_pc, valor_en_bodega=v_v WHERE productoid=_pid;
END $$;

CREATE OR REPLACE FUNCTION public.formulas_before_iu() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v NUMERIC(14,4);
BEGIN
  SELECT COALESCE(valor_en_bodega,0) INTO v FROM public.productos WHERE productoid=NEW.componente_id;
  NEW.valor_de_gasto := COALESCE(v,0) * COALESCE(NEW.cantidad,0);
  RETURN NEW;
END $$;
CREATE TRIGGER trg_formulas_calc BEFORE INSERT OR UPDATE ON public.formulas FOR EACH ROW EXECUTE FUNCTION public.formulas_before_iu();

CREATE OR REPLACE FUNCTION public.formulas_after_iud() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP='DELETE' THEN PERFORM public.recalc_producto(OLD.productoid); RETURN OLD;
  ELSE
    PERFORM public.recalc_producto(NEW.productoid);
    IF TG_OP='UPDATE' AND OLD.productoid IS DISTINCT FROM NEW.productoid THEN
      PERFORM public.recalc_producto(OLD.productoid);
    END IF;
    RETURN NEW;
  END IF;
END $$;
CREATE TRIGGER trg_formulas_recalc AFTER INSERT OR UPDATE OR DELETE ON public.formulas FOR EACH ROW EXECUTE FUNCTION public.formulas_after_iud();

CREATE OR REPLACE FUNCTION public.dc_after_iud() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_total NUMERIC(14,4);
BEGIN
  IF TG_OP IN ('INSERT','UPDATE') THEN
    PERFORM public.recalc_producto(NEW.productoid);
    SELECT COALESCE(SUM(cantidad),0) INTO v_total FROM public.detalles_de_compra WHERE productoid=NEW.productoid;
    UPDATE public.productos SET entrantes=v_total WHERE productoid=NEW.productoid;
  END IF;
  IF TG_OP='DELETE' OR (TG_OP='UPDATE' AND OLD.productoid IS DISTINCT FROM NEW.productoid) THEN
    PERFORM public.recalc_producto(OLD.productoid);
    SELECT COALESCE(SUM(cantidad),0) INTO v_total FROM public.detalles_de_compra WHERE productoid=OLD.productoid;
    UPDATE public.productos SET entrantes=v_total WHERE productoid=OLD.productoid;
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
CREATE TRIGGER trg_dc_recalc AFTER INSERT OR UPDATE OR DELETE ON public.detalles_de_compra FOR EACH ROW EXECUTE FUNCTION public.dc_after_iud();

CREATE OR REPLACE FUNCTION public.productos_before_u() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.precio_manual IS DISTINCT FROM OLD.precio_manual
     OR NEW.costo_de_formula IS DISTINCT FROM OLD.costo_de_formula
     OR NEW.precio_de_compra IS DISTINCT FROM OLD.precio_de_compra THEN
    NEW.valor_en_bodega := CASE
      WHEN NEW.costo_de_formula > NEW.precio_manual AND NEW.costo_de_formula > 0 THEN NEW.costo_de_formula
      WHEN NEW.precio_manual > 0 THEN NEW.precio_manual
      ELSE NEW.precio_de_compra
    END;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_prod_recalc BEFORE UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.productos_before_u();

CREATE OR REPLACE FUNCTION public.recalc_quema(_qid TEXT) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_max NUMERIC(7,2); v_pz INT; v_tk NUMERIC(14,4); v_vol NUMERIC(14,4);
  v_eng TEXT; v_eval NUMERIC(14,4); q RECORD;
BEGIN
  SELECT * INTO q FROM public.quemas WHERE id_quema=_qid;
  IF NOT FOUND THEN RETURN; END IF;
  SELECT COALESCE(MAX(temperatura_c),0) INTO v_max FROM public.firing_logs WHERE id_quema=_qid;
  SELECT COALESCE(SUM(cantidad_de_piezas),0) INTO v_pz FROM public.quemadepieza WHERE id_quema=_qid;
  SELECT tamano_tanque, volumen_interno, tipo_de_energia INTO v_tk, v_vol, v_eng FROM public.lista_de_hornos WHERE id_horno=q.id_horno;
  SELECT COALESCE(valor_en_bodega,0) INTO v_eval FROM public.productos WHERE productoid=COALESCE(q.energia_usada, v_eng);

  UPDATE public.quemas SET
    temperatura_alcanzada=v_max,
    cantidad_de_piezas=v_pz,
    porc_usado=GREATEST(COALESCE(porc_inicio_gas,0)-COALESCE(porc_fin_gas,0),0),
    cantidad_usado_en_lt=GREATEST(COALESCE(porc_inicio_gas,0)-COALESCE(porc_fin_gas,0),0)*COALESCE(v_tk,0)/100.0,
    costo_de_la_quema=(GREATEST(COALESCE(porc_inicio_gas,0)-COALESCE(porc_fin_gas,0),0)*COALESCE(v_tk,0)/100.0)*COALESCE(v_eval,0),
    tipo_de_quema=COALESCE(public.tipo_de_quema_from_temp(temperatura_estimada), tipo_de_quema),
    energia_usada=COALESCE(energia_usada, v_eng),
    tiempo_total_de_quema=CASE
      WHEN fin_de_quema IS NOT NULL THEN EXTRACT(EPOCH FROM (fin_de_quema-inicio_de_quema))/3600.0
      ELSE EXTRACT(EPOCH FROM (now()-inicio_de_quema))/3600.0
    END
  WHERE id_quema=_qid;
END $$;

CREATE OR REPLACE FUNCTION public.quemas_before_iu() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.fin_de_quema IS NOT NULL AND (TG_OP='INSERT' OR OLD.fin_de_quema IS NULL OR OLD.fin_de_quema IS DISTINCT FROM NEW.fin_de_quema) THEN
    IF NEW.status <> 'Terminada' THEN NEW.status := 'Terminada'; END IF;
  END IF;
  NEW.tipo_de_quema := COALESCE(public.tipo_de_quema_from_temp(NEW.temperatura_estimada), NEW.tipo_de_quema);
  NEW.porc_usado := GREATEST(COALESCE(NEW.porc_inicio_gas,0)-COALESCE(NEW.porc_fin_gas,0),0);
  RETURN NEW;
END $$;
CREATE TRIGGER trg_quemas_before BEFORE INSERT OR UPDATE ON public.quemas FOR EACH ROW EXECUTE FUNCTION public.quemas_before_iu();

CREATE OR REPLACE FUNCTION public.quemas_after_iu() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN PERFORM public.recalc_quema(NEW.id_quema); RETURN NEW; END $$;
CREATE TRIGGER trg_quemas_after AFTER INSERT OR UPDATE ON public.quemas FOR EACH ROW EXECUTE FUNCTION public.quemas_after_iu();

CREATE OR REPLACE FUNCTION public.firing_logs_after_iud() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_qid TEXT; v_max TIMESTAMPTZ; v_close BOOLEAN;
BEGIN
  v_qid := COALESCE(NEW.id_quema, OLD.id_quema);
  PERFORM public.recalc_quema(v_qid);
  SELECT cerrar_al_ultimo_log INTO v_close FROM public.quemas WHERE id_quema=v_qid;
  IF COALESCE(v_close,false) THEN
    SELECT MAX(tiempo) INTO v_max FROM public.firing_logs WHERE id_quema=v_qid;
    UPDATE public.quemas SET fin_de_quema=v_max WHERE id_quema=v_qid;
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
CREATE TRIGGER trg_logs_recalc AFTER INSERT OR UPDATE OR DELETE ON public.firing_logs FOR EACH ROW EXECUTE FUNCTION public.firing_logs_after_iud();

CREATE OR REPLACE FUNCTION public.qdp_before_iu() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_horno TEXT; v_hvol NUMERIC(14,4); v_cq NUMERIC(14,4); v_tipo TEXT;
  v_status TEXT; v_cant INT; v_vol NUMERIC(14,4);
BEGIN
  SELECT id_horno, costo_de_la_quema, tipo_de_quema INTO v_horno, v_cq, v_tipo FROM public.quemas WHERE id_quema=NEW.id_quema;
  NEW.id_horno := v_horno;
  NEW.tipo_de_quema := v_tipo;
  SELECT volumen_interno INTO v_hvol FROM public.lista_de_hornos WHERE id_horno=v_horno;
  IF NEW.produccioncliid IS NOT NULL THEN
    SELECT cantidad_de_piezas, volumen_de_pieza, status::text INTO v_cant, v_vol, v_status FROM public.produccion_clientes WHERE produccioncliid=NEW.produccioncliid;
  ELSIF NEW.produccionid IS NOT NULL THEN
    SELECT cantidad_de_piezas, volumen_de_pieza, status::text INTO v_cant, v_vol, v_status FROM public.producciones WHERE produccionid=NEW.produccionid;
  END IF;
  NEW.cantidad_de_piezas := COALESCE(NULLIF(NEW.cantidad_de_piezas,0), v_cant, 0);
  NEW.volumen_de_pieza := COALESCE(NULLIF(NEW.volumen_de_pieza,0), v_vol, 0);
  NEW.status_de_produccion := v_status;
  NEW.volumen_total := COALESCE(NEW.volumen_de_pieza,0) * COALESCE(NEW.cantidad_de_piezas,0);
  IF COALESCE(v_hvol,0) > 0 THEN
    NEW.porcentaje_espacio_en_horno := NEW.volumen_total * 100.0 / v_hvol;
    NEW.costo_de_quema_unidad := ((COALESCE(NEW.volumen_de_pieza,0)*3) * COALESCE(v_cq,0)) / v_hvol;
  ELSE
    NEW.porcentaje_espacio_en_horno := 0; NEW.costo_de_quema_unidad := 0;
  END IF;
  NEW.costo_de_quema := NEW.costo_de_quema_unidad * COALESCE(NEW.cantidad_de_piezas,0);
  RETURN NEW;
END $$;
CREATE TRIGGER trg_qdp_calc BEFORE INSERT OR UPDATE ON public.quemadepieza FOR EACH ROW EXECUTE FUNCTION public.qdp_before_iu();

CREATE OR REPLACE FUNCTION public.qdp_after_iud() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN PERFORM public.recalc_quema(COALESCE(NEW.id_quema, OLD.id_quema)); IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF; END $$;
CREATE TRIGGER trg_qdp_recalc AFTER INSERT OR UPDATE OR DELETE ON public.quemadepieza FOR EACH ROW EXECUTE FUNCTION public.qdp_after_iud();

CREATE OR REPLACE FUNCTION public.recalc_cliente(_cid TEXT) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_v NUMERIC(14,4); v_i NUMERIC(14,4); v_p NUMERIC(14,4); v_ad NUMERIC(14,4); v_aa NUMERIC(14,4);
BEGIN
  SELECT COALESCE(SUM(total),0) INTO v_v FROM public.ventas WHERE cliente_id=_cid AND (tipo IS NULL OR tipo<>'Mano de Obra');
  SELECT COALESCE(SUM(precio_total),0) INTO v_p FROM public.produccion_clientes WHERE cliente_id=_cid;
  SELECT COALESCE(SUM(ingreso),0) INTO v_i FROM public.transacciones_contabilidad WHERE cliente_id=_cid;
  SELECT ajuste_de_deuda, ajuste_de_abonos INTO v_ad, v_aa FROM public.clientes WHERE id=_cid;
  UPDATE public.clientes SET
    abonos = v_i + COALESCE(v_aa,0),
    deuda = (v_v + v_p) - (v_i + COALESCE(v_aa,0)) + COALESCE(v_ad,0)
  WHERE id=_cid;
END $$;

CREATE OR REPLACE FUNCTION public.ventas_after_iud() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP <> 'DELETE' AND NEW.cliente_id IS NOT NULL THEN PERFORM public.recalc_cliente(NEW.cliente_id); END IF;
  IF TG_OP IN ('UPDATE','DELETE') AND OLD.cliente_id IS NOT NULL AND (TG_OP='DELETE' OR OLD.cliente_id IS DISTINCT FROM NEW.cliente_id) THEN
    PERFORM public.recalc_cliente(OLD.cliente_id);
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
CREATE TRIGGER trg_ventas_recalc AFTER INSERT OR UPDATE OR DELETE ON public.ventas FOR EACH ROW EXECUTE FUNCTION public.ventas_after_iud();

CREATE OR REPLACE FUNCTION public.tx_after_iud() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP<>'DELETE' AND NEW.cliente_id IS NOT NULL THEN PERFORM public.recalc_cliente(NEW.cliente_id); END IF;
  IF TG_OP='DELETE' AND OLD.cliente_id IS NOT NULL THEN PERFORM public.recalc_cliente(OLD.cliente_id); END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
CREATE TRIGGER trg_tx_recalc AFTER INSERT OR UPDATE OR DELETE ON public.transacciones_contabilidad FOR EACH ROW EXECUTE FUNCTION public.tx_after_iud();

-- RLS POLICIES
CREATE POLICY "profiles_select_all_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador']::app_role[]));
CREATE POLICY "roles_select_auth" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_su_manage" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'SU')) WITH CHECK (public.has_role(auth.uid(),'SU'));
CREATE POLICY "usuarios_sel" ON public.usuarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "usuarios_ins" ON public.usuarios FOR INSERT TO authenticated WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador']::app_role[]));
CREATE POLICY "usuarios_upd" ON public.usuarios FOR UPDATE TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador']::app_role[]));
CREATE POLICY "usuarios_del" ON public.usuarios FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'SU'));
CREATE POLICY "prov_sel" ON public.proveedores FOR SELECT TO authenticated USING (true);
CREATE POLICY "prov_mod" ON public.proveedores FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador']::app_role[]));
CREATE POLICY "cli_sel" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "cli_mod" ON public.clientes FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Vendedor']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Vendedor']::app_role[]));
CREATE POLICY "prod_sel" ON public.productos FOR SELECT TO authenticated USING (true);
CREATE POLICY "prod_ins" ON public.productos FOR INSERT TO authenticated WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista','Bodegero']::app_role[]));
CREATE POLICY "prod_upd" ON public.productos FOR UPDATE TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista','Bodegero']::app_role[]));
CREATE POLICY "prod_del" ON public.productos FOR DELETE TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador']::app_role[]));
CREATE POLICY "fml_sel" ON public.formulas FOR SELECT TO authenticated USING (true);
CREATE POLICY "fml_mod" ON public.formulas FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[]));
CREATE POLICY "oc_sel" ON public.ordenes_de_compra FOR SELECT TO authenticated USING (true);
CREATE POLICY "oc_mod" ON public.ordenes_de_compra FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Bodegero']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Bodegero']::app_role[]));
CREATE POLICY "dc_sel" ON public.detalles_de_compra FOR SELECT TO authenticated USING (true);
CREATE POLICY "dc_mod" ON public.detalles_de_compra FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Bodegero']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Bodegero']::app_role[]));
CREATE POLICY "hornos_sel" ON public.lista_de_hornos FOR SELECT TO authenticated USING (true);
CREATE POLICY "hornos_mod" ON public.lista_de_hornos FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador']::app_role[]));
CREATE POLICY "prods_sel" ON public.producciones FOR SELECT TO authenticated USING (true);
CREATE POLICY "prods_mod" ON public.producciones FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[]));
CREATE POLICY "pcli_sel" ON public.produccion_clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "pcli_mod" ON public.produccion_clientes FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista','Vendedor']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista','Vendedor']::app_role[]));
CREATE POLICY "epc_sel" ON public.esm_prod_cer FOR SELECT TO authenticated USING (true);
CREATE POLICY "epc_mod" ON public.esm_prod_cer FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[]));
CREATE POLICY "quemas_sel" ON public.quemas FOR SELECT TO authenticated USING (true);
CREATE POLICY "quemas_mod" ON public.quemas FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[]));
CREATE POLICY "logs_sel" ON public.firing_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "logs_mod" ON public.firing_logs FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[]));
CREATE POLICY "qdp_sel" ON public.quemadepieza FOR SELECT TO authenticated USING (true);
CREATE POLICY "qdp_mod" ON public.quemadepieza FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Maestro Ceramista','Ceramista']::app_role[]));
CREATE POLICY "ventas_sel" ON public.ventas FOR SELECT TO authenticated USING (true);
CREATE POLICY "ventas_mod" ON public.ventas FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Vendedor']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Vendedor']::app_role[]));
CREATE POLICY "tx_sel" ON public.transacciones_contabilidad FOR SELECT TO authenticated USING (true);
CREATE POLICY "tx_mod" ON public.transacciones_contabilidad FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Vendedor']::app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['SU','Administrador','Vendedor']::app_role[]));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('productos','productos', true),
  ('hornos','hornos', true),
  ('avatares','avatares', true),
  ('firing-logs','firing-logs', true),
  ('fichas-tecnicas','fichas-tecnicas', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "public_read_buckets" ON storage.objects FOR SELECT USING (bucket_id IN ('productos','hornos','avatares','firing-logs','fichas-tecnicas'));
CREATE POLICY "auth_write_buckets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('productos','hornos','avatares','firing-logs','fichas-tecnicas'));
CREATE POLICY "auth_update_buckets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('productos','hornos','avatares','firing-logs','fichas-tecnicas'));
CREATE POLICY "auth_delete_buckets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('productos','hornos','avatares','firing-logs','fichas-tecnicas'));
