import Cookies from '../tools/cookies';
import { getUserLogin, login } from '../communication';

export const loginUser = async (): Promise<void> => {
  await getUserLogin(); // This should cache user data somewhere to use it in app
};

export const handleLogin = async (code: string): Promise<void> => {
  const data = await login(code);
  new Cookies().addLoginToken(data.access_token, data.expires_in);
  new Cookies().addRefreshToken(data.refresh_token, data.expires_in * 2);

  await loginUser();
};

