// src/utils/auth.js
export const saveToken = (token) => {
  const expiresAt = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days
  const authData = { token, expiresAt };
  localStorage.setItem('auth', JSON.stringify(authData));
};

export const getToken = () => {
  const authData = JSON.parse(localStorage.getItem('auth'));
  if (!authData) return null;

  if (new Date().getTime() > authData.expiresAt) {
    localStorage.removeItem('auth'); // expired
    return null;
  }

  return authData.token;
};

export const removeToken = () => {
  localStorage.removeItem('auth');
};
