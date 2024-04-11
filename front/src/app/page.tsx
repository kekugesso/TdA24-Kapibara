'use client'
import { useEffect, useState } from 'react';
import getLecturers from './get-lecturers';
import { Lecturer_Card, tag } from './lecturer';
import Card from './Card';


export default function Home() {
  const [lecturers, setLecturers] = useState<Lecturer_Card[]>([]);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const lecturersData = await getLecturers();
        setLecturers(lecturersData.map(convertToLecturerObject));
      } catch (error) {
        console.error('Error fetching lecturers:', error);
      }
    };
    const convertToLecturerObject = (
      data: { 
        tags: any[]; 
        UUID: string; 
        title_before: string; 
        first_name: string; 
        last_name: string; 
        title_after: string; 
        picture_url: string; 
        location: string; 
        claim: string; 
        price_per_hour: number; 
      }
    ) => {
        const tags = data.tags.map(tagData => new tag(tagData.uuid, tagData.name));
        const lecturer = new Lecturer_Card(
          data.UUID,
          data.title_before,
          data.first_name,
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
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-screen bg-white dark:bg-jet text-black dark:text-white items-center justify-between p-6 sm:px-12 lg:px-24">
      {/* Render fetched data here */}
      {lecturers.map((lecturer, index) => (
        <Card key={index} lecturer={lecturer} />
      ))}
    </section>
  );
}
