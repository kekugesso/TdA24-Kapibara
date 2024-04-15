import { Lecturer_Card } from "@/componets/lecturer";

export default function Card({ lecturer }: { lecturer: Lecturer_Card }) {

  return (
    <div className="grid grid-cols-1 items-center h-96 bg-jet/15 dark:bg-jet rounded-xl p-8 border-2 border-jet dark:border-white overflow-hidden">
      <img className="w-36 h-36 rounded-full mx-auto" src={lecturer.picture_url} alt={"picture of " + lecturer.fullName} />
      <div className="p-2 text-center space-y-2">
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
        <div className="flex flex-wrap max-w-screen-sm text-sm text-center text-black/55 dark:text-white/25">
          {lecturer.tags.map((tag) => (
            <a className="mx-1" href="">#{tag.name}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
