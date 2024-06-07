'use client';

export default async function Protected(route: string) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }
  try {
    const response = await fetch(`/api/${route}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application',
        'Authorization': `Token ${token}`,
      },
    });
    const data = await response.json();
    console.log(response);
    return data;
  } catch (error) {
    console.error('An error occurred', error);
  }
}

