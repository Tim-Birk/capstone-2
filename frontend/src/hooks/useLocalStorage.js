import { useState, useEffect } from 'react';

const useLocalStorage = (key, value = null) => {
  const initialVal = window.localStorage.getItem(key)
    ? window.localStorage.getItem(key)
    : value;

  const [theValue, setTheValue] = useState(initialVal);

  useEffect(() => {
    if (theValue) {
      localStorage.setItem(key, theValue);
    } else {
      localStorage.removeItem(key);
    }
  }, [key, theValue]);

  return [theValue, setTheValue];
};

export default useLocalStorage;
