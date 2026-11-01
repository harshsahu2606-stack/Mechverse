import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MECHVERSE | Realistic 3D Machine Explorer & Simulator",
  description:
    "Explore, dissect, customize and simulate interactive 3D machines including the Apex GT-V6 Supercar and AeroFlow Electric Table Fan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-[#090b0f] text-white overflow-x-hidden selection:bg-red-600/30">
        {children}
      </body>
    </html>
  );
}
