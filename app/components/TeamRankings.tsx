import getRankColor from '@/app/helpers/getRankColor';
//import getCurrentSeason from '@/app/helpers/getCurrentSeason';
//import formatOverviewRankings from '@/app/formatAPIcalls/formatOverviewRankings';
import getOverviewRankings from '@/app/apiCalls/getOverviewRankings';

export default async function TeamRankings({ teamID }) {
    //const currentSeason = await getCurrentSeason();
    //let displayedSeason = null;

    const tablePadding = "py-2.5 px-2 md:py-2 md:px-3";
    /*
    // if there's an error, decrease the current season number by 1
    // the only time there should be an error is during a small window in the offseason when the season number changes in the API response
    let res;
    try {
        res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/types/2/teams/${teamID}/statistics`, { 
            method: "get" 
        });
        if (!res.ok) throw new Error("Something went wrong");
    }
    catch (error) {
        res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason-1}/types/2/teams/${teamID}/statistics`, { 
            method: "get" 
        });
        displayedSeason = currentSeason-1;
    }

    const data = await res.json();

    const rankings = formatOverviewRankings(data);
    */
   const rankings = await getOverviewRankings(teamID);

    const displayTeamRankings = (sideOfBall) => { 
        return (
            <>
                { Object.keys(sideOfBall).map(category =>
                    <tr key={ sideOfBall[category].longName } className="odd:bg-altTableRow">
                        <td className={ `text-start ${tablePadding}` }>{ sideOfBall[category].shortName }</td>
                        <td className={ `text-start ${tablePadding}` }>{ sideOfBall[category].value }</td>
                        <td className={ `text-start ${tablePadding} ${getRankColor(sideOfBall[category].rank, false)}` }>{ sideOfBall[category].rankDisplayValue }</td>
                    </tr> 
                )}
            </>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            { Object.keys(rankings["sides"]).map(sideOfBall =>
                <div key={ sideOfBall }>
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-3">
                        { rankings["season"].type == 4 && 
                            <span className="mr-1.5">{ rankings["season"].year }</span> 
                        }
                        <span>{ sideOfBall } Rankings</span>
                    </h3>
                    <div className="font-rubik overflow-x-auto">
                        <table className="table-auto w-full text-nowrap font-rubik bg-sectionColor rounded-md overflow-hidden">
                            <thead className="border-b border-secondaryGrey">
                                <tr>
                                    <th className="py-2.5 px-2 md:px-3 text-start">Statastic</th>
                                    <th className="py-2.5 px-2 md:px-3 text-start">Value</th>
                                    <th className="py-2.5 px-2 md:px-3 text-start">Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                { displayTeamRankings(rankings["sides"][sideOfBall]) }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}