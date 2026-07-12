import { ImageResponse } from "next/og";

export const dynamic = "force-static";

// Fundo até a borda (sem cantos arredondados): tanto o Android (ícone
// "maskable") quanto o iOS aplicam sua própria máscara por cima.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171717",
          fontSize: 100,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        M
      </div>
    ),
    { width: 192, height: 192 },
  );
}
