import { M as useRouter, U as jsxRuntimeExports, r as reactExports, _ as Outlet } from "./worker-entry-CDL59hpK.js";
import { u as useNavigate, L as Link, s as supabase } from "./router-CXOYXOoj.js";
import { B as Button } from "./button-B-ffBoQS.js";
import { F as Flame } from "./flame-D_hDqx6G.js";
import { c as createLucideIcon } from "./createLucideIcon-wO4OZstR.js";
import { P as Package } from "./package-J02ERnkS.js";
import { B as Boxes } from "./boxes-D6FuXgmK.js";
import { H as Hammer } from "./hammer-CMltKBVl.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-MtTTh3JD.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$4 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$4);
const __iconNode$3 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const items = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/producciones", label: "Producciones", icon: Boxes },
  { to: "/hornos", label: "Hornos", icon: Hammer },
  { to: "/quemas", label: "Quemas", icon: Flame },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/proveedores", label: "Proveedores", icon: Truck }
];
function AppSidebar({ email }) {
  const loc = useLocation();
  const nav = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    nav({ to: "/login" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex h-screen w-60 flex-col border-r bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-5 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold leading-none", children: "Taller" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Cerámica" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-1 px-3", children: items.map(({ to, label, icon: Icon }) => {
      const active = loc.pathname === to || loc.pathname.startsWith(to + "/");
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to,
          className: `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
            label
          ]
        },
        to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-sidebar-border p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 truncate px-2 text-xs text-muted-foreground", children: email ?? "Invitado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "w-full justify-start gap-2", onClick: logout, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Cerrar sesión"
      ] })
    ] })
  ] });
}
function AuthenticatedLayout() {
  const [email, setEmail] = reactExports.useState(null);
  reactExports.useEffect(() => {
    supabase.auth.getUser().then(({
      data
    }) => setEmail(data.user?.email ?? null));
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, { email }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-6 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) })
  ] });
}
export {
  AuthenticatedLayout as component
};
