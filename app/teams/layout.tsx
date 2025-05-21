import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | Big Football",
  description: "A list of all NFL teams.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>{ children }</>
    );
}