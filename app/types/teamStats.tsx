export interface TeamStat {
    value: number;
    displayValue: string;
    rank: number;
    rankDisplayValue: string;
    shortDisplayName: string;
}

export interface TeamStatCategory {
    stats: TeamStat[];
}