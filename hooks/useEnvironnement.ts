import { useQuery } from "@tanstack/react-query";
import { fetchEnvironmentData } from "../services/environnement-data";

export const useEnvironmentData = (roomId: string) => {
  return useQuery({
    queryKey: ["environment", roomId],
    queryFn: () => fetchEnvironmentData(roomId),
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    staleTime: 30000,
  });
};
