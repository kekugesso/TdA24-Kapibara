'use server';

import { readFile } from 'fs/promises';

export default async function getLecturers() {
  try {
    const data = await readFile('src/sample_data/lecturers.json', 'utf8');
    const dataArray = JSON.parse(data);
    const lecturers =
      dataArray.map((
        lecturerData: {
          UUID: any;
          title_before: any;
          first_name: any;
          middle_name: any;
          last_name: any;
          title_after: any;
          picture_url: any;
          location: any;
          claim: any;
          price_per_hour: any;
          tags: any[];
        }
      ) => {
        return {
          UUID: lecturerData.UUID,
          title_before: lecturerData.title_before,
          first_name: lecturerData.first_name,
          middle_name: lecturerData.middle_name,
          last_name: lecturerData.last_name,
          title_after: lecturerData.title_after,
          picture_url: lecturerData.picture_url,
          location: lecturerData.location,
          claim: lecturerData.claim,
          tags: lecturerData.tags,
          price_per_hour: lecturerData.price_per_hour,
        };
      });
    return lecturers;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}
