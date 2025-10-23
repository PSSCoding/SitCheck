"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import logo from "./logo.png";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Buchungen", href: "/bookings" },
    { label: "Einstellungen", href: "/settings" },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full text-black p-4 transform transition-transform duration-300 z-40
              ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}
            style={{ backgroundColor: "#c0e3ff" }}
          >
            {/* Sidebar Logo + Titel */}
            <div className="flex items-center mb-6">
              <Image src={logo} alt="SitCheck Logo" width={120} height={120} />
              <h2 className="text-xl font-bold ml-2 text-black">SitCheck</h2>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 rounded transition-colors duration-200"
                  style={{ backgroundColor: "transparent", color: "black" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#9fd4ff")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div
            className={`flex-1 min-h-screen transition-all duration-300 
              ${sidebarOpen ? "ml-64" : "ml-0"}`}
          >
            {/* Header */}
           <header
  className="relative flex items-center p-4 shadow-md"
  style={{ backgroundColor: "#c0e3ff", height: "6rem" }}
>
  {/* Linke Seite: Hamburger + Logo + Titel */}
  <div className="flex items-center gap-4 z-10">
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="flex items-center justify-center bg-transparent border-0 appearance-none focus:outline-none"
    >
      {sidebarOpen ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="3"
          className="w-6 h-6"
        >
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="3"
          className="w-6 h-6"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      )}
    </button>

    {/* Logo links vom Titel */}
    <Image
      src={logo}
      alt="SitCheck Logo"
      width={120}
      height={120}
      className="object-contain"
    />

    <h1 className="text-2xl font-bold text-black">SitCheck</h1>
  </div>
</header>

            <main className="p-8">{children}</main>

            <footer
              className="p-4 text-center"
              style={{ backgroundColor: "#c0e3ff", color: "black" }}
            >
              © 2025 DHBW Germany GmbH Coblitzallee 1-9, 68163 Mannheim
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
