import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { EnvironmentData } from "@/types/environnementData";

interface StatsCardsProps {
  data: EnvironmentData[];
}

export function StatsCards({ data }: StatsCardsProps) {
  const getAverages = () => {
    if (data.length === 0) return { co2: 0, temperature: 0, humidity: 0 };

    const sum = data.reduce(
      (acc, curr) => ({
        co2: acc.co2 + curr.co2,
        temperature: acc.temperature + curr.temperature,
        humidity: acc.humidity + curr.humidity,
      }),
      { co2: 0, temperature: 0, humidity: 0 }
    );

    return {
      co2: Number((sum.co2 / data.length).toFixed(2)),
      temperature: Number((sum.temperature / data.length).toFixed(2)),
      humidity: Number((sum.humidity / data.length).toFixed(2)),
    };
  };

  const averages = getAverages();

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>CO2 Moyen</CardTitle>
          <CardDescription>Pour la période sélectionnée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averages.co2} ppm</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Température Moyenne</CardTitle>
          <CardDescription>Pour la période sélectionnée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averages.temperature}°C</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Humidité Moyenne</CardTitle>
          <CardDescription>Pour la période sélectionnée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averages.humidity}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
