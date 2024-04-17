'use server';

import { readFile } from 'fs/promises';

export default async function getLecturers(uuid: string) {
  try {
    console.log(uuid);
    const data = await readFile('src/sample_data/lecturer.json', 'utf8');
    const lecturer = JSON.parse(data);
    return lecturer;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

