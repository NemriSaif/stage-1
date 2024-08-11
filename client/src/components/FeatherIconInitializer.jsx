import { useEffect } from 'react';
import feather from 'feather-icons';

const FeatherIconInitializer = () => {
  useEffect(() => {
    feather.replace();
  }, []);

  return null;
};

export default FeatherIconInitializer;
