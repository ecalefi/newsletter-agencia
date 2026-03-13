"use client";

import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      className="btn rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
      type="button"
      onClick={onLogout}
    >
      Sair
    </button>
  );
};
