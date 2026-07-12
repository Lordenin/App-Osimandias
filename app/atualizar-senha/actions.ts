"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type EstadoAtualizarSenha = {
  erro?: string;
};

export async function atualizarSenha(
  _estadoAnterior: EstadoAtualizarSenha,
  formData: FormData,
): Promise<EstadoAtualizarSenha> {
  const senha = String(formData.get("senha") ?? "");
  const confirmarSenha = String(formData.get("confirmarSenha") ?? "");

  if (senha.length < 6) {
    return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  }

  if (senha !== confirmarSenha) {
    return { erro: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    return { erro: "Não foi possível atualizar a senha. Peça um novo link e tente de novo." };
  }

  redirect("/");
}
