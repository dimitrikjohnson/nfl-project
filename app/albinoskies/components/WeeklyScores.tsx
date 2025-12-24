import getColorShades from "@/app/helpers/getColorShades";
import WeeklyTable from "./WeeklyTable/WeeklyTable";

export default function WeeklyScores({ sortMode, recordMode, leagueID }: { sortMode: string, recordMode: string, leagueID: string }) {  
    return (
        <WeeklyTable 
            sortMode={ sortMode }
            recordMode={ recordMode }
            leagueID={ leagueID }
            displayWeeks="all"
            calcMinMax={ (users) => {
                // calulate everyone's points for (this is collective; total, gathered in "renderCells", is individual)
                const totals = Object.entries(users).map(([_, user]) => user.pointsFor);

                return [Math.min(...totals), Math.max(...totals)];
            }}
            extraHeaders={
                <th className="py-2.5 px-2 md:px-3 text-center border-l border-secondaryGrey">
                    Total
                </th>
            }
            renderCells={ (user, weeks, minTotal, maxTotal) => {
                // get the total points the user has scored this season ("points for")
                const total = user.pointsFor; 

                return (
                    <>
                        { weeks.map(week => (
                            <td key={week} className="text-center py-2.5 px-2 md:py-2 md:px-3">
                                { user.scores[week] == 0 ? "-" : user.scores[week].toFixed(2) }
                            </td>
                        ))}
                        <td 
                            className={`text-center py-2.5 px-2 md:py-2 md:px-3 font-semibold border-l border-secondaryGrey ${getColorShades(
                                total, minTotal!, maxTotal!
                            )}`}
                        >
                            { total.toFixed(2) }
                        </td>
                    </>
                )
            }}
        />
    )   
}