# Taller Cerámico — Plan de construcción

App completa en TanStack Start + React + Tailwind + shadcn/ui + Lovable Cloud (Supabase). UI 100% en español, dark mode forzado, paleta terracota cálida sobre crema oscuro.

## 1. Diseño visual

- Tema: dark mode permanente (sin toggle).
- Paleta (oklch):
  - background `#1a1410` (marrón muy oscuro)
  - card `#241b16`
  - primary terracota `#c2410c` / hover `#9a3412`
  - accent crema `#f5e6d3` para texto cálido y acentos
  - muted `#3a2e26`, border `#4a3a30`
  - destructive coral `#e11d48`
- Tipografía: Inter (sans) + tabular nums para números/temperaturas.
- shadcn/ui en todos los formularios, tablas, diálogos, sidebar.
- Sidebar fijo a la izquierda con logo, navegación principal (Panel, Productos, Producciones, Hornos, Quemas, Calendario, Clientes, Proveedores, Compras, Contabilidad), avatar + menú usuario abajo.

## 2. Autenticación y roles

- Lovable Cloud Auth: email/password + Google.
- Tabla `profiles` (1:1 con `auth.users`): `nombre`, `apellido_paterno`, `apellido_materno`, `username`, `telefono`, `direccion`, `foto`, `useractive`, trigger `handle_new_user` que la crea al registro.
- Tabla `usuarios` espejo de negocio con ID legible `USF-0001` ligada a `profiles.id`; `useremail` único.
- **Roles separados** en `user_roles` con enum `app_role` = `SU | Administrador | Maestro Ceramista | Ceramista | Vendedor | Bodegero`. Función `has_role(_user_id, _role)` `SECURITY DEFINER`.
- Matriz RLS:
  - SELECT: cualquier autenticado en todas las tablas operativas.
  - INSERT/UPDATE: Ceramista+ en producciones/quemas/firing_logs/formulas; Bodegero en entradas/salidas y compras; Vendedor en clientes/ventas/contabilidad; Administrador y SU en todo. Pricing (`precio_manual`, `precio_de_venta` override) sólo Administrador/SU. Gestión de `usuarios` y `user_roles` sólo SU.
- Rutas protegidas con `_authenticated` layout (`beforeLoad` valida sesión Supabase + redirect a `/login`). Páginas restringidas por rol via `beforeLoad` que llama server fn que usa `has_role`.

## 3. Esquema de base de datos

Todos los IDs textuales se generan con secuencias dedicadas y triggers `BEFORE INSERT` (Postgres no permite `GENERATED` con subconsulta a secuencia + lpad). Tipos numéricos en `numeric(14,4)`.

### Enums
`tipo_producto`, `categoria_esmaltes`, `unidad_producto`, `tipo_cliente`, `etiqueta_proveedor`, `app_role`, `status_produccion`, `status_quema`.

### Tablas (resumen — todas con `created_at`, `updated_at`, `created_by`)

1. **productos** — campos del spec. `costo_de_formula`, `precio_de_compra`, `valor_en_bodega`, `precio_de_venta`, `en_bodega` mantenidos por triggers (no `GENERATED` porque dependen de otras tablas). `valor_en_bodega` = CASE descrito; `precio_de_venta` = generated stored sobre `valor_en_bodega`.
2. **formulas** — trigger AFTER INSERT/UPDATE/DELETE → recalcula `productos.costo_de_formula` del producto padre, lo que cascada a `valor_en_bodega` y `precio_de_venta`.
3. **detallesdecompra** y **ordenesdecompra** (esquema mínimo: proveedor, fecha, total, items con `productoid`, `cantidad`, `precio_unidad`). Trigger recalcula `productos.precio_de_compra = MAX(precio_unidad)` y suma `entrantes`.
4. **usuarios**, **clientes**, **proveedores** — IDs `USF-`, `CL-`, `PROV-`.
5. **lista_de_hornos** — `volumen_interno` GENERATED como `(alto*largo*ancho)/1000`.
6. **quemas** — IDs `QDP-` (renombrado `Q-` para no chocar con quemadepieza; usaré `Q-0001` para quemas y `QDP-` para piezas tal cual el spec). Trigger:
   - al insertar firing_log: actualiza `temperatura_alcanzada = MAX(temperatura_c)`, y si la quema marca `cerrar_al_ultimo_log=true` ajusta `fin_de_quema`.
   - calcula `porc_usado`, `cantidad_usado_en_lt`, `costo_de_la_quema`, `tiempo_total_de_quema`, `cantidad_de_piezas` en columnas mantenidas por trigger.
   - al setear `fin_de_quema` → `status='Terminada'`.
   - CHECK `fin_de_quema IS NULL OR inicio_de_quema IS NULL OR fin_de_quema >= inicio_de_quema`.
7. **firing_logs** (`bitacora_de_quema`) — `tiempo_transcurrido_hours`, `tiempo_hhmm` GENERATED stored donde sea posible; recalcula agregados de quema.
8. **quemadepieza** — campos derivados via trigger leyendo producción/horno/quema.
9. **producciones** + **produccionclientes** — esquema razonable: producto, cantidad, volumen_de_pieza, status (`En proceso`, `Terminada`, `Merma`), fechas, cliente opcional, encargado.
10. **ventas**, **transaccionescontabilidad** — soporte mínimo para `clientes.deuda` y `clientes.abonos` mantenidos por trigger (suma de ventas no Mano de Obra − abonos + ajustes).
11. **esmprodcer** — relación esmalte↔producción (sólo tabla pivote).

