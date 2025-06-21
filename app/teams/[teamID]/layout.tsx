import { ReactNode } from "react";
import type { Metadata } from "next";
import Overview from "@/app/teams/[teamID]/@tabs/overview/page";
import ScheduleHome from "@/app/teams/[teamID]/@tabs/schedule/page";
import RosterHome from "@/app/teams/[teamID]/@tabs/roster/page";
import StatisticsHome from "@/app/teams/[teamID]/@tabs/statistics/page";
import Tabs from "@/app/components/Tabs";
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";

export const metadata: Metadata = {};

interface RootLayoutProps {
  children: ReactNode;
  params: {
    teamID: string;
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  // `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
  const { teamID } = await params;
  
  const allTeamsColors = teamColors as AllTeamsColors;
  const teamName = allTeamsColors[teamID].name;

  metadata.title = teamName;
  metadata.description = "An overview of the " + teamName + "' season, including stat leaders, rankings, division standings, and more."
  
  const items = {
    "overview": { content: <Overview teamID={ teamID } /> }, 
    "schedule": { content: <ScheduleHome teamID={ teamID } /> }, 
    "roster": { content: <RosterHome teamID={ teamID } /> }, 
    "statistics": { content: <StatisticsHome teamID={ teamID } /> }
  };
  
  return (
    <>
      { children }
      <Tabs items={ items } teamID={ teamID } />  
    </>
  );
}
