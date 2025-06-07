// types for TeamRankings

export interface Stat {
    shortName: string;
    longName: string;
    rank: number;
    rankDisplayValue: string;
    value: number | string;
}

export type Side = 'Offensive' | 'Defensive';

export type SideOfBall = {
    [key in Side]: Stat[];
}

export interface Rankings {
    season: {
        type: number | string;
        year: number | string;
    };
    sides: SideOfBall;
}
