import Link from "next/link";
import { Team, Player } from "@/app/types/search";

type Props = {
    teams: Team[];
    players: Player[];
    query: string;
    loading: boolean;
    className?: string;
};

export function SearchResults({ teams, players, query, loading, className }: Props) {
    const resultsStyling = `mt-1 pb-1 z-10 ${className && className}`;
    const smallTextStyling = "px-2 py-1.5 text-xs";
    
    // display loading state before results
    if (loading) {
        return (
            <div className={`px-4 py-6 text-center text-sm text-gray-500 dark:text-lighterSecondaryGrey ${className}`}>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                <span>Searching...</span>
            </div>
        );
    }
    
    if (teams.length === 0 && players.length === 0) {
        // if no query, display nothing
        if (query == '') {
            return null;    
        }

        // if there's a typed query with no matches, display "0 results"
        return (
            <div className={ resultsStyling }>
                <p className={ smallTextStyling }>0 results for &apos;{query}&apos;</p>
            </div>  
        );
    }

    return (
        <div className={ resultsStyling }>
            <p className={ smallTextStyling }>
                <span>{ players.length + teams.length }</span> <span>result{`${players.length + teams.length == 1 ? "" : "s"}`} for &apos;{ query }&apos;</span>
            </p>
            { teams.length > 0 && (
                <div>
                    <div className={`${smallTextStyling} font-bold text-gray-500 dark:text-lighterSecondaryGrey uppercase`}>
                        Teams
                    </div>
                    <ul>
                        { teams.map((team) => (
                            <li key={ team.id }>
                                <Link
                                    href={ team.link }
                                    className="flex gap-2.5 items-center px-2 py-2 hover:bg-section dark:hover:bg-section-dark cursor-pointer"
                                >
                                    <img className="w-8" src={ team.logo_url } alt={`${team.name} logo`} />
                                    <div>
                                        <p>{ team.name }</p>
                                        <p className="text-xs text-gray-500 dark:text-lighterSecondaryGrey">{ team.abbreviation }</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            { players.length > 0 && (
                <div>
                    <div className={`${smallTextStyling} font-bold text-gray-500 dark:text-lighterSecondaryGrey uppercase`}>
                        Players
                    </div>
                    <ul>
                        { players.map((player) => (
                            <li key={ player.id }>
                                <Link
                                    href={ player.link }
                                    className="flex gap-2.5 items-center px-2 py-2 hover:bg-section dark:hover:bg-section-dark cursor-pointer"
                                >
                                    <div className="h-8 w-8 border border-gray-500 dark:border-lighterSecondaryGrey relative rounded-full overflow-hidden">
                                        <img
                                            className="absolute top-2 object-cover object-center scale-[1.8]"
                                            src={ player.headshot_url }
                                            alt={ player.name }
                                        />
                                    </div>
                                    <div>
                                        <p>{ player.name }</p>
                                        <p className="flex gap-1 text-xs text-gray-500 dark:text-lighterSecondaryGrey">
                                            <span>{ player.team_abbreviation }</span>
                                            <span aria-label="Separator">&#8226;</span>
                                            <span>{ player.position }</span>
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
