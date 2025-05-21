export default function Leader({ stat }) {
    // if a player is no longer on a team, their jersey number disappears
    // this function accounts for the possibility of a missing number
    const isJerseyNumPresent = (num) => {
        if (num) return `#${ num }` 
    }

    return (
        <div className="w-full bg-sectionColor grid justify-center justify-items-center text-center pt-3 px-3 pb-0 rounded-md">
            <p className="mb-2 uppercase">{ stat.statName }</p>
            <p className="mb-2 font-semibold text-lg">{ stat.statValue }</p>
            <p className="mb-1">{ stat.playerName }</p>
            <p className="mb-2 flex gap-1 text-sm text-lighterSecondaryGrey">
                <span>{ stat.playerPosition }</span> 
                <span>{ isJerseyNumPresent(stat.playerJersey) }</span>
            </p>
            <div className="w-32 md:w-40 rounded-sm shrink-0">
                <img src={ stat.playerHeadshot } alt={ stat.playerName } />
            </div>
        </div>
    )
}