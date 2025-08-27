// types for LeagueLeaders and Leader

export interface PlayerStatLeader {
    playerHeadshot: string;
    playerJersey?: string;
    playerName: string;
    playerLink: string;
    playerPosition: string;
    statName: string;
    statValue: string;
    playerTeamLogo?: string;
    playerTeamName?: string;
}

export interface StatLeaders {
    [stat: string]: PlayerStatLeader[];
}
