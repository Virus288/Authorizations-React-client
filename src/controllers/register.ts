export const register = async (
  login: string, password: string, email: string,
): Promise<void> => {
  const apiUrl = import.meta.env.VITE_API_BACKEND as string;
  const homeUrl = import.meta.env.VITE_API_HOME as string;

  const res = await fetch(`${apiUrl}/reg`, {
    method: 'POST',
    body: JSON.stringify({ login, password, email }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': homeUrl,
    },
  });

  if (res.ok) {
    return;
  } else {
    throw await res.json();
  }
};
