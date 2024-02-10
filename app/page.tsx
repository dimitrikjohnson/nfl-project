'use client'
import Image from "next/image";
import NavBar from "./components/NavBar";
import ListOfTeams from "./components/ListOfTeams";
import Instructions from "./components/Instructions";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-between px-11">
        <Instructions />
        <ListOfTeams />
      </main>
    </>
  );
}
