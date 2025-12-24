import { redirect } from 'next/navigation';

/* 
    /albinoskies should redirect to /albinoskies/overview 
*/
export default function AlbinoSkies() {
    redirect(`/albinoskies/overview`);
}
