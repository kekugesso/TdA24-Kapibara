import Image from "next/image";
import Link from "next/link"

export default function Nav({ bgColor }: { bgColor: string }) {
    return (
      <header className={bgColor + " grid min-h-10 place-items-center px-6 py-6 lg:px-8"}>
        <nav className="container px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Link className="flex items-center font-semibold" href="#">
            <Image
                src="/TdA_LOGO/TeacherDigitalAgency_LOGO_black.svg"
                alt="Teacher digital Agency"
                className="white:invert"
                width={80}
                height={50}
                priority
                />
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                className="flex items-center w-10 h-10 rounded-full overflow-hidden border-2 border-jet py-2 text-jet"
                href="#"
              >
                <img
                  alt="Avatar"
                  className="rounded-full"
                  height="40"
                  src="/TdA_ikony/SVG/TdA_ikony_nastaveni_black.svg"
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
        </nav>
      </header>
    );
}
  
