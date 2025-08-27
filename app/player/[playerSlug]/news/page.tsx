import H2 from "@/app/components/H2";
import NewsArticles from "@/app/components/NewsArticles";
import { Suspense } from "react";

export default async function NewsTab({ params }: { params: Promise<{ playerSlug: string }>}) {
    const { playerSlug } = await params; 
    
    // get the player ID from the params (e.g. gets 1234 from 'josh-allen-1234')
    const playerID = playerSlug.substring(playerSlug.lastIndexOf('-')+1);
    
    //const player = await getPlayer({ playerID });

    return (
        <>
            <div className="mb-9 pb-2 border-b-2 border-primary dark:border-primary-dark">
                <H2>Latest News</H2>
            </div>
            <Suspense fallback={<div className="skeleton w-full h-36"></div>}>
                <NewsArticles type={"playerFull"} id={ playerID } /> 
            </Suspense>        
        </>         
    )
}