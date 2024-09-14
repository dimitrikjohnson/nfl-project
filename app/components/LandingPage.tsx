import Link from 'next/link';
import Image from 'next/image';
import Leaders from './Leaders';
import landing_design from '@/public/landing_design.svg';

export default function LandingPage() {
    return (
        <>
            <section className="w-full mb-10 px-4 md:px-6 lg:px-14">
                <Image className="absolute right-0 h-screen w-full object-cover z-0" src={ landing_design }  alt="Background polka dot design" priority /> 
                <div className="w-full flex items-center h-screen">
                    <div>
                        <h1 className="relative mb-2 font-rubik text-6xl md:text-8xl">
                            <span className="block text-cyan-400">the process</span>
                        </h1>
                        <p className="mb-2 text-white">
                            The
                        </p>
                        <div className="flex relative">
                            <Link href="/teams" prefetch={ true } className="btn h-10 min-h-10 mr-2.5 bg-cyan-400">Select a team</Link>
                            <button className="btn h-10 min-h-10 border border-cyan-400">View league stats</button>
                        </div>    
                    </div>
                    <div>image</div>
                </div>        
            </section> 
            <section className="w-full px-4 md:px-6 lg:px-14">
                <Leaders teamID={ "" } getLeadersOverview={ false } isLeagueLeader={ true }/>
            </section>
        </>
    )
}