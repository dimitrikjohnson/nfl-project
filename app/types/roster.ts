import { BasePlayerInfo } from "./player";

// defines the types for getRoster and Roster
export interface PlayerValues extends BasePlayerInfo {
    injuries?: string;
    experience: number;
    link: string;
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
