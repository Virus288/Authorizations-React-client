import { ETokenNames, ETokenType } from '../enums';
import { Cookies, generateRandomName } from '../tools';
import { generateCodeChallengeFromVerifier, generateCodeVerifier } from '../tools/crypto';

export const sendToLoginPage = async (): Promise<void> => {
  const redirectUrl = import.meta.env.VITE_API_REDIRECT_LOGIN_URL as string;
  const clientId = import.meta.env.VITE_API_CLIENT_ID as string;
  const server = import.meta.env.VITE_API_BACKEND as string;
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallengeFromVerifier(verifier);
  sessionStorage.setItem('verifier', verifier);

  // eslint-disable-next-line compat/compat
  const queryParams = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUrl,
    nonce: generateRandomName(),
    scope: 'openid',
    code_challenge_method: 'S256',
    code_challenge: challenge,
  }).toString();
  window.location.href = `${server}/auth?${queryParams}`;
};

export const sendToLogoutPage = (): void => {
  const redirectUrl = import.meta.env.VITE_API_HOME as string;
  const clientId = import.meta.env.VITE_API_CLIENT_ID as string;
  const server = import.meta.env.VITE_API_BACKEND as string;

  // eslint-disable-next-line compat/compat
  const params = new URLSearchParams({
    post_logout_redirect_uri: redirectUrl,
    client_id: clientId,
  }).toString();
  window.location.href = `${server}/session/end?${params}`;
};

export const login = async (code: string): Promise<{
  access_token: string, expires_in: number, refresh_token: string
}> => {
  const redirectUrl = import.meta.env.VITE_API_REDIRECT_LOGIN_URL as string;
  const clientSecret = import.meta.env.VITE_API_CLIENT_SECRET as string;
  const clientId = import.meta.env.VITE_API_CLIENT_ID as string;
  const verifier = sessionStorage.getItem('verifier') as string;
  sessionStorage.removeItem('verifier');

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUrl,
    code_verifier: verifier,
  });

  const apiUrl = import.meta.env.VITE_API_BACKEND as string;
  const homeUrl = import.meta.env.VITE_API_HOME as string;

  const res = await fetch(`${apiUrl}/token`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': homeUrl,
    },
  });

  if (res.ok) {
    return res.json();
  } else {
    throw (await res.json() as Error);
  }
};

export const revokeToken = async (token: string, type: ETokenType): Promise<unknown> => {
  const clientSecret = import.meta.env.VITE_API_CLIENT_SECRET as string;
  const clientId = import.meta.env.VITE_API_CLIENT_ID as string;

  // eslint-disable-next-line compat/compat
  const body = new URLSearchParams({
    token,
    token_type_hint: type,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const apiUrl = import.meta.env.VITE_API_BACKEND as string;
  const homeUrl = import.meta.env.VITE_API_HOME as string;

  const res = await fetch(`${apiUrl}/token/revocation`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': homeUrl,
    },
  });

  if (res.ok) {
    return {};
  } else {
    console.log('Login not 200');
    throw (await res.json() as Error);
  }
};

export const getUserLogin = async (): Promise<unknown> => {
  const apiUrl = import.meta.env.VITE_API_BACKEND as string;
  const homeUrl = import.meta.env.VITE_API_HOME as string;

  const loginToken = new Cookies().getToken(ETokenNames.Access);

  const res = await fetch(`${apiUrl}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': homeUrl,
      'Authorization': `Bearer ${loginToken}`,
    },
  });

  if (res.ok) {
    return res.json();
  } else {
    console.log('Login not 200');
    throw (await res.json() as Error);
  }
};

