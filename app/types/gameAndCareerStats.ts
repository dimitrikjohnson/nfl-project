export type Rows = {
    id: string;
    week: string; 
    atVs: string;
    score: string;
    result: string;
    opp: {
        link: string;
        name: string,
        abbreviation: string;
        logo: string;
    },
    stats: string[]
}

export type SeasonType = {
    name: string;
    headings: Headings[];
    stats: Rows[];
    totals: string[];
    includesFantasyData: boolean;
}

export type Headings = {
    category: string;
    columns: {
        abbreviation: string,
        title: string
        apiName?: string;
    }[];
}

export type Career = {
    includesFantasyData: boolean;
    headings: Headings[];
    seasons: {
        season: string;
        statsOnTeam: StatsOnTeam;
        totalStats: {
            gamesPlayed: string;
            stats: string[]
        }
    }[]
}

export type StatsOnTeam = {
    abbreviation: string;
    displayName: string;
    link: string;
    logo: string;
    gamesPlayed: string;
    stats: string[];
}[]