"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export type EstadoNovoLancamento = {
  erro?: string;
  sucesso?: number;
};

export async function criarLancamento(
  _estadoAnterior: EstadoNovoLancamento,
  formData: FormData,
): Promise<EstadoNovoLancamento> {
  const tipo = String(formData.get("tipo"));
  const valorCentavos = Number(formData.get("valorCentavos") ?? 0);
  const categoriaId = String(formData.get("categoriaId") ?? "") || null;
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const pendente = String(formData.get("pendente")) === "true";
  const hoje = String(formData.get("hoje") ?? "");
  const dataPrevista = String(formData.get("dataPrevista") ?? "") || hoje;

  if (tipo !== "entrada" && tipo !== "saida") {
    return { erro: "Tipo inválido." };
  }

  if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) {
    return { erro: "Informe um valor." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: "Sessão expirada. Entre novamente." };
  }

  const { data: membro } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membro) {
    return { erro: "Você não está vinculado a nenhum household." };
  }

  const data = pendente ? dataPrevista : hoje;

  const { error } = await supabase.from("lancamentos").insert({
    household_id: membro.household_id,
    criado_por: user.id,
    tipo,
    valor: valorCentavos / 100,
    descricao,
    categoria_id: categoriaId,
    data_competencia: data,
    status: pendente ? "pendente" : "realizado",
    data_prevista: pendente ? dataPrevista : null,
  });

  if (error) {
    return { erro: "Não foi possível salvar. Tente de novo." };
  }

  revalidatePath("/");
  revalidatePath("/lancamentos");
  revalidatePath("/dashboard");

  return { sucesso: Date.now() };
}
