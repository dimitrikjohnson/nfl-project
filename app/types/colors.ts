// type for allTeamsColors.json
export interface TeamColor {
  fullName: string;
  id: string;
  textColor: string;
  bgColor: string;
}

export type AllTeamsColors = Record<string, TeamColor>;