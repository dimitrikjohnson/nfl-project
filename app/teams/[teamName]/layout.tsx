import { ReactNode } from "react";
import type { Metadata } from "next";
import Overview from "@/app/teams/[teamName]/@tabs/overview/page";
import ScheduleHome from "@/app/teams/[teamName]/@tabs/schedule/page";
import RosterHome from "@/app/teams/[teamName]/@tabs/roster/page";
import StatisticsHome from "@/app/teams/[teamName]/@tabs/statistics/page";
import Tabs from "@/app/components/Tabs";
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";

export const metadata: Metadata = {};

interface RootLayoutProps {
  children: ReactNode;
  params: {
    teamName: string;
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  // `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
  const { teamName } = await params;
  
  const allTeamsColors = teamColors as AllTeamsColors;
  const teamFullName = allTeamsColors[teamName].fullName;

  metadata.title = teamFullName + " | Big Football";
  metadata.description = "An overview of the " + teamName + "' season, including stat leaders, rankings, division standings, and more on Big Football."
  
  const items = {
    "overview": { content: <Overview teamName={ teamName } /> }, 
    "schedule": { content: <ScheduleHome teamName={ teamName } /> }, 
    "roster": { content: <RosterHome teamName={ teamName } /> }, 
    "statistics": { content: <StatisticsHome teamName={ teamName } /> }
  };
  
  return (
    <>
      { children }
      <Tabs items={ items } teamName={ teamName } />  
    </>
  );
}
