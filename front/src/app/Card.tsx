import { Lecturer_Card } from "./lecturer";

export default function Card({ lecturer }: {lecturer: Lecturer_Card}) {

    return (
        <section className="flex min-h-screen bg-white dark:bg-jet text-black dark:text-white flex-col items-center justify-between p-24 border-2 border-jet">
            <h1>{lecturer.fullName}</h1>
            <h2>{lecturer.location}</h2>
            <img src={lecturer.picture_url} alt="Lecturer" />
            <p>{lecturer.claim}</p>
            <p>{lecturer.price_per_hour}</p>
            <div className="flex border-2 border-jet">
                {lecturer.tags.map((tag) => (
                    <p key={tag.uuid}>{tag.name}</p>
                ))}
            </div>
        </section>
    );
}