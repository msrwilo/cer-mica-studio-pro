import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { fmtMoney, fmtNum } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/productos")({
  head: () => ({ meta: [{ title: "Productos — Taller Cerámico" }] }),
  component: ProductosPage,
});

function ProductosPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("productoid, nombre, tipo, categoria_esmaltes, unidad, valor_en_bodega, precio_de_venta, en_bodega, imagen")
        .order("nombre");
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (data ?? []).filter((p: any) =>
    p.nombre.toLowerCase().includes(q.toLowerCase()) || p.productoid.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm text-muted-foreground">Inventario, fórmulas y precios.</p>
        </div>
      </header>

      <Input placeholder="Buscar producto..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
          <Package className="h-10 w-10" />
          <p>No hay productos todavía.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p: any) => (
            <Link key={p.productoid} to="/productos" className="block">
              <Card className="overflow-hidden transition hover:border-primary/60">
                <div className="aspect-video bg-muted">
                  {p.imagen ? <img src={p.imagen} alt={p.nombre} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><Package className="h-8 w-8" /></div>}
                </div>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium leading-tight">{p.nombre}</div>
                      <div className="text-xs text-muted-foreground">{p.productoid}</div>
                    </div>
                    <Badge variant="secondary">{p.tipo}</Badge>
                  </div>
                  <div className="flex justify-between text-sm tabular-nums">
                    <span className="text-muted-foreground">Bodega</span>
                    <span>{fmtNum(p.en_bodega, 2)} {p.unidad}</span>
                  </div>
                  <div className="flex justify-between text-sm tabular-nums">
                    <span className="text-muted-foreground">Valor</span>
                    <span>{fmtMoney(p.valor_en_bodega)}</span>
                  </div>
                  <div className="flex justify-between text-sm tabular-nums">
                    <span className="text-muted-foreground">Venta</span>
                    <span className="font-medium">{fmtMoney(p.precio_de_venta)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
