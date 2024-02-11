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
    console.log(selectedTeam)
  }
  
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-between px-11">
        { selectedTeam ? <SelectedTeam /> : <Instructions />}
        <ListOfTeams childToParent={childToParent} />
      </main>
    </>
  );
}
