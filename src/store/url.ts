import { useEffect, useState } from 'react';
import { setApiBaseUrl } from '../lib/axios';

export const useUrlSwitch = () => {
  const [baseUrl, setBaseUrlState] = useState(() => {
    return localStorage.getItem('baseUrl') || import.meta.env.VITE_API_DEV_BASE_URL;
  });

  const setBaseUrl = (urlType:string) => {
    let newBaseUrl;
    if (urlType === 'dev') {
      newBaseUrl = import.meta.env.VITE_API_DEV_BASE_URL;
    } else if (urlType === 'dash') {
      newBaseUrl = import.meta.env.VITE_API_DASH_BASE_URL;
    }
    setBaseUrlState(newBaseUrl);
    setApiBaseUrl(newBaseUrl); // update axios instance dynamically
    localStorage.setItem('baseUrl', newBaseUrl);
  };

  useEffect(() => {
    // ensure axios uses the correct baseUrl on component mount
    setApiBaseUrl(baseUrl);
  }, [baseUrl]);

  return { baseUrl, setBaseUrl };
};