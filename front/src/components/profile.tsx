import { Lecturer_Full } from "@/components/lecturer";
import Link from "next/link";
import Calendar from "@/components/calendar";

export default function Profile({ lecturer }: { lecturer: Lecturer_Full }) {
  return (
    <section className="grid grid-cols-4 min-h-screen bg-white dark:bg-jet text-black dark:text-white p-6 sm:px-12 lg:px-24 shadow-xl">
      {/*TODO: make it mobile friendly*/}
      {/*TODO: make it white mode*/}
      {/*TODO: make calendar*/}
      <div className="grid grid-cols-subgrid col-span-4 border-white border-b-2 items-center h-fit py-4">
        <img className="col-span-1 md:order-last w-48 h-48 rounded-5 mx-auto items-center align-middle" src={lecturer.picture_url} alt={"picture of " + lecturer.fullName} />

        <div className="col-span-3">
          <h1 className="text-6xl my-5">{lecturer.fullName}</h1>
          <h2 className="text-xl">{lecturer.claim}</h2>
        </div>
      </div>

      <div className="h-fit grid grid-cols-subgrid col-span-4 justify-start py-4">
        <div className="col-span-1 grid grid-cols-subgrid gap-3 px-2 text-center md:order-last">
          <div className="bg-yellow rounded-full min-w-fit text-center py-2 text-nowrap text-black text-xl">
            {lecturer.location}
          </div>
          <div className="bg-yellow rounded-full min-w-fit text-center py-2 text-nowrap text-black text-xl">
            {lecturer.price_per_hour} kč
          </div>

          <div className="border-white rounded-lg justify-between border-2">
            <div className="text-lg">Contact:</div>
            <p>{lecturer.contact.emails.join(', ')}</p>
            <p>{lecturer.contact.telephone_numbers.join(', ')}</p>
          </div>

          <div className="text-center text-black/55 dark:text-white/25">
            {lecturer.tags.map((tag) => (
              <Link href={"/?tag=" + tag.uuid}><div className="mx-1 hover:animate-pulse hover:animate-once">#{tag.name}</div></Link>
            ))}
          </div>
        </div>


        <div className="col-span-3 ">
          <div>{lecturer.bio}</div>
          <Calendar mode="simple" classes="border-white border-2" />
        </div>
      </div>

    </section>
  );
}
