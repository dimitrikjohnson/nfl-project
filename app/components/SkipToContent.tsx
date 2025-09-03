import Link from "next/link";

export default function SkipToContent() {
    return (
        <Link 
			className="absolute left-0 top-0 block z-50 -translate-x-full rounded-md bg-cyan-400 text-backdrop-dark px-4 py-3 font-bold uppercase tracking-wide focus:translate-x-0 focus-visible:translate-x-0" 
			href="#content">
				Skip to content
		</Link>
    )
}