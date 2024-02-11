import Image from "next/image";
import NFLLogo from "../images/nflLogo.svg";

export default function Instructions() {
    return (
        <section className="w-full grid md:flex gap-12 mb-20">
            <div className="flex justify-center md:block">
                <Image
                    src={NFLLogo}
                    width={175}
                    alt="NFL Logo"
                    priority
                /> 
            </div>
            
            <div>
                <h1 className="font-protest text-5xl uppercase mb-6">Select a team</h1>
                <p className="font-rubik text-lg">
                    Select a team's card to view their stats for the current season. If the chosen team is in the offseason, the team's stats
                    from the previous season will be displayed.
                </p>
            </div>
        </section>
    );
}