import React, { useState } from 'react';

const API_KEY = 'be61ea39971b82e35e204c4252d8c13e'; 

interface Props {
  onInputChange: (city: string) => void;
}

const CitySearch: React.FC<Props> = ({ onInputChange }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (text: string) => {
    if (!text) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error('Ошибка при загрузке');
      const data = await response.json();
      const names = data.map((item: any) => `${item.name}, ${item.country}`);
      setSuggestions(names);
    } catch (error) {
      console.error('Ошибка загрузки подсказок:', error);
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
    onInputChange(value); // Обновляем значение в родителе
  };

  const handleSelect = (city: string) => {
    setQuery(city);
    setSuggestions([]);
    onInputChange(city); // Передаём выбранный город
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Введите город"
        value={query}
        onChange={handleChange}
        style={{ width: '200px', padding: '6px' }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
            position: 'absolute',
            width: '200px',
            maxHeight: '150px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            zIndex: 100,
          }}
        >
          {suggestions.map((city, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(city)}
              style={{
                padding: '6px 10px',
                cursor: 'pointer',
              }}
              onMouseDown={(e) => e.preventDefault()} // Чтобы не терять фокус input при клике
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
