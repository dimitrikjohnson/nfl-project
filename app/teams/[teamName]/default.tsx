import { redirect } from 'next/navigation';

export default async function Team({ params }: { params: { teamName: string } }) {
	const { teamName } = await params;
  	redirect(`/teams/${teamName}/overview`);
}
