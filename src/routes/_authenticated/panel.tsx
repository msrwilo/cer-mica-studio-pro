import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Boxes, Package, Hammer } from "lucide-react";
import { fmtNum } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/panel")({
  head: () => ({ meta: [{ title: "Panel — Taller Cerámico" }] }),
  component: PanelPage,
});

function PanelPage() {
  const { data } = useQuery({
    queryKey: ["panel-kpis"],
    queryFn: async () => {
      const [productos, hornos, quemas, prods] = await Promise.all([
        supabase.from("productos").select("productoid", { count: "exact", head: true }),
        supabase.from("lista_de_hornos").select("id_horno", { count: "exact", head: true }),
        supabase.from("quemas").select("id_quema, status, inicio_de_quema, temperatura_alcanzada, tipo_de_quema").order("inicio_de_quema", { ascending: false }).limit(8),
        supabase.from("producciones").select("produccionid, status").eq("status", "En proceso"),
      ]);
      return {
        productos: productos.count ?? 0,
        hornos: hornos.count ?? 0,
        quemas: quemas.data ?? [],
        prodsEnProceso: prods.data?.length ?? 0,
      };
    },
  });

  const kpis = [
    { label: "Productos", value: data?.productos ?? 0, icon: Package },
    { label: "Hornos", value: data?.hornos ?? 0, icon: Hammer },
    { label: "Quemas registradas", value: data?.quemas?.length ?? 0, icon: Flame },
    { label: "Producciones en proceso", value: data?.prodsEnProceso ?? 0, icon: Boxes },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Panel</h1>
        <p className="text-sm text-muted-foreground">Resumen general del taller.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
                <div className="text-2xl font-semibold tabular-nums">{fmtNum(value, 0)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Últimas quemas</CardTitle></CardHeader>
        <CardContent>
          {data?.quemas?.length ? (
            <ul className="divide-y divide-border">
              {data.quemas.map((q: any) => (
                <li key={q.id_quema} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium">{q.id_quema} · {q.tipo_de_quema ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(q.inicio_de_quema).toLocaleString("es-MX")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums">{fmtNum(q.temperatura_alcanzada, 0)} °C</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{q.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aún no hay quemas registradas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
