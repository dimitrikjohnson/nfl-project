"use client";
import realNamesJSON from "@/app/data/albinoSkiesUserNames.json";
import { margins } from "@/app/helpers/albinoskiesStyling";

type BannerUser = {
    teamName: string,
    name: string,
    avatar: string,
    record?: string,
    points?: string
}

export default function SeasonOutcomeBanner({ season, sidebar }: { season: any, sidebar?: boolean }) {
    const realNames = realNamesJSON as Record<string, string>;
   
    if (!season)
        return <div className={`skeleton w-full rounded-md h-32 mb-8`}></div>;

    const championColor = "from-yellow-400/40 to-yellow-600/20 border-yellow-600/40 \
                            dark:from-yellow-300/20 dark:to-yellow-500/10 dark:border-yellow-400/30";

    const toiletColor = "from-red-400/40 to-red-600/20 border-red-600/40 \
                        dark:from-red-300/20 dark:to-red-500/10 dark:border-red-400/30";

    const topScoreColor = "from-emerald-400/40 to-emerald-600/20 border-emerald-600/40 \
                        dark:from-emerald-300/20 dark:to-emerald-500/10 dark:border-emerald-400/30";

    const champion: BannerUser = {
        teamName: season.champion_team_name,
        record: season.champion_record,
        avatar: season.champion_avatar,
        name: realNames[season.champion_user_id]
    }

    const toiletBowlLoser: BannerUser = {
        teamName: season.loser_team_name,
        record: season.loser_record,
        avatar: season.loser_avatar,
        name: realNames[season.loser_user_id]
    }

    const topScorer: BannerUser = {
        teamName: season.top_scorer_team_name,
        points: Math.trunc(season.top_scorer_points).toLocaleString(),
        avatar: season.top_scorer_avatar,
        name: realNames[season.top_scorer_user_id]
    }

    const cards = [
        {
            label: "Most Points Scored",
            emoji: "💯",
            user: topScorer,
            color: topScoreColor
        },
        {
            label: "Toilet Bowl Loser",
            emoji: "💩",
            user: toiletBowlLoser,
            color: toiletColor
        }    
    ];

    if (sidebar) {
        cards.unshift({
            label: "League Champion",
            emoji: "🏆",
            user: champion,
            color: championColor 
        });
    }

    return (
        <div className={`grid ${sidebar ? "md:grid-cols-2 xl:block" : `lg:grid-cols-2 mb-10 ${margins}`} gap-x-6 gap-y-5`}>
            { cards.map(({ label, emoji, user, color }) => (
                <div 
                    key={`${label}-${user.name}-${season.season}`} 
                    aria-label={`${label} banner`}
                    className={`flex relative w-full items-center justify-between ${sidebar && "xl:mb-5"} p-2.5 md:px-3 rounded-md border bg-gradient-to-r ${color} shadow opacity-0 animate-fadeIn`}
                >
                    <div className={`flex items-center ${sidebar ? "gap-2.5" : "gap-3 md:gap-4"}`}>
                        <div className={sidebar ? "text-xl md:text-2xl" : "text-xl md:text-3xl"}>{ emoji }</div>
                        <img
                            src={ user.avatar }
                            alt={`${user.name}'s avatar`}
                            className={`size-14 ${sidebar ?? "md:size-20"} rounded-full border`}
                        />
                        <div>
                            <div className="text-xl md:text-2xl font-semibold">{ user.name }</div>
                            <div className="text-xs md:text-sm text-gray-600 dark:text-lighterSecondaryGrey">{ label }</div>
                        </div>    
                    </div>
                    <div className="text-right italic text-primary/60 dark:text-white/35">
                        <p className={`text-4xl ${sidebar ?? "md:text-7xl"} font-extrabold select-none`}>
                            { user.record ?? user.points }
                        </p>    
                        <p className="text-xs md:text-sm">
                            { user.teamName }
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
