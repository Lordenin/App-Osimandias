"use client";

import { useActionState, useState } from "react";
import {
  criarLancamento,
  type EstadoNovoLancamento,
} from "@/app/(app)/actions";
import { formatarMoeda } from "@/lib/format";

type Categoria = {
  id: string;
  nome: string;
  tipo: "entrada" | "saida";
  cor: string;
  icone: string | null;
};

const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "⌫"];
const estadoInicial: EstadoNovoLancamento = {};

export function NovoLancamentoForm({
  categorias,
  hoje,
}: {
  categorias: Categoria[];
  hoje: string;
}) {
  const [estado, acao, enviando] = useActionState(
    criarLancamento,
    estadoInicial,
  );

  // Remonta os campos (e zera o formulário) sempre que um lançamento é
  // salvo com sucesso, trocando a "key" — evita setState dentro de efeito.
  return (
    <Campos
      key={estado.sucesso ?? 0}
      categorias={categorias}
      hoje={hoje}
      acao={acao}
      erro={estado.erro}
      enviando={enviando}
    />
  );
}

function Campos({
  categorias,
  hoje,
  acao,
  erro,
  enviando,
}: {
  categorias: Categoria[];
  hoje: string;
  acao: (formData: FormData) => void;
  erro?: string;
  enviando: boolean;
}) {
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");
  const [digitos, setDigitos] = useState("");
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);
  const [dataPrevista, setDataPrevista] = useState(hoje);

  const valorCentavos = digitos === "" ? 0 : parseInt(digitos, 10);
  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo);

  function selecionarTipo(novoTipo: "entrada" | "saida") {
    setTipo(novoTipo);
    setCategoriaId(null);
  }

  function digitar(tecla: string) {
    if (tecla === "⌫") {
      setDigitos((prev) => prev.slice(0, -1));
      return;
    }
    setDigitos((prev) => (prev + tecla).replace(/^0+/, "").slice(0, 10));
  }

  return (
    <form action={acao} className="flex flex-1 flex-col gap-3 p-4">
      <input type="hidden" name="tipo" value={tipo} />
      <input type="hidden" name="valorCentavos" value={valorCentavos} />
      <input type="hidden" name="categoriaId" value={categoriaId ?? ""} />
      <input type="hidden" name="pendente" value={pendente ? "true" : "false"} />
      <input type="hidden" name="hoje" value={hoje} />
      <input type="hidden" name="dataPrevista" value={dataPrevista} />

      <div className="flex rounded-lg border border-neutral-300 p-1 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => selecionarTipo("saida")}
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
          onClick={() => selecionarTipo("entrada")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            tipo === "entrada"
              ? "bg-green-600 text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          Entrada
        </button>
      </div>

      <div className="py-1 text-center text-4xl font-bold tabular-nums">
        {formatarMoeda(valorCentavos / 100)}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TECLAS.map((tecla) => (
          <button
            key={tecla}
            type="button"
            onClick={() => digitar(tecla)}
            className="rounded-lg bg-neutral-100 py-3.5 text-lg font-medium active:bg-neutral-200 dark:bg-neutral-900 dark:active:bg-neutral-800"
          >
            {tecla}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {categoriasFiltradas.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoriaId(c.id)}
            className="flex flex-col items-center gap-0.5 rounded-lg border-2 p-1.5 text-center"
            style={{
              borderColor: categoriaId === c.id ? c.cor : "transparent",
              backgroundColor:
                categoriaId === c.id ? `${c.cor}22` : "transparent",
            }}
          >
            <span className="text-lg leading-none">{c.icone ?? "🏷️"}</span>
            <span className="w-full truncate text-[10px] leading-tight text-neutral-600 dark:text-neutral-400">
              {c.nome}
            </span>
          </button>
        ))}
      </div>

      <input
        type="text"
        name="descricao"
        placeholder="Descrição (opcional)"
        className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
      />

      <label className="flex items-center justify-between text-sm">
        <span>É futuro / pendente</span>
        <input
          type="checkbox"
          checked={pendente}
          onChange={(e) => setPendente(e.target.checked)}
          className="h-5 w-5"
        />
      </label>

      {pendente && (
        <div className="flex flex-col gap-1">
          <label htmlFor="data-prevista" className="text-sm font-medium">
            Data prevista
          </label>
          <input
            id="data-prevista"
            type="date"
            value={dataPrevista}
            onChange={(e) => setDataPrevista(e.target.value)}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
          />
        </div>
      )}

      {erro && <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>}

      <button
        type="submit"
        disabled={enviando || valorCentavos === 0 || !categoriaId}
        className="mt-1 rounded-lg bg-neutral-900 py-3.5 text-base font-semibold text-white disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {enviando ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
