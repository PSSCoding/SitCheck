"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { rooms } from "@/data/rooms";

export default function HomePage() {
  const getStatus = (people, capacity) => {
    const ratio = people / capacity;
    if (ratio === 0) return { label: "Leer", color: "bg-gray-300 text-gray-800" };
    if (ratio <= 1 / 3) return { label: "Gering", color: "bg-green-500 text-white" };
    if (ratio <= 2 / 3) return { label: "Mittel", color: "bg-yellow-400 text-black" };
    if (ratio < 1) return { label: "Hoch", color: "bg-orange-500 text-white" };
    return { label: "Voll", color: "bg-red-600 text-white" };
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
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Bibliotheks-Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Linke Seite - Räume */}
        <div>
          {Object.keys(groupedRooms).map((type) => (
            <div key={type} className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">{type}</h2>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {groupedRooms[type].map((room) => {
                  const status = getStatus(room.people, room.capacity);
                  return (
                    <Link
                      href={`/rooms/${room.id}`}
                      key={room.id}
                      className="min-w-[200px] p-4 rounded-xl bg-white shadow-sm border border-gray-200 flex-shrink-0
                        hover:shadow-md hover:border-sky-400 transition-all duration-200 cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">{room.name}</h3>
                      <p className="text-gray-700">
                        Personen: <strong>{room.people}</strong> / {room.capacity}
                      </p>
                      <span
                        className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Rechte Seite - Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Geschätzte Belegung am {today}
          </h2>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="people" fill="#c0e3ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
