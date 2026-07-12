"use client";

import { useRouter } from "next/navigation";
import { SeletorMes } from "@/components/SeletorMes";
import type { Categoria } from "@/components/GradeCategorias";

export function FiltrosLancamentos({
  mes,
  tipo,
  categoriaId,
  categorias,
}: {
  mes: string;
  tipo: "todos" | "entrada" | "saida";
  categoriaId: string;
  categorias: Categoria[];
}) {
  const router = useRouter();

  function irPara(overrides: { mes?: string; tipo?: string; categoria?: string }) {
    const novoMes = overrides.mes ?? mes;
    const novoTipo = overrides.tipo ?? tipo;
    const novaCategoria = overrides.categoria ?? categoriaId;

    const params = new URLSearchParams({ mes: novoMes });
    if (novoTipo !== "todos") params.set("tipo", novoTipo);
    if (novaCategoria) params.set("categoria", novaCategoria);

    router.push(`/lancamentos?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-2">
      <SeletorMes mes={mes} aoMudar={(novoMes) => irPara({ mes: novoMes })} />

      <div className="flex gap-2">
        <select
          value={tipo}
          onChange={(e) => irPara({ tipo: e.target.value })}
          className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        >
          <option value="todos">Todos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <select
          value={categoriaId}
          onChange={(e) => irPara({ categoria: e.target.value })}
          className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        >
          <option value="">Todas categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icone} {c.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
