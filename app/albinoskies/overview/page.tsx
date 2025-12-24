import { neon } from "@neondatabase/serverless";
import H2 from "@/app/components/H2";
import H3 from "@/app/components/H3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import SeasonOutcomeBanner from "../components/SeasonOutcomeBanner";
import { margins } from "@/app/helpers/albinoskiesStyling";
import Link from "next/link";

const sql = neon(process.env.DATABASE_URL!);

export default async function Overview() {
    // get the most recent season from the database
    const season = await sql`
        SELECT *
        FROM fantasy_seasons
        ORDER BY season DESC
        LIMIT 1;
    `;

    return (
        <section className={ margins }>
            <div className="pb-2 mb-9 border-b-2 border-primary dark:border-primary-dark">
                <H2>Overview</H2>    
            </div>
            
            <div className="grid xl:flex gap-x-8 gap-y-9">
                <div className="xl:basis-2/3">
                    <div>
                        <div className="text-base/8 mb-8">
                            <p className="mb-4">
                                <span className="font-protest text-xl italic mr-1">Albino Skies</span> was founded in 2015 as a small fantasy football redraft 
                                league by commissioner Nick Harding. In 2025, the league transitioned into a 12-team <Link 
                                    target="_blank" 
                                    title="(opens in a new tab)" 
                                    className="text-blue-800 dark:text-cyan-400 hover:underline" 
                                    href="https://www.fantasylife.com/articles/dynasty/what-is-a-dynasty-league"
                                >
                                    dynasty format
                                </Link>, placing an emphasis on long-term roster building, active trading, and sustained success across multiple seasons.    
                            </p> 
                            <p>
                                Each year, managers compete for pride, a place in league history, and the most important prize of all: <span className="font-bold cursor-[url('/images/krabs-resized.png'),_pointer]">money</span>. 
                                The league champion earns a $225 cash prize and an official league trophy. Successful managers are those who can balance short-term 
                                performance with long-term vision, as every season, draft, and trade has lasting consequences.   
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                            <Card 
                                link="https://www.tiktok.com/@albinoskies" 
                                faIcon={faTiktok} 
                                title="Recaps" 
                                description="Weekly recaps on TikTok" 
                            />
                            <Card 
                                link="/albinoskies/drafts" 
                                faIcon={faUsers} 
                                title="Drafts" 
                                description="Draft history" 
                            />
                            <Card 
                                link="/albinoskies/history" 
                                faIcon={faClockRotateLeft} 
                                title="History" 
                                description="League history" 
                                colspan
                            />    
                        </div>
                    </div>
                </div>
                <div className="xl:basis-1/3">
                    <H3>Reigning Award Winners</H3>
                    <SeasonOutcomeBanner season={season[0]} sidebar />
                </div>
            </div>
        </section>
    )
}

function Card({link, faIcon, title, description, colspan}: {link: string, faIcon: any, title: string, description: string, colspan?: boolean}) {
    return (
        <Link 
            href={ link } 
            className={`text-center bg-section border border-gray-300 dark:bg-section-dark dark:border-none p-3 rounded-md \ 
                        transition ease-in-out delay-50 hover:-translate-y-1 md:hover:scale-105 duration-300 ${colspan ? "col-span-2 md:col-span-1" : ""}`}
        >
            <FontAwesomeIcon icon={faIcon} className="text-4xl mb-2" />
            <p className="uppercase font-bold mb-3">{ title }</p>
            <p className="text-xs md:text-sm">{ description }</p>
        </Link>
    )
}