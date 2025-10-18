export type Team = { 
    id: number; 
    name: string; 
    abbreviation: string; 
    logo_url: string; 
    link: string; 
};

export type Player = { 
    id: number; 
    name: string; 
    position: string; 
    headshot_url: string; 
    link: string; 
    team_abbreviation: string; 
};