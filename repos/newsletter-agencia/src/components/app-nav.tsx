"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/contatos", label: "Contatos" },
  { href: "/promocoes", label: "Promocoes" },
  { href: "/preview", label: "Preview Email" },
  { href: "/envio", label: "Envio" },
];

export const AppNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-[var(--color-ink)] hover:bg-[var(--color-bg-soft)]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};
