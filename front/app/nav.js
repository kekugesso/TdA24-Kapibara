import Link from "next/link"
import { Button } from "@/components/ui/button"


export default function Nav() {
    return (
      <header className="grid min-h-10 place-items-center bg-gray-400 px-6 py-6 lg:px-8">
            <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm translate-y-0/hidden md:translate-y-0.5/visible md:rounded-b-2xl/first">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between h-14">
          <Link className="flex items-center font-semibold" href="#">
            Acme Inc
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link className="flex items-center text-sm font-medium" href="#">
              Home
            </Link>
            <Link className="flex items-center text-sm font-medium [&:after]:content-none" href="#">
              Features
            </Link>
            <Link className="flex items-center text-sm font-medium" href="#">
              Pricing
            </Link>
            <Link className="flex items-center text-sm font-medium" href="#">
              Team
            </Link>
            <Link className="flex items-center text-sm font-medium" href="#">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
            <Link
              className="flex items-center w-8 h-8 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-800"
              href="#"
            >
              <img
                alt="Avatar"
                className="rounded-full"
                height="40"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "40/40",
                  objectFit: "cover",
                }}
                width="40"
              />
              <span className="sr-only">Toggle user menu</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
      </header>
    );
}
  
