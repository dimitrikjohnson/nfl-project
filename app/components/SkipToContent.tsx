'use client';
import Link from "next/link";
import { useEffect } from "react";

export default function SkipToContent() {
    useEffect(() => {
        const handleFirstTab = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                document.body.classList.add("user-is-tabbing");

                window.removeEventListener("keydown", handleFirstTab);
                window.addEventListener("mousedown", handleMouseDownOnce);
                window.addEventListener("touchstart", handleMouseDownOnce);
            }
        };

        const handleMouseDownOnce = () => {
            document.body.classList.remove("user-is-tabbing");

            window.addEventListener("keydown", handleFirstTab);
            window.removeEventListener("mousedown", handleMouseDownOnce);
            window.removeEventListener("touchstart", handleMouseDownOnce);
        };

        window.addEventListener("keydown", handleFirstTab);
        return () => {
            window.removeEventListener("keydown", handleFirstTab);
            window.removeEventListener("mousedown", handleMouseDownOnce);
            window.removeEventListener("touchstart", handleMouseDownOnce);
        };
    }, []);

    return (
        <Link 
			className="absolute left-0 top-0 block z-50
                -translate-x-full
                rounded-md bg-cyan-400 text-backdrop-dark
                px-4 py-3 text-sm font-bold uppercase tracking-wide

                focus-visible:translate-x-0
                [body.user-is-tabbing_&]:-translate-x-full
            "
			href="#content">
				Skip to content
		</Link>
    )
}