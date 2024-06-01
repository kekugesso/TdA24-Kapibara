'use server';

export default async function Logout() {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application',
        'Authorization': `${localStorage.getItem('token')}`,
      },
    });
    localStorage.removeItem('token');
    const data = await response.json();
    console.log(data);
    localStorage.removeItem('token');
  } catch (error) {
    console.error('An error occurred', error);
  }
}

