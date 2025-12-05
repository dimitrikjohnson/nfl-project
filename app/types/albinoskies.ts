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