'use client'

import Image from "next/image";
import Link from "next/link"
import { useState } from "react";

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
            <button 
              className="flex items-center w-12 h-12 p-1 rounded-full overflow-hidden text-jet"
              onClick={toggleUserMenu}
            >
              <img
                alt="Avatar"
                className="dark:invert"
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
            {showUserMenu && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                <Link 
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  href="/profile" 
                >
                  Profile
                </Link>
                <Link 
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  href="/settings"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    // Handle logout functionality
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </nav>
    </header>
  );
}
  
