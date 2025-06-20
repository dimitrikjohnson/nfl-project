import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
 
// Image metadata
export const alt = 'Big Football';
const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png';
 
// Image generation
export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const protestFont = await readFile(
    join(process.cwd(), 'public/fonts/ProtestStrike-Regular.ttf')
  );
 
  // custom background and styles
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#1C232B',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'white' }}>
            BIG
        </span> 
        <span style={{ color: '#22d3ee' }}>
            FOOTBALL
        </span>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the opengraph-image size
      // config to set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'ProtestStrike',
          data: protestFont,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}