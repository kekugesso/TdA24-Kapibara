'use client'

import Image from "next/image";
import Link from "next/link"
import * as reactDropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

export default function Nav({ bgColor }: { bgColor: string }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const handleLogout = () => {
    // Handle logout functionality
    throw new Error("Not implemented logout functionality");
  }

  return (
    <header className={bgColor + " grid min-h-10 place-items-center px-6 py-6"}>
      <nav className="container px-4">
        <div className="flex justify-between items-center">
          <Link className="flex items-center font-semibold" href="/">
            <Image
              src="/TdA_LOGO/TeacherDigitalAgency_LOGO_black.svg"
              alt="Teacher digital Agency"
              className="dark:invert"
              width={80}
              height={50}
              priority
            />
          </Link>
          <div className="flex items-center space-x-4 z-50">
            {loggedIn ? (
              <reactDropdownMenu.DropdownMenu>
                <reactDropdownMenu.DropdownMenuTrigger asChild>
                  <button className="flex items-center w-12 h-12 p-1 object-center rounded-full overflow-hidden text-jet">
                    <img
                      alt="Av"
                      className="dark:invert object-center"
                      height="40"
                      src="/TdA_ikony/SVG/TdA_ikony_nastaveni_black.svg"
                      style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                      }}
                      width="40"
                    />
                    <span className="sr-only">Toggle user menu</span>
                  </button>
                </reactDropdownMenu.DropdownMenuTrigger>
                <reactDropdownMenu.DropdownMenuContent className="w-56 mt-2 bg-white border border-jet-200 rounded-md shadow-lg">
                  <reactDropdownMenu.DropdownMenuItem>
                    <Link
                      className="block px-4 py-2 text-jet hover:bg-blue"
                      href="/admin/calendar"
                    >
                      Calendar
                    </Link>
                  </reactDropdownMenu.DropdownMenuItem>
                  <reactDropdownMenu.DropdownMenuItem>
                    <button
                      onClick={() => {
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-jet hover:bg-blue"
                    >
                      Logout
                    </button>
                  </reactDropdownMenu.DropdownMenuItem>
                </reactDropdownMenu.DropdownMenuContent>
              </reactDropdownMenu.DropdownMenu>
            ) : (
              <Link href="/login">
                <button className="text-jet bg-white px-4 py-2 rounded-lg">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>

      </nav>
    </header>
  );
}
