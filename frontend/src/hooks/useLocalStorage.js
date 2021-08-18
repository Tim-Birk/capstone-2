import { useState, useEffect } from 'react';

const useLocalStorage = (key, value = null) => {
  const initialVal = window.localStorage.getItem(key)
    ? window.localStorage.getItem(key)
    : value;

  const [token, setToken] = useState(initialVal);

  useEffect(() => {
    if (token) {
      localStorage.setItem(key, token);
    } else {
      localStorage.removeItem(key);
    }
  }, [key, token]);

  return [token, setToken];
};

export default useLocalStorage;
