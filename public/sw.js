// Service worker mínimo: só o necessário pra instalabilidade como PWA.
// Não faz cache agressivo de HTML/dados — o app depende de dados sempre
// atualizados do Supabase, então servir uma tela ou saldo desatualizado
// seria pior do que não ter service worker nenhum. Só cai pro cache
// quando a rede falha de verdade (ex: sem conexão).

const CACHE_NAME = "money-tracker-v1";
const PRECACHE = ["/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves
            .filter((chave) => chave !== CACHE_NAME)
            .map((chave) => caches.delete(chave)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const resposta = await caches.match(event.request);
      return resposta ?? Response.error();
    }),
  );
});
