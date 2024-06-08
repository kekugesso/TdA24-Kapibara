import { useAuth } from "@/components/auth/authContext";

const useLogin = () => {
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (!response.ok) {
        throw new Error('Error occurred with communication to the server. Please try again later.');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        login();
        return data.token;
      } else {
        throw new Error('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('An error occurred', error);
      throw error;
    }
  };

  return { handleLogin };
};

export default useLogin;

