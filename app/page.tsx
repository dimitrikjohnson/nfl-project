//import { BrowserRouter } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
//import { useState, useEffect, createContext } from "react";
//import { Link, Route, Routes } from 'react-router-dom';

//import NavBar from "./components/NavBar";
//import ListOfTeams from "./components/ListOfTeams";
//import Instructions from "./components/Instructions";
//import SelectedTeam from "./components/SelectedTeam";
import LandingPage from "./components/LandingPage";
//import Routes from "./components/Routes";

import fetchCurrentSeason from './apiCalls/getCurrentSeason';
import getSuperBowlWinner from './apiCalls/getSuperBowlWinner';
import getAllTeams from './apiCalls/getAllTeams';
import CurrentSeasonProvider from "./contextProviders/currentSeasonProvider";

library.add(faCircleInfo);
/*
export const ThisSeason = createContext(null);
export const SuperBowlWinner = createContext(null);
export const AllTeams = createContext(null);
*/
export default function Home() {
	/*
	const [currentSeason, setCurrentSeason] = useState("");
	const [sbWinner, setSBWinner] = useState({});
	const [teams, setTeams] = useState([]);
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
		),
		getAllTeams().then(
			(res) => setTeams(res)
		);
	}, []);
	*/
	return (
		<>
			<span id="top-of-page"></span>
			{ /* <NavBar /> */}
			<main className="flex min-h-screen flex-col">
				<LandingPage />	
				
				
				{ /*<Routes />*/ }
				{/*
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
				*/}
				{ /*
				<Routes>
					<Route path="/*" element={ <LandingPage /> } />
					<Route path="/teams" element={ 
						<ThisSeason.Provider value={ currentSeason }>
							<SuperBowlWinner.Provider value={ sbWinner }>
								<AllTeams.Provider value={ teams }>
									<ListOfTeams />
								</AllTeams.Provider>    
							</SuperBowlWinner.Provider>
						</ThisSeason.Provider> 
					} />
				</Routes>
				*/}
			</main>
		</>
	)
}
