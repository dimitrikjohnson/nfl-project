export interface StandingsData {
    team: { $ref: string };
    records: any[];
}

export type TeamInStandings = {
    id: string;
    name: string;
    shortDisplayName: string;
    abbreviation: string;
    logo: string;
    record: string;
    seed: number;
    stats: { heading: string; description: string; value: string }[];
    clinch?: any;
};