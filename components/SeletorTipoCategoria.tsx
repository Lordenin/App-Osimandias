"use client";

import { useRouter } from "next/navigation";

export function SeletorTipoCategoria({ tipo }: { tipo: "entrada" | "saida" }) {
  const router = useRouter();

  return (
    <div className="flex flex-1 rounded-lg border border-neutral-300 p-1 dark:border-neutral-700">
      <button
        type="button"
        onClick={() => router.push("/categorias?tipo=saida")}
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
        onClick={() => router.push("/categorias?tipo=entrada")}
        className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
          tipo === "entrada"
            ? "bg-green-600 text-white"
            : "text-neutral-500 dark:text-neutral-400"
        }`}
      >
        Entrada
      </button>
    </div>
  );
}
