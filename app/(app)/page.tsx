import { createClient } from "@/lib/supabase/server";
import { NovoLancamentoForm } from "@/components/NovoLancamentoForm";
import { hojeSaoPaulo } from "@/lib/data";

export default async function Home() {
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nome, tipo, cor, icone")
    .eq("ativa", true)
    .order("nome");

  return (
    <NovoLancamentoForm categorias={categorias ?? []} hoje={hojeSaoPaulo()} />
  );
}
