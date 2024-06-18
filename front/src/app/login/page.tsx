'use client';
import { useState, useEffect } from 'react';

import useLogin from '@/components/auth/login';
import { useRouter } from 'next/navigation';
import Loading from '@/components/basic/loading';

export default function SignIn() {
  const router = useRouter();
  const { handleLogin } = useLogin();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = await handleLogin(userName, password);
      if (token) {
        localStorage.setItem('token', token);
        router.push('/dashboard');
      } else {
        setError('Login failed. Please check your credentials and try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.' + err);
      setLoading(false);
    }
  };

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <section className="flex w-full items-center justify-center ">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-gray-300 p-8 shadow-lg dark:bg-jet">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Přihlášení</h1>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">Username</label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-black"
              id="username"
              type="username"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Heslo</label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-black"
              id="password"
              type="password"
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue/90 h-10 px-4 py-2 w-full border-1 border-white"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Přihlašování...' : 'Přihlásit se'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </section>
  );
}
