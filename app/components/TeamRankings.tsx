import getRankColor from '@/app/helpers/getRankColor';
import getOverviewRankings from '@/app/apiCalls/getOverviewRankings';
import { Stat, Side, Rankings } from '@/app/types/rankings';

export default async function TeamRankings({ teamID }: { teamID: string }) {
    const tablePadding = "py-2.5 px-2 md:py-2 md:px-3";

    const rankings: Rankings = await getOverviewRankings(teamID);

    const displayTeamRankings = (stats: Stat[]) => {
        return (
            <>
                { stats.map(stat =>
                    <tr key={stat.longName} className="odd:bg-altTableRow">
                        <td className={ `text-start ${tablePadding}` }>
                            { stat.shortName }
                        </td>
                        <td className={ `text-start ${tablePadding}` }>
                            { stat.value }
                        </td>
                        <td className={ `text-start ${tablePadding} ${getRankColor(stat.rank, false)}` }>
                            { stat.rankDisplayValue }
                        </td>
                    </tr>
                )}
            </>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 mb-12">
            { (Object.keys(rankings.sides) as Side[]).map(sideOfBall =>
                <div key={ sideOfBall }>
                    <h3 className="font-protest text-2xl 2xl:text-3xl pb-3">
                        { rankings.season.type === 4 &&
                            <span className="mr-1.5">{ rankings.season.year }</span>
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
                                { displayTeamRankings(rankings.sides[sideOfBall]) }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
