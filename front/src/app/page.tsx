'use client'
import { useEffect, useState } from 'react';
import { Lecturer_Card, location_reservation, tag } from '@/components/basic/lecturer';
import Card from '@/components/sections/card';
import Loading from '@/components/basic/loading';
import Search from '@/components/sections/search';
import { useSearchParams } from 'next/navigation';


export default function Home() {
  const searchParams = useSearchParams();
  const [lecturers, setLecturers] = useState<Lecturer_Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const maxPrice = Math.max(...lecturers.map(lecturer => lecturer.price_per_hour));
  type range = { min: number; max: number; };
  const [range, setRange] = useState<range>({ min: 0, max: maxPrice });
  const [tags, setTags] = useState<tag[]>([]);
  const [location, setLocation] = useState<string>("Anywhere");

  const subjects = lecturers.map(lecturer => lecturer.tags).flat().filter((tag, index, self) => self.findIndex(t => t.uuid === tag.uuid) === index);

  const filteredLecturers = lecturers.filter(lecturer => {
    const price = lecturer.price_per_hour;
    const matchesTags = tags.length === 0 || tags.every(tag => lecturer.tags.some(lTag => lTag.uuid === tag.uuid));
    const matchesLocation = location === "Anywhere" || lecturer.location === location;
    return price >= range.min && price <= range.max && matchesTags && matchesLocation;
  }) as Lecturer_Card[];

  useEffect(() => {
    const searchParamsObj = convertSearchParametersToSearch(new URLSearchParams(searchParams.toString()));
    setRange(searchParamsObj.range);
    setTags(searchParamsObj.tags);
    setLocation(searchParamsObj.location);
  }, [searchParams.toString(), lecturers]);

  const convertSearchParametersToSearch = (searchParameters: URLSearchParams) => {
    const query_minPrice = parseInt(searchParameters.get("minPrice") || "0");
    const query_maxPrice = parseInt(searchParameters.get("maxPrice") || maxPrice.toString());
    const location = searchParameters.get("location") || "Anywhere";
    const tags = searchParameters.getAll("tags").map(uuid => subjects.find(subject => subject.uuid === uuid)).filter(Boolean) as tag[];
    return { range: { min: query_minPrice, max: query_maxPrice }, tags, location };
  };

  useEffect(() => {
    const searchParamsObj = convertSearchParametersToSearch(new URLSearchParams(searchParams.toString()));
    setRange(searchParamsObj.range);
    setTags(searchParamsObj.tags);
    setLocation(searchParamsObj.location);
  }, [searchParams]);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const lecturersData = await fetch("/api/lecturers?format=json").then((response) => response.json());
        setLecturers(lecturersData.map(convertToLecturerObject));
        setLoading(false);
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
    loading ? <Loading /> :
      lecturers.length === 0 ?
        <section className="place-self-center flex bg-white dark:bg-jet text-black dark:text-white items-center justify-center">
          <h1 className="text-6xl">Žádní lektoři nebyli nalezeni...</h1>
        </section> :
        <section className="flex flex-col items-center justify-center">
          <Search
            lecturers={lecturers}
            subjects={
              lecturers
                .map(lecturer => lecturer.tags)
                .flat()
                .filter((tag, index, self) => self.findIndex(t => t.uuid === tag.uuid) === index)
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-jet text-black dark:text-white items-center justify-between p-6 sm:px-12 lg:px-24 justify-self-center">
            {filteredLecturers.map((lecturer, index) => (
              <Card key={`Card_${lecturer.uuid}`} lecturer={lecturer} index={index} />
            ))}
          </div>
        </section>
  );
}
