"use client";
import Link from "next/link";
import { Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useRooms } from "@/hooks/useRoom";
import { cn } from "@/lib/utils";
import { EnvironmentData } from "@/types/environnementData";
import { useQueries } from "@tanstack/react-query";
import { fetchEnvironmentData } from "@/services/environnement-data";
import { THRESHOLDS } from "@/lib/constants";

interface Alert {
  roomId: string;
  roomName: string;
  type: "co2" | "temperature" | "humidity";
  value: number;
  threshold: number;
  timestamp: Date;
  status: string | null;
}

export function SiteHeader() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { data: rooms } = useRooms();

  const environmentQueries = useQueries({
    queries: (rooms ?? []).map((room) => ({
      queryKey: ["environment", room.id],
      queryFn: () => fetchEnvironmentData(room.id),
      refetchInterval: 60000,
      refetchIntervalInBackground: true,
    })),
  });

  useEffect(() => {
    if (!rooms || environmentQueries.some((query) => query.isLoading)) return;

    const newAlerts: Alert[] = [];

    rooms.forEach((room, index) => {
      const data = environmentQueries[index].data;
      if (!data) return;

      const lastEntry = Object.values(data).pop() as EnvironmentData;
      if (!lastEntry) return;

      const isRoomOnline = Object.values(data).some((value) => {
        const envData = value as EnvironmentData;
        const dataDate = new Date(envData.date);
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        return dataDate > oneMinuteAgo;
      });

      if (!isRoomOnline) return;

      const currentAlerts = [
        {
          roomId: room.id,
          roomName: `Salle ${room.id.replace("_", ".")}`,
          type: "co2" as const,
          value: lastEntry.co2,
          threshold: THRESHOLDS.co2.warning,
          timestamp: new Date(lastEntry.date),
          status: lastEntry.co2 >= THRESHOLDS.co2.warning ? "warning" : null,
        },
        {
          roomId: room.id,
          roomName: `Salle ${room.id.replace("_", ".")}`,
          type: "temperature" as const,
          value: lastEntry.temperature,
          threshold: THRESHOLDS.temperature.max,
          timestamp: new Date(lastEntry.date),
          status:
            lastEntry.temperature > THRESHOLDS.temperature.max ||
            lastEntry.temperature < THRESHOLDS.temperature.min
              ? "warning"
              : null,
        },
        {
          roomId: room.id,
          roomName: `Salle ${room.id.replace("_", ".")}`,
          type: "humidity" as const,
          value: lastEntry.humidity,
          threshold: THRESHOLDS.humidity.max,
          timestamp: new Date(lastEntry.date),
          status:
            lastEntry.humidity > THRESHOLDS.humidity.max ||
            lastEntry.humidity < THRESHOLDS.humidity.min
              ? "warning"
              : null,
        },
      ];

      currentAlerts.forEach((alert) => {
        if (alert.status === "warning") {
          newAlerts.push(alert);
        }
      });
    });

    setAlerts((prevAlerts) => {
      const alertsChanged =
        JSON.stringify(prevAlerts) !== JSON.stringify(newAlerts);
      return alertsChanged ? newAlerts : prevAlerts;
    });
  }, [rooms, environmentQueries]);

  const warningCount = alerts.filter((a) => a.status === "warning").length;

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link href="/">Digital Campus</Link>
        </h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {warningCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  {warningCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>État des salles</SheetTitle>
              <SheetDescription>
                Surveillance des conditions environnementales
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {alerts.map((alert, index) => (
                <div
                  key={`${alert.roomId}-${alert.type}-${index}`}
                  className={cn(
                    "flex items-start gap-2 p-3 rounded-lg border",
                    alert.status === "warning" ? "bg-red-50" : "bg-green-50"
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      "h-4 w-4 mt-1",
                      alert.status === "warning"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{alert.roomName}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.type === "co2" &&
                        `CO2: ${alert.value.toFixed(0)} ppm`}
                      {alert.type === "temperature" &&
                        `Température: ${alert.value.toFixed(1)}°C`}
                      {alert.type === "humidity" &&
                        `Humidité: ${alert.value.toFixed(0)}%`}
                      {alert.status === "warning"
                        ? " (Seuil dépassé)"
                        : " (Normal)"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
