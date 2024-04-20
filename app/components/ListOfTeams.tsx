import 'client-only';
import { useState, useEffect, memo } from 'react';
import getAllTeams from '../apiCalls/getAllTeams';
import getSuperBowlWinner from '../apiCalls/getSuperBowlWinner';
import teamDivisions from './data/teamDivisions.json';

function ListOfTeams({ childToParent }) {
    const [teams, setTeams] = useState([])
    const [sbWinner, setSBWinner] = useState({})
    
    const getTeams = () => getAllTeams().then(
        (res) => {
            //console.log(res)
            setTeams(res)
        } 
    )

    const getSBWinner = () => getSuperBowlWinner().then(
        (res) => {
            if (res) {
                setSBWinner({
                    headline: res.headline, 
                    winner: res.winnerID
                })
            }
        }
    )

    // run getTeams() when the page loads
    useEffect(() => {
        getTeams()
        getSBWinner()
        //console.log("og fire")
    }, [])

    return (
        <section className="mb-14 mx-4 md:mx-6 lg:mx-14 3xl:m-auto 3xl:max-w-[1700px]">
            <div className="flex mb-6">
                <h1 className="font-protest text-5xl uppercase">Teams</h1>
            </div>
            <div className="grid gap-7 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                { teams.map((x) =>
                    <a
                    href="#top-of-page" 
                    // tell parent which team was selected by sending their ID
                    onClick={ () => childToParent(x.team.id) }
                    aria-selected={ sbWinner.winner == x.team.id }
                    key={ x.team.id } 
                    className="p-1.5 rounded-md transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-90 md:hover:scale-110 aria-selected:border-2 aria-selected:border-gold duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" 
                    style={{ backgroundColor: "#" + x.team.color }}
                    >
                        { sbWinner.winner == x.team.id 
                            ? <p className="font-rubik text-gold text-center">{ sbWinner.headline } Champions</p> 
                            : null 
                        }
                        <div>
                            <img src={ x.team.shortDisplayName == 'Giants' || 'Jets'
                                ? x.team.logos[1].href 
                                : x.team.logos[0].href } alt={ x.team.displayName + " logo" 
                            } />
                        </div>
                        <p className="font-rubik text-lg font-semibold text-center" style={{ color: "#" + x.team.alternateColor }}>{ x.team.displayName }</p>
                    </a>
                )}
            </div>
        </section>
    );
}

export default memo(ListOfTeams);