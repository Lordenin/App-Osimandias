// "en-CA" formata como YYYY-MM-DD, o mesmo formato aceito por <input type="date">
// e pela coluna "date" do Postgres.
export function hojeSaoPaulo(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}
