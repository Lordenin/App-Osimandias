"use client";

import { useEffect } from "react";

export function RegistrarServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Instalar como PWA é um extra; se falhar, o app web continua
        // funcionando normalmente pelo navegador.
      });
    }
  }, []);

  return null;
}
