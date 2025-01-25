import { useState, useEffect } from 'react';
import { Character } from '../types';

export function useCharactersApi(githubUsername: string) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const endpoint = `https://recruiting.verylongdomaintotestwith.ca/api/${githubUsername}/character`;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load data (Status: ${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.body)) {
          setCharacters(data.body);
        } else {
          console.warn('Check API response format.', data);
          setCharacters([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching characters:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  async function saveCharacters(updatedCharacters: Character[]) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCharacters),
      });

      if (!response.ok) {
        throw new Error(`Failed to save data (Status: ${response.status})`);
      }

      const result = await response.json();
      if (Array.isArray(result)) {
        setCharacters(result);
      } else {
        setCharacters(updatedCharacters);
      }
    } catch (err) {
      console.error('Error saving characters:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    characters,
    setCharacters,
    loading,
    error,
    saveCharacters,
  };
}
