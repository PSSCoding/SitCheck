import { notFound } from "next/navigation";
import RoomDetailClient from "./RoomDetailClient";
import { rooms } from "@/data/rooms";

const CATEGORY_META = {
  "Lesesäle": {
    gradient: "from-sky-400 via-sky-500 to-sky-600",
    pieFill: "#0ea5e9",
  },
  Gruppenräume: {
    gradient: "from-amber-400 via-orange-400 to-orange-500",
    pieFill: "#f97316",
  },
  Seitenbänke: {
    gradient: "from-emerald-400 via-teal-400 to-teal-500",
    pieFill: "#10b981",
  },
};

export function generateStaticParams() {
  return rooms.map((room) => ({ id: String(room.id) }));
}

export default function RoomDetailPage({ params }) {
  const roomId = Number(params?.id);
  const room = rooms.find((entry) => entry.id === roomId);

  if (!room) {
    notFound();
  }

  return <RoomDetailClient room={room} />;
}
