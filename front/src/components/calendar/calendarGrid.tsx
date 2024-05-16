import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import minMax from 'dayjs/plugin/minMax.js';
import { Route } from 'next';
import Link from 'next/link';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

const timeSlots = Array.from({ length: 27 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});
console.log(timeSlots);
const generateColStartClass = (index: number) => `col-start-[${index + 1}]`;
const generateColSpanClass = (index: number) => `col-end-[span_${index}]`;
const generateRowStartClass = (index: number) => `row-start-[${index + 1}]`;
const generateRowSpanClass = (index: number) => `row-end-[span_${index}]`;

type Props<RouteInferred extends string> = {
  dates: `${number}${number}${number}${number}-${number}${number}-${number}${number}`[];
  events: {
    id: number;
    start: Date;
    end: Date;
    title: string;
    href: Route<RouteInferred>;
    isSecondary?: boolean;
  }[];
};

export default function CalendarGrid<Route extends string>(props: Props<Route>) {
  const timeSlotColCount = 1;

  const events = props.events.map((event) => {
    const end = dayjs(event.end);
    return {
      ...event,
      start: dayjs(event.start),
      end: end,
      isMultiDay: end.diff(event.start, 'hour') >= 24,
    };
  });

  const getEventClassNames = useCallback(
    (event: (typeof events)[number]) => {
      const previousMultiDayEvents = events.filter(
        ({ isMultiDay }, index) => isMultiDay && index < events.indexOf(event),
      );
      const previousNonMultiDayEvents = events.filter(
        ({ isMultiDay }, index) => !isMultiDay && index < events.indexOf(event),
      );
      const isOverlappingNonMultiDay =
        !event.isMultiDay &&
        previousNonMultiDayEvents.reduce(
          (isEventOverlappingPreviousEvents, otherAppointment) => {
            return (
              isEventOverlappingPreviousEvents ||
              (event.start.isBefore(dayjs(otherAppointment.end)) &&
                event.end.isAfter(dayjs(otherAppointment.start)))
            );
          },
          false,
        );

      // Disallow negative index (if date outside of range, the
      // event should start at the first date in props.dates)
      const dateIndex = Math.max(
        0,
        props.dates.findIndex((date) =>
          date.startsWith(event.start.format('YYYY-MM-DD')),
        ),
      );

      return twMerge(
        'flex max-h-full flex-col break-words rounded p-[7px_6px_5px] text-[13px] leading-[20px] no-underline transition-[background-color] hover:z-10 hover:h-min hover:max-h-none hover:min-h-full',
        generateColStartClass(timeSlotColCount + dateIndex),
        event.isMultiDay &&
        generateColSpanClass(
          Math.min(
            props.dates.length - dateIndex,
            event.end.diff(
              dayjs.max(event.start, dayjs(props.dates[0])),
              'days',
            ),
          )
        ),
        generateRowStartClass(
          (event.isMultiDay
            ? previousMultiDayEvents.reduce((rowStart, multiDayEvent) => {
              // Move the event down a row if it overlaps with a previous event
              if (
                event.start.isBefore(dayjs(multiDayEvent.end)) &&
                event.end.isAfter(dayjs(multiDayEvent.start))
              ) {
                rowStart++;
              }
              return rowStart;
            }, 1)
            : timeSlots.indexOf(
              dayjs(event.start).format(
                'HH:mm',
              ) as (typeof timeSlots)[number],
            ))
        ),
        !event.isMultiDay &&
        generateRowSpanClass(
          (event.end.diff(event.start, 'minute') /
            30)
        ),
        !event.isSecondary
          ? 'bg-blue text-white hover:bg-yellow'
          : 'bg-dark_blue text-white hover:bg-yellow',
        isOverlappingNonMultiDay &&
        'w-[75%] ml-[25%] border border-white text-right z-20 hover:z-30',
      );
    },
    [props.dates, events, timeSlotColCount],
  );

  return (
    <div className="p-3 min-w-[650px]">
      <div className="grid auto-rows-[32px] grid-cols-[60px_repeat(5,_1fr)] gap-1 col-end-[span_1]">
        {props.dates.map((date, index) => {
          return (
            <div
              key={`date-${date}`}
              className={twMerge(
                'text-darkGray col-span-1 p-2 text-center text-[13px] text-xs',
                generateColStartClass(timeSlotColCount + index)
                ,
              )}
            >
              {date}
            </div>
          );
        })}

        {events
          .filter(({ isMultiDay }) => isMultiDay)
          .map((event) => {
            return (
              <Link
                key={`event-${event.id}`}
                href={event.href}
                className={twMerge(
                  getEventClassNames(event),
                  dayjs(props.dates[0]).startOf('day').isAfter(event.start) &&
                  'rounded-l-none ',
                  dayjs(props.dates[props.dates.length - 1])
                    .add(1, 'day')
                    .startOf('day')
                    .isBefore(event.end) && 'rounded-r-none ',
                )}
              >
                {event.title}
              </Link>
            );
          })}
      </div>

      <div className="mt-1 grid grid-cols-[60px_repeat(5,_1fr)] grid-rows-[repeat(24,32px)] gap-1">
        {timeSlots.map((time, index) => {
          return (
            <div
              key={`time-slot-${time}`}
              className={twMerge(
                generateRowStartClass(index),
                'text-darkGray translate-y-[-16px] text-xs leading-[30px]',
              )}
            >
              {time.endsWith('30') ? <>&nbsp;</> : time}
            </div>
          );
        })}

        {events
          .filter((event) => {
            const hours = event.end.diff(event.start, 'hour');
            return hours < 24;
          })
          .map((event) => {
            return (
              <Link
                key={`time-slot-event-${event.id}`}
                href={event.href}
                className={getEventClassNames(event)}
              >
                <div className="min-h-0 overflow-hidden">{event.title}</div>
                {event.end.diff(event.start, 'minute') / 30 > 1 && (
                  <div className="pt-1 text-[10px]">
                    {dayjs(event.start).format('HH:mm')} -{' '}
                    {dayjs(event.end).format('HH:mm')}
                  </div>
                )}
              </Link>
            );
          })}
      </div>
    </div>
  );
}

