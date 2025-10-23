"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { rooms } from "@/data/rooms";

export default function HomePage() {
  const getStatus = (people, capacity) => {
    const ratio = people / capacity;
    if (ratio === 0) return { label: "Leer", color: "bg-slate-200 text-slate-800" };
    if (ratio <= 1 / 3) return { label: "Gering", color: "bg-emerald-500 text-white" };
    if (ratio <= 2 / 3) return { label: "Mittel", color: "bg-amber-400 text-slate-900" };
    if (ratio < 1) return { label: "Hoch", color: "bg-orange-500 text-white" };
    return { label: "Voll", color: "bg-rose-500 text-white" };
  };

  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.type]) acc[room.type] = [];
    acc[room.type].push(room);
    return acc;
  }, {});

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const data = [
    { time: "10:00", people: 20 },
    { time: "11:00", people: 35 },
    { time: "12:00", people: 50 },
    { time: "13:00", people: 65 },
    { time: "14:00", people: 80 },
    { time: "15:00", people: 70 },
    { time: "16:00", people: 60 },
    { time: "17:00", people: 75 },
    { time: "18:00", people: 90 },
    { time: "19:00", people: 85 },
    { time: "20:00", people: 70 },
    { time: "21:00", people: 55 },
    { time: "22:00", people: 40 },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="rounded-3xl bg-gradient-to-r from-sky-100 via-sky-50 to-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Bibliotheks-Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
            Verfolge die aktuelle Auslastung der Lern- und Gruppenräume und erhalte Prognosen für den heutigen Tag.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white/80 p-4 text-sm text-slate-700 shadow-inner sm:mt-0">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Heutiges Datum</p>
            <p className="font-semibold text-slate-900">{today}</p>
          </div>
          <div className="hidden h-12 w-px bg-slate-200 sm:block" aria-hidden="true" />
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-wide text-slate-500">Aktive Räume</p>
            <p className="font-semibold text-slate-900">{rooms.length}</p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        {Object.keys(groupedRooms).map((type) => (
          <div key={type} className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{type}</h2>
                <p className="text-sm text-slate-600">
                  Übersicht der aktuellen Auslastung aller {type.toLowerCase()}.
                </p>
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {groupedRooms[type].length} Räume
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {groupedRooms[type].map((room) => {
                const status = getStatus(room.people, room.capacity);
                const utilization = Math.round((room.people / room.capacity) * 100);
                return (
                  <Link
                    href={`/rooms/${room.id}`}
                    key={room.id}
                    className="group rounded-2xl border border-transparent bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{room.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{room.capacity} Plätze insgesamt</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-900">{room.people}</span> Personen im Raum
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wide text-slate-400">Auslastung</span>
                        <span className="font-semibold text-slate-900">{utilization}%</span>
                      </div>
                    </div>
                    <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600"
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-xs font-medium text-sky-600">
                      Details ansehen
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Auslastungsprognose</h2>
            <p className="text-sm text-slate-600">
              Geschätzte Besucherzahlen im Tagesverlauf für alle Bereiche zusammen.
            </p>
          </div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Stand: {today}</span>
        </div>
        <div className="mt-6 h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="people" fill="#38bdf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
