// defines types for Schedule, formatSchedule, and displayGameInfo

// Basic structures

export interface TeamLogo {
    href: string;
}

export interface TeamInfo {
    id: string;
    displayName: string;
    shortDisplayName: string;
    abbreviation: string;
    logos?: TeamLogo[];
    logo?: string;
}

export interface GameLeader {
    value: string,
    player: {
        displayName: string;
        shortName: string;
        lastName: string;
        link: string;
    };  
}

// Teams in a game

export interface CompetitorTeam {
    id: string;
    homeAway: "home" | "away";
    winner?: boolean;
    score?: { value?: number | string } | string;
    record?: { displayValue: string }[];
    team: TeamInfo;
    leaders?: GameLeader[];
    records?: { summary: string }[];
}

export interface TeamsInGameResult {
    chosenTeam: {
        score: string | number | undefined;
        name: string;
        homeAway: "home" | "away";
        winner?: boolean;
        record: string | null;
        logo?: string;
        leaders?: CompetitorTeam["leaders"];
    };
    otherTeam: {
        id: string;
        score: string | number | undefined;
        shortDisplayName: string;
        name: string;
        abbreviation: string;
        logo?: string;
        winner?: boolean;
    };
}

// Game status

export interface GameStatus {
    state: "pre" | "in" | "post";
    shortDetail?: string;
    altDetail?: string;
}

// Game object

export interface GameData {
    id?: string;
    date?: string; // ISO string
    teams?: CompetitorTeam[];
    status?: GameStatus;
    week: {
        number: number;
        text?: string;
    };
    season?: number;
    seasonType?: {
        id: string;
        type: string;
        name: string;
        abbreviation: string;
    };
    network?: string;
    spread?: string;
    overUnder?: string;
    leaders?: GameLeader[];
    possession?: string;
    state?: "pre" | "in" | "post";
    statusText?: string;
    downDistance?: string; 
}

// Grouping and final schedule 

export interface GameGroup {
    tableHeadings: string[];
    games: GameData[];
}

export interface FormattedSchedule {
    requestedSeason: string;
    allGames: GameGroup[];
    byeWeek: number | false;
}
