import { getTeamRankColor } from '@/app/helpers/getRankColor';
import getOverviewRankings from '@/app/apiCalls/getOverviewRankings';
import { Stat, Side, Rankings } from '@/app/types/rankings';
import H3 from '@/app/components/H3';

export default async function TeamRankings({ teamID }: { teamID: string }) {
    const tablePadding = "py-2.5 px-2 md:py-2 md:px-3";

    const rankings: Rankings = await getOverviewRankings(teamID);

    const displayTeamRankings = (stats: Stat[]) => {
        return (
            <>
                { stats.map(stat =>
                    <tr key={stat.longName} className="odd:bg-alt-table-row dark:odd:bg-alt-table-row-dark border-b border-gray-900/20 last-of-type:border-none dark:border-none">
                        <td className={`text-start ${tablePadding}`}>
                            { stat.shortName }
                        </td>
                        <td className={`text-start ${tablePadding}`}>
                            { stat.value }
                        </td>
                        <td className={`text-start ${tablePadding} ${getTeamRankColor(stat.rank, false)}`}>
                            { stat.rankDisplayValue }
                        </td>
                    </tr>
                )}
            </>
        );
    }

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 mb-12">
            { (Object.keys(rankings.sides) as Side[]).map(sideOfBall =>
                <div key={ sideOfBall }>
                    <H3>
                        { (rankings.season.type == 4 || rankings.season.type == 1) &&
                            <span className="mr-1.5">{ rankings.season.year }</span>
                        }
                        <span>{ sideOfBall } Rankings</span>
                    </H3>
                    <div className="rounded-md overflow-x-auto bg-section border border-gray-300 dark:bg-section-dark dark:border-none">
                        <table className="table-auto w-full text-nowrap">
                            <thead className="border-b border-secondaryGrey">
                                <tr>
                                    <th className="py-2.5 px-2 md:px-3 text-start">Statastic</th>
                                    <th className="py-2.5 px-2 md:px-3 text-start">Value</th>
                                    <th className="py-2.5 px-2 md:px-3 text-start">Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                { displayTeamRankings(rankings.sides[sideOfBall]) }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
