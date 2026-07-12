import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoriaForm } from "@/components/CategoriaForm";
import { atualizarCategoria } from "@/app/(app)/categorias/actions";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: categoria } = await supabase
    .from("categorias")
    .select("id, nome, tipo, cor, icone, ativa, orcamento_mensal")
    .eq("id", id)
    .single();

  if (!categoria) {
    notFound();
  }

  return (
    <CategoriaForm
      acao={atualizarCategoria.bind(null, categoria.id)}
      textoBotao="Salvar alterações"
      valoresIniciais={{
        nome: categoria.nome,
        tipo: categoria.tipo,
        cor: categoria.cor,
        icone: categoria.icone ?? "",
        ativa: categoria.ativa,
        orcamentoMensal:
          categoria.orcamento_mensal != null
            ? String(categoria.orcamento_mensal)
            : "",
      }}
    />
  );
}
