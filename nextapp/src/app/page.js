"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { rooms } from "@/data/rooms";

const CATEGORY_META = {
  "Learning Center": {
    gradient: "from-sky-400 via-sky-500 to-sky-600",
    accent: "text-sky-600",
    pieFill: "#0ea5e9",
  },
  Gruppenräume: {
    gradient: "from-amber-400 via-orange-400 to-orange-500",
    accent: "text-orange-500",
    pieFill: "#f97316",
  },
  Seitenbänke: {
    gradient: "from-emerald-400 via-teal-400 to-teal-500",
    accent: "text-emerald-500",
    pieFill: "#10b981",
  },
};

const bookings = [
  {
    id: 1,
    roomId: 7,
    roomName: "Gruppenraum B",
    category: "Gruppenräume",
    start: "13:30",
    end: "15:00",
    status: "Bestätigt",
  },
  {
    id: 2,
    roomId: 3,
    roomName: "Lesesaal 3",
    category: "Learning Center",
    start: "16:00",
    end: "18:00",
    status: "Option",
  },
  {
    id: 3,
    roomId: 11,
    roomName: "Seitenbank 1",
    category: "Seitenbänke",
    start: "18:30",
    end: "19:30",
    status: "Bestätigt",
  },
];

const parseTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export default function HomePage() {
  const groupedRooms = Object.entries(
    rooms.reduce((acc, room) => {
      if (!acc[room.type]) acc[room.type] = [];
      acc[room.type].push(room);
      return acc;
    }, {}),
  );

  const totalPeople = rooms.reduce((sum, room) => sum + room.people, 0);
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const freeSeats = Math.max(totalCapacity - totalPeople, 0);
  const averageUtilization = totalCapacity
    ? Math.round((totalPeople / totalCapacity) * 100)
    : 0;

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const sortedBookings = [...bookings].sort(
    (a, b) => parseTimeToMinutes(a.start) - parseTimeToMinutes(b.start),
  );
  const nextBooking = sortedBookings[0];
  const additionalBookings = sortedBookings.slice(1);

  const categoryTotals = groupedRooms.reduce((acc, [type, typeRooms]) => {
    const totals = typeRooms.reduce(
      (tot, room) => {
        tot.people += room.people;
        tot.capacity += room.capacity;
        return tot;
      },
      { people: 0, capacity: 0 },
    );
    acc[type] = totals;
    return acc;
  }, {});

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const forecastFactors = [
    0.22,
    0.35,
    0.48,
    0.58,
    0.73,
    0.82,
    0.88,
    0.8,
    0.74,
    0.62,
    0.5,
    0.42,
    0.3,
  ];

  const forecastData = timeSlots.map((time, index) => {
    const entry = { time };
    groupedRooms.forEach(([type]) => {
      const capacity = categoryTotals[type]?.capacity ?? 0;
      entry[type] = Math.round(capacity * forecastFactors[index]);
    });
    return entry;
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-6 sm:gap-12">
      <section className="space-y-4 sm:space-y-6">
        <div className="rounded-4xl bg-gradient-to-br from-sky-100 via-sky-50 to-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                Meine nächste Buchung
              </span>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{nextBooking.roomName}</h1>
                <p className="mt-1 text-sm text-slate-600">
                  {nextBooking.start} – {nextBooking.end} Uhr · {nextBooking.category}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="rounded-full bg-sky-200/50 px-3 py-1 font-medium text-sky-700">Status: {nextBooking.status}</span>
                <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-700">Heute, {today}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm text-slate-600">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-sky-600">
                Buchung verwalten
                <span aria-hidden="true">→</span>
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700">
                Neuen Raum suchen
              </button>
            </div>
          </div>

          {additionalBookings.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {additionalBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-inner"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{booking.roomName}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {booking.start} – {booking.end} Uhr · {booking.category}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-3">
          {[
            { label: "Aktive Räume", value: rooms.length },
            { label: "Personen aktuell", value: totalPeople },
            { label: "Freie Plätze", value: freeSeats },
            { label: "Ø Auslastung", value: `${averageUtilization}%` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        {groupedRooms.map(([type, typeRooms]) => {
          const totals = categoryTotals[type];
          const meta = CATEGORY_META[type] ?? {
            gradient: "from-slate-400 via-slate-500 to-slate-600",
            accent: "text-slate-600",
            pieFill: "#64748b",
          };
          const utilization = totals.capacity
            ? Math.round((totals.people / totals.capacity) * 100)
            : 0;
          const pieData = [
            { name: "Belegt", value: totals.people },
            { name: "Frei", value: Math.max(totals.capacity - totals.people, 0) },
          ];

          return (
            <article
              key={type}
              className="rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${meta.gradient} px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow`}
                    >
                      {type}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {typeRooms.length} Räume
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Aggregierte Auslastung aller {type.toLowerCase()} im Überblick.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>
                      Belegt: <span className="font-semibold text-slate-900">{totals.people}</span>
                    </span>
                    <span>
                      Kapazität: <span className="font-semibold text-slate-900">{totals.capacity}</span>
                    </span>
                    <span>
                      Frei: <span className="font-semibold text-slate-900">{Math.max(totals.capacity - totals.people, 0)}</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">Live</span>
                    <span className="rounded-full px-2 py-0.5 text-slate-500">Heute</span>
                    <span className="rounded-full px-2 py-0.5 text-slate-500">Woche</span>
                  </div>
                  <div className="relative h-28 w-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          innerRadius={40}
                          outerRadius={56}
                          startAngle={90}
                          endAngle={450}
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`${type}-pie-${entry.name}`}
                              fill={index === 0 ? meta.pieFill : "#e2e8f0"}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-slate-500">Auslastung</span>
                      <span className="text-lg font-semibold text-slate-900">{utilization}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="-mx-5 mt-6 overflow-x-auto pb-4">
                <div className="flex gap-4 px-1 sm:px-5">
                  {typeRooms.map((room) => {
                    const statusRatio = room.people / room.capacity;
                    const status = (() => {
                      if (statusRatio === 0)
                        return { label: "Leer", badge: "bg-slate-200 text-slate-800" };
                      if (statusRatio <= 1 / 3)
                        return { label: "Gering", badge: "bg-emerald-500 text-white" };
                      if (statusRatio <= 2 / 3)
                        return { label: "Mittel", badge: "bg-amber-400 text-slate-900" };
                      if (statusRatio < 1)
                        return { label: "Hoch", badge: "bg-orange-500 text-white" };
                      return { label: "Voll", badge: "bg-rose-500 text-white" };
                    })();
                    const utilizationRoom = Math.round((room.people / room.capacity) * 100);

                    return (
                      <Link
                        href={`/rooms/${room.id}`}
                        key={room.id}
                        className="group flex min-w-[240px] snap-start flex-col gap-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-slate-400">{room.type}</p>
                            <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                          <div>
                            <p>Personen</p>
                            <p className="text-sm font-semibold text-slate-900">{room.people}</p>
                          </div>
                          <div>
                            <p>Kapazität</p>
                            <p className="text-sm font-semibold text-slate-900">{room.capacity}</p>
                          </div>
                          <div>
                            <p>Auslastung</p>
                            <p className="text-sm font-semibold text-slate-900">{utilizationRoom}%</p>
                          </div>
                          <div>
                            <p>Freie Plätze</p>
                            <p className="text-sm font-semibold text-slate-900">{Math.max(room.capacity - room.people, 0)}</p>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
                            style={{ width: `${Math.min(utilizationRoom, 100)}%` }}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold text-sky-600">
                          <span className="flex items-center gap-2">
                            Details ansehen
                            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </span>
                          <span className="text-slate-500">Live</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Auslastungsprognose nach Bereichen</h2>
            <p className="text-sm text-slate-600">
              Geschätzte Besucherzahlen im Tagesverlauf – aggregiert nach Raumtyp.
            </p>
          </div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Stand: {today}</span>
        </div>
        <div className="mt-6 h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastData} stackOffset="expand" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `${Math.round(value)}%`} domain={[0, 1]} />
              <Tooltip
                formatter={(value, name, props) => {
                  const capacity = categoryTotals[name]?.capacity ?? 0;
                  return `${Math.round(value * capacity)} Personen`;
                }}
                labelFormatter={(label) => `${label} Uhr`}
                contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
              />
              <Legend wrapperStyle={{ paddingTop: 16 }} />
              {groupedRooms.map(([type]) => (
                <Bar key={type} dataKey={type} stackId="categories" fill={CATEGORY_META[type]?.pieFill ?? "#94a3b8"} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
