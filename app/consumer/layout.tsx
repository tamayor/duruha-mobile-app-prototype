
import type { Metadata } from "next";

import ConsumerBottomNav from "../components/ConsumerBottomNav";


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
      <ConsumerBottomNav />
    </div>
  );
}
