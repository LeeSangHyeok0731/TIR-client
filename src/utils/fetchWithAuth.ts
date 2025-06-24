import Cookies from "js-cookie";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const accessToken = Cookies.get("accessToken");
  const headers = {
    ...(init?.headers || {}),
    ...(accessToken && typeof input === "string" && input.startsWith("/api")
      ? { Authorization: `Bearer ${accessToken}` }
      : {}),
  };

  return fetch(input, { ...init, headers });
}
