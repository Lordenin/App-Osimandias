"use client";

import { useRouter } from "next/navigation";
import { SeletorMes } from "@/components/SeletorMes";

export function FiltroMesDashboard({ mes }: { mes: string }) {
  const router = useRouter();

  return (
    <SeletorMes
      mes={mes}
      aoMudar={(novoMes) => router.push(`/dashboard?mes=${novoMes}`)}
    />
  );
}
