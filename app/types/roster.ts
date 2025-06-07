// defines the types for getRoster and Roster
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
        tags: string[];
        players: {
            [rank: string]: {
                playerValues: PlayerValues;
            };
        };  
    };
}

export interface PartialPlayerInfo {
    [playerID: string]: {
        position: string;
        rank: number | string;
    }[];
}
