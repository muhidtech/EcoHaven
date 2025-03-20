import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./contexts/CardContext";
import { AuthProvider } from "./contexts/AuthContext";



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
        <CartProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
