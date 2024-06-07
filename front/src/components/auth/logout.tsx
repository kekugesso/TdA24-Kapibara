'use client';

export default async function Logout() {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    if (response.status === 200) {
      localStorage.removeItem('token');
      return true;
    } else {
      return false;
    }
    //console.log(response.status);
  } catch (error) {
    console.error('An error occurred', error);
  }
}

