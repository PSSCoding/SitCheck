"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { rooms } from "@/data/rooms";

export default function RoomDetailPage() {
  const { id } = useParams();
  const room = rooms.find((r) => r.id === Number(id));

  if (!room) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 text-center text-rose-600">
        Raum mit ID {id} wurde nicht gefunden.
      </div>
    );
  }

  const getStatus = (people, capacity) => {
    const ratio = people / capacity;
    if (ratio === 0) return { label: "Leer", color: "bg-slate-200 text-slate-800" };
    if (ratio <= 1 / 3) return { label: "Gering", color: "bg-emerald-500 text-white" };
    if (ratio <= 2 / 3) return { label: "Mittel", color: "bg-amber-400 text-slate-900" };
    if (ratio < 1) return { label: "Hoch", color: "bg-orange-500 text-white" };
    return { label: "Voll", color: "bg-rose-500 text-white" };
  };

  const status = getStatus(room.people, room.capacity);
  const utilization = Math.round((room.people / room.capacity) * 100);

  // Dummy-Prognosedaten basierend auf diesem Raum
  const data = [
    { time: "10:00", people: Math.round(room.people * 0.6) },
    { time: "12:00", people: Math.round(room.people * 0.8) },
    { time: "14:00", people: room.people },
    { time: "16:00", people: Math.min(room.capacity, Math.round(room.people * 1.1)) },
    { time: "18:00", people: Math.min(room.capacity, Math.round(room.people * 1.2)) },
    { time: "20:00", people: Math.max(0, Math.round(room.people * 0.7)) },
  ];

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-center gap-2 text-sm text-sky-600">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 font-medium shadow-sm transition hover:border-sky-300 hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          <span aria-hidden="true">←</span>
          Zur Übersicht
        </Link>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Raum</p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{room.name}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Aktuelle Live-Daten für Belegung und erwartete Entwicklung im Laufe des Tages.
            </p>
          </div>
          <span className={`self-start rounded-full px-4 py-2 text-xs font-semibold ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-sky-50 p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-wide text-sky-600">Personen im Raum</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{room.people}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-wide text-slate-500">Kapazität</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{room.capacity}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-wide text-emerald-600">Auslastung</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{utilization}%</p>
          </div>
        </div>

        <div className="mt-6 h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600"
            style={{ width: `${Math.min(utilization, 100)}%` }}
            aria-hidden="true"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Prognostizierter Verlauf</h2>
            <p className="text-sm text-slate-600">Erwartete Auslastung bis in die Abendstunden.</p>
          </div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Stand: {today}</span>
        </div>
        <div className="mt-6 h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="people" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
