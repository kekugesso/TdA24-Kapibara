'use client'
import { useEffect, useState } from 'react';
import getLecturers from '../get-lecturers';

export default function Test() {
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
      <h1>Just a testing site for server components: F12</h1>
      {/* Render your fetched data here */}
      <ul>
        {lecturers.map((lecturer, index) => (
          <li key={index} data-uuid={lecturer.uuid}>{index+1}: {lecturer.title_before} {lecturer.first_name} {lecturer.last_name} {lecturer.title_after}</li>
        ))}
      </ul>
    </section>
  );
}