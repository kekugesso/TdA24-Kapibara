'use client'
import { useEffect, useState } from 'react';
import getLecturers from './get-lecturers';


export default function Home() {
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const lecturersData = await getLecturers();
        setLecturers(lecturersData);
      } catch (error) {
        console.error('Error fetching lecturers:', error);
      }
    };

    fetchLecturers();
  }, []);

  //console.log(lecturers);

  return (
    <section className="flex min-h-screen bg-white dark:bg-jet text-black dark:text-white flex-col items-center justify-between p-24">
      <h1>Hello world!</h1>
    </section>
  );
}
