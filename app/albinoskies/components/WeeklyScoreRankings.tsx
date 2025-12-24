import getColorShades from "@/app/helpers/getColorShades";
import WeeklyTable from "./WeeklyTable/WeeklyTable";
import { tableMargins } from "@/app/helpers/albinoskiesStyling";

export default function WeeklyScoreRankings({ sortMode, recordMode, leagueID }: { sortMode: string, recordMode: string, leagueID: string }) {
    return (
        <>
            <WeeklyTable 
                sortMode={ sortMode }
                recordMode={ recordMode }
                leagueID={ leagueID }
                displayWeeks="completed"
                extraHeaders={
                    <>
                        <th className="py-2.5 px-2 md:px-3 text-center border-l border-secondaryGrey">
                            <abbr className="no-underline" title="Average">AVG</abbr>
                        </th>
                        <th className="py-2.5 px-2 md:px-3 text-center">
                            <abbr className="no-underline" title="Games over median">GoM</abbr>
                        </th>
                    </>
                }
                renderCells={(user, weeks) => {
                    // compute the total and average number of games the user would have won in each week
                    // round the average to one decimal place
                    const total = Object.values(user.weeklyRankings).reduce((a, b) => a + b, 0);
                    const average = Math.round((total / Object.keys(weeks).length) * 10) / 10;
                    
                    const min = 0, max = 11; // max is the number of league members - 1
        
                    return (
                        <>
                            { weeks.map(week => (
                                <td key={week} className={`text-center py-2.5 px-2 md:py-2 md:px-3 ${getColorShades(user.weeklyRankings[week], min, max)}`}>
                                    { user.weeklyRankings[week] }
                                </td>
                            ))}
                    
                            <td className="text-center py-2.5 px-2 md:py-2 md:px-3 border-l border-secondaryGrey">
                                { average }
                            </td>
                            <td className="text-center py-2.5 px-2 md:py-2 md:px-3">
                                { user.gamesOverMedian }
                            </td>
                        </>
                    )
                }}
            />
            <p className={`text-xs text-gray-600 dark:text-lighterSecondaryGrey mt-3 mx-4 ${tableMargins}`}>
                * Top weekly scorer earns an 11. Bottom scorer is a 0. See this as, &quot;How many match-ups would I win if I faced everyone each week?&quot;
            </p>
        </>
    )
}