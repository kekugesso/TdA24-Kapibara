import React, { Fragment, useState } from "react";
import { reservation } from "./lecturer";

export default function Calendar({ classes, reservations }: { classes: string, reservations: reservation[] }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  {/*TODO: fix the rendering of reservations/events*/ }
  {/*TODO: fix the day description*/ }
  {/*TODO: make reservations as the list to display the events*/ }
  {/*TODO: make button to add reservations*/ }
  const events = [
    { startDateTime: new Date(2023, 3, 3, 10, 0), endDateTime: new Date(2023, 3, 3, 11, 0), title: 'Meeting with Client' },
    { startDateTime: new Date(2023, 3, 8, 14, 0), endDateTime: new Date(2023, 3, 8, 15, 0), title: 'Team Standup' },
    { startDateTime: new Date(2023, 3, 15, 11, 30), endDateTime: new Date(2023, 3, 15, 12, 30), title: 'Project Presentation' },
  ];

  const getStartOfWeek = (date: Date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const renderEvents = (day: Date) => {
    const dayEvents = events.filter((event) => {
      const eventDate = event.startDateTime.getDate();
      return eventDate === day.getDate();
    });
    return dayEvents.map((event, index) => (
      <div key={index} className="text-xs">
        <span className="font-bold">
          {event.startDateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          -
          {event.endDateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </span> - {event.title}
      </div>
    ));
  };

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek + 1);
  };

  const currentDate = new Date();
  const startDateOfWeek = getStartOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (currentWeek * 7)));

  return (
    <div className={classes}>
      <br />
      <div className="bg-white rounded-lg shadow-lg p-6 flex">
        {/* Calendar section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">{startDateOfWeek.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevWeek} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
                <ChevronLeftIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
              </button>
              <button onClick={handleNextWeek} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
                <ChevronRightIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 grid-rows-[repeat(14,_minmax(0,_1fr))] grid-flow-col gap-2">
            {[...Array(5)].map((_, day) => (
              <Fragment key={startDateOfWeek.getDate() + day + "." + startDateOfWeek.getMonth()}>
                <div className="text-xs font-medium mb-1">{startDateOfWeek.getDate() + day}.{startDateOfWeek.getMonth()}</div>
                {[...Array(13)].map((_, hour) => (
                  <div key={hour + ":00 " + day} className="border border-gray-200 rounded p-2">
                    <div className="text-xs text-gray-500">{hour + 8}:00</div>
                    {renderEvents(new Date(startDateOfWeek.getFullYear(), startDateOfWeek.getMonth(), startDateOfWeek.getDate() + day))}
                  </div>
                ))}
              </Fragment>
            ))}

          </div>
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
  );
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
  );
}
