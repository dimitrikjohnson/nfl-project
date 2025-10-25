import getColorShades from "@/app/helpers/getColorShades";
import WeeklyTable from "./WeeklyTable/WeeklyTable";

export default function WeeklyScores({ recordMode, tableMargins }: { recordMode: string, tableMargins: string }) {  
    return (
        <WeeklyTable 
            recordMode={ recordMode }
            tableMargins={ tableMargins }  
            displayWeeks="all"
            calcMinMax={ (users) => {
                // calulate everyone's points for (this is collective; total, computed in "renderCells", is individual)
                const totals = Object.entries(users).map(([_, user]) =>
                    Object.values(user.scores).reduce((a, b) => a + b, 0)
                );

                return [Math.min(...totals), Math.max(...totals)];
            }}
            extraHeaders={
                <th className="py-2.5 px-2 md:px-3 text-center border-l border-secondaryGrey">
                    Total
                </th>
            }
            renderCells={ (user, weeks, minTotal, maxTotal) => {
                // compute the total points the user has scored this season ("points for")
                const total = Object.values(user.scores).reduce((a, b) => a + b, 0);

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