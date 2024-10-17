import React, { useEffect, useState } from 'react';
import Cookies from '../tools/cookies';
import { loginUser } from '../controllers/login';
import { ETokenNames } from '../enums';
import NotLoggedIn from '../pages/NotLoggedIn';
import LoggedIn from '../pages/LoggedIn';


const Home: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = new Cookies().getToken(ETokenNames.Access);

    if (accessToken) {
      loginUser().then(() => {
        setLoggedIn(true);
      }).catch((err) => {
        console.log('Got err with preLogin', err);
      });
    }
  }, []);

  return <div>{loggedIn ? <LoggedIn /> : <NotLoggedIn />}</div>;
};

export default Home;
