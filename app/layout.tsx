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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600;1,700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#07080A] text-white overflow-x-hidden selection:bg-[#FF6A1A]/40">
        {children}
      </body>
    </html>
  );
}
