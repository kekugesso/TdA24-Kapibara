'use client';

import { _reservation } from "@/components/basic/lecturer";
import { useCallback, useState } from "react";
import DialogUpcoming from "./dialog";
import dayjs from "dayjs";

export default function Upcoming({ _reservations }: { _reservations: _reservation[] }) {
  const [selectedEvent, setSelectedEvent] = useState<_reservation>()
  const reservations = _reservations.filter((reservation) => dayjs(reservation.start_time).isAfter(dayjs()));
  const reservationDate = useCallback((reservation: _reservation) => {
    return `${dayjs(reservation.start_time).format('MMMM D, YYYY')} | ${dayjs(reservation.start_time).format('h:mm A')} - ${dayjs(reservation.end_time).format('h:mm A')}`;
  }, [reservations]);
  const handleEventClick = (reservation: _reservation) => {
    setSelectedEvent(reservation);
  }

  const handleEventClose = () => {
    setSelectedEvent(undefined);
  }

  return (
    <div className="border-white rounded-lg border-2 text-white w-full sm:w-[40%]">
      <div className="flex-1">
        <div className="flex items-center justify-between bg-white p-3">
          <h2 className="text-2xl font-bold text-black">Nadcházející rezervace</h2>
        </div>
      </div>
      <div className="flex flex-col gap-2 h-full">
        {reservations
          .filter((reservation) => dayjs(reservation.start_time).isAfter(dayjs()))
          .filter((reservation) => reservation.status === "Reserved")
          .length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <h3 className="text-lg text-center">Žádné nadchazející rezervace</h3>
          </div>
        ) : (
          <div className="h-[80vh] overflow-auto">
            <div className="p-6 space-y-4">
              {reservations
                .filter((reservation) => dayjs(reservation.start_time).isAfter(dayjs()))
                .filter((reservation) => reservation.status === "Reserved")
                .sort((a, b) => dayjs(a.start_time).isAfter(dayjs(b.start_time)) ? 1 : -1)
                .map((reservation: _reservation) => (
                  <div
                    key={`Upcoming_event_${reservation.uuid}`}
                    className={`flex flex-col gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-4 rounded-md transition-colors ${reservation.location === "Online" ? "border-2 border-blue-500" : ""
                      }`}
                    onClick={() => handleEventClick(reservation)}
                  >
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{reservationDate(reservation)}</div>
                    <h3 className="text-base font-semibold">{reservation.status}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{reservation.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {reservation.subject.map((subject) => (
                        <span key={subject.uuid}>{subject.name}</span>
                      ))}
                    </div>
                    {reservation.location === "Online" ? <div className="text-sm font-medium text-blue-500">Online</div> : <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Offline</div>}
                  </div>
                ))}
            </div>
            {// <DialogUpcoming reservation={selectedEvent} closeDialog={handleEventClose} />
            }
          </div>
        )
        }
      </div>
    </div>
  );
}
