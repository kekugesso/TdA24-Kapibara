'use client'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react';
import getLecturer from '@/components/fetch/getLecturer';
import { Lecturer_Full, tag, contact, reservation, location_reservation, status } from '@/components/basic/lecturer';
import Profile from '@/components/sections/profile';

export default function lecturer() {
  const pathname = usePathname()
  const uuid = pathname.split("/")[2]
  const [lecturer, setLecturer] = useState<Lecturer_Full | null>(null);

  const fetchLecturer = useCallback(async () => {
    try {
      const lecturerData = await fetch(`/api/lecturer/${uuid}?format=json`).then((response) => response.json());
      console.log(lecturerData);
      setLecturer(convertToLecturerObject(lecturerData));
    } catch (error) {
      console.error('Error fetching lecturer:', error);
    }
  }, [uuid]);

  const convertToLecturerObject = useCallback((data: any) => {
    const tags = data.tags.map((tagData: any) => new tag(tagData.uuid, tagData.name));
    const contactInfo = new contact(data.contact.telephone_numbers, data.contact.emails);
    const reservations = data.reservations ? data.reservations.map((reservationData: any) => {
      const subjects = reservationData.subjects ? reservationData.subjects.map((subjectData: any) => new tag(subjectData.uuid, subjectData.name)) : [];
      return new reservation(
        reservationData.uuid,
        new Date(reservationData.start_time),
        new Date(reservationData.end_time),
        reservationData.location as location_reservation,
        reservationData.status as status,
        subjects
      )
    }) : [];
    return new Lecturer_Full(
      data.uuid,
      data.title_before,
      data.first_name,
      data.middle_name,
      data.last_name,
      data.title_after,
      data.location,
      data.picture_url,
      data.price_per_hour,
      data.claim,
      tags,
      data.bio,
      contactInfo,
      reservations
    );
  }, [fetchLecturer]);

  useEffect(() => {
    fetchLecturer();
  }, [uuid]);

  return (
    lecturer ?
      (<Profile key={"profile_" + uuid} lecturer={lecturer} />) :
      (<section className="place-self-center flex bg-white dark:bg-jet text-black dark:text-white items-center justify-center">
        <h1 className="text-6xl">Načítání...</h1>
      </section>)
  )
}
