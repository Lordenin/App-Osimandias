import { CategoriaForm } from "@/components/CategoriaForm";
import { criarCategoria } from "@/app/(app)/categorias/actions";

export default async function NovaCategoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const params = await searchParams;
  const tipo = params.tipo === "entrada" ? "entrada" : "saida";

  return (
    <CategoriaForm
      acao={criarCategoria}
      textoBotao="Criar categoria"
      valoresIniciais={{
        nome: "",
        tipo,
        cor: "#78716c",
        icone: "",
        ativa: true,
        orcamentoMensal: "",
      }}
    />
  );
}
