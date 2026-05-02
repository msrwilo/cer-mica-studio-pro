import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CDL59hpK.js";
import { u as useNavigate, s as supabase, t as toast } from "./router-CXOYXOoj.js";
import { B as Button } from "./button-B-ffBoQS.js";
import { I as Input } from "./input-D_CiP2_w.js";
import { L as Label } from "./label-ao884MsU.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-CJ2FLLQe.js";
import { F as Flame } from "./flame-D_hDqx6G.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-MtTTh3JD.js";
import "./createLucideIcon-wO4OZstR.js";
function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = reactExports.useState("login");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [nombre, setNombre] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) navigate({
        to: "/panel"
      });
    });
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name: nombre
            }
          }
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisa tu correo si es necesario.");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
      navigate({
        to: "/panel"
      });
    } catch (err) {
      toast.error(err.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-7 w-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Taller Cerámico" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Gestión de fórmulas, hornos y quemas" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("login"), className: `flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${tab === "login" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`, children: "Entrar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("signup"), className: `flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${tab === "signup" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`, children: "Crear cuenta" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "pt-4", children: tab === "login" ? "Iniciar sesión" : "Registrarse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: tab === "login" ? "Accede al taller con tu correo" : "Crea tu cuenta del equipo" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        tab === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nombre", children: "Nombre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "nombre", value: nombre, onChange: (e) => setNombre(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Correo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Contraseña" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", autoComplete: tab === "login" ? "current-password" : "new-password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Cargando..." : tab === "login" ? "Entrar" : "Crear cuenta" })
      ] }) })
    ] })
  ] }) });
}
export {
  LoginPage as component
};
