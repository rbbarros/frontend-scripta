const TOKEN_KEY = "scripta_token";
const USER_TYPE_KEY = "scripta_user_type";

export function decodeTokenPayload(token) {
  if (!token) {
    return null;
  }

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return null;
    }

    const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(normalizedPayload);
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserType() {
  return localStorage.getItem(USER_TYPE_KEY);
}

export function getCurrentUserId() {
  const payload = decodeTokenPayload(getToken());
  return payload?.sub ?? payload?.id ?? null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function saveSession(token, userType) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_TYPE_KEY, userType);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
}
