"use client";

import { useEnvironmentData } from "@/hooks/useEnvironnement";
import { CO2Chart, TemperatureChart, HumidityChart } from "./components/charts";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { EnvironmentData } from "@/types/environnementData";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { StatsCards } from "./components/stats-cards";

const timeRanges = [
  { value: "1h", label: "Dernière heure" },
  { value: "3h", label: "3 dernières heures" },
  { value: "24h", label: "24 dernières heures" },
  { value: "7d", label: "7 derniers jours" },
  { value: "30d", label: "30 derniers jours" },
];

export default function RoomPage({ params }: { params: { id: string } }) {
  const [timeRange, setTimeRange] = useState("24h");
  const { data: environmentData, isLoading } = useEnvironmentData(params.id);

  const getDisplayData = () => {
    if (!environmentData) return [];
    const values = Array.isArray(environmentData)
      ? environmentData
      : (Object.values(environmentData) as EnvironmentData[]);
    const now = new Date();
    const cutoffDate = new Date();

    // Calculer la date limite selon la période choisie
    switch (timeRange) {
      case "1h":
        cutoffDate.setHours(now.getHours() - 1);
        break;
      case "3h":
        cutoffDate.setHours(now.getHours() - 3);
        break;
      case "24h":
        cutoffDate.setHours(now.getHours() - 24);
        break;
      case "7d":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(now.getDate() - 30);
        break;
    }

    return values
      .filter((item) => new Date(item.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const exportToCSV = () => {
    const data = (
      Object.values(environmentData || {}) as EnvironmentData[]
    ).map((value) => ({
      date: new Date(value.date).toLocaleString(),
      co2: value.co2,
      temperature: value.temperature,
      humidity: value.humidity,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Données");
    XLSX.writeFile(wb, `salle_${params.id}_données.csv`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = (
      Object.values(environmentData || {}) as EnvironmentData[]
    ).map((value) => ({
      date: new Date(value.date).toLocaleString(),
      co2: value.co2.toFixed(2),
      temperature: value.temperature.toFixed(2),
      humidity: value.humidity.toFixed(2),
    }));

    doc.text(`Données de la salle ${params.id}`, 20, 10);
    data.forEach((row, i) => {
      doc.text(
        `${row.date}: CO2: ${row.co2}, Temp: ${row.temperature}°C, Hum: ${row.humidity}%`,
        20,
        20 + i * 10
      );
    });
    doc.save(`salle_${params.id}_données.pdf`);
  };

  const exportToXML = () => {
    const data = Object.values(environmentData || {}) as EnvironmentData[];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<measurements>\n';

    data.forEach((value: EnvironmentData) => {
      xml += `  <measurement>
    <date>${new Date(value.date).toISOString()}</date>
    <co2>${value.co2}</co2>
    <temperature>${value.temperature}</temperature>
    <humidity>${value.humidity}</humidity>
  </measurement>\n`;
    });

    xml += "</measurements>";
    const blob = new Blob([xml], { type: "text/xml;charset=utf-8" });
    saveAs(blob, `salle_${params.id}_données.xml`);
  };

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">
            Tableau de bord de la salle {params.id.replace("_", ".")}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button onClick={exportToPDF} variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button onClick={exportToXML} variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                XML
              </Button>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {isLoading ? (
          <div>Chargement des données...</div>
        ) : (
          <>
            <StatsCards data={getDisplayData()} />
            <div className="grid gap-4 md:grid-cols-2">
              <CO2Chart data={getDisplayData()} timeRange={timeRange} />
              <TemperatureChart data={getDisplayData()} timeRange={timeRange} />
              <HumidityChart data={getDisplayData()} timeRange={timeRange} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
