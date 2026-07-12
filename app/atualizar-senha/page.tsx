"use client";

import { useActionState } from "react";
import { atualizarSenha, type EstadoAtualizarSenha } from "./actions";

const estadoInicial: EstadoAtualizarSenha = {};

export default function AtualizarSenhaPage() {
  const [estado, acao, pendente] = useActionState(atualizarSenha, estadoInicial);

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-semibold">
          Nova senha
        </h1>

        <form action={acao} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="senha" className="text-sm font-medium">
              Nova senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmarSenha" className="text-sm font-medium">
              Confirmar nova senha
            </label>
            <input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
            />
          </div>

          {estado.erro && (
            <p className="text-sm text-red-600 dark:text-red-400">{estado.erro}</p>
          )}

          <button
            type="submit"
            disabled={pendente}
            className="mt-2 rounded-lg bg-neutral-900 px-4 py-3 text-base font-medium text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {pendente ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
