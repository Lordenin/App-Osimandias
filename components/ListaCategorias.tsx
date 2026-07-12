"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatarMoeda } from "@/lib/format";
import { excluirCategoria } from "@/app/(app)/categorias/actions";

export type CategoriaCompleta = {
  id: string;
  nome: string;
  tipo: "entrada" | "saida";
  cor: string;
  icone: string | null;
  ativa: boolean;
  orcamento_mensal: number | null;
};

export function ListaCategorias({
  categorias,
}: {
  categorias: CategoriaCompleta[];
}) {
  if (categorias.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Nenhuma categoria ainda.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {categorias.map((c) => (
        <CategoriaCard key={c.id} categoria={c} />
      ))}
    </ul>
  );
}

function CategoriaCard({ categoria }: { categoria: CategoriaCompleta }) {
  const [pendente, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function excluir() {
    if (!confirm(`Excluir a categoria "${categoria.nome}"?`)) return;
    setErro(null);
    startTransition(async () => {
      const resultado = await excluirCategoria(categoria.id);
      if (resultado?.erro) setErro(resultado.erro);
    });
  }

  return (
    <li
      className={`rounded-lg border border-neutral-200 p-3 dark:border-neutral-800 ${
        categoria.ativa ? "" : "opacity-50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: categoria.cor }}
          />
          <span className="text-lg leading-none">{categoria.icone ?? "🏷️"}</span>
          <span className="truncate text-sm font-medium">{categoria.nome}</span>
          {!categoria.ativa && (
            <span className="shrink-0 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              Inativa
            </span>
          )}
        </div>

        {categoria.tipo === "saida" && (
          <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
            {categoria.orcamento_mensal
              ? `Orç. ${formatarMoeda(categoria.orcamento_mensal)}`
              : "Sem orçamento"}
          </span>
        )}
      </div>

      {erro && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{erro}</p>}

      <div className="mt-2 flex gap-3 text-xs">
        <Link
          href={`/categorias/${categoria.id}/editar`}
          className="font-medium text-neutral-600 dark:text-neutral-400"
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={excluir}
          disabled={pendente}
          className="font-medium text-red-600 disabled:opacity-50 dark:text-red-400"
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
