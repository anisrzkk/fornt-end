import { useRuntimeConfig } from '#app';

export async function apiFetch(path: string, options?: RequestInit) {
  const config = useRuntimeConfig();
const BASE_URL = config.public.apiUrl;

  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}