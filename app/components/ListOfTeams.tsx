import 'client-only';
import { useState, useEffect } from 'react';
import { getAllTeams } from "../data/API";

export default function ListOfTeams({ childToParent }) {
    const [teams, setTeams] = useState([])
    
    const getTeams = () => getAllTeams().then(
        (res) => {
            setTeams(res)
        }
    )
    
    // run getTeams() when the page loads
    useEffect(() => {
        getTeams()
    }, [])

    return (
        <section className="w-full mb-14">
            <div className="flex mb-6">
                <h1 className="font-protest text-5xl uppercase">Teams</h1>
            </div>
            <div className="grid gap-7 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                { teams.map((x) =>
                    <div onClick={ () => childToParent(x.team.id) } key={ x.team.id } className="p-1.5 rounded-lg transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-90 md:hover:scale-110 duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" style={{ backgroundColor: "#" + x.team.color }}>
                        <div>
                            <img src={ x.team.shortDisplayName == 'Giants' ? x.team.logos[1].href : x.team.logos[0].href } alt={ x.team.displayName + " logo" } />
                        </div>
                        <p className="font-rubik text-xl font-semibold text-center" style={{ color: "#" + x.team.alternateColor }}>{ x.team.displayName }</p>
                    </div>
                )}
            </div>
        </section>
    );
}