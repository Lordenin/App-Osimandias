"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hojeSaoPaulo } from "@/lib/data";

function revalidarTudo() {
  revalidatePath("/lancamentos");
  revalidatePath("/dashboard");
}

export async function excluirLancamento(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("lancamentos").delete().eq("id", id);

  if (error) {
    return { erro: "Não foi possível excluir." };
  }

  revalidarTudo();
  return {};
}

export async function marcarComoPago(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("lancamentos")
    .update({ status: "realizado", data_competencia: hojeSaoPaulo() })
    .eq("id", id);

  if (error) {
    return { erro: "Não foi possível marcar como pago." };
  }

  revalidarTudo();
  return {};
}

export type EstadoEditarLancamento = {
  erro?: string;
};

export async function atualizarLancamento(
  id: string,
  _estadoAnterior: EstadoEditarLancamento,
  formData: FormData,
): Promise<EstadoEditarLancamento> {
  const tipo = String(formData.get("tipo"));
  const valorCentavos = Number(formData.get("valorCentavos") ?? 0);
  const categoriaId = String(formData.get("categoriaId") ?? "") || null;
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const data = String(formData.get("data") ?? "");
  const pendente = String(formData.get("pendente")) === "true";
  const dataPrevista = String(formData.get("dataPrevista") ?? "") || data;

  if (tipo !== "entrada" && tipo !== "saida") {
    return { erro: "Tipo inválido." };
  }

  if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) {
    return { erro: "Informe um valor." };
  }

  if (!data) {
    return { erro: "Informe a data." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("lancamentos")
    .update({
      tipo,
      valor: valorCentavos / 100,
      descricao,
      categoria_id: categoriaId,
      data_competencia: data,
      data_prevista: pendente ? dataPrevista : null,
    })
    .eq("id", id);

  if (error) {
    return { erro: "Não foi possível salvar as alterações." };
  }

  revalidarTudo();
  redirect("/lancamentos");
}
