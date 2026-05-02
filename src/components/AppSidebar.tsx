import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Flame, Package, Hammer, Boxes, CalendarDays, LayoutDashboard, Users, Truck, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/producciones", label: "Producciones", icon: Boxes },
  { to: "/hornos", label: "Hornos", icon: Hammer },
  { to: "/quemas", label: "Quemas", icon: Flame },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/proveedores", label: "Proveedores", icon: Truck },
] as const;

export function AppSidebar({ email }: { email?: string | null }) {
  const loc = useLocation();
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    nav({ to: "/login" });
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-none">Taller</div>
          <div className="text-xs text-muted-foreground">Cerámica</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to || loc.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 truncate px-2 text-xs text-muted-foreground">{email ?? "Invitado"}</div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
