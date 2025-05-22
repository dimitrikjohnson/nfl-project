// defines the types for formatSchedule.tsx
export interface GameData {
    id?: string; // used in JSX as a key
    date?: Date;
    teams?: any[];
    status?: {
        type: {
            state: string;
        }
    };
    week: {
        number: number;
        text?: string;
    };
    season?: string;
    seasonType?: string;
    network?: string;
    spread?: string;
    overUnder?: string;
    leaders?: any[];
    upcomingGames?: any[];
    pastGames?: any[];
}