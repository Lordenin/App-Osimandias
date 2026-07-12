import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditarLancamentoForm } from "@/components/EditarLancamentoForm";

export default async function EditarLancamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: lancamento }, { data: categorias }] = await Promise.all([
    supabase
      .from("lancamentos")
      .select(
        "id, tipo, valor, descricao, categoria_id, data_competencia, status, data_prevista",
      )
      .eq("id", id)
      .single(),
    supabase.from("categorias").select("id, nome, tipo, cor, icone").order("nome"),
  ]);

  if (!lancamento) {
    notFound();
  }

  return (
    <EditarLancamentoForm lancamento={lancamento} categorias={categorias ?? []} />
  );
}
