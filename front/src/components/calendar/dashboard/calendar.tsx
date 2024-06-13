import React, { useEffect, useState, useCallback, useMemo } from "react";
import { _reservation, tag } from "@/components/basic/lecturer";
import CalendarGrid from "@/components/calendar/dashboard/calendarGrid";
import dayjs from "dayjs";
import Upcoming from "./upcoming";
import ReservationModal from "./reservationModal";

export default function Calendar({ _reservations, subjects }: { _reservations: _reservation[], subjects: tag[] }) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [reservations, setReservations] = useState<_reservation[] | undefined>(_reservations);
  useEffect(() => {
    setReservations(_reservations);
  }, [_reservations]);

  const events = useMemo(
    () => {
      if (!reservations) return [];
      return reservations.map(reservation => ({
        uuid: reservation.uuid,
        title: reservation.status,
        start: dayjs(reservation.start_time).toDate(),
        end: dayjs(reservation.end_time).toDate(),
        location: reservation.location,
        subjects: reservation.subject,
      }));
    },
    [_reservations],
  )
  const generateWorkWeek = useCallback((weeksOffset = 0) => {
    const startOfWeek = dayjs().startOf('week').add(weeksOffset, 'week');
    const workWeek = [];
    for (let i = 0; i < 5; i++)
      workWeek.push(startOfWeek.add(i + 1, 'day').format('YYYY-MM-DD'));
    return workWeek;
  }, [weekOffset]);

  const sendReservation = async (reservation: _reservation) => {
    const response = await fetch('/api/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...reservation,
        lecturer_uuid: lecturer_uuid,
      }),
    });
    const newReservation = await response.json().then((data) => {
      return data as _reservation;
    });
    setReservations(prevReservations => [...prevReservations, newReservation]);
    if (!response.ok) {
      throw new Error('Failed to create reservation');
    }
  }

  const checkValidTime = (reservation: _reservation) => {
    const start = reservation.start_time;
    const end = reservation.end_time;
    if (start >= end) return false;
    if (start < new Date()) return false;
    if (start.getHours() < 8 || start.getHours() > 20) return false;
    if (end.getHours() < 9 || end.getHours() > 20) return false;
    if (start.getMinutes() !== 0 || end.getMinutes() !== 0) return false;
    if (start.getSeconds() !== 0 || end.getSeconds() !== 0) return false;
    if (start.getDay() === 0 || start.getDay() === 6) return false;
    return true;
  }

  const checkReservationOverlap = (reservation: _reservation) => {
    if (!reservations) return false;
    for (const res of reservations) {
      if (reservation.start_time >= res.end_time || reservation.end_time <= res.start_time) {
        continue;
      }
      return true;
    }
    return false;
  }

  const checkStudentFields = (reservation: _reservation) => {
    const student = reservation.student;
    if (!student.first_name || !student.last_name || !student.email || !student.phone) return false;
    if (!student.email.includes('@')) return false;
    if (!/^\d+$/.test(student.phone)) return false;
    return true;
  }

  const checkValidReservation = (reservation: _reservation) => {
    class validation {
      constructor(
        public valid: boolean,
        public message: string,
      ) { }
    }
    if (!checkStudentFields(reservation)) return new validation(false, 'Invalid student information');
    if (!checkValidTime(reservation)) return new validation(false, 'Invalid time');
    if (checkReservationOverlap(reservation)) return new validation(false, 'Reservation overlap');
    if (reservation.subject.length === 0) return new validation(false, 'No subject selected');
    return new validation(true, '');
  }


  const calendarTitle = useCallback(() => {
    const startOfWeek = dayjs().startOf('week').add(weekOffset, 'week');
    const endOfWeek = startOfWeek.add(4, 'day');
    return `${startOfWeek.format('DD.MM.YYYY')} - ${endOfWeek.format('DD.MM.YYYY')}`;
  }, [weekOffset]);

  return (
    <div className="my-4 flex gap-4 w-full mx-5 flex-col sm:flex-row">
      <div className="border-white rounded-lg border-2 text-black w-full">
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
              <button onClick={() => setOpenModal(true)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
                <PlusIcon className="w-5 h-5 text-black/50 dark:text-black/40" />
              </button>
            </div>
          </div>
          <CalendarGrid
            dates={
              generateWorkWeek(weekOffset) as `${number}${number}${number}${number}-${number}${number}-${number}${number}`[]
            }
            initalEvents={events}
          />
        </div>
        <ReservationModal
          open={openModal}
          _onClose={() => setOpenModal(false)}
          lecturer_subjects={subjects}
          onReservationCreated={(reservation: _reservation) => {
            sendReservation(reservation);
            setOpenModal(false);
          }}
          checkValidation={checkValidReservation}
        />
      </div>
      <Upcoming _reservations={reservations ? reservations : []} />
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

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5V19M5 12H19" />
    </svg>
  );
}
