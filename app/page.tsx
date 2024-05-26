'use client'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import NavBar from "./components/NavBar";
import ListOfTeams from "./components/ListOfTeams";
import Instructions from "./components/Instructions";
import SelectedTeam from "./components/SelectedTeam";
import { useState, useEffect, createContext } from "react";
import fetchCurrentSeason from './apiCalls/fetchCurrentSeason';
import getSuperBowlWinner from './apiCalls/getSuperBowlWinner';

library.add(faCircleInfo);

export const ThisSeason = createContext(null);
export const SuperBowlWinner = createContext(null);

export default function Home() {
	const [currentSeason, setCurrentSeason] = useState("");
	const [sbWinner, setSBWinner] = useState({});
	const [selectedTeam, setSelectedTeam] = useState("");
	
	const childToParent = (childData) => setSelectedTeam(childData)

	const getSBWinner = () => getSuperBowlWinner().then(
		(res) => {
			if (res) {
				setSBWinner({
					headline: res.headline, 
					winner: res.winnerID
				});
			}
		}
	);

	useEffect(() => {
		//getTeams(),
		getSBWinner(),
		fetchCurrentSeason().then(
			res => setCurrentSeason(res)
		);
	}, []);
  
	return (
		<>
			<span id="top-of-page"></span>
			{ /* <NavBar /> */}
			<main className="flex min-h-screen flex-col">
				{ selectedTeam 
					? <ThisSeason.Provider value={ currentSeason }>
							<SuperBowlWinner.Provider value={ sbWinner }>
								<SelectedTeam teamID={ selectedTeam } />  
							</SuperBowlWinner.Provider>
						</ThisSeason.Provider>
					: <Instructions /> 
				}
				<ThisSeason.Provider value={ currentSeason }>
					<SuperBowlWinner.Provider value={ sbWinner }>
						<ListOfTeams childToParent={ childToParent } />    
					</SuperBowlWinner.Provider>
				</ThisSeason.Provider>		
			</main>
		</>
	)
}
