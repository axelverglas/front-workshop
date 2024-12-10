import { getDatabase, ref, get } from "firebase/database";
import app from "@/lib/firebase";
import { Room } from "@/types/rooms";
const database = getDatabase(app);

export const fetchRooms = async (): Promise<Room[]> => {
  const envRef = ref(database, "environment");
  const snapshot = await get(envRef);

  if (!snapshot.exists()) return [];

  return Object.keys(snapshot.val()).map((roomId) => ({
    id: roomId,
    name: `Salle ${roomId}`,
    floor: roomId.startsWith("S")
      ? "sous-sol"
      : roomId.startsWith("R")
      ? "rdc"
      : (roomId[0] as "1" | "2" | "3" | "4" | "5" | "6"),
    isOnline: Object.values(snapshot.val()[roomId] || {}).some(
      (value: unknown) => {
        const data = value as { date: string | number };
        const dataDate = new Date(data.date);
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        return dataDate > oneMinuteAgo;
      }
    ),
  }));
};
