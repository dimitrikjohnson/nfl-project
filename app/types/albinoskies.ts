export type Medians = {
    [week: string] : number;
}

export type User = {
    name: string;
    gamesOverMedian: number;
    pointsFor: number;
    record: {
        wins: number;
        losses: number;
    };
    recordWithMedian: {
        wins: number;
        losses: number;
    };
    scores: {
        [week: string]: number
    };
    weeklyRankings: {
        [week: string]: number
    }
}

export type Users = {
    [userID: string]: User
}

// DRAFTS

export type Draft = {                  // single draft
    draftID: string;
    draftOrder: DraftOrder;
    draftType: "snake" | "linear";
    leagueID: string;
    season: string;
    users: DraftUser[];
    picks: DraftPick[];
    
}

type DraftMap = Record<string, Draft>;  // collection of drafts

type DraftUser = {
    userID: string;
    displayName: string;
    avatar: string;
    realName: string;
}

export type DraftPick = {
    pickNumber: number;
    round: number;
    userID: string;
    player: {
        firstName: string;
        headshot: string;
        id: string;
        lastName: string;
        link: string;
        position: string;
        team: string;
    } | null;
    defense: {
        link: string;
        logo: string;
        name: string;
        team: string;
    } | null;
}

export type DraftOrder = string[];