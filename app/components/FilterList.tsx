import 'client-only';
import allTeamsColors from './data/allTeamsColors.json';

export default function FilterList({ tags, teamID, isMobile, showTeamColors, filter, childToParent }) {
    const handleFilterPick = (tag) => {
        childToParent(tag);
    }

    return (
        <div className={ isMobile == true
            ? "flex w-full overflow-x-auto mb-4 md:hidden" 
            : isMobile == "override" 
                ? "flex w-full overflow-x-auto mb-4" 
                : "hidden md:flex"
        }>
            { tags.map(tag =>
                <button key={ tag } 
                className="mr-2.5 capitalize border text-center text-nowrap border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] py-2 md:py-0 px-3.5 rounded-md last-of-type:m-0"
                style={ showTeamColors && (tag == filter) 
                        ? { 
                            backgroundColor: allTeamsColors[teamID].bgColor, 
                            color: allTeamsColors[teamID].textColor, 
                            border: `1px solid ${allTeamsColors[teamID].textColor}` 
                          } 
                        : null 
                }
                onClick={ () => handleFilterPick(tag) } 
                >
                    { tag }
                </button>
            )}
        </div>
    )
}