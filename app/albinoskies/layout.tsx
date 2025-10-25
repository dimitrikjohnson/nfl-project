import { ReactNode } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import SkipToContent from "@/app/components/SkipToContent";

export default async function AlbinoSkiesLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <SkipToContent /> 
            <main>
                <Suspense fallback={<div className="skeleton w-full h-14"></div>}>
                    {children}  
                </Suspense>   
            </main> 
        </>
    );
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Albino Skies",
        description: "Albino Skies is a dynasty fantasy football league. This page contains insightful league data, including weekly scores, medians, and rankings.",
    };
}
