import LandingPage from "./components/LandingPage";
import { config } from "@fortawesome/fontawesome-svg-core";
import SkipToContent from "./components/SkipToContent";
config.autoAddCss = false;

export const revalidate = 60; // revalidates the page after 60 seconds (needed for getting a new background image)

export default function Home() {
	return (
		<>
			<SkipToContent />
			<main className="flex min-h-screen flex-col">
				<LandingPage />	
			</main>
		</>
	)
}
