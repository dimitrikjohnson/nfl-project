// helper functions for the draft board

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import realNamesJSON from "@/app/data/albinoSkiesUserNames.json";
import { DraftPick } from '@/app/types/albinoskies';

const realNames = realNamesJSON as Record<string, string>;

export function buildDraftBoard(draft: any) {
    const numTeams = draft.draftOrder.length;

    // derive rounds from data
    const totalRounds = Math.max(...draft.picks.map((p: any) => p.round));

    const board = Array.from(
        { length: totalRounds },
        () => Array(numTeams).fill(null)
    );

    for (const pick of draft.picks) {
        const row = pick.round - 1;

        const col = getColumnFromPickNumber({
            pickNumber: pick.pickNumber,
            draftType: draft.draftType,
            numTeams
        });

        if (board[row]) {
            board[row][col] = pick;
        }
    }

    return board;
}

export function getColumnFromPickNumber({ pickNumber, draftType, numTeams }: { pickNumber: number; draftType: "snake" | "linear"; numTeams: number; }) {
    const round = Math.floor((pickNumber - 1) / numTeams) + 1;
    const slot = (pickNumber - 1) % numTeams;

    if (draftType === "linear") {
        return slot;
    }

    // snake
    const isEvenRound = round % 2 === 0;
    return isEvenRound
        ? numTeams - 1 - slot
        : slot;
}

// determine arrow direction for demonstrating the flow of picks
export function getPickArrowDirection({ round, colIndex, numTeams, draftType }: { round: number; colIndex: number; numTeams: number; draftType: "snake" | "linear"; }) {
    if (draftType === "linear") {
        return "right";
    }

    const isEvenRound = round % 2 === 0;

    if (isEvenRound) {
        // right → left
        return colIndex === 0 ? null : "left";
    }

    // left → right
    return colIndex === numTeams - 1 ? null : "right";
}

// calcuate what pick a player is in a round
export function getRoundPickNumber({ round, colIndex, numTeams, draftType }: { round: number; colIndex: number; numTeams: number; draftType: "snake" | "linear"; }) {
    if (draftType === "linear") {
        return colIndex + 1;
    }

    const isEvenRound = round % 2 === 0;

    return isEvenRound
        ? numTeams - colIndex
        : colIndex + 1;
}

// each position has a different card color
export function cardColor(position: string | undefined) {
    if (position == "QB") return "bg-[#BF5E85]";            // pinkish-red
    else if (position == "RB") return "bg-[#72C3A6]";       // light green/seafoam
    else if (position == "WR") return "bg-[#45A2CA]";       // blue
    else if (position == "TE") return "bg-[#CB8C4A]";       // orange
    
    // D/ST
    return "bg-[#BD65FA]";       // purple
}

// display a picture on each card (unless it's a traded pick)
export function pictureOrTrade(pick: DraftPick, isTradedPick: boolean) {
    if (isTradedPick) {
        return (
            <p className="text-[10px] md:text-xs absolute bottom-0 right-0 p-0.5 md:px-2 bg-section-dark/60 text-primary-dark rounded-tl-md">
                <FontAwesomeIcon className="mr-1" icon={ faArrowRightArrowLeft } />
                <span>{realNames[pick.userID]}</span>
            </p>
        )
    }
    
    if (pick.player?.headshot) {
        return (
            <img 
                className="w-10 md:w-14 absolute bottom-0 right-0" 
                src={ pick.player.headshot } 
                alt={`${pick.player.firstName} ${pick.player.lastName}'s headshot`} 
            />
        )
    }

    if (pick.defense?.logo) {
        return (
            <img 
                className="w-6 md:w-10 absolute bottom-0 right-1" 
                src={ pick.defense.logo } 
                alt={`${pick.defense.name} logo`} 
            />    
        )
    }
}