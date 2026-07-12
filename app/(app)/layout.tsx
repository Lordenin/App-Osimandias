import { BottomNav } from "@/components/BottomNav";
import { sair } from "./actions";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <span className="font-semibold">Money Tracker</span>
        <form action={sair}>
          <button
            type="submit"
            className="text-sm text-neutral-500 underline dark:text-neutral-400"
          >
            Sair
          </button>
        </form>
      </header>

      <div className="flex flex-1 flex-col pb-16">{children}</div>

      <BottomNav />
    </div>
  );
}
