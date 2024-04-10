import { Lecturer_Card } from "./lecturer";

export default function Card({ lecturer }: {lecturer: Lecturer_Card}) {

    return (
        <figure className="flex bg-blue dark:bg-jet rounded-xl p-8 md:p-0 dark:bg-slate-800 border-2 border-jet dark:border-white">
            <img className="w-24 h-24 md:w-48 md:h-auto rounded-none mx-auto" src={lecturer.picture_url} alt={lecturer.fullName}  />
            <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
                <p>{lecturer.fullName}</p>
                <p>{lecturer.location}</p>
                <p>{lecturer.claim}</p>
                <p>{lecturer.price_per_hour}</p>
                <div className="flex">
                    {lecturer.tags.map((tag) => (
                        <span key={tag.uuid} className="bg-yellow rounded-full mx-1 px-2 justify-center text-center text-nowrap text-jet">{tag.name}</span>
                    ))}
                </div>
            </div>
        </figure>
        //<figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
        //<img class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" height="512">
        //<div class="pt-6 md:p-8 text-center md:text-left space-y-4">
            //<blockquote>
            //<p class="text-lg font-medium">
                //“Tailwind CSS is the only framework that I've seen scale
                //on large teams. It’s easy to customize, adapts to any design,
                //and the build size is tiny.”
            //</p>
            //</blockquote>
            //<figcaption class="font-medium">
            //<div class="text-sky-500 dark:text-sky-400">
                //Sarah Dayan
            //</div>
            //<div class="text-slate-700 dark:text-slate-500">
                //Staff Engineer, Algolia
            //</div>
            //</figcaption>
        //</div>
        //</figure>
     );
}