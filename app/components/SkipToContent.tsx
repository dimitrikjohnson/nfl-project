import Link from "next/link";

export default function SkipToContent() {
    // Add a class to <body> if the user presses Tab
    // this stops the link from grabbing focus on mobile unnecessarily
    if (typeof window !== "undefined") {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                document.body.classList.add("user-is-tabbing");
            }
        });
    }

    return (
        <Link 
			className="absolute left-0 top-0 block z-50
                -translate-x-full
                rounded-md bg-cyan-400 text-backdrop-dark
                px-4 py-3 text-sm font-bold uppercase tracking-wide

                body-has[.user-is-tabbing]:-translate-x-full
                focus-visible:translate-x-0
            "
			href="#content">
				Skip to content
		</Link>
    )
}