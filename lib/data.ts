// "en-CA" formata como YYYY-MM-DD, o mesmo formato aceito por <input type="date">
// e pela coluna "date" do Postgres.
export function hojeSaoPaulo(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

// "YYYY-MM" do mês vigente (calendário) no fuso America/Sao_Paulo.
export function mesAtualSaoPaulo(): string {
  return hojeSaoPaulo().slice(0, 7);
}

// Toda a matemática de mês usa Date.UTC só pra somar/subtrair meses sem
// depender do fuso do servidor — não representa um instante real.
export function mesAnterior(mes: string): string {
  const [ano, m] = mes.split("-").map(Number);
  const d = new Date(Date.UTC(ano, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function mesSeguinte(mes: string): string {
  const [ano, m] = mes.split("-").map(Number);
  const d = new Date(Date.UTC(ano, m, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function ultimoDiaDoMes(mes: string): string {
  const [ano, m] = mes.split("-").map(Number);
  const dia = new Date(Date.UTC(ano, m, 0)).getUTCDate();
  return `${mes}-${String(dia).padStart(2, "0")}`;
}

export function formatarMesAno(mes: string): string {
  const [ano, m] = mes.split("-").map(Number);
  const texto = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(ano, m - 1, 1)));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
