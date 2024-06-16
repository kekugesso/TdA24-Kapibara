import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import minMax from 'dayjs/plugin/minMax.js';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { _reservation, tag } from '@/components/basic/lecturer';
import { useReservations } from './reservationContex';
import Dialog from './dialog';

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

class event {
  constructor(
    public uuid: string,
    public start: Date,
    public end: Date,
    public title: string,
    public location?: string,
    public isUnavailable?: boolean,
    public isMultipleDays?: boolean,
    public subjects?: tag[]
  ) { }
}

export default function CalendarGrid({ dates, initalEvents }:
  {
    dates: `${number}${number}${number}${number}-${number}${number}-${number}${number}`[],
    initalEvents: event[],
  }
) {
  const timeSlotColCount = 1;

  const splitEvents = useCallback((events: event[]) => {
    const result: event[] = [];
    events.forEach((event) => {
      const start = dayjs(event.start);
      const end = dayjs(event.end);
      const totalDays = end.startOf('day').diff(start.startOf('day'), 'day') + 1;

      for (let day = 0; day < totalDays; day++) {
        const currentStart = start.add(day, 'day').startOf('day').isAfter(start) ? start.add(day, 'day').startOf('day') : start;
        const currentEnd = day === totalDays - 1 ? end : currentStart.endOf('day');
        result.push({
          ...event,
          start: currentStart.toDate(),
          end: currentEnd.toDate(),
          isMultipleDays: totalDays > 1,
          isUnavailable: event.title === 'Unavailable',
        });
      }
    });
    return result;
  }, [dates]);

  const removeExeciveEveats = useCallback((events: event[]) => {
    const result: event[] = [];
    events.forEach((event) => {
      const date = dayjs(event.start).format('YYYY-MM-DD') as `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
      if (dates.includes(date)) {
        result.push(event);
      }
    });
    return result;
  }, [splitEvents]);

  const [events, setEvents] = useState<event[]>([]);

  useEffect(() => {
    setEvents(removeExeciveEveats(splitEvents(initalEvents)));
  }, [dates, initalEvents]);

  const [eventHovered, setEventHovered] = useState("");

  const getEventClassNames = useCallback(
    (event: event) => {
      const startDate = dayjs(event.start);
      const endDate = dayjs(event.end);
      const dateIndex = Math.max(
        0,
        dates.findIndex((date) =>
          date.startsWith(startDate.format('YYYY-MM-DD'))
        )
      );

      const startTimeIndex = timeSlots.indexOf(startDate.format('HH:mm'));
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
      // console.log(eventOrigin);
      return twMerge(
        'flex max-h-full flex-col break-words p-[7px_6px_5px] text-[13px] leading-[20px] no-underline transition-[background-color] hover:z-10 hover:h-min hover:max-h-none hover:min-h-full',
        generateColStartClass(timeSlotColCount + dateIndex),
        generateRowStartClass(startTimeIndex),
        generateRowSpanClass(totalRows),
        !event.isUnavailable ? 'bg-blue text-black' : 'bg-dark_blue text-white',
        eventOrigin(event.uuid).start.toUTCString() === event.start.toUTCString() ? 'rounded-t' : '',
        eventOrigin(event.uuid).end.toUTCString() === event.end.toUTCString() ? 'rounded-b' : ''
      );
    },
    [events, eventHovered]
  );

  const eventOrigin = (uuid: string) => initalEvents.find(e => e.uuid === uuid) as event;
  const reservationOrigin = (uuid: string) => reservations.find(e => e.uuid === uuid) as _reservation;

  const [selectedEvent, setSelectedEvent] = useState<_reservation | undefined>()
  const { reservations, deleteReservation } = useReservations();

  const handleEventClick = (reservation: _reservation) => {
    setSelectedEvent(reservation);
  }

  const handleEventClose = () => {
    setSelectedEvent(undefined);
  }
  const handleEventDelete = () => {
    if (selectedEvent) {
      deleteReservation(selectedEvent.uuid);
      setSelectedEvent(undefined);
    }
  }

  return (
    <div className="p-3">
      <div className="grid auto-rows-min grid-cols-[60px_repeat(5,_1fr)] gap-1">
        {dates.map((date, index) => (
          <div
            key={`date-${date}`}
            className={twMerge(
              'text-white col-span-1 p-2 text-center text-[13px] text-xs',
              generateColStartClass(timeSlotColCount + index)
            )}
          >
            {dayjs(date).format('dddd (DD.MM)')}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-flow-col grid-cols-[60px_repeat(5,_1fr)] grid-rows-[repeat(25,27px)] gap-1">
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
        {events.map((event: event) => (
          <button
            onClick={() => handleEventClick(reservationOrigin(event.uuid))}
            onMouseEnter={() => setEventHovered(event.uuid)}
            onMouseLeave={() => setEventHovered("")}
            style={
              {
                backgroundColor: eventHovered === event.uuid ? 'yellow' : '',
                color: eventHovered === event.uuid ? 'black' : ''
              }
            }
            key={`time-slot-event-${event.uuid}-${dayjs(event.start).toISOString()}`}
            className={getEventClassNames(event)}
          >
            <div className="min-h-0">{event.title}{event.location === 'Online' ? ' | 🌐💻' : ''}</div>
            {dayjs(event.end).diff(dayjs(event.start), 'minute') / 30 > 1 && (
              <div className="pt-1 text-[10px] overflow-hidden">
                {
                  event.isMultipleDays ?
                    dayjs(((initalEvents.find(e => e.uuid === event.uuid) as event) || event).start).format('HH:mm YYYY-MM-DD')
                    : dayjs(((initalEvents.find(e => e.uuid === event.uuid) as event) || event).start).format('HH:mm')
                } - {
                  event.isMultipleDays ?
                    dayjs(((initalEvents.find(e => e.uuid === event.uuid) as event) || event).end).format('HH:mm YYYY-MM-DD')
                    : dayjs(((initalEvents.find(e => e.uuid === event.uuid) as event) || event).end).format('HH:mm')
                }
              </div>
            )}
          </button>
        ))}
      </div>
      {selectedEvent && (
        <Dialog
          reservation={selectedEvent}
          closeDialog={handleEventClose}
          deleteReservation={handleEventDelete}
        />
      )}
    </div>
  );
}
