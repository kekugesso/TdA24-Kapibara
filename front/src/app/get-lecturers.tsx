'use server'

import { readFile } from 'fs/promises';

export default async function getLecturers() {
    try {
        const data = await readFile('src/sample_data/lecturers.json', 'utf8');
        const lecturers = JSON.parse(data);
        return lecturers;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error; 
    }
}