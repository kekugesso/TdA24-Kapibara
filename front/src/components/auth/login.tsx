'use server';

export default async function Login(email: string, password: string) {
  return 'THIS IS A FAKE TOKEN';
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (!response.ok) {
      throw new Error('Error occurred with communication to the server. Please try again later.');
    }

    const data = await response.json();
    console.log(data);

    if (data.token) {
      return data.token;
    } else {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }
  catch (error) {
    console.error('An error occurred', error);
  }
}
