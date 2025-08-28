import H3 from "@/app/components/H3";
import { PlayerOverview } from "@/app/types/player";
import getPlayerHistory from "@/app/apiCalls/getPlayerHistory";
import Link from "next/link";

function displayBioData(value: string | number | undefined, label: string, careerStatus?: string) {
    if (value) {
        return (
            <dl className="flex gap-1.5 mb-3 last:m-0"> 
                <dt className="xl:w-[100px] text-gray-500 dark:text-lighterSecondaryGrey uppercase">{ label }:</dt>
                <dd>
                    { careerStatus == "inactive" 
                        ? normalizeSeasonString(value.toString()) 
                        : value 
                    }
                </dd>
            </dl>    
        )
    }
}

// if the player is retired, change the "experience" output
function normalizeSeasonString(str: string) {
    const match = str.match(/^(\d+)(st|nd|rd|th)\s+Season$/);
    if (match) {
        return shouldBePlural(match[1]);  // determine if the output should be plural (match[1] is the number)
    }
    return str; // leave unchanged if no match
}


// add an 's' to season if the player was there for more than 1
function shouldBePlural(num: string) {
    let output = `${num} season`;
    
    if (num != "1") {
        output = `${output}s`;    
    }

    return output;
}

async function displayPlayerHistory(playerID: string) {
    const history = await getPlayerHistory(playerID);

    if (!history.length) { return undefined } // the array will be empty for newly drafted rookies

    return (
        history.map((team, index) => (
            <div key={index} className="group mb-4 last-of-type:m-0">
                <Link className="flex gap-3" href={`/teams/${team.currentName}`}>
                    <img className="w-10" src={ team.logo } alt={ team.logoAlt } />
                    <div>
                        <p className="text-blue-800 dark:text-cyan-400 group-hover:underline">{ team.name }</p>
                        <p className="text-gray-500 dark:text-lighterSecondaryGrey">
                            { team.seasons } ({ shouldBePlural(team.seasonCount) })
                        </p>    
                    </div>   
                </Link>    
            </div>         
        ))
    )
}

export default async function Bio({ player }: { player: PlayerOverview }) {
    return (
        <section>
            <H3>Bio</H3>
            <div className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none text-sm p-3 rounded-md">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:block mb-6 last-of-type:mb-0">
                    <div className="lg:hidden">
                        { displayBioData(player.position.abbreviation, "Position") }    
                    </div>
                    <div className="hidden lg:block lg:mb-3">
                        { displayBioData(player.position.name, "Position") }    
                    </div>     

                    { displayBioData(`${player.age} years old`, "Age") }
                    { displayBioData(player.height, "Height") }
                    { displayBioData(player.weight, "Weight") }
                    { displayBioData(player.college, "College") }

                    <div className="order-2 col-span-2 xl:mb-3 xl:order-1">
                        { displayBioData(player.draft, "Draft") }
                    </div>
                    <div className="order-1 xl:order-2">
                        { displayBioData(player.experience, "Experience", player.status.type) }
                    </div>          
                </div>
                { await displayPlayerHistory(player.id) &&
                    <div>
                        <h4 className="font-bold border-b border-primary dark:border-primary-dark pb-2 mb-3">Career History</h4>
                        <div className="sm:grid grid-cols-2 md:block">
                            { displayPlayerHistory(player.id) }    
                        </div>    
                    </div>
                }
            </div>
        </section>
    )
}