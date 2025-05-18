// defines the types for getRoster.tsx
export interface PlayerValues {
    name: string;
    jersey: number;
    age: number;
    weight: string;
    height: string;
    experience: number;
    injuries?: string;
    headshot?: string;
    college?: string;
}

export interface AllPlayers {
    [positionName: string]: {
        players: {
            [rank: string]: {
                playerValues: PlayerValues;
            };
        };
        tags: string[];
    };
}

export interface PartialPlayerInfo {
    [playerID: string]: {
        position: string;
        rank: number | string;
    }[];
}
