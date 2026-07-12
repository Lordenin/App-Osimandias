import { formatarMoeda } from "@/lib/format";

export function CardSaldo({
  entradas,
  saidas,
}: {
  entradas: number;
  saidas: number;
}) {
  const saldo = entradas - saidas;
  const positivo = saldo >= 0;

  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Saldo do mês</p>
      <p
        className={`text-4xl font-bold ${
          positivo
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {formatarMoeda(saldo)}
      </p>
      <div className="mt-3 flex gap-6 text-sm">
        <div>
          <p className="text-neutral-500 dark:text-neutral-400">Entradas</p>
          <p className="font-medium text-green-600 dark:text-green-400">
            {formatarMoeda(entradas)}
          </p>
        </div>
        <div>
          <p className="text-neutral-500 dark:text-neutral-400">Saídas</p>
          <p className="font-medium text-red-600 dark:text-red-400">
            {formatarMoeda(saidas)}
          </p>
        </div>
      </div>
    </div>
  );
}
