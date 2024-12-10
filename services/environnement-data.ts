import { getDatabase, ref, get } from "firebase/database";
import app from "@/lib/firebase";
const database = getDatabase(app);

export const fetchEnvironmentData = async (roomId: string) => {
  const roomRef = ref(database, `environment/${roomId}`);
  const snapshot = await get(roomRef);
  return snapshot.val();
};
