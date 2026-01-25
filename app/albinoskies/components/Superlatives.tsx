"use client";
import { useState, useEffect } from "react";
import { margins } from "@/app/helpers/albinoskiesStyling";
import realNamesJSON from "@/app/data/albinoSkiesUserNames.json";
import Link from "next/link";

export default function Superlatives({ season }: { season: number }) {
    const [superlatives, setSuperlatives] = useState<any[]>([]);

    const realNames = realNamesJSON as Record<string, string>;

    // Load superlatives for season on mount
    useEffect(() => {
        async function loadSuperlatives() {
            const res = await fetch(`/api/fantasy-user-awards/${season}`);
            const data = await res.json();
    
            setSuperlatives(data);
        }
    
        loadSuperlatives();
    }, [season]);

    if (superlatives.length === 0) {
        return null;
    }

    // list of Youtube video IDs for each season
    const videoIDs: Record<number, string> = {
        2025: "uSsdbaStHVI"
    }
  
    return (
        <section className={`mb-8 ${margins}`}>
            <div className={`flex justify-between mb-3`}>
                <h3 className="font-protest text-2xl lg:text-3xl">Superlative Awards</h3>
            </div>
            <div className="w-full rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4 bg-section border border-gray-300 dark:bg-section-dark dark:border-none mb-8">
                <div>
                    <iframe
                        className="w-full aspect-video"
                        src={`https://www.youtube.com/embed/${videoIDs[season]}?si=8aIQoNBXufdsMJ2B`}
                        title="YouTube video player"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>

                <div className="flex flex-col justify-center px-3 pb-3 md:pl-0 md:pb-0 md:pr-2">
                    <span className="text-xs md:text-sm uppercase tracking-wide text-gray-500 dark:text-lighterSecondaryGrey mb-1">
                        Video Recap
                    </span>

                    <h4 className="text-xl lg:text-2xl font-bold mb-3">
                        {season} Albino Skies Superlatives
                    </h4>

                    <p className="text-sm md:text-base text-gray-500 dark:text-lighterSecondaryGrey mb-4">
                        Watch the full recap of the {season} award winners — the moments, jokes,
                        and trophies that defined the year.
                    </p>

                    <p className="text-xs md:text-sm text-gray-500 dark:text-lighterSecondaryGrey">
                        Edited by 
                        <Link 
                            href="https://www.dimitrik.dev/" 
                            className="font-medium text-blue-800 dark:text-cyan-400 hover:underline ml-1"
                        >
                            Dimitrik Johnson
                        </Link>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                { superlatives.map((superlative) => (
                    <div key={superlative.id} className="w-full bg-section border border-gray-300 dark:bg-section-dark dark:border-none grid justify-center justify-items-center text-center p-2 rounded-md">
                        <img 
                            src={`/award-icons/${superlative.award_icon}`} 
                            alt={`${superlative.award_name} icon`} 
                            className="mb-2.5 w-16 md:w-20" 
                        />
                        <div className="mb-2.5">
                            <p className="text-sm font-semibold">{superlative.award_name}</p>
                            { superlative.description &&
                                <p className="text-xs text-gray-500 dark:text-lighterSecondaryGrey mt-1">{superlative.description}</p>
                            }    
                        </div>
                        
                        <p className="md:text-lg">{realNames[superlative.user_id]}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}