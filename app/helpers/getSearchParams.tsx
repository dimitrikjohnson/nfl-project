'use client';
import { useSearchParams } from 'next/navigation';

export default function getSearchParams(query) {
    const searchParams = useSearchParams();
    return searchParams.has(query) && searchParams.get(query);
    //const stats = searchParams.has('stats') && searchParams.get('stats');
    //const popupActive = searchParams.has('popupActive');
}