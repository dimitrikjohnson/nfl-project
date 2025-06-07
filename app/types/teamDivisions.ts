export type DivisionName = 
  | "afc north" | "afc south" | "afc east" | "afc west"
  | "nfc north" | "nfc south" | "nfc east" | "nfc west";

export interface DivisionTeam {
  city: string;
  name: string;
  id: string | number;
}

export type TeamDivisions = Record<DivisionName, DivisionTeam[]>;