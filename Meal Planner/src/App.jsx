import React, { useState, useEffect } from 'react';
import './index.css';
import { FirebaseStorageManager, COLLECTIONS } from './firebaseService';

const MEALS = {
  breakfast: [
    'Aaloo Paratha',
    'Appe',
    'Chana',
    'Chilla',
    'Eat Out',
    'English Breakfast',
    'Idli',
    'Matar',
    'Matar ke parathe',
    'Methi Paratha',
    'Muesli',
    'Omelette',
    'Pancakes',
    'Paratha Sabzi',
    'Poha',
    'Rava Dosa',
    'Sandwich',
    'Sattu Paratha',
    'Sewai',
    'Sunny Side',
    'Utappam',
    'Veg Omlette',
    'Waffles'
  ],
  lunch: [
    'Aaloo bhaja',
    'Aaloo chana',
    'Arbi',
    'Arhar daal',
    'Baigan Aaloo',
    'Baigan bharta',
    'Beans',
    'Bhindi',
    'Cabbage',
    'Chole',
    'Eat Out',
    'Gajar Matar',
    'Kadhi',
    'Karela',
    'Kundru',
    'Lauki',
    'Moong daal',
    'Nimona',
    'Palak daal',
    'Paneer',
    'Phool Gobhi',
    'Rajma',
    'Saag Palak',
    'Shimla mirch',
    'Soyabean',
    'Tamatar aaloo'
  ],
  dinner: [
    'Bruschetta',
    'Burger',
    'Eat Out',
    'Khichdi',
    'Liiti',
    'Pasta',
    'Pizza',
    'Salads',
    'Soyabean tikki'
  ]
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const INGREDIENTS = {
  // Breakfast Items
  'Aaloo Paratha': ['Potatoes', 'Wheat flour', 'Oil', 'Onion', 'Spices'],
  'Appe': ['Rice flour', 'Urad dal', 'Oil', 'Mustard seeds', 'Curry leaves'],
  'Chana': ['Chickpeas', 'Onion', 'Tomato', 'Ginger-garlic', 'Spices'],
  'Chilla': ['Besan (gram flour)', 'Onion', 'Tomato', 'Green chili', 'Oil'],
  'English Breakfast': ['Eggs', 'Bread', 'Butter', 'Beans', 'Tomato'],
  'Idli': ['Rice', 'Urad dal', 'Fenugreek seeds', 'Salt'],
  'Matar': ['Green peas', 'Onion', 'Tomato', 'Spices', 'Oil'],
  'Matar ke parathe': ['Wheat flour', 'Green peas', 'Spices', 'Oil'],
  'Methi Paratha': ['Wheat flour', 'Fenugreek leaves', 'Spices', 'Oil'],
  'Muesli': ['Oats', 'Nuts', 'Dried fruits', 'Milk'],
  'Omelette': ['Eggs', 'Onion', 'Tomato', 'Green chili', 'Oil'],
  'Pancakes': ['Flour', 'Milk', 'Eggs', 'Sugar', 'Butter'],
  'Paratha Sabzi': ['Wheat flour', 'Mixed vegetables', 'Spices', 'Oil'],
  'Poha': ['Flattened rice', 'Onion', 'Peanuts', 'Curry leaves', 'Oil'],
  'Rava Dosa': ['Semolina', 'Rice flour', 'Onion', 'Green chili', 'Oil'],
  'Sandwich': ['Bread', 'Vegetables', 'Butter', 'Cheese'],
  'Sattu Paratha': ['Wheat flour', 'Sattu flour', 'Onion', 'Spices', 'Oil'],
  'Sewai': ['Vermicelli', 'Milk', 'Sugar', 'Nuts', 'Cardamom'],
  'Sunny Side': ['Eggs', 'Oil', 'Salt', 'Pepper'],
  'Utappam': ['Rice', 'Urad dal', 'Vegetables', 'Oil'],
  'Veg Omlette': ['Besan', 'Vegetables', 'Spices', 'Oil'],
  'Waffles': ['Flour', 'Milk', 'Eggs', 'Sugar', 'Butter'],

  // Lunch Items
  'Aaloo bhaja': ['Potatoes', 'Oil', 'Turmeric', 'Salt'],
  'Aaloo chana': ['Potatoes', 'Chickpeas', 'Onion', 'Tomato', 'Spices'],
  'Arbi': ['Colocasia', 'Onion', 'Spices', 'Oil'],
  'Arhar daal': ['Arhar dal', 'Onion', 'Tomato', 'Turmeric', 'Spices'],
  'Baigan Aaloo': ['Brinjal', 'Potatoes', 'Onion', 'Spices', 'Oil'],
  'Baigan bharta': ['Brinjal', 'Onion', 'Tomato', 'Ginger-garlic', 'Spices'],
  'Beans': ['Green beans', 'Onion', 'Coconut', 'Spices', 'Oil'],
  'Bhindi': ['Okra', 'Onion', 'Spices', 'Oil'],
  'Cabbage': ['Cabbage', 'Onion', 'Spices', 'Oil'],
  'Chole': ['Chickpeas', 'Onion', 'Tomato', 'Spices', 'Oil'],
  'Gajar Matar': ['Carrots', 'Green peas', 'Onion', 'Spices', 'Oil'],
  'Kadhi': ['Yogurt', 'Besan', 'Ginger', 'Green chili', 'Spices'],
  'Karela': ['Bitter gourd', 'Onion', 'Spices', 'Oil'],
  'Kundru': ['Ivy gourd', 'Onion', 'Spices', 'Oil'],
  'Lauki': ['Bottle gourd', 'Onion', 'Tomato', 'Spices', 'Oil'],
  'Moong daal': ['Moong dal', 'Onion', 'Tomato', 'Turmeric', 'Spices'],
  'Nimona': ['Green peas', 'Potatoes', 'Spices', 'Oil'],
  'Palak daal': ['Spinach', 'Dal', 'Onion', 'Garlic', 'Spices'],
  'Paneer': ['Paneer', 'Onion', 'Tomato', 'Spices', 'Oil'],
  'Phool Gobhi': ['Cauliflower', 'Onion', 'Tomato', 'Spices', 'Oil'],
  'Rajma': ['Kidney beans', 'Onion', 'Tomato', 'Ginger-garlic', 'Spices'],
  'Saag Palak': ['Spinach', 'Mustard greens', 'Onion', 'Garlic', 'Spices'],
  'Shimla mirch': ['Bell peppers', 'Onion', 'Potatoes', 'Spices', 'Oil'],
  'Soyabean': ['Soybean chunks', 'Onion', 'Tomato', 'Spices', 'Oil'],
  'Tamatar aaloo': ['Tomatoes', 'Potatoes', 'Onion', 'Spices', 'Oil'],

  // Dinner Items
  'Bruschetta': ['Bread', 'Tomatoes', 'Basil', 'Garlic', 'Olive oil'],
  'Burger': ['Buns', 'Patty', 'Lettuce', 'Tomato', 'Onion'],
  'Khichdi': ['Rice', 'Dal', 'Vegetables', 'Turmeric', 'Ghee'],
  'Liiti': ['Wheat flour', 'Sattu flour', 'Onion', 'Spices', 'Ghee'],
  'Pasta': ['Pasta', 'Tomatoes', 'Garlic', 'Basil', 'Olive oil'],
  'Pizza': ['Pizza base', 'Cheese', 'Tomato sauce', 'Vegetables'],
  'Salads': ['Mixed vegetables', 'Lettuce', 'Cucumber', 'Tomato', 'Dressing'],
  'Soyabean tikki': ['Soybean', 'Potatoes', 'Spices', 'Breadcrumbs', 'Oil'],

  // Common for Eat Out
  'Eat Out': []
};

// Storage utilities for data persistence
const StorageManager = {
  keys: {
    ingredients: 'mealPlannerIngredients',
    customMeals: 'mealPlannerCustomMeals',
    confirmedMeals: 'mealPlannerConfirmedMeals',
    settings: 'mealPlannerSettings'
  },

  save: (key, data) => {
    try {
      const dataWithTimestamp = {
        data,
        lastModified: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return true;
    } catch (error) {
      console.error('Failed to save data:', error);
      return false;
    }
  },

  load: (key, fallback = null) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return fallback;

      const parsed = JSON.parse(stored);
      // Handle both old format (direct data) and new format (with metadata)
      return parsed.data !== undefined ? parsed.data : parsed;
    } catch (error) {
      console.error('Failed to load data:', error);
      return fallback;
    }
  },

  exportData: () => {
    const allData = {
      ingredients: StorageManager.load(StorageManager.keys.ingredients),
      customMeals: StorageManager.load(StorageManager.keys.customMeals),
      confirmedMeals: StorageManager.load(StorageManager.keys.confirmedMeals),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(allData, null, 2);
  },

  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.ingredients) {
        StorageManager.save(StorageManager.keys.ingredients, data.ingredients);
      }
      if (data.customMeals) {
        StorageManager.save(StorageManager.keys.customMeals, data.customMeals);
      }
      if (data.confirmedMeals) {
        StorageManager.save(StorageManager.keys.confirmedMeals, data.confirmedMeals);
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
};

function App() {
  const [weeklyMeals, setWeeklyMeals] = useState(() => {
    const initial = {};
    DAYS.forEach(day => {
      initial[day] = {
        breakfast: '',
        lunch: '',
        dinner: ''
      };
    });
    return initial;
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedMeals, setConfirmedMeals] = useState({});
  const [confirmationTime, setConfirmationTime] = useState(null);
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [editableIngredients, setEditableIngredients] = useState({ ...INGREDIENTS });
  const [customMeals, setCustomMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  });
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [userId, setUserId] = useState('');

  // Initialize Firebase and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = await FirebaseStorageManager.initAuth();
        if (user) {
          setUserId(user.uid);
          setIsFirebaseReady(true);

          // Load data from Firebase
          const [ingredients, customMealsData, confirmedMealsData] = await Promise.all([
            FirebaseStorageManager.load(COLLECTIONS.INGREDIENTS, { ...INGREDIENTS }),
            FirebaseStorageManager.load(COLLECTIONS.CUSTOM_MEALS, { breakfast: [], lunch: [], dinner: [] }),
            FirebaseStorageManager.load(COLLECTIONS.CONFIRMED_MEALS, {})
          ]);

          setEditableIngredients(ingredients);
          setCustomMeals(customMealsData);
          if (confirmedMealsData.meals) {
            setConfirmedMeals(confirmedMealsData.meals);
            if (confirmedMealsData.confirmationTime) {
              setConfirmationTime(new Date(confirmedMealsData.confirmationTime));
              setIsConfirmed(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        setIsFirebaseReady(true); // Continue with localStorage fallback
      }
    };

    initializeApp();
  }, []);

  const handleMealChange = (day, mealType, meal) => {
    setWeeklyMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: meal
      }
    }));
    if (isConfirmed) {
      setIsConfirmed(false);
    }
  };

  const handleCustomMealAdd = async (day, mealType, customMeal) => {
    if (customMeal && !MEALS[mealType].includes(customMeal) && !customMeals[mealType].includes(customMeal)) {
      const newCustomMeals = {
        ...customMeals,
        [mealType]: [...customMeals[mealType], customMeal]
      };
      setCustomMeals(newCustomMeals);

      if (isFirebaseReady) {
        await FirebaseStorageManager.save(COLLECTIONS.CUSTOM_MEALS, newCustomMeals);
      }

      // Add to editable ingredients with empty array if doesn't exist
      if (!editableIngredients[customMeal]) {
        const newIngredients = {
          ...editableIngredients,
          [customMeal]: []
        };
        setEditableIngredients(newIngredients);

        if (isFirebaseReady) {
          await FirebaseStorageManager.save(COLLECTIONS.INGREDIENTS, newIngredients);
        }
      }
    }
    handleMealChange(day, mealType, customMeal);
  };

  const generateGroceryList = (meals) => {
    const ingredientCount = {};

    // Count ingredients from all confirmed meals
    Object.values(meals).forEach(dayMeals => {
      Object.values(dayMeals).forEach(meal => {
        if (meal && meal !== '' && editableIngredients[meal]) {
          editableIngredients[meal].forEach(ingredient => {
            ingredientCount[ingredient] = (ingredientCount[ingredient] || 0) + 1;
          });
        }
      });
    });

    // Convert to array and sort alphabetically
    return Object.keys(ingredientCount)
      .sort()
      .map(ingredient => ({
        name: ingredient,
        count: ingredientCount[ingredient]
      }));
  };

  const handleIngredientsModalOpen = (mealType) => {
    setSelectedMealType(mealType);
    setShowIngredientsModal(true);
  };

  const handleIngredientsModalClose = () => {
    setShowIngredientsModal(false);
    setSelectedMealType('');
  };

  const handleIngredientUpdate = (mealName, newIngredients) => {
    setEditableIngredients(prev => ({
      ...prev,
      [mealName]: newIngredients
    }));
  };

  const handleIngredientAdd = (mealName, ingredient) => {
    if (ingredient.trim()) {
      setEditableIngredients(prev => ({
        ...prev,
        [mealName]: [...(prev[mealName] || []), ingredient.trim()]
      }));
    }
  };

  const handleIngredientRemove = (mealName, ingredientIndex) => {
    setEditableIngredients(prev => ({
      ...prev,
      [mealName]: prev[mealName].filter((_, index) => index !== ingredientIndex)
    }));
  };

  const handleConfirm = async () => {
    const currentTime = new Date();
    const confirmedData = { ...weeklyMeals };

    // Store the confirmed meals before resetting
    setConfirmedMeals(confirmedData);
    setConfirmationTime(currentTime);
    setIsConfirmed(true);

    // Save confirmed meals to Firebase
    if (isFirebaseReady) {
      await FirebaseStorageManager.save(COLLECTIONS.CONFIRMED_MEALS, {
        meals: confirmedData,
        confirmationTime: currentTime.toISOString()
      });
    }

    // Generate grocery list
    const groceries = generateGroceryList(weeklyMeals);
    setGroceryList(groceries);
    setCheckedItems({});

    // Reset planner to original state
    const initial = {};
    DAYS.forEach(day => {
      initial[day] = {
        breakfast: '',
        lunch: '',
        dinner: ''
      };
    });
    setWeeklyMeals(initial);
  };

  const handleGroceryCheck = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


  const isComplete = DAYS.every(day =>
    weeklyMeals[day]?.breakfast &&
    weeklyMeals[day]?.lunch &&
    weeklyMeals[day]?.dinner
  );

  const getMealOptions = (mealType) => [
    ...MEALS[mealType],
    ...customMeals[mealType]
  ];

  const fillRandomMeals = () => {
    const newWeeklyMeals = {};

    DAYS.forEach(day => {
      newWeeklyMeals[day] = {
        breakfast: getRandomMeal('breakfast'),
        lunch: getRandomMeal('lunch'),
        dinner: getRandomMeal('dinner')
      };
    });

    setWeeklyMeals(newWeeklyMeals);
  };

  const getRandomMeal = (mealType) => {
    const options = getMealOptions(mealType);
    // Filter out 'Eat Out' for more variety, but include it if it's the only option
    const filteredOptions = options.filter(meal => meal !== 'Eat Out');
    const availableOptions = filteredOptions.length > 0 ? filteredOptions : options;

    if (availableOptions.length === 0) return '';

    const randomIndex = Math.floor(Math.random() * availableOptions.length);
    return availableOptions[randomIndex];
  };

  const clearAllMeals = () => {
    const clearedMeals = {};
    DAYS.forEach(day => {
      clearedMeals[day] = {
        breakfast: '',
        lunch: '',
        dinner: ''
      };
    });
    setWeeklyMeals(clearedMeals);
  };

  const MealInput = ({ day, mealType, value }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    React.useEffect(() => {
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
      handleMealChange(day, mealType, suggestion);
      setShowSuggestions(false);
    };

    const handleAddToMenu = () => {
      if (inputValue.trim() && !getMealOptions(mealType).includes(inputValue.trim())) {
        handleCustomMealAdd(day, mealType, inputValue.trim());
      } else if (inputValue.trim()) {
        handleMealChange(day, mealType, inputValue.trim());
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
          handleMealChange(day, mealType, inputValue.trim());
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
            {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Weekly Meal Planner</h1>
          <p className="text-gray-600">Plan your perfect week of meals</p>
        </header>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mb-6 animate-fade-in">
          <button
            onClick={fillRandomMeals}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            🎲 Fill Random
          </button>
          <button
            onClick={clearAllMeals}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            🗑️ Clear All
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-8 animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 sm:p-4 font-semibold text-gray-800 border-b-2 border-gray-200 w-20 sm:w-32">
                    <span className="hidden sm:inline">Day / Meal</span>
                    <span className="sm:hidden">Day</span>
                  </th>
                  {['breakfast', 'lunch', 'dinner'].map(mealType => (
                    <th key={mealType} className="text-center p-2 sm:p-4 font-semibold text-gray-800 border-b-2 border-gray-200 min-w-32 sm:min-w-40">
                      <div className="flex items-center justify-center">
                        <span className={`w-3 h-3 rounded-full mr-1 sm:mr-2 ${
                          mealType === 'breakfast' ? 'bg-orange-400' :
                          mealType === 'lunch' ? 'bg-green-400' : 'bg-purple-400'
                        }`}></span>
                        <span className="capitalize text-sm sm:text-base">{mealType}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-2 sm:p-4 font-medium text-gray-700 bg-gray-50 text-sm sm:text-base">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.slice(0, 3)}</span>
                    </td>
                    {['breakfast', 'lunch', 'dinner'].map(mealType => (
                      <td key={`${day}-${mealType}`} className="p-2 sm:p-4">
                        <MealInput
                          day={day}
                          mealType={mealType}
                          value={weeklyMeals[day]?.[mealType] || ''}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isComplete && !isConfirmed && (
          <div className="text-center mb-8 animate-bounce-subtle">
            <button
              onClick={handleConfirm}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
            >
              Confirm Weekly Menu
            </button>
          </div>
        )}

        {isConfirmed && (
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 animate-slide-up">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">This Week's Menu</h2>
              {confirmationTime && (
                <p className="text-sm text-gray-500">
                  Confirmed on {confirmationTime.toLocaleDateString()} at {confirmationTime.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 sm:p-4 font-semibold text-gray-800 border-b-2 border-gray-200 w-20 sm:w-32">
                      <span className="hidden sm:inline">Day / Meal</span>
                      <span className="sm:hidden">Day</span>
                    </th>
                    {['breakfast', 'lunch', 'dinner'].map(mealType => (
                      <th key={mealType} className="text-center p-2 sm:p-4 font-semibold text-gray-800 border-b-2 border-gray-200">
                        <div className="flex items-center justify-center">
                          <span className={`w-3 h-3 rounded-full mr-1 sm:mr-2 ${
                            mealType === 'breakfast' ? 'bg-orange-400' :
                            mealType === 'lunch' ? 'bg-green-400' : 'bg-purple-400'
                          }`}></span>
                          <span className="capitalize text-sm sm:text-base">{mealType}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day} className="border-b border-gray-100">
                      <td className="p-2 sm:p-4 font-medium text-gray-700 bg-gray-50 text-sm sm:text-base">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.slice(0, 3)}</span>
                      </td>
                      {['breakfast', 'lunch', 'dinner'].map(mealType => (
                        <td key={`${day}-${mealType}`} className="p-2 sm:p-4 text-center text-gray-700 text-sm sm:text-base">
                          {confirmedMeals[day]?.[mealType] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {groceryList.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Grocery Checklist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groceryList.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <input
                        type="checkbox"
                        id={`grocery-${index}`}
                        checked={checkedItems[index] || false}
                        onChange={() => handleGroceryCheck(index)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`grocery-${index}`}
                        className={`ml-3 text-sm flex-1 cursor-pointer ${
                          checkedItems[index] ? 'line-through text-gray-500' : 'text-gray-700'
                        }`}
                      >
                        {item.name}
                        {item.count > 1 && (
                          <span className="ml-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {item.count}x
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">
                    {groceryList.filter((_, index) => checkedItems[index]).length} / {groceryList.length}
                  </span>
                  {' '}items checked
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Manage Ingredients</h3>

              {/* Meal Type Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                {['breakfast', 'lunch', 'dinner'].map(mealType => (
                  <button
                    key={mealType}
                    onClick={() => handleIngredientsModalOpen(mealType)}
                    className={`px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:scale-105 transform transition-all duration-300 ${
                      mealType === 'breakfast' ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' :
                      mealType === 'lunch' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                      'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                    }`}
                  >
                    <span className="capitalize">{mealType}</span> List
                  </button>
                ))}
              </div>

              {/* Data Backup & Restore */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Data Backup & Restore</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      const data = await FirebaseStorageManager.exportData();
                      if (data) {
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `meal-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      } else {
                        alert('Failed to export data. Please try again.');
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    📥 Export Data
                  </button>

                  <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm cursor-pointer">
                    📤 Import Data
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            const success = await FirebaseStorageManager.importData(event.target.result);
                            if (success) {
                              alert('Data imported successfully! Please refresh the page to see changes.');
                              window.location.reload();
                            } else {
                              alert('Failed to import data. Please check the file format.');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    🔄 Reset to Default
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <p className="mb-1">
                    {isFirebaseReady ? (
                      <>🔗 <span className="text-green-600 font-medium">Connected to Firebase</span> - Data syncs across all your devices</>
                    ) : (
                      <>⏳ <span className="text-yellow-600 font-medium">Connecting...</span> - Please wait</>
                    )}
                  </p>
                  {userId && (
                    <p className="text-xs text-gray-500">
                      User ID: {userId.substring(0, 8)}...
                    </p>
                  )}
                  <p className="mt-1">
                    💾 Data automatically syncs to Firebase cloud storage. Changes appear instantly on all your devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ingredients Modal */}
        {showIngredientsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {selectedMealType} Ingredients
                </h2>
                <button
                  onClick={handleIngredientsModalClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MEALS[selectedMealType]?.map(mealName => (
                    <div key={mealName} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-3">{mealName}</h3>
                      <div className="space-y-2">
                        {(editableIngredients[mealName] || []).map((ingredient, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <input
                              type="text"
                              value={ingredient}
                              onChange={(e) => {
                                const newIngredients = [...editableIngredients[mealName]];
                                newIngredients[index] = e.target.value;
                                handleIngredientUpdate(mealName, newIngredients);
                              }}
                              className="flex-1 bg-transparent border-none outline-none text-sm"
                            />
                            <button
                              onClick={() => handleIngredientRemove(mealName, index)}
                              className="text-red-500 hover:text-red-700 ml-2 text-sm font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center mt-2">
                          <input
                            type="text"
                            placeholder="Add new ingredient"
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                handleIngredientAdd(mealName, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const input = e.target.previousElementSibling;
                              if (input.value.trim()) {
                                handleIngredientAdd(mealName, input.value);
                                input.value = '';
                              }
                            }}
                            className="ml-2 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
                <button
                  onClick={handleIngredientsModalClose}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    // Save to Firebase
                    const success = await FirebaseStorageManager.save(COLLECTIONS.INGREDIENTS, editableIngredients);
                    if (success) {
                      alert('Ingredients saved successfully!');
                      handleIngredientsModalClose();
                    } else {
                      alert('Failed to save ingredients. Please try again.');
                    }
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;