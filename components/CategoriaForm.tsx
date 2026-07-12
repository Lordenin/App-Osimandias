"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { EstadoCategoria } from "@/app/(app)/categorias/actions";

const estadoInicial: EstadoCategoria = {};

export type CategoriaValores = {
  nome: string;
  tipo: "entrada" | "saida";
  cor: string;
  icone: string;
  ativa: boolean;
  orcamentoMensal: string;
};

export function CategoriaForm({
  acao,
  valoresIniciais,
  textoBotao,
}: {
  acao: (
    estado: EstadoCategoria,
    formData: FormData,
  ) => Promise<EstadoCategoria>;
  valoresIniciais: CategoriaValores;
  textoBotao: string;
}) {
  const router = useRouter();
  const [estado, executar, enviando] = useActionState(acao, estadoInicial);
  const [tipo, setTipo] = useState<"entrada" | "saida">(valoresIniciais.tipo);

  return (
    <form action={executar} className="flex flex-1 flex-col gap-3 p-4">
      <input type="hidden" name="tipo" value={tipo} />

      <div className="flex rounded-lg border border-neutral-300 p-1 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => setTipo("saida")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            tipo === "saida"
              ? "bg-red-600 text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Saída
        </button>
        <button
          type="button"
          onClick={() => setTipo("entrada")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            tipo === "entrada"
              ? "bg-green-600 text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Entrada
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className="text-sm font-medium">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          defaultValue={valoresIniciais.nome}
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="icone" className="text-sm font-medium">
            Emoji
          </label>
          <input
            id="icone"
            name="icone"
            type="text"
            maxLength={4}
            defaultValue={valoresIniciais.icone}
            placeholder="🏷️"
            className="w-16 rounded-lg border border-neutral-300 px-3 py-2.5 text-center text-lg outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="cor" className="text-sm font-medium">
            Cor
          </label>
          <input
            id="cor"
            name="cor"
            type="color"
            defaultValue={valoresIniciais.cor}
            className="h-[42px] w-full rounded-lg border border-neutral-300 dark:border-neutral-700"
          />
        </div>
      </div>

      {tipo === "saida" && (
        <div className="flex flex-col gap-1">
          <label htmlFor="orcamentoMensal" className="text-sm font-medium">
            Orçamento mensal (opcional)
          </label>
          <input
            id="orcamentoMensal"
            name="orcamentoMensal"
            type="number"
            step="0.01"
            min="0"
            defaultValue={valoresIniciais.orcamentoMensal}
            placeholder="0,00"
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
          />
        </div>
      )}

      <label className="flex items-center justify-between text-sm">
        <span>Ativa</span>
        <input
          type="checkbox"
          name="ativa"
          defaultChecked={valoresIniciais.ativa}
          className="h-5 w-5"
        />
      </label>

      {estado.erro && (
        <p className="text-sm text-red-600 dark:text-red-400">{estado.erro}</p>
      )}

      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/categorias")}
          className="flex-1 rounded-lg border border-neutral-300 py-3.5 text-base font-medium dark:border-neutral-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={enviando}
          className="flex-1 rounded-lg bg-neutral-900 py-3.5 text-base font-semibold text-white disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {enviando ? "Salvando…" : textoBotao}
        </button>
      </div>
    </form>
  );
}
