'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Protected from '@/components/auth/protected';
import { reservation } from '@/components/basic/lecturer';
import Calendar from '@/components/calendar/dashboard/calendar';
import Loading from '@/components/basic/loading';

export default function Dashboard() {
  const router = useRouter();
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [reservations, setReservations] = useState<reservation[]>();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      Protected("reservations?format=json")
        .then((data: reservation[]) => {
          if (data === undefined || data === null) {
            router.push('/login');
          }
          setReservations(data);
          setIsLoading(false);
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
      <Calendar reservations={reservations} />
  );
}