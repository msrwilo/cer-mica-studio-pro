import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Hammer } from "lucide-react";
import { fmtNum } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/hornos")({
  head: () => ({ meta: [{ title: "Hornos — Taller Cerámico" }] }),
  component: HornosPage,
});

function HornosPage() {
  const { data } = useQuery({
    queryKey: ["hornos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lista_de_hornos").select("*").order("id_horno");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Hornos</h1>
        <p className="text-sm text-muted-foreground">Listado de hornos del taller.</p>
      </header>
      {(!data || data.length === 0) ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
          <Hammer className="h-10 w-10" /><p>Aún no hay hornos registrados.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((h: any) => (
            <Link key={h.id_horno} to="/hornos">
              <Card className="overflow-hidden transition hover:border-primary/60">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Hammer className="h-5 w-5" /></div>
                    <div>
                      <div className="font-medium">{h.nombre ?? h.id_horno}</div>
                      <div className="text-xs text-muted-foreground">{h.id_horno}</div>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-sm tabular-nums">
                    <div><dt className="text-muted-foreground">Volumen</dt><dd>{fmtNum(h.volumen_interno, 2)} L</dd></div>
                    <div><dt className="text-muted-foreground">Quemadores</dt><dd>{fmtNum(h.cantidad_de_quemadores, 0)}</dd></div>
                    <div><dt className="text-muted-foreground">Tanque</dt><dd>{fmtNum(h.tamano_tanque, 0)} L</dd></div>
                  </dl>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
