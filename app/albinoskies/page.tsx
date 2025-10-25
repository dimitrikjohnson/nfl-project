import Image from "next/image";
import Skies from '@/public/skies.png';
import LeagueData from "./components/LeagueData";
import NavBar from "../components/NavBar";

export default function AlbinoSkiesHome() {
    return (
        <>
            <section className="relative w-full h-fit mb-11 shadow-md">
                <NavBar />
                <Image src={ Skies } className="absolute inset-0 object-cover w-full h-full" alt="Albino Skies logo" priority />
                <div id="content" className="relative z-10 flex items-center justify-center px-4 py-16 md:py-32 max-w-2xl mx-auto">
                    <h1 className="font-protest text-4xl md:text-6xl uppercase text-backdrop-dark">Albino Skies</h1>
                </div>
            </section>
            <LeagueData />
        </>
    )
}
