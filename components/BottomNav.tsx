"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/", label: "Novo", emoji: "➕" },
  { href: "/dashboard", label: "Dashboard", emoji: "📊" },
  { href: "/lancamentos", label: "Lançamentos", emoji: "📋" },
  { href: "/categorias", label: "Categorias", emoji: "🏷️" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
      <ul className="flex">
        {ITENS.map((item) => {
          const ativo =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs ${
                  ativo
                    ? "text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                <span className="text-xl leading-none">{item.emoji}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
