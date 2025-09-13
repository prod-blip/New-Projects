import React, { useState, useEffect } from 'react';

const MealInput = ({ day, mealType, value, onMealChange, onCustomMealAdd, getMealOptions }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);

    if (input.length > 0) {
      const allOptions = getMealOptions(mealType);
      const filtered = allOptions.filter(meal =>
        meal.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onMealChange(day, mealType, suggestion);
    setShowSuggestions(false);
  };

  const handleAddToMenu = () => {
    if (inputValue.trim() && !getMealOptions(mealType).includes(inputValue.trim())) {
      onCustomMealAdd(day, mealType, inputValue.trim());
    } else if (inputValue.trim()) {
      onMealChange(day, mealType, inputValue.trim());
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddToMenu();
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
      if (inputValue.trim()) {
        onMealChange(day, mealType, inputValue.trim());
      }
    }, 300);
  };

  const isNewMeal = inputValue.trim() && !getMealOptions(mealType).includes(inputValue.trim());

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => {
          const allOptions = getMealOptions(mealType);
          if (inputValue.length > 0) {
            const filtered = allOptions.filter(meal =>
              meal.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredSuggestions(filtered);
          } else {
            setFilteredSuggestions(allOptions);
          }
          setShowSuggestions(true);
        }}
        placeholder={`Enter ${mealType}...`}
        className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />

      {showSuggestions && (filteredSuggestions.length > 0 || isNewMeal) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
              className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 border-b border-gray-100 last:border-b-0"
            >
              {suggestion}
            </div>
          ))}
          {isNewMeal && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                handleAddToMenu();
              }}
              className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-green-50 hover:text-green-700 border-t border-green-200 bg-green-25 flex items-center justify-between"
            >
              <span>+ Add "{inputValue}" to menu</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealInput;