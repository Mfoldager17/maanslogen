"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NavLink } from "./NavLink";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
  IconHome,
  IconFolder,
  IconTag,
  IconBeaker,
  IconBuildingStorefront,
  IconListBullets,
  IconQuestionMarkCircle,
  IconStar,
} from "./NavIcons";

const nav = [
  { href: "/", label: "Forside", icon: IconHome },
  { href: "/categories", label: "Kategorier", icon: IconFolder },
  { href: "/types", label: "Typer", icon: IconTag },
  { href: "/brands", label: "Mærker", icon: IconBuildingStorefront },
  { href: "/beverages", label: "Drikke", icon: IconBeaker },
  { href: "/attributes", label: "Attribute", icon: IconListBullets },
  { href: "/questions", label: "Spørgsmål", icon: IconQuestionMarkCircle },
  { href: "/reviews", label: "Anmeldelser", icon: IconStar },
] as const;

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

const DESKTOP_BREAKPOINT = 768;
const THEME_STORAGE_KEY = "maanslogen-admin-theme";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const pathname = usePathname();

  /* Anvend gemt tema med det samme ved load (ThemeSwitcher er kun synlig når menuen er åben) */
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null;
    const theme = (stored as string) ?? "";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    setIsMobile(!mq.matches);
    const fn = () => setIsMobile(!mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  /* Lås scroll i baggrunden kun på mobil når menuen er åben */
  useEffect(() => {
    if (!sidebarOpen || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen, isMobile]);

  const drawerWidthPx = isMobile ? (sidebarOpen ? 256 : 0) : (sidebarOpen ? 256 : 56);

  return (
    <div className="flex min-h-screen">
      {/* Mobil: overlay over hele skærmen – Framer Motion for smooth fade */}
      <motion.button
        type="button"
        aria-label="Luk menu"
        className="fixed inset-0 z-30 bg-black/40 md:hidden"
        initial={false}
        animate={{ opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar: Framer Motion for width-animation (skuffe) på mobil og desktop */}
      <motion.aside
        className="drawer-panel shrink-0 border-r border-theme bg-elevated
          fixed inset-y-0 left-0 z-40 overflow-hidden shadow-theme-sm
          md:relative md:inset-auto md:top-0 md:bottom-0 md:left-0 md:right-auto md:shadow-none
        "
        initial={false}
        animate={{ width: drawerWidthPx }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          boxShadow:
            sidebarOpen && isMobile
              ? "4px 0 24px rgba(0,0,0,0.15)"
              : undefined,
        }}
      >
        {/* Desktop: smal bar når panelet er lukket – ikoner (kan trykkes) + expand-knap */}
        {!isMobile && !sidebarOpen && (
          <div className="hidden h-full w-14 flex-col items-center gap-1 py-4 md:flex">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-theme text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-bg-hover))] focus:ring-2 focus:ring-[rgb(var(--color-accent))]"
              aria-label="Åbn menu"
            >
              <MenuIcon open={false} />
            </button>
            <nav className="mt-2 flex flex-col gap-1" aria-label="Navigation">
              {nav.map(({ href, label, icon }) => (
                <NavLink key={href} href={href} label={label} icon={icon} iconOnly />
              ))}
            </nav>
          </div>
        )}

        {/* Fuld sidebar: på mobil altid i DOM (skuffe-animation), på desktop kun når udvidet */}
        {(isMobile || sidebarOpen) && (
          <div className="flex h-full w-64 flex-col gap-1 p-4 pt-6 md:sticky md:top-0 md:pt-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="truncate text-lg font-semibold">Maanslogen Admin</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="hidden min-h-9 min-w-9 touch-manipulation items-center justify-center rounded-theme text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-bg-hover))] focus:ring-2 focus:ring-[rgb(var(--color-accent))] md:flex"
                aria-label="Luk menu"
              >
                <MenuIcon open={true} />
              </button>
            </div>
            <ThemeSwitcher />
            <nav className="mt-4 flex flex-col gap-1">
              {nav.map(({ href, label, icon }) => (
                <NavLink key={href} href={href} label={label} icon={icon} />
              ))}
            </nav>
          </div>
        )}
      </motion.aside>

      {/* Top bar kun på mobil – menu-knap + titel */}
      <div className="fixed left-0 right-0 top-0 z-20 flex min-h-14 items-center gap-3 border-b border-theme bg-elevated px-4 shadow-theme-sm md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-theme text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-bg-hover))] focus:ring-2 focus:ring-[rgb(var(--color-accent))]"
          aria-label={sidebarOpen ? "Luk menu" : "Åbn menu"}
          aria-expanded={sidebarOpen}
        >
          <MenuIcon open={sidebarOpen} />
        </button>
        <span className="truncate text-lg font-semibold">Maanslogen Admin</span>
      </div>

      {/* Main – ekstra top-padding på mobil pga. top bar */}
      <main className="min-w-0 flex-1 p-4 pt-16 md:p-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
