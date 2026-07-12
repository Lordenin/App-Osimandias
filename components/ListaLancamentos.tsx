"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatarMoeda } from "@/lib/format";
import { excluirLancamento, marcarComoPago } from "@/app/(app)/lancamentos/actions";

export type Lancamento = {
  id: string;
  tipo: "entrada" | "saida";
  valor: number;
  descricao: string | null;
  categoria_id: string | null;
  data_competencia: string;
  status: "realizado" | "pendente";
  data_prevista: string | null;
  categorias: { nome: string; icone: string | null; cor: string } | null;
};

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function ListaLancamentos({ lancamentos }: { lancamentos: Lancamento[] }) {
  if (lancamentos.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Nenhum lançamento neste mês.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {lancamentos.map((l) => (
        <LancamentoCard key={l.id} lancamento={l} />
      ))}
    </ul>
  );
}

function LancamentoCard({ lancamento }: { lancamento: Lancamento }) {
  const [pendenteAcao, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const categoria = lancamento.categorias;

  function excluir() {
    if (!confirm("Excluir este lançamento?")) return;
    setErro(null);
    startTransition(async () => {
      const resultado = await excluirLancamento(lancamento.id);
      if (resultado?.erro) setErro(resultado.erro);
    });
  }

  function pagar() {
    setErro(null);
    startTransition(async () => {
      const resultado = await marcarComoPago(lancamento.id);
      if (resultado?.erro) setErro(resultado.erro);
    });
  }

  return (
    <li className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xl leading-none">{categoria?.icone ?? "🏷️"}</span>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium">
              {categoria?.nome ?? "Sem categoria"}
            </p>
            {lancamento.descricao && (
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {lancamento.descricao}
              </p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 font-semibold tabular-nums ${
            lancamento.tipo === "entrada"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatarMoeda(lancamento.valor)}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span>{formatarData(lancamento.data_competencia)}</span>
        {lancamento.status === "pendente" && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            Previsto
          </span>
        )}
      </div>

      {erro && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{erro}</p>}

      <div className="mt-2 flex gap-3 text-xs">
        {lancamento.status === "pendente" && (
          <button
            type="button"
            onClick={pagar}
            disabled={pendenteAcao}
            className="font-medium text-green-600 disabled:opacity-50 dark:text-green-400"
          >
            Marcar como pago
          </button>
        )}
        <Link
          href={`/lancamentos/${lancamento.id}/editar`}
          className="font-medium text-neutral-600 dark:text-neutral-400"
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={excluir}
          disabled={pendenteAcao}
          className="font-medium text-red-600 disabled:opacity-50 dark:text-red-400"
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
