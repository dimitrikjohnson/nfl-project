import Image from "next/image";
import NFLLogo from "../images/nflLogo.svg";

export default function Instructions() {
    return (
        <section className="w-full flex mb-14">
            <Image
                src={NFLLogo}
                width={150}
                alt="NFL Logo"
                priority
            />
            <p className="font-rubik">Select a team's card to view their stats for the current season.</p>
        </section>
    );
}