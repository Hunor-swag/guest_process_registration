import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Register",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
