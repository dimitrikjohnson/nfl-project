export interface PlayerStats {
    jersey: string | undefined;
    name: string;
    position: string;
    link: string;
    stats: string[];
}

export interface PlayerStatCategories {
    [category: string]: {
        players: PlayerStats[];
        tableHeadings: {
            [column: string]: {
                heading: string;
                title: string;
        
            }   
        }
    };
}

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

export interface TeamStatTable {
    [group: string]: {
        label: string;
        shortLabel: string;
        perGame?: string | number;
        rank: number;
        rankDisplay: string;
        reversedColors: boolean;
        total: string | number;
    }[];
}