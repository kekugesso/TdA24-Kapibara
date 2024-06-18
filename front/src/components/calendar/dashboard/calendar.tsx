import React, { useState, useCallback, useMemo } from "react";
import { _reservation, status, tag } from "@/components/basic/lecturer";
import CalendarGrid from "@/components/calendar/dashboard/calendarGrid";
import dayjs from "dayjs";
import Upcoming from "./upcoming";
import ReservationModal from "./reservationModal";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@/components/basic/icons";
import { useReservations } from "./reservationContex";

export default function Calendar({ subjects }: { subjects: tag[] }) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const { reservations, addReservation } = useReservations();

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
    [reservations],
  )

  const generateWorkWeek = useCallback((weeksOffset = 0) => {
    const startOfWeek = dayjs().startOf('week').add(weeksOffset, 'week');
    const workWeek = [];
    for (let i = 0; i < 5; i++)
      workWeek.push(startOfWeek.add(i + 1, 'day').format('YYYY-MM-DD'));
    return workWeek;
  }, [weekOffset]);

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

  const checkValidTimeUnavailable = (reservation: _reservation) => {
    const start = reservation.start_time;
    const end = reservation.end_time;
    if (start >= end) return false;
    if (start < new Date()) return false;
    if (start.getHours() < 8 || start.getHours() > 20) return false;
    if (end.getHours() < 9 || end.getHours() > 20) return false;
    if (start.getMinutes() !== 0 || end.getMinutes() !== 0) return false;
    if (start.getSeconds() !== 0 || end.getSeconds() !== 0) return false;
    return true;
  }

  const checkValidDate = (reservation: _reservation) => {
    const start = reservation.start_time;
    const end = reservation.end_time;
    if (start >= end) return false;
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
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(student.email)) return false;
    if (!/^\+[1-9]{1}[0-9]{3,14}$/.test(student.phone)) return false;
    return true;
  }

  const checkValidReservation = (reservation: _reservation) => {
    class validation {
      constructor(
        public valid: boolean,
        public message: string,
      ) { }
    }
    if (reservation.status === status.Reserved) {
      if (!checkStudentFields(reservation)) return new validation(false, 'Invalid student information');
      if (!checkValidTime(reservation)) return new validation(false, 'Invalid time');
      if (checkReservationOverlap(reservation)) return new validation(false, 'Reservation overlap');
      if (reservation.subject.length === 0) return new validation(false, 'No subject selected');
      return new validation(true, '');
    } else {
      if (!checkValidTimeUnavailable(reservation)) return new validation(false, 'Invalid time');
      if (!checkValidDate(reservation)) return new validation(false, 'Invalid date');
      return new validation(true, '');
    }
  }


  const calendarTitle = useCallback(() => {
    const startOfWeek = dayjs().startOf('week').add(1, 'day').add(weekOffset, 'week');
    const endOfWeek = startOfWeek.add(5, 'day');
    return `${startOfWeek.format('DD.MM.YYYY')} - ${endOfWeek.format('DD.MM.YYYY')}`;
  }, [weekOffset]);

  return (
    <div className="my-4 flex gap-4 w-full mx-5 flex-col sm:flex-row">
      <div className="border-jet dark:border-white dark:rounded-lg border-2 text-black w-full">
        <div className="flex-1">
          <div className="flex items-center justify-between bg-gray-200 p-2">
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
            addReservation(reservation);
            setOpenModal(false);
          }}
          checkValidation={checkValidReservation}
        />
      </div>
      <Upcoming />
    </div>
  );
}
