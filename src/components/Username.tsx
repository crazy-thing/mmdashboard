import { useEffect, useState } from 'react';
import '../styles/Username.scss';
import { add, deleteIcon, trash2 } from '../assets/exports';

interface UsernameProps {
  setShowUsername: (show: boolean) => void;
}

const Username = ({ setShowUsername }: UsernameProps) => {
  const [usernames, setUsernames] = useState<string[]>([]);

  const fetchUsernames = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_IP}/usernames`);
      const result = await response.json();
      if (response.ok) {
        setUsernames(result.usernames || []);
      } else {
        console.error(result.message || 'Failed to fetch usernames');
      }
    } catch (err) {
      console.error('Error fetching usernames:', err);
    }
  };

  const handleAddUsername = async () => {
    const input = prompt('Enter a username:');

    if (!input || !input.trim()) {
      alert('Username cannot be empty.');
      return;
    }

    try {
      const apiKey = localStorage.getItem('apiKey') || '';
      const response = await fetch(`${import.meta.env.VITE_IP}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ username: input.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        fetchUsernames();
      } else {
        alert(`Failed to register: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error registering username:', error);
      alert('Error connecting to server.');
    }
  };

  const handleDeleteUsername = async (username: string) => {
    if (!window.confirm(`Are you sure you want to delete the username "${username}"?`)) return;
    try {
      const apiKey = localStorage.getItem('apiKey') || '';
      const response = await fetch(`${import.meta.env.VITE_IP}/delete-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (response.ok) {
        fetchUsernames();
      } else {
        alert(`Failed to delete username: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting username:', error);
      alert('Error connecting to server.');
    }
  };

  useEffect(() => {
    fetchUsernames();
  }, []);

  return (
    <div className="username">
      <div className="username__top">
        <span className="username__top-button" onClick={() => setShowUsername(false)}>GO BACK</span>
        <span className="username__top-button blue" onClick={() => setShowUsername(false)}>SAVE</span>
      </div>

      <div className="app__create" onClick={handleAddUsername}>
        <img className="app__create__icon" src={add} />
        <p className="app__create__text">Add Username</p>
      </div>

      <div className="username__list">
        <h3>Usernames:</h3>
        {usernames.map((name, index) => (
          <div key={index} className="username__item">
            <p className="username__item__text">{name}</p>
            <img className="username__item__delete" onClick={() => handleDeleteUsername(name)} src={trash2} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Username;
