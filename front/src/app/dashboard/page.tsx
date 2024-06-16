'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Protected from '@/components/auth/protected';
import { _reservation, tag } from '@/components/basic/lecturer';
import Calendar from '@/components/calendar/dashboard/calendar';
import Loading from '@/components/basic/loading';
import { ReservationsProvider } from '@/components/calendar/dashboard/reservationContex';

export default function Dashboard() {
  const router = useRouter();
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [reservations, setReservations] = useState<_reservation[]>();
  const [subjects, setSubjects] = useState<tag[]>([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      Protected("reservations?format=json")
        .then((data: _reservation[]) => {
          if (data === undefined || data === null) {
            router.push('/login');
          }
          setReservations(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
      Protected("token?format=json")
        .then((data: tag[]) => {
          setSubjects(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  // console.log(reservations);

  return (
    isloading ? <Loading /> :
      reservations &&
      <ReservationsProvider initialReservations={reservations}>
        <Calendar subjects={subjects ? subjects : []} />
      </ReservationsProvider>
  );
}
