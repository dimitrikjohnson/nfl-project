import getStandings from "@/app/apiCalls/getStandings";
import getTeam from "@/app/apiCalls/getTeam";
import ClientStandings from "@/app/components/ClientStandings";

export default async function Standings({ teamID = "" }) {
    let groupNum = "8"; // get the AFC standings by default

    // get the team id for their division standings
    if (teamID != "") {
        const team = await getTeam({teamID});
        groupNum = team.division;
    }

    const res = await getStandings(groupNum);
    const [season, seasonType, data] = res;

    return (
        <ClientStandings
            season={ season }
            seasonType={ seasonType }
            originalData={ data }
            originalGroupNum={ groupNum }
            teamID={ teamID }
        />
    );
}