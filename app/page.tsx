'use client'
import NavBar from "./components/NavBar";
import ListOfTeams from "./components/ListOfTeams";
import Instructions from "./components/Instructions";
import SelectedTeam from "./components/SelectedTeam";
import { useState } from "react";

export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState("");
  
  const childToParent = (childData) => {
    setSelectedTeam(childData)
  }
  
  return (
    <>
      <span id="top-of-page"></span>
      { /* <NavBar /> */}
      <main className="flex min-h-screen flex-col items-center">
        { selectedTeam 
          ? <SelectedTeam teamID={ selectedTeam } /> 
          : <Instructions /> 
        }
        <ListOfTeams childToParent={ childToParent } />
      </main>
    </>
  );
}
