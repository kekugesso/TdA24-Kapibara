import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import minMax from 'dayjs/plugin/minMax.js';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { start } from 'repl';
import { twMerge } from 'tailwind-merge';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

const timeSlots = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const generateColStartClass = (index: number) => `col-start-[${index + 1}]`;
const generateRowStartClass = (index: number) => `row-start-[${index + 1}]`;
const generateRowSpanClass = (span: number) => `row-end-[span_${span}]`;

type Props<RouteInferred extends string> = {
  dates: `${number}${number}${number}${number}-${number}${number}-${number}${number}`[];
  events: {
    id: number;
    start: Date;
    end: Date;
    title: string;
    href: string;
    isSecondary?: boolean;
  }[];
};

export default function CalendarGrid<Route extends string>(props: Props<Route>) {
  const timeSlotColCount = 1;

  const splitEvents = useCallback((events) => {
    const result = [];
    events.forEach((event) => {
      const start = dayjs(event.start);
      const end = dayjs(event.end);
      const totalDays = Math.max(
        1,
        props.dates.findIndex((date) =>
          date.startsWith(end.format('YYYY-MM-DD'))) -
        Math.max(0,
          props.dates.findIndex((date) => date.startsWith(start.format('YYYY-MM-DD')))
        ) + 1
      );

      for (let day = 0; day < totalDays; day++) {
        const currentStart = start.add(day, 'day').startOf('day').isAfter(start) ? start.add(day, 'day').startOf('day') : start;
        const currentEnd = day === totalDays - 1 ? end : currentStart.endOf('day');
        result.push({
          ...event,
          start: currentStart.toDate(),
          end: currentEnd.toDate(),
          isMultiDay: totalDays > 1,
        });
      }
    });
    return result;
  }, []);

  const events = splitEvents(props.events);

  const getEventClassNames = useCallback(
    (event) => {
      const startDate = dayjs(event.start);
      const endDate = dayjs(event.end);
      const dateIndex = Math.max(
        0,
        props.dates.findIndex((date) =>
          date.startsWith(startDate.format('YYYY-MM-DD'))
        )
      );

      const startTimeIndex = timeSlots.indexOf(startDate.format('HH:mm'));
      const durationInHours = endDate.diff(startDate, 'hour', true);
      const totalRows = (() => {
        let start = 0;
        let end = 0;
        if (startDate.hour() < 8) {
          start = 8 * 2;
        } else {
          start = startDate.hour() * 2 + (startDate.minute() === 30 ? 1 : 0);
        }
        if (endDate.hour() > 20) {
          end = 20 * 2 + (endDate.minute() > 30 ? 1 : 0);
        } else {
          end = endDate.hour() * 2 + (endDate.minute() === 30 ? 1 : 0);
        }
        return Math.max(end - start, 1);
      })();

      Math.max(Math.ceil(durationInHours * 2), 1);

      return twMerge(
        'flex max-h-full flex-col break-words rounded p-[7px_6px_5px] text-[13px] leading-[20px] no-underline transition-[background-color] hover:z-10 hover:h-min hover:max-h-none hover:min-h-full',
        generateColStartClass(timeSlotColCount + dateIndex),
        generateRowStartClass(startTimeIndex),
        generateRowSpanClass(totalRows),
        !event.isSecondary ? 'bg-blue text-black' : 'bg-dark_blue text-white',
      );
    },
    [props.dates]
  );

  let [eventHovered, setEventHovered] = useState(0);

  return (
    <div className="p-3 min-w-[650px]">
      <div className="grid auto-rows-[32px] grid-cols-[60px_repeat(5,_1fr)] gap-1">
        {props.dates.map((date, index) => (
          <div
            key={`date-${date}`}
            className={twMerge(
              'text-white col-span-1 p-2 text-center text-[13px] text-xs',
              generateColStartClass(timeSlotColCount + index)
            )}
          >
            {date}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-flow-col grid-cols-[60px_repeat(5,_1fr)] grid-rows-[repeat(25,32px)] gap-1">
        {timeSlots.map((time, index) => (
          <div
            key={`time-slot-${time}`}
            className={twMerge(
              generateRowStartClass(index),
              'text-white translate-y-[-16px] text-xs leading-[30px]'
            )}
          >
            {time.endsWith('30') ? <>&nbsp;</> : time}
          </div>
        ))}
        {events.map((event) => (
          <Link
            onMouseEnter={() => { setEventHovered(event.id) }}
            onMouseLeave={() => { setEventHovered(0) }}
            style={{ backgroundColor: eventHovered === event.id ? 'yellow' : '', color: eventHovered === event.id ? 'black' : '' }}
            key={`time-slot-event-${event.id}-${dayjs(event.start).toISOString()}`}
            href={event.href}
            className={getEventClassNames(event)}
          >
            <div className="min-h-0 overflow-hidden">{event.title}</div>
            {dayjs(event.end).diff(dayjs(event.start), 'minute') / 30 > 1 && (
              <div className="pt-1 text-[10px]">
                {dayjs(props.events.find(e => e.id === event.id).start).format('HH:mm DD-MM-YYYY')} - {dayjs(props.events.find(e => e.id === event.id).end).format('HH:mm DD-MM-YYYY')}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
