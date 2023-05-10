import { useEffect, useState } from 'react';

interface UserLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
}

export const useUserLocation = (): UserLocation | undefined => {
  const [location, setLocation] = useState<UserLocation>();

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const { ip } = await response.json();
        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await locationResponse.json();
        setLocation({
          ip: locationData.ip,
          city: locationData.city,
          region: locationData.region,
          country: locationData.country,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserLocation();
  }, []);

  return location;
};