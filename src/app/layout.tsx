import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "EcoMarket | Sustainable Local Products",
  description: "Discover and order nearby sustainable goods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(outfit.className, "min-h-screen flex flex-col bg-slate-50")}>
        <NavBar />
        <main className="flex-1 w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
