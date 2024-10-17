import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { handleLogin } from '../controllers/login.ts';

export default function NotLoggedIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) {
      navigate('/');
      return;
    }
    if (!sessionStorage.getItem('verifier')) {
      navigate('/');
      return;
    }

    handleLogin(code)
      .then(() => {
        navigate('/');
      })
      .catch((err: unknown) => {
        console.log('Error while logging in with code');
        console.log(err);
        navigate('/');
      });

  }, [navigate]);

  return (
    <div>Logging in... </div>
  );
}
