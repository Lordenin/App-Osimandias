"use client";

import { useActionState, useState } from "react";
import { entrar, solicitarRecuperacaoSenha, type EstadoLogin } from "./actions";

const estadoInicial: EstadoLogin = {};

export default function LoginPage() {
  const [modo, setModo] = useState<"login" | "recuperar">("login");
  const [estadoLogin, acaoLogin, pendenteLogin] = useActionState(
    entrar,
    estadoInicial,
  );
  const [estadoRecuperar, acaoRecuperar, pendenteRecuperar] = useActionState(
    solicitarRecuperacaoSenha,
    estadoInicial,
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center text-2xl font-semibold">
          Money Tracker
        </h1>
        <p className="mb-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Controle financeiro da casa
        </p>

        {modo === "login" ? (
          <form action={acaoLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="senha" className="text-sm font-medium">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                className="rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
              />
            </div>

            {estadoLogin.erro && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {estadoLogin.erro}
              </p>
            )}

            <button
              type="submit"
              disabled={pendenteLogin}
              className="mt-2 rounded-lg bg-neutral-900 px-4 py-3 text-base font-medium text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
            >
              {pendenteLogin ? "Entrando…" : "Entrar"}
            </button>

            <button
              type="button"
              onClick={() => setModo("recuperar")}
              className="text-sm text-neutral-500 underline dark:text-neutral-400"
            >
              Esqueci minha senha
            </button>
          </form>
        ) : (
          <form action={acaoRecuperar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email-recuperar" className="text-sm font-medium">
                E-mail
              </label>
              <input
                id="email-recuperar"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-base outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
              />
            </div>

            {estadoRecuperar.erro && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {estadoRecuperar.erro}
              </p>
            )}
            {estadoRecuperar.mensagem && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {estadoRecuperar.mensagem}
              </p>
            )}

            <button
              type="submit"
              disabled={pendenteRecuperar}
              className="mt-2 rounded-lg bg-neutral-900 px-4 py-3 text-base font-medium text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
            >
              {pendenteRecuperar ? "Enviando…" : "Enviar link de recuperação"}
            </button>

            <button
              type="button"
              onClick={() => setModo("login")}
              className="text-sm text-neutral-500 underline dark:text-neutral-400"
            >
              Voltar ao login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
