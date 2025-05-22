'use client';
import { usePathname } from 'next/navigation';
 
export default function useCurrentPath() {
  const fullPath = usePathname();
  const pathEnd = fullPath.substring(fullPath.lastIndexOf('/') + 1);

  return pathEnd;
}