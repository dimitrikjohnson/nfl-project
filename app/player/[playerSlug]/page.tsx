import { redirect } from 'next/navigation';

export default async function Player({ params }: { params: Promise<{ playerSlug: string }> }) {
    const { playerSlug } = await params;
    redirect(`/player/${playerSlug}/overview`);
}
