export const THRESHOLDS = {
  co2: {
    warning: 1000,
    danger: 1500,
  },
  temperature: {
    min: 19,
    max: 25,
  },
  humidity: {
    min: 30,
    max: 70,
  },
};

export const getValueColor = (
  type: "co2" | "temperature" | "humidity",
  value: number
) => {
  switch (type) {
    case "co2":
      return value >= THRESHOLDS.co2.warning
        ? "text-red-500"
        : "text-green-500";
    case "temperature":
      return value > THRESHOLDS.temperature.max ||
        value < THRESHOLDS.temperature.min
        ? "text-red-500"
        : "text-green-500";
    case "humidity":
      return value <= THRESHOLDS.humidity.min ||
        value >= THRESHOLDS.humidity.max
        ? "text-red-500"
        : "text-green-500";
  }
};
