export interface Team {
    id: string;
    location: string;
    name: string;
    displayName: string;
    shortDisplayName: string;
    logo: string;
    abbreviation: string;
    alternateColor: string;
    record: string;
    standingSummary: string;
    conference: string;
}

export interface Teams {
    [team: string]: Team;
}