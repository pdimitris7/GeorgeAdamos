// app/layout.tsx
import "./globals.css";
import { Montserrat, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "George Adamos | Food & Travel Photographer",
  description:
    "Premium food, travel, and documentary photography by George Adamos",
  generator: "v0.app",
};

export default function RootLayout({
  children,
  modal, // 👈 slot για @modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${montserrat.variable} ${playfair.variable} font-sans bg-background text-foreground`}
      >
        {children}
        {modal /* 👈 εδώ θα «κάθεται» το overlay modal */}
      </body>
    </html>
  );
}
