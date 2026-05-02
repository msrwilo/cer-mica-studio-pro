import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { fmtNum, fmtDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/quemas")({
  head: () => ({ meta: [{ title: "Quemas — Taller Cerámico" }] }),
  component: QuemasPage,
});

function QuemasPage() {
  const { data } = useQuery({
    queryKey: ["quemas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quemas").select("*").order("inicio_de_quema", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Quemas</h1>
        <p className="text-sm text-muted-foreground">Bitácora histórica de quemas.</p>
      </header>
      {(!data || data.length === 0) ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
          <Flame className="h-10 w-10" /><p>Aún no hay quemas registradas.</p>
        </CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Inicio</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Horno</th>
                  <th className="px-4 py-3 text-right">Temp. alcanzada</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((q: any) => (
                  <tr key={q.id_quema} className="hover:bg-muted/30">
                    <td className="px-4 py-3"><Link to="/quemas/$id" params={{ id: q.id_quema }} className="font-medium text-primary hover:underline">{q.id_quema}</Link></td>
                    <td className="px-4 py-3">{fmtDateTime(q.inicio_de_quema)}</td>
                    <td className="px-4 py-3">{q.tipo_de_quema ?? "—"}</td>
                    <td className="px-4 py-3">{q.id_horno}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtNum(q.temperatura_alcanzada, 0)} °C</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{q.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
