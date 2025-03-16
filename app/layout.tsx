import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "EcoHaven",
  description: "EcoHaven is a sustainable living platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
