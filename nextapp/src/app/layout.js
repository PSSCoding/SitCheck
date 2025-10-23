"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import logo from "./logo.png";
import { rooms } from "@/data/rooms";
import { AppDataProvider, useAppData } from "@/context/AppDataContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${active ? "text-sky-600" : "text-slate-400"}`}
      >
        <path
          d="M4.5 11a7.5 7.5 0 1115 0v8.25a.75.75 0 01-.75.75h-4.5v-5.25a1.5 1.5 0 00-1.5-1.5h-1.5a1.5 1.5 0 00-1.5 1.5V20H5.25a.75.75 0 01-.75-.75V11z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Buchungen",
    href: "/bookings",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${active ? "text-sky-600" : "text-slate-400"}`}
      >
        <path
          d="M6.5 5.5a2 2 0 012-2h7a2 2 0 012 2v15l-5.5-2.75L6.5 20.5v-15z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Einstellungen",
    href: "/settings",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${active ? "text-sky-600" : "text-slate-400"}`}
      >
        <path
          d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.4 13.5a7.5 7.5 0 00.05-3l1.75-1.32a.75.75 0 00.2-.95l-1.66-2.88a.75.75 0 00-.9-.35l-2.05.68a7.55 7.55 0 00-2.6-1.5l-.32-2.15A.75.75 0 0013.12 1h-2.24a.75.75 0 00-.74.64l-.32 2.15a7.55 7.55 0 00-2.6 1.5L5.17 4.01a.75.75 0 00-.9.35L2.6 7.24a.75.75 0 00.2.95L4.55 9.5a7.5 7.5 0 000 3l-1.75 1.32a.75.75 0 00-.2.95l1.66 2.88a.75.75 0 00.9.35l2.05-.68a7.55 7.55 0 002.6 1.5l.32 2.15a.75.75 0 00.74.64h2.24a.75.75 0 00.74-.64l.32-2.15a7.55 7.55 0 002.6-1.5l2.05.68a.75.75 0 00.9-.35l1.66-2.88a.75.75 0 00-.2-.95L19.4 13.5z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function FavoritesSidebarSection() {
  const { favorites } = useAppData();

  const favoriteRooms = rooms
    .filter((room) => favorites.includes(room.id))
    .slice(0, 3);

  return (
    <div className="mt-8 mb-6 rounded-2xl bg-white/80 p-4 text-sm text-slate-600 shadow-inner">
      <p className="text-xs uppercase tracking-wide text-slate-600">Meine Favoriten</p>
      <div className="mt-3 space-y-2">
        {favoriteRooms.length > 0 ? (
          favoriteRooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-xs text-slate-600"
            >
              <span className="font-semibold text-slate-900">{room.name}</span>
              <span className="text-[11px] uppercase tracking-wide text-slate-500">
                {room.type}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500">Noch keine Favoriten gespeichert.</p>
        )}
      </div>
      <Link
        href="/favorites"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
      >
        Zu meinen Favoriten
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
    setSearchTerm("");
    setSearchFocused(false);
  }, [pathname]);

  const suggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (query.length < 2) return [];
    return rooms
      .filter(
        (room) =>
          room.name.toLowerCase().includes(query) ||
          room.type.toLowerCase().includes(query),
      )
      .slice(0, 6);
  }, [searchTerm]);

  const shouldShowSuggestions = searchFocused && suggestions.length > 0;

  const now = new Date();
  const formattedTime = now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 text-slate-900`}
      >
        <AppDataProvider>
          <div className="relative flex min-h-screen bg-slate-100">
            {/* Overlay for mobile navigation */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`fixed top-0 left-0 z-40 flex h-full w-72 transform flex-col border-r border-slate-200
                bg-[#c0e3ff] px-5 py-6 text-slate-900 shadow-xl transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:relative lg:translate-x-0 lg:shadow-none`}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={logo}
                  alt="SitCheck Logo"
                  width={156}
                  height={48}
                  className="h-12 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                />
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-600">Campus Dashboard</p>
                  <h2 className="text-xl font-semibold text-slate-900">SitCheck</h2>
                </div>
              </div>

              <nav className="mt-8 space-y-1 text-sm font-medium">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors
                        ${active ? "bg-white text-slate-900 shadow" : "text-slate-700 hover:bg-white/70"}`}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden="true" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <FavoritesSidebarSection />

              <div className="mt-auto rounded-2xl bg-white/80 p-4 text-sm text-slate-600 shadow-inner">
                <p className="font-semibold text-slate-900">Öffnungszeiten</p>
                <p>Mo–Fr: 08:00–22:00</p>
                <p>Sa: 09:00–18:00</p>
              </div>
            </aside>

            {/* Main Content */}
          <div className="flex min-h-screen w-full flex-1 flex-col lg:pl-72">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#c0e3ff] backdrop-blur">
              <div className="flex flex-col gap-4 px-4 py-4 sm:px-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Navigation umschalten"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:text-slate-900 lg:hidden"
                      onClick={() => setSidebarOpen((prev) => !prev)}
                    >
                      {sidebarOpen ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                        >
                          <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                        >
                          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      <Image
                        src={logo}
                        alt="SitCheck Logo"
                        width={160}
                        height={48}
                        className="h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                        priority
                      />
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-700">SitCheck</p>
                        <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">Raumübersicht</h1>
                      </div>
                    </div>
                  </div>
                  <div className="hidden items-center gap-4 text-sm text-slate-600 sm:flex">
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">DHBW Mannheim</p>
                      <p>Letzte Aktualisierung {formattedTime} Uhr</p>
                    </div>
                    <Image
                      src={logo}
                      alt="SitCheck Logo klein"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full bg-white object-contain p-2 shadow"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide text-slate-600">
                  <span>Systemstatus: <span className="text-emerald-600">Online</span></span>
                  <span className="hidden sm:inline">Standort: DHBW Learning Center · Mannheim</span>
                </div>

                <div className="relative w-full">
                  <div className="relative mx-auto w-full max-w-2xl">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-500">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                        <path
                          d="M15.5 15.5l3.5 3.5M11 17a6 6 0 100-12 6 6 0 000 12z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
                      placeholder="Nach Räumen, Bereichen oder Ausstattungen suchen..."
                      className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm text-slate-700 shadow-inner transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:text-slate-700"
                        aria-label="Suchfeld leeren"
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                          <path d="M7 7l10 10M17 7l-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                    {shouldShowSuggestions && (
                      <ul className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-2 text-sm shadow-xl">
                        {suggestions.map((room) => (
                          <li key={room.id}>
                            <Link
                              href={`/rooms/${room.id}`}
                              onClick={() => {
                                setSearchTerm("");
                                setSearchFocused(false);
                              }}
                              className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-100"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900">{room.name}</span>
                                <span className="text-xs uppercase tracking-wide text-slate-500">{room.type}</span>
                              </div>
                              <span className="text-xs text-slate-500">
                                Kapazität: <span className="font-semibold text-slate-900">{room.capacity}</span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pb-12 sm:pt-10">{children}</main>

            <footer className="border-t border-slate-200 bg-[#c0e3ff] px-4 pb-28 pt-6 text-center text-xs text-slate-600 sm:pb-8 sm:text-sm">
              © 2025 DHBW Germany GmbH · Coblitzallee 1-9, 68163 Mannheim
            </footer>
          </div>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 py-2 backdrop-blur sm:hidden">
            <div className="mx-auto flex w-full max-w-md items-center justify-around px-6">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 text-xs font-medium transition ${active ? "text-sky-600" : "text-slate-500 hover:text-slate-700"}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.icon(active)}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          </div>
        </AppDataProvider>
      </body>
    </html>
  );
}
