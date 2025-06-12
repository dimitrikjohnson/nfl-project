import LandingPage from "./components/LandingPage";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS manually
config.autoAddCss = false;

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col">
			<LandingPage />	
		</main>
	)
}
