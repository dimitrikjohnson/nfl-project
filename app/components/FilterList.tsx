'use client';
import { useSearchParams } from 'next/navigation';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import Link from 'next/link';

export default function FilterList(
    { tags, teamName, isMobile, showTeamColors, query }: 
    { tags: string[], teamName: string, isMobile: boolean | string, showTeamColors: boolean, query: string }
){
    // gets the query from the URL
    const searchParams = useSearchParams();
    const queryValue = searchParams.has(query) && searchParams.get(query);

    const allTeamsColors = teamColors as AllTeamsColors;

    return (
        <div className={ isMobile == true
            ? "flex w-full overflow-x-auto mb-4 md:hidden" 
            : isMobile == "override" 
                ? "flex w-full overflow-x-auto mb-4" 
                : "hidden md:flex"
        }>
            { tags.map((tag: string) =>
                <Link 
                    key={ tag } 
                    href={ `?${query}=${slugify(tag)}` }
                    className="btn h-10 min-h-10 mr-2.5 capitalize border text-center text-nowrap \
                        hover:bg-secondaryGrey/[0.25] py-2 md:py-0 px-3.5 rounded-md last-of-type:m-0 \
                        bg-alt-table-row text-primary border-gray-300 dark:border-none dark:bg-alt-table-row-dark dark:text-primary-dark"
                    style={ showTeamColors && ((slugify(tag) == queryValue) || (!queryValue && tag == tags[0])) 
                            ? { 
                                backgroundColor: allTeamsColors[teamName].bgColor, 
                                color: allTeamsColors[teamName].textColor, 
                                border: `1px solid ${allTeamsColors[teamName].textColor}`
                            } 
                            : undefined 
                    }
                    replace
                >
                    { tag }
                </Link>
            )}
        </div>
    )
}

// make tag URL friendly by replacing spaces with dashes
const slugify = (str: string) => {
    const urlFriendlyStr = str.toLowerCase().trim().replace(/[\s_-]+/g, '-'); 
    return urlFriendlyStr;
}