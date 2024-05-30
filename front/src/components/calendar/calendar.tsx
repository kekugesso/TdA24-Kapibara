import React, { useRef, useEffect, useState } from "react";
import { reservation } from "@/components/basic/lecturer";
import CalendarGrid from "@/components/calendar/calendarGrid";
import dayjs from "dayjs";

export default function Calendar({ reservations, lecturer_uuid }: { reservations: reservation[], lecturer_uuid: string }) {
  const calendarRef = useRef<any>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const events = reservations.map(reservation => ({
    uuid: reservation.uuid,
    title: reservation.status,
    start: reservation.start_time,
    end: reservation.end_time,
  }));

  const generateWorkWeek = (weeksOffset = 0) => {
    const startOfWeek = dayjs().startOf('week').add(weeksOffset, 'week');
    const workWeek = [];

    for (let i = 0; i < 5; i++) { // Only include weekdays (5 days)
      workWeek.push(startOfWeek.add(i + 1, 'day').format('YYYY-MM-DD') as `${number}${number}${number}${number}-${number}${number}-${number}${number}`);
    }

    return workWeek;
  };

  const handleClickBackButton = () => {
    setWeekOffset(weekOffset - 1);
    // setCalendarTitle();
  };

  const handleClickNextButton = () => {
    setWeekOffset(weekOffset + 1);
    // setCalendarTitle();
  };
  // const setCalendarTitle = () => {
  //     const titleObj = document.getElementById('CalendarTitle');
  //     titleObj.innerText = moment(calendarInstance.getDateRangeStart() + 0).format('YYYY MMMM DD') + " - " + moment(calendarInstance.getDateRangeEnd() + 0).format('YYYY MMMM DD');
  //   }
  // };

  // const events = [
  //   {
  //     uuid: "605babb7-36d2-4eb5-9023-5e4e17d441b7",
  //     start: new Date('2023-09-04T09:00:00'),
  //     end: new Date('2023-09-04T10:00:00'),
  //     title: 'Project Kickoff Meeting',
  //   },
  //   {
  //     uuid: "e90a9647-fad6-4345-a33b-a1179529cf36",
  //     start: new Date('2023-09-04T12:00:00'),
  //     end: new Date('2023-09-04T14:30:00'),
  //     title: 'Creative Workshop',
  //   },
  //   {
  //     uuid: "bafaabd7-9ed9-4a68-b562-fa506ee770ca",
  //     start: new Date('2023-09-04T15:30:00'),
  //     end: new Date('2023-09-04T19:30:00'),
  //     title: 'Innovation Seminar',
  //   },
  //   {
  //     uuid: "95ac5899-2dae-4031-8ac2-793eb36748a2",
  //     start: new Date('2023-09-05T10:30:00'),
  //     end: new Date('2023-09-05T12:30:00'),
  //     title: 'Product Presentation',
  //   },
  //   // Day 3 (2023-09-06)
  //   {
  //     uuid: "c827507b-9ce7-4a3f-95c4-505069367fe9",
  //     start: new Date('2023-09-05T15:00:00'),
  //     end: new Date('2023-09-05T16:30:00'),
  //     title: 'Team Meeting',
  //   },
  //   {
  //     uuid: "dded1b4e-a862-4a78-85c2-5111f1de624e",
  //     start: new Date('2023-09-06T09:30:00'),
  //     end: new Date('2023-09-06T11:30:00'),
  //     title: 'Brainstorming Session',
  //   },
  //   {
  //     uuid: "3ee906fa-982d-4578-ae46-c32eca8b3c96",
  //     start: new Date('2023-09-06T11:30:00'),
  //     end: new Date('2023-09-06T18:00:00'),
  //     title: 'Team Training',
  //   },
  //   {
  //     uuid: "98352922-65b2-47bc-bebd-a9072240333a",
  //     start: new Date('2023-09-06T18:00:00'),
  //     end: new Date('2023-09-08T14:30:00'),
  //     title: 'Afternoon Training',
  //     isUnavailable: true,
  //   },
  // ];
  //
  return (
    <div className="mt-4 border-white rounded-lg border-2 text-black">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black" id="CalendarTitle"></h2>
          <div className="flex items-center gap-2">
            <button onClick={handleClickBackButton} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
            </button>
            <button onClick={handleClickNextButton} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
              <ChevronRightIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
            </button>
          </div>
        </div>
        <CalendarGrid
          dates={generateWorkWeek(weekOffset)}
          events={events}
          lecturer_uuid={lecturer_uuid}
        />
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
