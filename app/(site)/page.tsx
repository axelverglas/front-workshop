"use client";

import { useRooms } from "@/hooks/useRoom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { EnvironmentData } from "@/types/environnementData";
import { useQueries } from "@tanstack/react-query";
import { fetchEnvironmentData } from "@/services/environnement-data";
import { getValueColor, THRESHOLDS } from "@/lib/constants";

const floorOptions = [
  { value: "all", label: "Tous les étages 🏢" },
  { value: "parking", label: "Parking 🅿️" },
  { value: "sous-sol", label: "Sous-sol 🔻" },
  { value: "rdc", label: "Rez-de-chaussée 🏠" },
  { value: "1", label: "1er étage 1️⃣" },
  { value: "2", label: "2ème étage 2️⃣" },
  { value: "3", label: "3ème étage 3️⃣" },
  { value: "4", label: "4ème étage 4️⃣" },
  { value: "5", label: "5ème étage 5️⃣" },
  { value: "6", label: "6ème étage 6️⃣" },
];

export default function Home() {
  const { data: rooms, isLoading } = useRooms();
  const router = useRouter();
  const [selectedFloor, setSelectedFloor] = useState<string>("all");

  const filteredRooms = rooms?.filter((room) => {
    if (selectedFloor === "all") return true;
    return room.floor === selectedFloor;
  });

  const environmentQueries = useQueries({
    queries: (rooms ?? []).map((room) => ({
      queryKey: ["environment", room.id],
      queryFn: () => fetchEnvironmentData(room.id),
      refetchInterval: 60000,
      refetchIntervalInBackground: true,
    })),
  });

  return (
    <section className="py-12">
      <div className="container">
        <div className="md:flex justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">Salles disponibles</h1>
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Filtrer par étage" />
            </SelectTrigger>
            <SelectContent>
              {floorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div>Chargement des salles...</div>
        ) : !filteredRooms?.length ? (
          <div>Aucune salle trouvée pour cet étage</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {filteredRooms.map((room, index) => {
              const environmentData = environmentQueries[index]?.data;
              const lastValues = environmentData
                ? (Object.values(environmentData).pop() as EnvironmentData)
                : null;

              return (
                <Card
                  key={room.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => router.push(`/rooms/${room.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {room.name.replace("_", ".")}
                      <Circle
                        className={cn(
                          "h-3 w-3",
                          room.isOnline
                            ? "text-green-500 fill-green-500"
                            : "text-red-500 fill-red-500"
                        )}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground">
                        {room.isOnline ? "En ligne" : "Hors ligne"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {room.floor === "rdc"
                          ? "Rez-de-chaussée"
                          : room.floor === "sous-sol"
                          ? "Sous-sol"
                          : `${room.floor}ème étage`}
                      </p>
                      {lastValues && (
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <span
                                className={getValueColor("co2", lastValues.co2)}
                              >
                                <Circle
                                  className={cn(
                                    "h-2 w-2 inline-block mr-1",
                                    lastValues.co2 >= THRESHOLDS.co2.warning
                                      ? "fill-red-500"
                                      : "fill-green-500"
                                  )}
                                />
                                {lastValues.co2.toFixed(0)}ppm
                              </span>
                              <span
                                className={getValueColor(
                                  "temperature",
                                  lastValues.temperature
                                )}
                              >
                                <Circle
                                  className={cn(
                                    "h-2 w-2 inline-block mr-1",
                                    lastValues.temperature >
                                      THRESHOLDS.temperature.max ||
                                      lastValues.temperature <
                                        THRESHOLDS.temperature.min
                                      ? "fill-red-500"
                                      : "fill-green-500"
                                  )}
                                />
                                {lastValues.temperature.toFixed(1)}°C
                              </span>
                              <span
                                className={getValueColor(
                                  "humidity",
                                  lastValues.humidity
                                )}
                              >
                                <Circle
                                  className={cn(
                                    "h-2 w-2 inline-block mr-1",
                                    lastValues.humidity >
                                      THRESHOLDS.humidity.max ||
                                      lastValues.humidity <
                                        THRESHOLDS.humidity.min
                                      ? "fill-red-500"
                                      : "fill-green-500"
                                  )}
                                />
                                {lastValues.humidity.toFixed(0)}%
                              </span>
                            </span>
                            <TrendingUp className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
