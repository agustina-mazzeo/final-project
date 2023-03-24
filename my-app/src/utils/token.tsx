export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("tokenExpiration");
  if (storedExpirationDate) {
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
  } else {
    return 0;
  }
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return "";
  }
  const tokenDuration = getTokenDuration();
  if (tokenDuration <= 0) {
    logout()
    return "";
  }
  return token;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiration");
}
