import React, { useRef, useEffect } from "react";
import { reservation } from "@/components/basic/lecturer";
import CalendarGrid from "@/components/calendar/calendarGrid";

export default function Calendar({ reservations }: { reservations: reservation[] }) {
  /*const calendarRef = useRef<any>(null);

  useEffect(() => {
    setCalendarTitle();
  }, []);

  const initialEvents = reservations.map(reservation => ({
    uuid: reservation.uuid,
    title: reservation.status,
    start: reservation.start_time,
    end: reservation.end_time,
  }));

  const calendarOptions = {
    usageStatistics: false,
    useFormPopup: true,
    useDetailPopup: true,
    events: initialEvents,
    height: '800px',
    view: 'week',
    week: {
      startDayOfWeek: 1,
      dayNames: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
      workweek: true,
      hourStart: 8,
      hourEnd: 20,
      EventView: false,
      TaskView: false,
      narrowWeekend: true,
    },
  };

  const handleClickBackButton = () => {
    const calendarInstance = calendarRef.current.getInstance();
    if (calendarInstance) {
      calendarInstance.prev();
      setCalendarTitle();
    }
  };

  const setCalendarTitle = () => {
    const calendarInstance = calendarRef.current.getInstance();
    if (calendarInstance) {
      const titleObj = document.getElementById('CalendarTitle');
      titleObj.innerText = moment(calendarInstance.getDateRangeStart() + 0).format('YYYY MMMM DD') + " - " + moment(calendarInstance.getDateRangeEnd() + 0).format('YYYY MMMM DD');
    }
  };

  const handleClickNextButton = () => {
    const calendarInstance = calendarRef.current.getInstance();
    if (calendarInstance) {
      calendarInstance.next();
      setCalendarTitle();
    }
  };*/
  const events = [
    {
      id: 1,
      start: new Date('2023-09-04T09:00:00'),
      end: new Date('2023-09-04T10:00:00'),
      title: 'Project Kickoff Meeting',
      href: '/project/meeting/1',
    },
    {
      id: 6,
      start: new Date('2023-09-04T12:00:00'),
      end: new Date('2023-09-04T14:30:00'),
      title: 'Creative Workshop',
      href: '/workshop/creative',
    },
    {
      id: 7,
      start: new Date('2023-09-04T15:30:00'),
      end: new Date('2023-09-04T19:30:00'),
      title: 'Innovation Seminar',
      href: '/seminar/innovation',
    },
    {
      id: 8,
      start: new Date('2023-09-05T10:30:00'),
      end: new Date('2023-09-05T12:30:00'),
      title: 'Product Presentation',
      href: '/presentation/product',
    },
    // Day 3 (2023-09-06)
    {
      id: 9,
      start: new Date('2023-09-05T15:00:00'),
      end: new Date('2023-09-05T16:30:00'),
      title: 'Team Meeting',
      href: '/meeting/team',
    },
    {
      id: 10,
      start: new Date('2023-09-06T09:30:00'),
      end: new Date('2023-09-06T11:30:00'),
      title: 'Brainstorming Session',
      href: '/session/brainstorming',
    },
    {
      id: 22,
      start: new Date('2023-09-06T11:30:00'),
      end: new Date('2023-09-06T18:00:00'),
      title: 'Team Training',
      href: '/training/team',
    },
    {
      id: 25,
      start: new Date('2023-09-06T18:00:00'),
      end: new Date('2023-09-08T14:30:00'),
      title: 'Afternoon Training',
      href: '/training/afternoon',
      isSecondary: true,
    },
  ];

  return (
    <div className="mt-4 border-white rounded-lg border-2 text-black">
      <div className="flex-1">
        {/*<div className="flex items-center justify-between mb-4">
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
        <CalendarGrid ref={calendarRef} />*/}
        <CalendarGrid
          dates={[
            '2023-09-04',
            '2023-09-05',
            '2023-09-06',
            '2023-09-07',
            '2023-09-08',
          ]}
          events={events}
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
