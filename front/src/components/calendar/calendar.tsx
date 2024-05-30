import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { reservation } from "@/components/basic/lecturer";
import CalendarGrid from "@/components/calendar/calendarGrid";
import dayjs from "dayjs";

export default function Calendar({ reservations, lecturer_uuid }: { reservations: reservation[], lecturer_uuid: string }) {
  // const calendarRef = useRef<any>(null);
  const [weekOffset, setWeekOffset] = useState<number>(-4);

  const events = useMemo(
    () => {
      return reservations.map(reservation => ({
        uuid: reservation.uuid,
        title: reservation.status,
        start: reservation.start_time,
        end: reservation.end_time,
        location: reservation.location,
        subjects: reservation.subject,
      }));
    },
    [reservations],
  )

  const generateWorkWeek = useCallback((weeksOffset = 0) => {
    const startOfWeek = dayjs().startOf('week').add(weeksOffset, 'week');
    const workWeek = [];
    for (let i = 0; i < 5; i++)
      workWeek.push(startOfWeek.add(i + 1, 'day').format('YYYY-MM-DD'));
    return workWeek;
  }, [weekOffset]);

  const calendarTitle = useCallback(() => {
    const startOfWeek = dayjs().startOf('week').add(weekOffset, 'week');
    const endOfWeek = startOfWeek.add(4, 'day');
    return `${startOfWeek.format('DD.MM.YYYY')} - ${endOfWeek.format('DD.MM.YYYY')}`;
  }, [weekOffset]);

  return (
    <div className="mt-4 border-white rounded-lg border-2 text-black hidden sm:block">
      <div className="flex-1">
        <div className="flex items-center justify-between bg-white p-2">
          <h2 className="text-2xl font-bold text-black">{calendarTitle()}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
            </button>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
              <ChevronRightIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
            </button>
          </div>
        </div>
        <CalendarGrid
          dates={
            generateWorkWeek(weekOffset) as `${number}${number}${number}${number}-${number}${number}-${number}${number}`[]
          }
          initalEvents={events}
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
