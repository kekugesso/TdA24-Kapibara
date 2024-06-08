import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import Nav from "@/components/basic/nav";
import Footer from "@/components/basic/footer";
import { AuthProvider } from "@/components/auth/authContext";

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
      <body>
        <AuthProvider>
          <Theme className={`${inter.className} flex flex-col bg-white dark:bg-jet justify-between min-h-screen`}>
            <Nav bgColor="bg-blue dark:bg-dark_blue" />
            <main className="flex-grow flex items-center justify-center mb-auto">{children}</main>
            <Footer bgColor="bg-dark_blue" />
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}

