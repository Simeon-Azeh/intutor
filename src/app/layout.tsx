import type { Metadata } from "next";
import { DarkModeProvider } from "@/components/DarkModeContext"; // Update this path based on your project structure
import "./globals.css";

export const metadata: Metadata = {
  title: "Intutor",
  description: "Welcome to our LMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The `dark` class is toggled dynamically inside the DarkModeProvider */}
      <body className="transition-colors duration-200">
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
