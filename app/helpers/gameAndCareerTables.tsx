// helper functions that display parts of tables on player gamelog and career stat pages

import type { Headings } from '@/app/types/gameAndCareerStats';
import { displayGamelogWeek } from "@/app/helpers/displayWeekInfo";
import Link from "next/link";
import { Fragment } from "react";
import DefaultLogo from '@/app/images/default_logo.png';
import Image from "next/image";

const headerFooterPadding = "py-2.5 px-2 md:px-2.5";

export function displayTableHead(headings: Headings[], fantasyType: 'half-ppr' | 'ppr') {
    return (
        <thead className="border-b border-secondaryGrey">
            <tr>
                { headings.map((heading, headingSection) =>
                    <th 
                        key={ headingSection } 
                        colSpan={ heading.category == "Fantasy" ? 1 : heading.columns.length } 
                        className={`border-x border-b border-secondaryGrey first:border-x-0 last:border-r-0 ${headerFooterPadding} 
                            ${headingSection == 0 ? "text-start": "text-center"}
                        `}
                    >
                        { heading.category }
                    </th>
                )}
            </tr>
            <tr>
                { headings?.map((heading, headingSection) =>
                    heading.columns.map((column, index) => {
                        if (heading.category === "Fantasy" && column.abbreviation.toLowerCase() !== fantasyType.toLowerCase()) {
                            return null  
                        }

                        return (
                            <th key={ column.title } className={`
                                ${(index == 0 || heading.category === "Fantasy")  && "border-l border-secondaryGrey first:border-none"} 
                                ${headingSection == 0 ? "text-start" : "text-center"} 
                                ${headerFooterPadding} text-sm uppercase
                            `}>
                                <abbr title={ column.title } className="no-underline">
                                    { column.abbreviation }
                                </abbr>
                            </th>
                        );
                    })
                )}
            </tr>
        </thead>
    )
}

export function displayTableBody(headings: Headings[], games: any, fantasyType: 'half-ppr' | 'ppr') {
    const containerClasses = "flex gap-x-1.5 items-center";
    const tablePadding = "py-2.5 px-2 md:py-1.5 md:px-2.5";

    return (
        <tbody className="text-sm">
            { games.map((game: any) => 
                <Fragment key={ game.id }>
                    <tr className="border-b border-gray-900/20 last-of-type:border-none odd:bg-alt-table-row dark:odd:bg-alt-table-row-dark dark:border-none">
                        <td className={`text-start ${tablePadding}`}>   
                            { displayGamelogWeek(game.week?.toString()) }
                        </td>
                        <td className={`text-start ${containerClasses} ${tablePadding}`}>
                            <span>{ game.atVs }</span>
                            <Link href={ game.opp.link } className={`group ${containerClasses}`}>
                                { game.opp.logo
                                    ? <img className="w-5 md:w-7" src={ game.opp.logo } alt={`${game.opp.name} logo`} />
                                    : <Image className="w-4 md:w-6" src={ DefaultLogo }  alt="Default logo" priority />
                                }
                                <span className="text-blue-800 dark:text-cyan-400 group-hover:underline">
                                    <abbr title={ game.opp.name } className="no-underline">{ game.opp.abbreviation }</abbr>    
                                </span> 
                            </Link>
                        </td>
                        <td className={`text-start ${tablePadding}`}>
                            <span className={`
                                ${game.result == "W" ? "bg-green-500/[0.7]" : "bg-red-500/[0.7]"} 
                                px-1.5 mr-2
                            `}>
                                { game.result }
                            </span>
                            <span>{ game.score}</span>
                        </td>
                        { showStats(headings, game.stats, tablePadding, fantasyType) }
                    </tr>       
                </Fragment>
            )}    
        </tbody>  
    )
}

export function displayTableFoot(
    statArrs: { totals: string[], averages: string[] }, 
    headings: Headings[], fantasyType: 'half-ppr' | 'ppr'
) {
    const { totals, averages } = statArrs;

    return (
        <tfoot className="font-bold text-sm border-t border-secondaryGrey">
            <tr className="border-t border-secondaryGrey">
                <td colSpan={ headings[0].columns.length } className={ headerFooterPadding }>AVERAGES</td>
                { showStats(headings, averages, headerFooterPadding, fantasyType) }
            </tr>
            <tr className="border-t border-secondaryGrey">
                <td colSpan={ headings[0].columns.length } className={ headerFooterPadding }>TOTALS</td>
                { showStats(headings, totals, headerFooterPadding, fantasyType, true) }    
            </tr>
        </tfoot>
    )
}

export function convertToNumber(value: any) {
    const n = Number(String(value ?? '').replace(",", ''));
    return isNaN(n) ? 0 : n;
}

export function showStats(headings: Headings[], statArr: any[], padding: string, fantasyType: 'half-ppr' | 'ppr', isTotalsRow?: boolean) {
    // some columns should not have values in the "totals" row
    const columnsToExclude = ["LNG", "AVG"];
    
    if (statArr) return visibleColumns(headings, statArr, fantasyType).map(({ heading, column, value, isFirstInCategory }) => {

        return (
            <td
                key={`${heading.category}-${column.abbreviation}`}
                className={`
                    ${(isFirstInCategory || heading.category === 'Fantasy') ? 'border-l border-secondaryGrey' : ''}
                    text-center ${padding}
                `}
            >
                { (isTotalsRow && columnsToExclude.includes(column.abbreviation)) 
                    ? "-" 
                    : value 
                }
            </td>
        );
    });
}

// loop through all visible columns
export function visibleColumns(headings: Headings[], statArr: any[], fantasyType: 'half-ppr' | 'ppr') {
    const columns: {
        heading: Headings;
        column: any;
        value: any;
        columnIndex: number;
        isFirstInCategory: boolean;
    }[] = [];

    for (let headingIndex = 0; headingIndex < headings.length; headingIndex++) {
        const heading = headings[headingIndex];
        if (headingIndex === 0) continue; // skip first 3 columns

        const start = headings
            .slice(1, headingIndex)
            .reduce((sum, heading) => sum + heading.columns.length, 0);
        
        const end = start + heading.columns.length;
        const statSlice = statArr.slice(start, end);

        for (let columnIndex = 0; columnIndex < heading.columns.length; columnIndex += 1) {
            const column = heading.columns[columnIndex];

            if (heading.category === 'Fantasy' && column.abbreviation.toLowerCase() != fantasyType.toLowerCase()) {
                continue;
            }

            columns.push({
                heading,
                column,
                value: statSlice[columnIndex],
                columnIndex,
                isFirstInCategory: columnIndex == 0
            });
        }
    }

    return columns;
}