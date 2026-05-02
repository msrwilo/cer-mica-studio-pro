import { U as jsxRuntimeExports } from "./worker-entry-CDL59hpK.js";
import { u as useQuery, a as fmtNum } from "./format-BdkPdSRh.js";
import { s as supabase } from "./router-CXOYXOoj.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle } from "./card-CJ2FLLQe.js";
import { P as Package } from "./package-J02ERnkS.js";
import { H as Hammer } from "./hammer-CMltKBVl.js";
import { F as Flame } from "./flame-D_hDqx6G.js";
import { B as Boxes } from "./boxes-D6FuXgmK.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-wO4OZstR.js";
function PanelPage() {
  const {
    data
  } = useQuery({
    queryKey: ["panel-kpis"],
    queryFn: async () => {
      const [productos, hornos, quemas, prods] = await Promise.all([supabase.from("productos").select("productoid", {
        count: "exact",
        head: true
      }), supabase.from("lista_de_hornos").select("id_horno", {
        count: "exact",
        head: true
      }), supabase.from("quemas").select("id_quema, status, inicio_de_quema, temperatura_alcanzada, tipo_de_quema").order("inicio_de_quema", {
        ascending: false
      }).limit(8), supabase.from("producciones").select("produccionid, status").eq("status", "En proceso")]);
      return {
        productos: productos.count ?? 0,
        hornos: hornos.count ?? 0,
        quemas: quemas.data ?? [],
        prodsEnProceso: prods.data?.length ?? 0
      };
    }
  });
  const kpis = [{
    label: "Productos",
    value: data?.productos ?? 0,
    icon: Package
  }, {
    label: "Hornos",
    value: data?.hornos ?? 0,
    icon: Hammer
  }, {
    label: "Quemas registradas",
    value: data?.quemas?.length ?? 0,
    icon: Flame
  }, {
    label: "Producciones en proceso",
    value: data?.prodsEnProceso ?? 0,
    icon: Boxes
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Panel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Resumen general del taller." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: kpis.map(({
      label,
      value,
      icon: Icon
    }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold tabular-nums", children: fmtNum(value, 0) })
      ] })
    ] }) }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Últimas quemas" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: data?.quemas?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: data.quemas.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
            q.id_quema,
            " · ",
            q.tipo_de_quema ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(q.inicio_de_quema).toLocaleString("es-MX") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
            fmtNum(q.temperatura_alcanzada, 0),
            " °C"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-muted px-2 py-0.5 text-xs", children: q.status })
        ] })
      ] }, q.id_quema)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Aún no hay quemas registradas." }) })
    ] })
  ] });
}
export {
  PanelPage as component
};
