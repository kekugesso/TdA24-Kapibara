import { _reservation } from "@/components/basic/lecturer";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { ExIcon } from "@/components/basic/icons";

export default function Dialog({ reservation, closeDialog, deleteReservation }: { reservation: _reservation, closeDialog: () => void, deleteReservation: (uuid: string) => void }) {
  const [selectedEvent, setSelectedEvent] = useState<_reservation>(reservation);

  const selectedEventDate = useCallback(() => {
    return `${dayjs(selectedEvent.start_time).format('MMMM D, YYYY')} | ${dayjs(selectedEvent.start_time).format('h:mm A')} - ${dayjs(selectedEvent.end_time).format('h:mm A')}`;
  }, [selectedEvent]);

  useEffect(() => {
    if (reservation !== undefined)
      setSelectedEvent(reservation);
  }, [reservation]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeDialog();
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white p-5 rounded-lg shadow-lg relative text-black">
        {/* HEADER */}
        <header className="mb-3">
          <div className="inline text-2xl font-semibold leading-none tracking-tight justify-between">
            {selectedEvent.status} - {selectedEvent.location === "Offline" && (
              <div className="inline text-dark_blue font-medium">
                Offline
              </div>
            )}
            {selectedEvent.location === "Online" && (
              <div className="inline text-dark_blue font-medium">
                Online
              </div>
            )}
          </div>
          <button
            onClick={closeDialog}
            className="inline float-end text-gray-500 hover:text-gray-800"
          >
            <ExIcon className="w-7 h-7" />
          </button>
          <div className="text-sm text-muted-foreground">{selectedEventDate()}</div>
        </header>
        {/* BODY */}
        <div className="flex w-full flex-col">
          <div className="text-xl font-semibold">{`${selectedEvent.student.first_name} ${selectedEvent.student.last_name}`}</div>
          <div className="text-sm text-muted-foreground">{selectedEvent.student.email}</div>
          <div className="text-sm text-muted-foreground">{selectedEvent.student.phone}</div>
          <div className="flex flex-wrap">
            {selectedEvent.description}
          </div>
          <div className="flex flex-wrap">
            {selectedEvent.subject.map((subject, index) => (
              <span key={index} className="text-sm text-gray-500 dark:text-gray-400">
                #{subject.name}
              </span>
            ))}
          </div>
        </div>
        {/* FOOTER */}
        <footer className="flex mt-3 w-full ">
          <button
            onClick={() => deleteReservation(selectedEvent.uuid)}
            className="text-red-500 hover:text-red-800 bg-red-100 hover:bg-red-200 rounded-md px-5 py-2 text-sm font-medium"
          >
            Smazat
          </button>
          <button
            onClick={closeDialog}
            className="ml-auto text-gray-500 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md px-5 py-2 text-sm font-medium"
          >
            Zavřít
          </button>
        </footer>
      </div>
    </div>
  )
}

