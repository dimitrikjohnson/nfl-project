import realNamesJSON from "@/app/data/albinoSkiesUserNames.json";
import { margins } from "@/app/helpers/albinoskiesStyling";
import { useEffect, useState } from "react";

type SeasonFinishes = {
    champion_user_id: string;
    champion_name: string;
    champion_avatar: string;

    runner_up_user_id: string;
    runner_up_name: string;
    runner_up_avatar: string;

    third_place_user_id: string;
    third_place_name: string;
    third_place_avatar: string;
}

export default function Podium({ season }: { season: number }) {
    const [finishes, setFinishes] = useState<SeasonFinishes | null>(null);
    
    const realNames = realNamesJSON as Record<string, string>;

    const loadFinishes = async (season: number) => {
        try {
            const res = await fetch(`/api/fantasy-playoff-matchups/${season}?query=top3`).then(res => res.json());

            setFinishes(res);
        } 
        catch (err) {
            console.error("Error loading standings", err);
        } 
    };

    useEffect(() => {
        loadFinishes(season);
    }, [season]);

    if (!finishes || Object.keys(finishes).length === 0)
        return <div className={`skeleton rounded-md h-32 mb-8 ${margins}`}></div>;

    return (
        <div 
            aria-label={`Podium finishes for ${season}`} 
            className={`flex items-end text-center mb-8 md:mb-10 gap-2 md:gap-3 ${margins}`}
        >
            <PodiumColumn
                name={realNames[finishes.runner_up_user_id]} 
                teamName={finishes.runner_up_name}
                avatar={finishes.runner_up_avatar}
                borderColor="border-gray-500"
                bgColor="bg-gray-400/30"
                width="w-16 md:w-28"
                rank="2"
                rankBGcolor="bg-gray-500"
                paddingBottom="pb-16"
                spaceFromTop="top-[52px] md:top-24"
            />
            <PodiumColumn
                name={realNames[finishes.champion_user_id]} 
                teamName={finishes.champion_name}
                avatar={finishes.champion_avatar}
                borderColor="border-yellow-400"
                bgColor="bg-yellow-400/40"
                width="w-20 md:w-40"
                rank="Champion"
                rankBGcolor="bg-yellow-400"
                paddingBottom="pb-20"
                spaceFromTop="top-[70px] md:top-36"
            />
            <PodiumColumn
                name={realNames[finishes.third_place_user_id]} 
                teamName={finishes.third_place_name}
                avatar={finishes.third_place_avatar}
                borderColor="border-amber-700"
                bgColor="bg-amber-700/40"
                width="w-14 md:w-24"
                rank="3"
                rankBGcolor="bg-amber-700"
                paddingBottom="pb-6"
                spaceFromTop="top-11 md:top-20"
            />
        </div>
    )
}

function PodiumColumn (
    { name, teamName, avatar, borderColor, bgColor, width, rank, rankBGcolor, paddingBottom, spaceFromTop }: 
    { name: string; teamName: string; avatar: string; borderColor: string; bgColor: string; width: string, rank: string, rankBGcolor: string, paddingBottom: string, spaceFromTop: string }
) {
    return (
        <div 
            key={`${name}-${rank}`} 
            className={`flex flex-col items-center w-full ${bgColor} ${paddingBottom} border ${borderColor} pt-4 rounded-md opacity-0 animate-fadeIn`}
        >
            { rank == "Champion" && 
                <span className="text-3xl md:text-5xl">👑</span>
            }
            <div className={`relative ${rank == "Champion" ? "mb-5" : "mb-3"} md:mb-6`}>
                <img 
                    className={`${width} border-4 ${borderColor} rounded-full`}
                    src={avatar} 
                    alt={`${name}'s avatar`} 
                />
                <div className={`absolute ${spaceFromTop} left-1/2 -translate-x-1/2 text-sm md:text-lg rounded-lg px-2 font-bold ${rankBGcolor} ${rank == "Champion" && "text-primary"}`}>
                    { rank }
                </div> 
            </div>
            
            <p className="font-bold text-lg md:text-2xl">{ name }</p>
            <p className="text-[10px] md:text-sm italic">{ teamName }</p>
        </div>
    )
}