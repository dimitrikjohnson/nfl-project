"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Dropdown from "@/app/components/Dropdown";
import { margins } from "@/app/helpers/albinoskiesStyling";
import realNamesJSON from "@/app/data/albinoSkiesUserNames.json";
import H2 from "@/app/components/H2";
import H3 from "@/app/components/H3";
import Link from "next/link";
import { Draft, DraftOrder, DraftPick } from "@/app/types/albinoskies";
import { buildDraftBoard, cardColor, getPickArrowDirection, getRoundPickNumber, pictureOrTrade } from "./helpers";

const realNames = realNamesJSON as Record<string, string>;

export default function DraftsClient() {
    const [seasons, setSeasons] = useState<number[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [drafts, setDrafts] = useState<any>(null);

    const headingMargins = "mx-4 md:mx-6 lg:mx-14 xl:mx-auto max-w-screen-2xl";
    
    // Load seasons on mount
    useEffect(() => {
        async function loadSeasons() {
            const res = await fetch("/api/fantasy-drafts");
            const data = await res.json();

            setSeasons(data.seasons);
            setSelectedSeason(data.latestSeason);
        }

        loadSeasons();
    }, []);

    // Load drafts when season changes
    useEffect(() => {
        if (!selectedSeason) return;

        async function loadDrafts() {
            // 1. Load drafts for season
            const drafts = await fetch(`/api/fantasy-drafts/${selectedSeason}`).then(res => res.json());

            const draftList: Draft[] = Object.values(drafts);
            if (draftList.length === 0) {
                setDrafts(drafts);
                return;
            }

            // 2. Extract league ID once
            const leagueID = draftList[0].leagueID;

            // 3. Fetch users ONCE
            const users = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/users`).then(res => res.json());

            // 4. Normalize users by roster_id
            const usersByID: Record<number, any> = {};

            for (const user of users) {
                usersByID[user.user_id] = {
                    userID: user.user_id,
                    displayName: user.display_name,
                    realName: realNames[user.user_id],
                    avatar: user.metadata.avatar ?? null,
                };
            }

            // 5. Attach users AND draft_order to every draft
            for (const draftID in drafts) {
                const draft = drafts[draftID];

                // fetch draft metadata once per draft
                const draftData = await fetch(`https://api.sleeper.app/v1/draft/${draftID}`).then(res => res.json());

                // normalize draft_order into ordered array of userIDs
                const draftOrder: DraftOrder = Object.entries(draftData.draft_order as Record<string, number>)
                    .sort((a, b) => a[1] - b[1])
                    .map(([userID]) => userID);

                draft.users = Object.values(usersByID);
                draft.draftOrder = draftOrder;
            }

            setDrafts(drafts);
        }

        loadDrafts();
    }, [selectedSeason]);

    if (!drafts || Object.keys(drafts).length === 0)
        return <div className={`skeleton rounded-md h-32 mb-8 ${margins}`}></div>;


    return (
        <section>
            <div className={`flex justify-between pb-2 mb-6 md:mb-9 border-b-2 border-primary dark:border-primary-dark ${headingMargins}`}>
                <div className="flex items-end">
                    <H2>
                        <span>{selectedSeason}</span> 
                        <span> { Object.keys(drafts).length > 1 ? "Drafts" : "Draft"}</span>
                    </H2>    
                </div>
                <Dropdown
                    buttonLabel={ selectedSeason }
                    width="w-20"
                    items={
                        seasons.map((season) => ({
                            label: season,
                            onClick: () => setSelectedSeason(season)
                        }))
                    }
                />    
            </div>  

            {/* Draft boards */}
            { drafts &&
                Object.values(drafts).map((draft: any) => {
                    const board = buildDraftBoard(draft);
                    const numPicks = draft.picks.length;
                                    
                    return (
                        <div key={draft.draftID}>
                            { draft.playerPool &&
                                <div className={headingMargins}>
                                    <H3>'{draft.playerPool} Only' Draft</H3>    
                                </div>
                            }
                            
                            <div className="mb-12 overflow-x-auto md:overflow-x-visible xl:mx-auto max-w-screen-2xl opacity-0 animate-fadeIn">
                                <div className="relative min-w-min md:min-w-0">
                                    <div
                                        className="grid min-w-[95px] bg-gray-200 text-primary dark:bg-backdrop-dark dark:text-primary-dark py-1"
                                        style={{ 
                                            gridTemplateColumns: `repeat(${draft.draftOrder.length}, 1fr)`,
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 40
                                        }}
                                    >                                  
                                        { draft.draftOrder.map((userID: string) => {
                                            const user = draft.users.find((u: any) => u.userID === userID);
                                            return (
                                                <div key={userID} className="flex flex-col items-center">
                                                    <img className="w-8 md:w-10 rounded-full mb-2" src={user?.avatar} alt={`${user?.realName}'s avatar`} />
                                                    <p className="text-sm md:text-base text-center font-bold">{user?.realName}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div>
                                        { board.map((row: any[], roundIndex: number) => (
                                            <div
                                                key={roundIndex}
                                                className="grid gap-1"
                                                style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
                                            >
                                                { row.map((pick, colIndex) => {
                                                    return (
                                                        <DraftCard 
                                                            key={colIndex}
                                                            draft={draft}
                                                            pick={pick}
                                                            numPicks={numPicks}
                                                            colIndex={colIndex}
                                                        />    
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>    
                            </div>     
                        </div>  
                    );
                })
            }
        </section>
    );
}

function DraftCard({ draft, pick, numPicks, colIndex }: { draft: Draft, pick: DraftPick, numPicks: number, colIndex: number }) {
    const arrowDirection = getPickArrowDirection({
        round: pick.round,
        colIndex,
        numTeams: draft.draftOrder.length,
        draftType: draft.draftType
    });
                                                
    // determine if the pick was aquired via trade
    const slotOwner = draft.draftOrder[colIndex];
    const pickOwner = pick.userID;

    const isTradedPick = slotOwner !== pickOwner;

    const href = pick.player?.link ?? pick.defense?.link;
    if (!href) return null;

    
    return (
        <Link 
            href={ href } 
            target="_blank"
            title="(opens in a new tab)" 
            className={`min-w-[95px] relative rounded-md px-1.5 pt-1.5 mb-1 text-primary overflow-hidden transition ease-in-out delay-25 md:hover:scale-105 duration-300
                ${cardColor(pick.player?.position)}
            `}
        >
            <div className="flex justify-between gap-1">          
                { pick?.player && (
                    <div className="overflow-hidden">
                        <p className="text-[10px] md:text-xs font-bold">{ pick.player.firstName }</p>
                        <p className="text-xs md:text-sm font-bold leading-none truncate">{ pick.player.lastName }</p> 
                        <p className="text-[10px] md:text-xs">
                            <span>{ pick.player.position }</span>
                            { pick.player.team &&
                                <span> - { pick.player.team }</span>
                            }
                        </p>
                    </div>
                )}
                { pick?.defense && (
                    <div>
                        <p className="text-[10px] md:text-xs">{pick.defense.name}</p>
                        <p className="text-[10px] md:text-sm font-bold">DEF - {pick.defense.team}</p>
                    </div>
                )}
                <p className="text-[10px] md:text-xs">
                    { pick.round }.
                    { getRoundPickNumber({
                        round: pick.round,
                        colIndex,
                        numTeams: draft.draftOrder.length,
                        draftType: draft.draftType
                    })}
                </p>
            </div> 
            { pick.pickNumber != numPicks &&  // don't display an arrow for the last pick
                <FontAwesomeIcon
                    icon={ arrowDirection == "left"
                        ? faArrowLeft
                        : arrowDirection == "right"
                            ? faArrowRight
                            : faArrowDown
                    }
                    className="text-[10px] md:text-xs opacity-80"
                />
            }
            { pictureOrTrade(pick, isTradedPick) }
        </Link>
    )
}