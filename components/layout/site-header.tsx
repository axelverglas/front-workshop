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
import { fetchEnvironmentData } from "@/services/environnement-data";

const ALERT_THRESHOLDS = {
  co2: 1000,
  temperature: 25,
  humidity: 70,
};

interface Alert {
  roomId: string;
  roomName: string;
  type: "co2" | "temperature" | "humidity";
  value: number;
  threshold: number;
  timestamp: Date;
  status: "warning" | "success";
}

export function SiteHeader() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { data: rooms } = useRooms();

  useEffect(() => {
    if (!rooms) return;

    const checkAlerts = async () => {
      const newAlerts: Alert[] = [];

      for (const room of rooms) {
        const data = await fetchEnvironmentData(room.id);
        if (!data) continue;

        const lastEntry = Object.values(data).pop() as EnvironmentData;
        if (!lastEntry) continue;

        const currentAlerts = [
          {
            roomId: room.id,
            roomName: room.name,
            type: "co2" as const,
            value: lastEntry.co2,
            threshold: ALERT_THRESHOLDS.co2,
            timestamp: new Date(lastEntry.date),
            status:
              lastEntry.co2 > ALERT_THRESHOLDS.co2
                ? ("warning" as const)
                : ("success" as const),
          },
          {
            roomId: room.id,
            roomName: room.name,
            type: "temperature" as const,
            value: lastEntry.temperature,
            threshold: ALERT_THRESHOLDS.temperature,
            timestamp: new Date(lastEntry.date),
            status:
              lastEntry.temperature > ALERT_THRESHOLDS.temperature
                ? ("warning" as const)
                : ("success" as const),
          },
          {
            roomId: room.id,
            roomName: room.name,
            type: "humidity" as const,
            value: lastEntry.humidity,
            threshold: ALERT_THRESHOLDS.humidity,
            timestamp: new Date(lastEntry.date),
            status:
              lastEntry.humidity > ALERT_THRESHOLDS.humidity
                ? ("warning" as const)
                : ("success" as const),
          },
        ];

        currentAlerts.forEach((alert) => {
          const existingAlert = alerts.find(
            (a) => a.roomId === alert.roomId && a.type === alert.type
          );
          if (!existingAlert || existingAlert.status !== alert.status) {
            newAlerts.push(alert);
          }
        });
      }

      setAlerts((prev) => {
        const filteredAlerts = prev.filter((oldAlert) => {
          const newAlert = newAlerts.find(
            (a) => a.roomId === oldAlert.roomId && a.type === oldAlert.type
          );
          return !newAlert;
        });
        return [...filteredAlerts, ...newAlerts];
      });
    };

    checkAlerts();
  }, [rooms, alerts]);

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
