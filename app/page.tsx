import LandingPage from "./components/LandingPage";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS manually
import Link from 'next/link';
config.autoAddCss = false;

export const revalidate = 60; // revalidates the page after 60 seconds (needed for getting a new background image)

export default function Home() {
	return (
		<>
			<Link 
				className="absolute left-0 top-0 block z-50 -translate-x-full rounded-md bg-cyan-400 text-backdrop-dark px-4 py-3 text-sm font-bold uppercase tracking-wide focus-visible:translate-x-0" 
				href="#content">
					Skip to content
			</Link>
			<main className="flex min-h-screen flex-col">
				<LandingPage />	
			</main>
		</>
	)
}
