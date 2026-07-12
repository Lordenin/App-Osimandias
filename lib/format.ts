const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarMoeda(valorEmReais: number): string {
  return formatadorMoeda.format(valorEmReais);
}
