import Link from 'next/link';

export default function Leader({ stat, isLeagueLeader }) {
    // if a player is no longer on a team, their jersey number disappears
    // this function accounts for the possibility of a missing number
    const isJerseyNumPresent = (num) => {
        if (num) return (
           <span>#{ num }</span>  
        )
    }

    return (
        <div className={ isLeagueLeader ? "w-auto indicator" : undefined }>
            { isLeagueLeader && <img className="w-12 h-auto indicator-item" src={ stat.playerTeamLogo } alt={`${stat.playerTeamName} logo`} /> }
            <div className="w-full bg-sectionColor grid justify-center justify-items-center text-center pt-3 px-3 pb-0 rounded-md">
                <p className="mb-2 uppercase">{ stat.statName }</p>
                <p className="mb-2 font-semibold text-lg">{ stat.statValue }</p>
                <p className="mb-1">{ stat.playerName }</p>
                <p className="mb-2 flex gap-1 text-sm text-lighterSecondaryGrey">
                    <span>
                        { isLeagueLeader && 
                            <>
                                <Link href={ `/teams/${stat.playerTeamID}` } className="hover:text-cyan-400 hover:underline mr-1" title={ stat.playerTeamName }>
                                    { stat.playerTeamAbbreviation }
                                </Link>
                                <span>&#183;</span>
                            </>
                        } { stat.playerPosition }
                    </span> 
                    <span className="flex gap-1">{ isJerseyNumPresent(stat.playerJersey) }</span>
                </p>
                <div className="w-32 md:w-40 rounded-sm shrink-0">
                    <img src={ stat.playerHeadshot } alt={ stat.playerName } />
                </div>
            </div>
        </div>
    )
}