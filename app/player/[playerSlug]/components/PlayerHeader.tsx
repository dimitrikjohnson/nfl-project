import NavBar from "@/app/components/NavBar";
import { PlayerOverview } from "@/app/types/player";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default async function PlayerHeader({ player }: { player: PlayerOverview }) {
    return (
        <>
            <NavBar player={ player } />
            <section className="w-full">
                <div className="flex relative h-60 md:h-80 overflow-hidden z-0">
                    <div className="absolute w-full h-full" style={{ backgroundColor: player.team.bgColor }}></div>
                    <div className="flex flex-col md:flex-row relative w-full justify-between items-center md:items-end mt-16 md:mx-6 lg:mx-11">
                        { player.headshot
                            ? <img className="order-2 md:order-1 w-36 md:w-56 lg:w-72" src={ player.headshot } alt={ player.name } />
                            : <FontAwesomeIcon icon={faUser} className="order-2 md:order-1 w-36 md:w-56 lg:w-72 text-6xl lg:text-[190px]" /> 
                        }
                        <div className="order-1 md:order-2 flex flex-col h-full text-center justify-center" style={{ color: player.team.textColor }}>
                            <p className="md:hidden font-protest uppercase text-4xl mb-1">{ player.name }</p>
                            <p className="hidden md:block font-protest uppercase text-3xl md:text-5xl mb-1">{ player.firstName }</p>
                            <p className="hidden md:block font-protest uppercase text-6xl md:text-8xl mb-2">{ player.lastName }</p>
                            <div className="font-rubik text-sm md:text-base font-semibold flex gap-1.5 items-center justify-center">
                                { player.onATeam && 
                                    <>
                                        <Link 
                                            href={`/teams/${player.team.shortName?.toLowerCase()}`}
                                            className="flex items-center gap-1.5 hover:underline"
                                        >
                                            <img className="md:hidden w-6" src={ player.team.logo } alt={ player.team.longName } />
                                            { player.team.longName }
                                        </Link>
                                        <span>&#183;</span>
                                    </>
                                }
                                <p>{ player.position.name }</p>
                                <p>{ player.jersey}</p>
                            </div>
                        </div>
                        <img 
                            className={`order-3 hidden md:block md:w-44 ${player.team.logo.includes("nflLogo") || "lg:w-56"}`} 
                            src={ player.team.logo } 
                            alt={ player.team.longName } 
                        />
                    </div>
                </div>	
            </section>
        </>
    )
}