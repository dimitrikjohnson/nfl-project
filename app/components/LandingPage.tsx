import Link from 'next/link';

export default function LandingPage() {
    return (
        <>
            <section className="px-4 md:px-6 lg:px-14 max-w-screen-xl">
                <h1 className="font-rubik text-6xl md:text-8xl">
                    <span className="block">Test home phrase</span>
                    <span className="block text-cyan-400">Test home phrase</span>
                </h1>
                <div className="flex">
                    <Link href="/teams" prefetch={ true }>Select a team</Link>
                    <button>View league stats</button>
                </div>      
            </section> 
        </>
    )
}