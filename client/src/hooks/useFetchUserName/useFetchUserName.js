import { useState, useEffect } from 'react';

const useFetchUserName = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setUserName(data.username);
      } catch (error) {
        console.log('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);

  return userName;
};

export default useFetchUserName;
