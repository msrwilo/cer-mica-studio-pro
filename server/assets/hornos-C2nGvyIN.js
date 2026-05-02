import { U as jsxRuntimeExports } from "./worker-entry-CDL59hpK.js";
import { s as supabase, L as Link } from "./router-CXOYXOoj.js";
import { u as useQuery, a as fmtNum } from "./format-BdkPdSRh.js";
import { C as Card, d as CardContent } from "./card-CJ2FLLQe.js";
import { H as Hammer } from "./hammer-CMltKBVl.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-wO4OZstR.js";
function HornosPage() {
  const {
    data
  } = useQuery({
    queryKey: ["hornos"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("lista_de_hornos").select("*").order("id_horno");
      if (error) throw error;
      return data2 ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Hornos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Listado de hornos del taller." })
    ] }),
    !data || data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center gap-3 py-12 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { className: "h-10 w-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aún no hay hornos registrados." })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: data.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/hornos", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden transition hover:border-primary/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: h.nombre ?? h.id_horno }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: h.id_horno })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 grid grid-cols-2 gap-2 text-sm tabular-nums", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Volumen" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { children: [
            fmtNum(h.volumen_interno, 2),
            " L"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Quemadores" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: fmtNum(h.cantidad_de_quemadores, 0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Tanque" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { children: [
            fmtNum(h.tamano_tanque, 0),
            " L"
          ] })
        ] })
      ] })
    ] }) }) }, h.id_horno)) })
  ] });
}
export {
  HornosPage as component
};
