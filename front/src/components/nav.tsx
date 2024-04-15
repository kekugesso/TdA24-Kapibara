'use client'

import Image from "next/image";
import Link from "next/link"
import { useState } from "react";
import * as reactDropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Nav({ bgColor } : { bgColor: string }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

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
          <div className="flex items-center space-x-4">
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
                    href="/admin/edit-profile" 
                  >
                    Edit your profile
                  </Link>
                </reactDropdownMenu.DropdownMenuItem>
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
                      // Handle logout functionality
                      throw new Error("Not implemented logout functionality");
                    }}
                    className="block w-full text-left px-4 py-2 text-jet hover:bg-blue"
                  >
                    Logout
                  </button>
                </reactDropdownMenu.DropdownMenuItem>
              </reactDropdownMenu.DropdownMenuContent>
            </reactDropdownMenu.DropdownMenu>
          </div>
        </div>

      </nav>
    </header>
  );
}
  
