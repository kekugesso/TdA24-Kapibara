export default function Calendar({ mode, classes }: { mode: string, classes: string }) {
  function getMode(mode: string): boolean {
    if (mode === "simple") {
      return false;
    } else if (mode === "full") {
      return true;
    } else {
      // Handle invalid mode
      throw new Error("Invalid mode specified");
    }
  }
  const full = getMode(mode);
  return (
    <div className={classes}>
      <br />
      Calendar
      {full && (<div>studentinfo</div>)}
      <br />
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black">April 2023</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
            </button>
            <button className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
              <ChevronRightIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          <div className="text-center text-sm font-medium text-black/50 dark:text-black/40">Sun</div>
          <div className="text-center text-sm font-medium text-black/50 dark:text-black/40">Mon</div>
          <div className="text-center text-sm font-medium text-black/50 dark:text-black/40">Tue</div>
          <div className="text-center text-sm font-medium text-black/50 dark:text-black/40">Wed</div>
          <div className="text-center text-sm font-medium text-black/50 dark:text-black/40">Thu</div>
          <div className="text-center text-sm font-medium text-black/50 dark:text-black/40">Fri</div>
          <div className="text-center text-sm font-medium text-black/50 dark:text-black/40">Sat</div>
        </div>
      </div>
    </div>

  );
}

function ChevronLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}


function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
