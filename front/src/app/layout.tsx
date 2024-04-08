import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./nav";
import Footer from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teacher digital Agency",
  description: "A web to connect lectorers with students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cz">
      <body className={inter.className + 'flex flex-col h-screen justify-between'}>
        <Nav bgColor="bg-blue dark:bg-dark_blue"/>
        <main className="mb-auto">{children}</main>
        <Footer bgColor="bg-dark_blue"/>
      </body>
    </html>
  );
}

