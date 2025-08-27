import H3 from "@/app/components/H3";
import { getPlayerRankColor } from "@/app/helpers/getRankColor";
import { PlayerOverview } from "@/app/types/player";

export default async function StatsSummary({ summary }: {summary: PlayerOverview["statsSummary"]}) {
    return (
        <div className="mb-9 md:mb-12">
            <H3>
                <span className="capitalize">{ summary?.heading }</span>
            </H3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                { summary?.stats.map(stat => (
                    <div 
                        key={ stat.label } 
                        className="w-full bg-section border border-gray-300 dark:bg-section-dark dark:border-none text-center p-3 rounded-md"
                    >
                        <p className="mb-2">
                            <span className="uppercase">{ stat.label }</span>
                        </p>
                        <p className={`font-semibold text-lg ${ 
                            stat.giveValueColor && getPlayerRankColor(Number(stat.value))
                        }`}>
                            { stat.value }
                        </p>
                        { stat.rank &&
                            <p className={`mt-2 ${ typeof stat.rank == "number" 
                                ? getPlayerRankColor(stat.rank) 
                                : undefined 
                            }`}>
                                { stat.rankDisplay }
                            </p>
                        }
                    </div>
                ))}
            </div>
        </div> 
    )
}