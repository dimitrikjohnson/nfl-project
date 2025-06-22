import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";

// id → current team name (e.g. 28 → "commanders")
// only made for when a team's old name appears on the schedule from a previous year
export const idToName: Record<string, string> = Object.fromEntries(
    Object.entries(teamColors as AllTeamsColors).map(([name, num]) => [
        num.id,   
        name      
    ])
);