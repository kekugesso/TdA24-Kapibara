import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./nav";
import Footer from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Teacher digital Agency",
  description: "A web to connect lectorers with students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={'${inter.className} flex flex-col h-screen justify-between'}>
        <Nav />
        <main className="mb-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
