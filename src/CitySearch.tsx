import React, { useState } from 'react';
import './CitySearch.css';

const API_KEY = 'be61ea39971b82e35e204c4252d8c13e';

interface Props {
  onInputChange: (city: string) => void;
}

interface CitySuggestion {
  name: string;
}

const CitySearch: React.FC<Props> = ({ onInputChange }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (text: string) => {
    if (text.length >= 3) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=10&appid=${API_KEY}`
        );
        const data = await response.json();

        const uniqueCities = new Map<string, CitySuggestion>();

        data.forEach((item: any) => {
          const key = `${item.name},${item.country}`;
          const matches = item.name.toLowerCase().startsWith(text.toLowerCase());
          if (matches && !uniqueCities.has(key)) {
            uniqueCities.set(key, { name: item.name });
          }
        });
        

        setSuggestions(Array.from(uniqueCities.values()));
      } catch (error) {
        console.error('Ошибка при получении подсказок:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const fetchSuggestions = async (text: string) => {
    if (text.length >= 3) {
      await handleInputChange(text);
    } else {
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
    onInputChange(value);
  };

  const handleSelect = (city: string) => {
    setQuery(city);
    setSuggestions([]);
    onInputChange(city);
  };

  return (
    <div
      className="city-search"
      onMouseEnter={() => setShowSuggestions(true)}
      onMouseLeave={() => setShowSuggestions(false)}
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Введите город"
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSelect(`${city.name}`)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
