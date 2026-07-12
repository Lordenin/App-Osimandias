import { formatarMesAno, mesAnterior, mesSeguinte } from "@/lib/data";

export function SeletorMes({
  mes,
  aoMudar,
}: {
  mes: string;
  aoMudar: (novoMes: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        aria-label="Mês anterior"
        onClick={() => aoMudar(mesAnterior(mes))}
        className="rounded-lg px-3 py-1.5 text-lg active:bg-neutral-100 dark:active:bg-neutral-900"
      >
        ‹
      </button>
      <span className="font-medium">{formatarMesAno(mes)}</span>
      <button
        type="button"
        aria-label="Próximo mês"
        onClick={() => aoMudar(mesSeguinte(mes))}
        className="rounded-lg px-3 py-1.5 text-lg active:bg-neutral-100 dark:active:bg-neutral-900"
      >
        ›
      </button>
    </div>
  );
}
