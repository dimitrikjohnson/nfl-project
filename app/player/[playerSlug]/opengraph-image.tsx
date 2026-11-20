import { ImageResponse } from 'next/og';
import { getPlayerIDOrNotFound, getPlayerOrNotFound } from "@/app/helpers/routeGuards";

const size = {
    width: 850,
    height: 446.25,
}

// generating images is CPU-heavy, so cache each one and re-generate it at most once a day
export const revalidate = 86400;

export async function generateStaticParams() {
    return [];
}

// opengraph-images are the images that appear when sharing a link to the website via text/social media
export default async function Image({ params }: { params: { playerSlug: string }}) {
    const { playerSlug } = await params; 
  
    // get the player ID from the params (e.g. gets 1234 from 'josh-allen-1234')
    const playerID = getPlayerIDOrNotFound(playerSlug);
  
    const player = await getPlayerOrNotFound(playerID);
        
    // convert image to base64 so it can be embedded
    const headshotUrl = player.headshot;
    const imageRes = await fetch(headshotUrl);
    const arrayBuffer = await imageRes.arrayBuffer();

    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    // custom background and styles
    return new ImageResponse(
        (
            <div
                style={{
                    backgroundColor: player.team.altColor,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
  
                <img style={{ position: 'absolute', bottom: 0 }} src={dataUrl} width={600} alt={ player.name } />      
            </div>
        ),
        {
            ...size
        }
    );
}
