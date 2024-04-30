import React, { useRef, useEffect } from "react";
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import moment from 'moment';
import { reservation } from "./lecturer";

export default function CalendarFrame({ classes, reservations }: { classes: string, reservations: reservation[] }) {
  const calendarRef = useRef<any>(null);

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
  };

  return (
    <div className={classes}>
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
        <Calendar ref={calendarRef} {...calendarOptions} />
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
