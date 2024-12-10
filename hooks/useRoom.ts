import { useQuery } from "@tanstack/react-query";
import { fetchRooms } from "../services/rooms";

export const useRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => fetchRooms(),
    refetchInterval: 60000,
  });
};
