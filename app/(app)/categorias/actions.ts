"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type EstadoCategoria = {
  erro?: string;
};

function lerCampos(formData: FormData) {
  const tipo = String(formData.get("tipo"));
  const nome = String(formData.get("nome") ?? "").trim();
  const cor = String(formData.get("cor") ?? "#78716c");
  const icone = String(formData.get("icone") ?? "").trim() || null;
  const ativa = formData.get("ativa") === "on";
  const orcamentoStr = String(formData.get("orcamentoMensal") ?? "").trim();
  const orcamentoMensal =
    tipo === "saida" && orcamentoStr ? Number(orcamentoStr) : null;

  return { tipo, nome, cor, icone, ativa, orcamentoMensal };
}

export async function criarCategoria(
  _estadoAnterior: EstadoCategoria,
  formData: FormData,
): Promise<EstadoCategoria> {
  const { tipo, nome, cor, icone, ativa, orcamentoMensal } = lerCampos(formData);

  if (tipo !== "entrada" && tipo !== "saida") {
    return { erro: "Tipo inválido." };
  }
  if (!nome) {
    return { erro: "Informe o nome da categoria." };
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

  const { error } = await supabase.from("categorias").insert({
    household_id: membro.household_id,
    nome,
    tipo,
    cor,
    icone,
    ativa,
    orcamento_mensal: orcamentoMensal,
  });

  if (error) {
    return { erro: "Não foi possível criar a categoria." };
  }

  revalidatePath("/categorias");
  revalidatePath("/");
  redirect(`/categorias?tipo=${tipo}`);
}

export async function atualizarCategoria(
  id: string,
  _estadoAnterior: EstadoCategoria,
  formData: FormData,
): Promise<EstadoCategoria> {
  const { tipo, nome, cor, icone, ativa, orcamentoMensal } = lerCampos(formData);

  if (tipo !== "entrada" && tipo !== "saida") {
    return { erro: "Tipo inválido." };
  }
  if (!nome) {
    return { erro: "Informe o nome da categoria." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categorias")
    .update({
      nome,
      tipo,
      cor,
      icone,
      ativa,
      orcamento_mensal: orcamentoMensal,
    })
    .eq("id", id);

  if (error) {
    return { erro: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/categorias");
  revalidatePath("/");
  redirect(`/categorias?tipo=${tipo}`);
}

export async function excluirCategoria(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error) {
    return { erro: "Não foi possível excluir." };
  }

  revalidatePath("/categorias");
  revalidatePath("/");
  return {};
}
