import { useNavigate } from 'react-router-dom';
import { sendToLoginPage } from '../communication';

export default function NotLoggedIn() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Not logged in </h2>
      <button type="button" onClick={(e) => {
        e.preventDefault();
        sendToLoginPage().catch((err) => {
          console.log('Couldn\'t send to login page', err);
        });
      }}
      >
        Login
      </button>

      <button type="button" onClick={(e) => {
        e.preventDefault();
        navigate('/register');
      }}
      >
        Register
      </button>
    </div>
  );
}
