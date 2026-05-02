import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { toast } from "sonner";
import { ArrowLeft, Download } from "lucide-react";
import { fmtNum, fmtDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/quemas/$id")({
  head: () => ({ meta: [{ title: "Detalle de quema — Taller Cerámico" }] }),
  component: QuemaDetallePage,
});

function QuemaDetallePage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const { data: quema } = useQuery({
    queryKey: ["quema", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("quemas").select("*").eq("id_quema", id).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: logs } = useQuery({
    queryKey: ["firing_logs", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("firing_logs").select("*").eq("id_quema", id).order("tiempo");
      if (error) throw error;
      return data ?? [];
    },
  });

  const [temp, setTemp] = useState("");
  const [obs, setObs] = useState("");
  const [saving, setSaving] = useState(false);

  const addLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("firing_logs").insert({
      id_quema: id,
      temperatura_c: Number(temp),
      observaciones: obs || null,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setTemp(""); setObs("");
    toast.success("Lectura agregada");
    qc.invalidateQueries({ queryKey: ["firing_logs", id] });
    qc.invalidateQueries({ queryKey: ["quema", id] });
  };

  const exportCsv = () => {
    if (!logs?.length) return;
    const header = ["id_bq", "tiempo", "temperatura_c", "consumo_energia", "apertura_de_chimenea", "observaciones"];
    const rows = logs.map((l: any) => header.map((k) => JSON.stringify(l[k] ?? "")).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `bitacora-${id}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = (logs ?? []).map((l: any, i: number, arr: any[]) => ({
    t: new Date(l.tiempo).getTime(),
    label: new Date(l.tiempo).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    temperatura: Number(l.temperatura_c),
    horas: arr[0] ? (new Date(l.tiempo).getTime() - new Date(arr[0].tiempo).getTime()) / 3_600_000 : 0,
  }));

  return (
    <div className="space-y-6">
      <Link to="/quemas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Volver</Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{quema?.id_quema ?? id}</h1>
          <p className="text-sm text-muted-foreground">{quema?.tipo_de_quema ?? "—"} · Horno {quema?.id_horno}</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!logs?.length}><Download className="h-4 w-4 mr-2" />Exportar CSV</Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Inicio", value: fmtDateTime(quema?.inicio_de_quema) },
          { label: "Fin", value: fmtDateTime(quema?.fin_de_quema) },
          { label: "Temp. estimada", value: `${fmtNum(quema?.temperatura_estimada, 0)} °C` },
          { label: "Temp. alcanzada", value: `${fmtNum(quema?.temperatura_alcanzada, 0)} °C` },
        ].map((k) => (
          <Card key={k.label}><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</div>
            <div className="mt-1 text-lg font-medium tabular-nums">{k.value}</div>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Temperatura vs. tiempo</CardTitle></CardHeader>
        <CardContent style={{ height: 320 }}>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay lecturas.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.025 45)" />
                <XAxis dataKey="label" stroke="oklch(0.72 0.04 70)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.04 70)" fontSize={12} unit=" °C" />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.025 50)", border: "1px solid oklch(0.32 0.025 45)", borderRadius: 8 }} />
                {quema?.temperatura_estimada > 0 && (
                  <ReferenceLine y={Number(quema.temperatura_estimada)} stroke="oklch(0.78 0.10 90)" strokeDasharray="4 4" label={{ value: "Objetivo", fill: "oklch(0.78 0.10 90)", fontSize: 11 }} />
                )}
                <Line type="monotone" dataKey="temperatura" stroke="oklch(0.62 0.17 40)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Agregar lectura</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addLog} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="temp">Temperatura (°C)</Label>
              <Input id="temp" type="number" step="1" value={temp} onChange={(e) => setTemp(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="obs">Observaciones</Label>
              <Input id="obs" value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Apertura de chimenea, color de llama..." />
            </div>
            <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Agregar"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Bitácora ({logs?.length ?? 0})</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tiempo</th>
                <th className="px-4 py-3 text-right">Temp.</th>
                <th className="px-4 py-3">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(logs ?? []).map((l: any) => (
                <tr key={l.id_bq}>
                  <td className="px-4 py-2 font-mono text-xs">{l.id_bq}</td>
                  <td className="px-4 py-2">{fmtDateTime(l.tiempo)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{fmtNum(l.temperatura_c, 0)} °C</td>
                  <td className="px-4 py-2 text-muted-foreground">{l.observaciones ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
