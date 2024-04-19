import { Lecturer_Card } from "@/components/lecturer";
import Link from 'next/link'
import { IsVisible } from "./isVisible";
import { useRef } from "react";

function isOdd(num: number) {
  return num % 2 !== 0;
}

export default function Card({ lecturer, index }: { lecturer: Lecturer_Card, index: number }) {
  const ref = useRef(null)
  const isVisible = IsVisible(ref);

  return (
    <Link href={"/lecturer/" + lecturer.uuid} className="transition ease-in-out delay-100 hover:scale-105 xl:hover:scale-[1.03] duration-300">
      <div ref={ref} className={"grid grid-cols-1 h-96 bg-jet/15 dark:bg-jet rounded-xl p-8 border-2 border-jet dark:border-white overflow-hidden" + (isVisible ? " opacity-100 animate-fade-up animate-ease-in-out animate-alternate " + (isOdd(index) ? "animate-delay-[100ms]" : "") : " opacity-0")}>
        <div className="p-2 text-center space-y-2">
          <img className="w-36 h-36 rounded-full mx-auto items-center align-middle border-2 border-white" src={lecturer.picture_url} alt={"picture of " + lecturer.fullName} />
          <p><strong>{lecturer.fullName}</strong></p>
          <p>{lecturer.claim}</p>
          <div className="grid grid-cols-2 gap-10">
            <span className="bg-yellow rounded-full min-w-fit px-4 py-1 text-center text-nowrap text-black">
              {lecturer.location}
            </span>
            <span className="bg-yellow rounded-full min-w-fit px-4 py-1 text-center text-nowrap text-black">
              {lecturer.price_per_hour} kč
            </span>
          </div>
        </div>
        <div className="flex flex-wrap max-w-screen-sm text-sm text-center text-black/55 dark:text-white/25">
          {lecturer.tags.map((tag) => (
            <Link href={"?tag=" + tag.uuid}><div className="mx-1 hover:animate-pulse hover:animate-once">#{tag.name}</div></Link>
          ))}
        </div>
      </div>
    </Link>
  );
}
