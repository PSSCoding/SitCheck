"use client";

import { useParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { rooms } from "@/data/rooms"; 

export default function RoomDetailPage() {
  const { id } = useParams();
  const room = rooms.find((r) => r.id === Number(id));

  if (!room) {
    return <div className="p-8 text-red-600">Raum mit ID {id} wurde nicht gefunden.</div>;
  }

  const getStatus = (people, capacity) => {
    const ratio = people / capacity;
    if (ratio === 0) return { label: "Leer", color: "bg-gray-300 text-gray-800" };
    if (ratio <= 1 / 3) return { label: "Gering", color: "bg-green-500 text-white" };
    if (ratio <= 2 / 3) return { label: "Mittel", color: "bg-yellow-400 text-black" };
    if (ratio < 1) return { label: "Hoch", color: "bg-orange-500 text-white" };
    return { label: "Voll", color: "bg-red-600 text-white" };
  };

  const status = getStatus(room.people, room.capacity);

  // Dummy-Prognosedaten basierend auf diesem Raum
  const data = [
    { time: "10:00", people: room.people * 0.6 },
    { time: "12:00", people: room.people * 0.8 },
    { time: "14:00", people: room.people },
    { time: "16:00", people: Math.min(room.capacity, room.people * 1.1) },
    { time: "18:00", people: Math.min(room.capacity, room.people * 1.2) },
    { time: "20:00", people: Math.max(0, room.people * 0.7) },
  ];

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.name}</h1>

      <div className="flex items-center gap-4 mb-6">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>
          {status.label}
        </span>
        <p className="text-lg text-gray-700">
          {room.people} von {room.capacity} Plätzen belegt
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Prognostizierte Auslastung am {today}
        </h2>
        <div className="min-w-[700px] h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="people" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
