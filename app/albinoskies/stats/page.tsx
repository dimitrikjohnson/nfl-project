import LeagueStats from "../components/LeagueStats";
import H2 from "@/app/components/H2";

export default async function StatsHome() {
    const leagueID = process.env.ALBINOSKIES_ID!;

    const league = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`).then(res => res.json());
    
    return (
        <LeagueStats leagueID={ leagueID }>
            <H2>{ league.season } League Stats</H2>
        </LeagueStats>
    )
}
