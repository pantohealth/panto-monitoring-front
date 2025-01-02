import { useState } from 'react';
import { setApiBaseUrl } from '../lib/axios';

export const useUrlSwitch = () => {
  const [baseUrl, setBaseUrlState] = useState(import.meta.env.VITE_API_DEV_BASE_URL);

  const setBaseUrl = (urlType:string) => {
    let newBaseUrl;
    if (urlType === 'dev') {
      newBaseUrl = import.meta.env.VITE_API_DEV_BASE_URL;
    } else if (urlType === 'dash') {
      newBaseUrl = import.meta.env.VITE_API_DASH_BASE_URL;
    }
    setBaseUrlState(newBaseUrl);
    setApiBaseUrl(newBaseUrl); // update axios instance dynamically
  };

  return { baseUrl, setBaseUrl };
};