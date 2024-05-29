'use client'
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { Route, Routes } from 'react-router-dom';

//import NavBar from "./components/NavBar";
import ListOfTeams from "./ListOfTeams";
//import Instructions from "./components/Instructions";
import SelectedTeam from "../components/SelectedTeam";
import LandingPage from "../components/LandingPage";

import fetchCurrentSeason from '../apiCalls/getCurrentSeason';
import getSuperBowlWinner from '../apiCalls/getSuperBowlWinner';
import getAllTeams from '../apiCalls/getAllTeams';

export const ThisSeason = createContext(null);
export const SuperBowlWinner = createContext(null);
export const AllTeams = createContext(null);

export default function Home() {
	const [currentSeason, setCurrentSeason] = useState("");
	const [sbWinner, setSBWinner] = useState({});
	const [teams, setTeams] = useState([]);
	const [selectedTeam, setSelectedTeam] = useState("");
	
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
  
	return (
		<BrowserRouter>
				
				
				<Routes>
					<Route path="/" element={ <LandingPage /> } />
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
			
		</BrowserRouter>
	)
}
