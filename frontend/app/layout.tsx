import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const playfair = Playfair_Display({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EShop - Your Online Store",
  description: "Shop amazing products at unbeatable prices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
