import { notFound } from "next/navigation";
import RoomDetailClient from "./RoomDetailClient";
import { rooms } from "@/data/rooms";

export const dynamicParams = false;

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
