"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import logo from "./logo.png";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Buchungen", href: "/bookings" },
  { label: "Einstellungen", href: "/settings" },
];

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 text-slate-900`}
      >
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
                width={56}
                height={56}
                className="h-14 w-14 rounded-full bg-white object-contain p-2 shadow"
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

            <div className="mt-auto rounded-2xl bg-white/80 p-4 text-sm text-slate-600 shadow-inner">
              <p className="font-semibold text-slate-900">Öffnungszeiten</p>
              <p>Mo–Fr: 08:00–22:00</p>
              <p>Sa: 09:00–18:00</p>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex min-h-screen w-full flex-1 flex-col lg:pl-72">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#c0e3ff]/80 backdrop-blur">
              <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-8">
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
                      width={48}
                      height={48}
                      className="hidden h-12 w-12 rounded-full bg-white object-contain p-2 shadow sm:block"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-700">SitCheck</p>
                      <h1 className="text-lg font-semibold text-slate-900 sm:text-2xl">Bibliotheksübersicht</h1>
                    </div>
                  </div>
                </div>

                <div className="hidden items-center gap-3 text-sm text-slate-600 sm:flex">
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">DHBW Mannheim</p>
                    <p>Studierendenzugänge live</p>
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
            </header>

            <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>

            <footer className="px-4 py-6 text-center text-xs text-slate-500 sm:text-sm">
              © 2025 DHBW Germany GmbH · Coblitzallee 1-9, 68163 Mannheim
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
