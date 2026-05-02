import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-CDL59hpK.js";
import { s as supabase, L as Link } from "./router-CXOYXOoj.js";
import { u as useQuery, a as fmtNum, b as fmtMoney } from "./format-BdkPdSRh.js";
import { I as Input } from "./input-D_CiP2_w.js";
import { C as Card, d as CardContent } from "./card-CJ2FLLQe.js";
import { c as cva } from "./index-MtTTh3JD.js";
import { a as cn } from "./createLucideIcon-wO4OZstR.js";
import { P as Package } from "./package-J02ERnkS.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function ProductosPage() {
  const [q, setQ] = reactExports.useState("");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("productos").select("productoid, nombre, tipo, categoria_esmaltes, unidad, valor_en_bodega, precio_de_venta, en_bodega, imagen").order("nombre");
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const filtered = (data ?? []).filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()) || p.productoid.toLowerCase().includes(q.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Productos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Inventario, fórmulas y precios." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Buscar producto...", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-sm" }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Cargando..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No hay productos todavía." })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/productos", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden transition hover:border-primary/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-muted", children: p.imagen ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.imagen, alt: p.nombre, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium leading-tight", children: p.nombre }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: p.productoid })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: p.tipo })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm tabular-nums", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Bodega" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            fmtNum(p.en_bodega, 2),
            " ",
            p.unidad
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm tabular-nums", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Valor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmtMoney(p.valor_en_bodega) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm tabular-nums", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Venta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: fmtMoney(p.precio_de_venta) })
        ] })
      ] })
    ] }) }, p.productoid)) })
  ] });
}
export {
  ProductosPage as component
};
