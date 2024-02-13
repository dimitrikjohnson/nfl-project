'use client'
import Image from "next/image";
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
      <NavBar />
      <main className="flex min-h-screen flex-col items-center px-11">
        { selectedTeam ? <SelectedTeam teamID={ selectedTeam }/> : <Instructions />}
        <ListOfTeams childToParent={childToParent} />
      </main>
    </>
  );
}
