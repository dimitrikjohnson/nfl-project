import Roster from "./Roster"

export default async function RosterTab({ params }: { params: Promise<{ teamName: string }> }) {
    const { teamName } = await params;
    return <Roster teamName={ teamName } />
}
  
