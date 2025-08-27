export interface BasePlayerInfo {
    id: string;
    name: string;
    headshot: string;
    jersey?: string | number;
    experience: string | number;
    college?: string;
    age: number;
    height: string;
    weight: string;
}

export interface PlayerOverview extends BasePlayerInfo {
    firstName: string;
    lastName: string;
    position: {
        name: string;
        abbreviation: string;
    };
    onATeam: boolean;
    team: {
        logo: string;
        longName?: string;
        shortName?: string;
        bgColor: string;
        textColor: string;
        altColor: string;
    };
    status: {
        name: string;
        type: string;
    };
    draft: string;
    debutYear: number;
    injury?: {
        status: string;
        abbreviation: string;
        updateDate: string;
        comment: string;
        type: string;
        detail: string;
        location: string | false;
        returnDate: string;
    }
    statsSummary?: {
        heading: string;
        stats: {
            label: string;
            value: string;
            giveValueColor?: boolean;
            rank?: number | boolean;
            rankDisplay?: string;
        }[]
    }
}