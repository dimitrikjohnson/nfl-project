import getRankColor from '@/app/helpers/getRankColor';
import getCurrentSeason from '@/app/helpers/getCurrentSeason';
import formatOverviewRankings from '@/app/formatAPIcalls/formatOverviewRankings';

export default async function TeamRankings({ teamID }) {
    const currentSeason = await getCurrentSeason();
    let displayedSeason = null;

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
    
    const displayTeamRankings = (sideOfBall) => { 
        return (
            <>
                { Object.keys(sideOfBall).map(category =>
                    <div key={ sideOfBall[category].longName } className="grid grid-rows-2 gap-2 content-between">
                        <p>{ sideOfBall[category].shortName }</p>
                        <p className={ getRankColor(sideOfBall[category].rank, false) }>{ sideOfBall[category].rankDisplayValue }</p>
                    </div> 
                )}
            </>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            { Object.keys(rankings).map(sideOfBall =>
                <div key={ sideOfBall }>
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-3">
                    <span>{ sideOfBall } Rankings</span>
                    { displayedSeason != null && 
                        <span className="ml-1.5">{ displayedSeason }</span> 
                    }
                    </h3>
                    <div className="font-rubik grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-2 bg-sectionColor p-3 rounded-md">
                        { displayTeamRankings(rankings[sideOfBall]) }
                    </div>
                </div>
            )}
        </div>
    )
}