import { NextResponse } from "next/server";

/*
 * Returns a JSON response that Vercel's CDN can cache.
 * s-maxage: how long (in seconds) the CDN serves the cached response without running the function again
 * stale-while-revalidate: after that, how long the CDN keeps serving the old response while it refreshes it in the background
 * Cached responses don't invoke a function, so they don't use any server CPU.
*/
export default function cachedJson(data: unknown, sMaxAge = 3600, staleWhileRevalidate = 86400) {
    return NextResponse.json(data, {
        headers: {
            "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
        }
    });
}
