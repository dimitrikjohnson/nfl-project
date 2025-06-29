import Schedule from "./Schedule";
  
export default async function ScheduleTab({ params }: { params: Promise<{ teamName: string }>}) {
    const { teamName } = await params;
    return <Schedule teamName={ teamName } />
}
  