### Función SQL

```sql
tipo_de_quema_from_temp(temp numeric) returns text
```

Mapeo por defecto (puedes corregir luego):
- `< 900` → `Bizcocho Baja`
- `900–1050` → `Baja`
- `1050–1180` → `Media`
- `1180–1240` → `Media Alta`
- `1240–1300` → `Alta`
- `>= 1300` → `Especial / Raku`

### Vistas

- `v_producto_detalle` (producto + arrays JSON de fórmulas y compras).
- `v_quema_detalle` (quema + horno + logs + piezas + agregados).
- `v_calendario_quemas` (quemas con campos para render).
- `v_kpis_panel` (en proceso, terminadas mes, mermas mes, quemas activas).

### Almacenamiento

Buckets Supabase: `productos`, `fichas-tecnicas`, `avatares`, `hornos`, `firing-logs`. Políticas: lectura pública para imágenes de producto/horno; escritura sólo autenticados.

## 4. Server functions y endpoints

`createServerFn` con `requireSupabaseAuth` para todo CRUD. Endpoints clave:
- `listProductos`, `getProductoDetalle`, `upsertProducto`, `upsertFormula`.
- `listProducciones`, `getProduccionDetalle`, `cambiarStatusProduccion`.
- `listHornos`, `getHornoDetalle` (con próximas quemas + historial).
- `listQuemas`, `getQuemaDetalle`, `addFiringLog`, `cerrarQuema`, `exportFiringLogsCsv` (devuelve CSV).
- `getCalendarioQuemas(rango)`.
- `listClientes`, `listProveedores`, `crearVenta`, `registrarAbono`.

CSV export se genera en server fn (string CSV) y se descarga desde el cliente con Blob.

## 5. Rutas y UI

```text
/login                              email+password, Google, link a recuperación
/_authenticated/                    Panel: KPIs, próximas quemas, últimas producciones, gráfico mini de actividad
/_authenticated/productos           Grid de cards, filtros tipo/categoría, búsqueda, botón Nuevo
/_authenticated/productos/$id       Detalle: foto, datos, tabs Fórmula / Compras / Movimientos / Notas
/_authenticated/producciones        Tabla + KPIs (en proceso, terminadas mes, mermas), filtros
/_authenticated/producciones/$id    Detalle, cambio rápido de status, piezas relacionadas
/_authenticated/hornos              Lista cards + mini-calendario lateral
/_authenticated/hornos/$id          Datos, plano, historial de quemas, próximas
/_authenticated/quemas              Tabla con filtros (horno, tipo, status, rango)
/_authenticated/quemas/$id          Encabezado con gauge temperatura, tabla logs, form rápido add log,
                                    gráfico Recharts Temperatura vs Tiempo con línea objetivo,
                                    tabla piezas, botón Exportar CSV, botón Cerrar quema
/_authenticated/calendario          Vistas Mes / Semana, color por tipo_de_quema, opacidad por status,
                                    click → drawer con detalle + link
/_authenticated/clientes, /clientes/$id
/_authenticated/proveedores, /proveedores/$id
/_authenticated/compras             Órdenes + detalles
/_authenticated/contabilidad        Transacciones, abonos
/_authenticated/usuarios            Sólo SU/Admin: gestionar roles
```

Calendario implementado con `date-fns` + grid CSS propio (sin libs pesadas). Charts con `recharts`.

## 6. Detalles técnicos clave

- Migraciones SQL en orden: enums → secuencias → tablas → índices → funciones → triggers → vistas → RLS → políticas → seeds.
- Índices en todas las FKs y en `quemas(inicio_de_quema)`, `firing_logs(id_quema, tiempo)`.
- `precio_de_venta` y `volumen_interno` como `GENERATED ALWAYS AS ... STORED`. El resto de derivados multi-tabla se mantiene por triggers (Postgres no permite subconsultas en columnas generadas).
- Triggers idempotentes y agrupados en funciones `recalc_producto(productoid)`, `recalc_quema(id_quema)`, `recalc_cliente(cliente_id)`.
- Trigger `set_updated_at` global.
- Trigger `set_legible_id` por tabla que usa `nextval` + `lpad`.
- `usuarios` se sincroniza con `profiles` via trigger; `quien_modifica` se resuelve en server fn (no en cliente) leyendo `auth.uid() → profiles → usuarios.id`.
- Validación con Zod en cada server fn.

## 7. Entregables de esta iteración

1. Migración SQL completa (enums, tablas, secuencias, funciones, triggers, vistas, RLS).
2. Cliente Supabase + middleware auth + helpers de roles.
3. Layout autenticado con sidebar y theming dark terracota.
4. Páginas listadas arriba con CRUD funcional, filtros, gráficos y exportación CSV.
5. Seed mínimo (1 horno demo, productos de energía, roles base) para que el panel no aparezca vacío.
6. Tras la entrega, iteramos sobre detalles (mapping exacto de `tipo_de_quema_from_temp`, ajustes de RLS por rol, columnas extra que falten).

Confirma o pídeme ajustes y procedo.