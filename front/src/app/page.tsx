'use client'
import { useEffect, useState } from 'react';
import { Lecturer_Card, tag } from '@/components/basic/lecturer';
import Card from '@/components/sections/card';


export default function Home() {
  const [lecturers, setLecturers] = useState<Lecturer_Card[]>([]);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const lecturersData = await fetch("/api/lecturers?format=json").then((response) => response.json());
        setLecturers(lecturersData.map(convertToLecturerObject));
      } catch (error) {
        console.error('Error fetching lecturers:', error);
      }
    };
    const convertToLecturerObject = (data: any) => {
      const tags = data.tags.map((tagData: { uuid: string; name: string; }) => new tag(tagData.uuid, tagData.name));
      const lecturer = new Lecturer_Card(
        data.uuid,
        data.title_before,
        data.first_name,
        data.middle_name,
        data.last_name,
        data.title_after,
        data.picture_url,
        data.location,
        data.claim,
        tags,
        data.price_per_hour
      );
      return lecturer;
    };

    fetchLecturers();
  }, []);

  //console.log(lecturers);


  return (
    lecturers.length === 0 ? <section className="place-self-center flex bg-white dark:bg-jet text-black dark:text-white items-center justify-center">
      <h1 className="text-6xl">Načítání...</h1>
    </section> :
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-jet text-black dark:text-white items-center justify-between p-6 sm:px-12 lg:px-24 justify-self-center">
        {/* Render fetched data here */}
        {lecturers.map((lecturer, index) => (
          <Card key={`Card_${lecturer.uuid}`} lecturer={lecturer} index={index} />
        ))}
      </section>
  );
}
