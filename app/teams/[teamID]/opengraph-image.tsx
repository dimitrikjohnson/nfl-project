import getTeam from '@/app/apiCalls/getTeam';
import { ImageResponse } from 'next/og';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";

const size = {
  width: 1200,
  height: 630,
}

// opengraph-images are the images that appear when sharing a link to the website via text/social media
export default async function Image({ params }: { params: { teamID: string }}) {
  const { teamID } = await params;

  const allTeamsColors = teamColors as AllTeamsColors;

  // fetch the team data
  const team = await getTeam({teamID});
      
  // convert image to base64 so it can be embedded
  const logoUrl = team.logo;
  const imageRes = await fetch(logoUrl);
  const arrayBuffer = await imageRes.arrayBuffer();

  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;

  // custom background and styles
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: allTeamsColors[teamID].bgColor,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={dataUrl} width={375} height={375} alt={`${allTeamsColors[teamID].name} logo`} />
      </div>
    ),
    {
      ...size
    }
  );
}
