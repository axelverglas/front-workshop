export interface Room {
  id: string;
  name: string;
  isOnline: boolean;
  floor: "sous-sol" | "rdc" | "1" | "2" | "3" | "4" | "5" | "6";
}
