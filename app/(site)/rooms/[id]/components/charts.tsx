"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface EnvironmentData {
  co2: number;
  date: string | number;
  humidity: number;
  temperature: number;
}

interface ChartProps {
  data: EnvironmentData[];
  timeRange: string;
}

const formatData = (data: EnvironmentData[]) => {
  return data.map((item) => ({
    timestamp: item.date,
    ...item,
  }));
};

const formatXAxis = (timestamp: string | number, timeRange: string) => {
  const date =
    typeof timestamp === "string"
      ? new Date(timestamp)
      : new Date(Number(timestamp));

  switch (timeRange) {
    case "1h":
    case "3h":
      // Format HH:mm pour les vues horaires
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "24h":
      // Format HH:mm pour la vue 24h
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "7d":
      // Format jour de la semaine pour la vue hebdomadaire
      return date.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
      });
    case "30d":
      // Format jour/mois pour la vue mensuelle
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    default:
      return date.toLocaleString("fr-FR");
  }
};

export function CO2Chart({ data, timeRange }: ChartProps) {
  const [selectedType, setSelectedType] = useState<"area" | "line" | "bar">(
    "area"
  );

  const chartConfig = {
    co2: {
      label: "CO2",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const formattedData = formatData(data);
  const lastValue = formattedData[formattedData.length - 1]?.co2 ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>CO2</CardTitle>
            <CardDescription>Niveau de CO2 en temps réel</CardDescription>
          </div>
          <Select
            value={selectedType}
            onValueChange={(value) =>
              setSelectedType(value as "area" | "line" | "bar")
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type de graphique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Aire 📊</SelectItem>
              <SelectItem value="line">Ligne 📈</SelectItem>
              <SelectItem value="bar">Barres 📊</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {selectedType === "bar" ? (
            <BarChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="co2" fill="hsl(var(--chart-1))" />
            </BarChart>
          ) : selectedType === "line" ? (
            <LineChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="co2"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="co2"
                type="natural"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-1))"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <span>Dernière valeur: {lastValue.toFixed(2)} ppm</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Mesures en temps réel
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function TemperatureChart({ data, timeRange }: ChartProps) {
  const [selectedType, setSelectedType] = useState<"area" | "line" | "bar">(
    "area"
  );

  const chartConfig = {
    temperature: {
      label: "Température",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const formattedData = formatData(data);
  const lastValue = formattedData[formattedData.length - 1]?.temperature ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Température</CardTitle>
            <CardDescription>Température en temps réel</CardDescription>
          </div>
          <Select
            value={selectedType}
            onValueChange={(value) =>
              setSelectedType(value as "area" | "line" | "bar")
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type de graphique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Aire 📊</SelectItem>
              <SelectItem value="line">Ligne 📈</SelectItem>
              <SelectItem value="bar">Barres 📊</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {selectedType === "bar" ? (
            <BarChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="temperature" fill="hsl(var(--chart-2))" />
            </BarChart>
          ) : selectedType === "line" ? (
            <LineChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="temperature"
                type="natural"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-2))"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <span>Dernière valeur: {lastValue.toFixed(2)} °C</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Mesures en temps réel
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function HumidityChart({ data, timeRange }: ChartProps) {
  const [selectedType, setSelectedType] = useState<"area" | "line" | "bar">(
    "area"
  );

  const chartConfig = {
    humidity: {
      label: "Humidité",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const formattedData = formatData(data);
  const lastValue = formattedData[formattedData.length - 1]?.humidity ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Humidité</CardTitle>
            <CardDescription>Humidité en temps réel</CardDescription>
          </div>
          <Select
            value={selectedType}
            onValueChange={(value) =>
              setSelectedType(value as "area" | "line" | "bar")
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type de graphique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Aire 📊</SelectItem>
              <SelectItem value="line">Ligne 📈</SelectItem>
              <SelectItem value="bar">Barres 📊</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {selectedType === "bar" ? (
            <BarChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="humidity" fill="hsl(var(--chart-3))" />
            </BarChart>
          ) : selectedType === "line" ? (
            <LineChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart
              accessibilityLayer
              data={formattedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatXAxis(value, timeRange)}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="humidity"
                type="natural"
                fill="hsl(var(--chart-3))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-3))"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <span>Dernière valeur: {lastValue.toFixed(2)} %</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Mesures en temps réel
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
