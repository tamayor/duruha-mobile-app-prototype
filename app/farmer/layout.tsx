
import type { Metadata } from "next";

import FarmerBottomNav from "../components/FarmerBottomNav";


export const metadata: Metadata = {
    title: "Dirikita - Farmer App",
    description: "Mobile-first farmer application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div >
            {children}
            <FarmerBottomNav />
        </div>
    );
}
