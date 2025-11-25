// src/utils/auth.js

// Function to get the token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Function to get the expiration time from localStorage
export const getTokenExpiration = () => {
  return localStorage.getItem('auth_token_expiration');
};

// Function to check if the token is expired
export const isTokenExpired = () => {
  const expirationTime = getTokenExpiration();
  const currentTime = Date.now();
  return !expirationTime || currentTime > expirationTime; // Token is expired
};

// Function to set token and its expiration time
export const setAuthToken = (token, expirationTime) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_token_expiration', expirationTime);
};

// Function to remove the token and expiration time
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_token_expiration');
};


export const logout = () => {
  localStorage.removeItem('auth_token');
localStorage.removeItem('auth_token_expiration');

  window.location.href = '/'; // Redirect to login page after logout (optional)
};