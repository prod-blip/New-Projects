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
  const [persistentGroceryList, setPersistentGroceryList] = useState([]);
  const [baseGroceryList, setBaseGroceryList] = useState([]); // Store manually added items
  const [frequentItems] = useState(['Potato', 'Tomato', 'Ginger', 'Lemon', 'Dhaniya', 'Adrak']);
  const [masalaItems] = useState(['Garam Masala', 'Coriander Powder', 'Amchur', 'Pepper', 'Dhaniya Powder']);

  // Initialize Firebase and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = await FirebaseStorageManager.initAuth();
        if (user) {
          setUserId(user.uid);
          setIsFirebaseReady(true);

          // Load data from Firebase
          const [ingredients, customMealsData, confirmedMealsData, groceryData, baseGroceryData] = await Promise.all([
            FirebaseStorageManager.load(COLLECTIONS.INGREDIENTS, { ...INGREDIENTS }),
            FirebaseStorageManager.load(COLLECTIONS.CUSTOM_MEALS, { breakfast: [], lunch: [], dinner: [] }),
            FirebaseStorageManager.load(COLLECTIONS.CONFIRMED_MEALS, {}),
            FirebaseStorageManager.load('groceryList', []),
            FirebaseStorageManager.load('baseGroceryList', [])
          ]);

          setEditableIngredients(ingredients);
          setCustomMeals(customMealsData);
          setPersistentGroceryList(groceryData);
          setGroceryList(groceryData);
          setBaseGroceryList(baseGroceryData);

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

  // Update grocery list whenever menu selection changes
  useEffect(() => {
    const updateGroceryFromMeals = () => {
      // Generate ingredients from current meal selection
      const mealIngredients = generateGroceryList(weeklyMeals);

      // Combine base grocery list (manually added items) with meal ingredients
      const combinedList = [...baseGroceryList];

      // Add meal ingredients that aren't already in the base list
      mealIngredients.forEach(ingredient => {
        const exists = combinedList.some(item => item.name === ingredient.name);
        if (!exists) {
          combinedList.push(ingredient);
        }
      });

      setPersistentGroceryList(combinedList);
      setGroceryList(combinedList);
    };

    updateGroceryFromMeals();
  }, [weeklyMeals, baseGroceryList, editableIngredients]);

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
    const ingredientSet = new Set();

    // Add ingredients from all confirmed meals
    Object.values(meals).forEach(dayMeals => {
      Object.values(dayMeals).forEach(meal => {
        if (meal && meal !== '' && editableIngredients[meal]) {
          editableIngredients[meal].forEach(ingredient => {
            ingredientSet.add(ingredient);
          });
        }
      });
    });

    // Convert to array and sort alphabetically
    return Array.from(ingredientSet)
      .sort()
      .map(ingredient => ({
        name: ingredient
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

    // The grocery list will be updated automatically by the useEffect

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

  const getMealOptions = (mealType) => {
    const hiddenMealsKey = `hidden${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`;
    const hiddenMeals = customMeals[hiddenMealsKey] || [];

    return [
      ...MEALS[mealType].filter(meal => !hiddenMeals.includes(meal)),
      ...customMeals[mealType]
    ];
  };

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
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 mb-8 animate-slide-up">
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

            </div>
          </div>
        )}

        {/* Grocery Lists Section - Always Visible */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Grocery Checklist */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Grocery Checklist</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {persistentGroceryList.map((item, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
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
                    </label>
                    <button
                      onClick={async () => {
                        const itemToRemove = persistentGroceryList[index];

                        // Remove from persistentGroceryList
                        const newList = persistentGroceryList.filter((_, i) => i !== index);
                        setPersistentGroceryList(newList);

                        // Also remove from baseGroceryList if it exists there
                        const isInBaseList = baseGroceryList.some(item => item.name === itemToRemove.name);
                        if (isInBaseList) {
                          const newBaseList = baseGroceryList.filter(item => item.name !== itemToRemove.name);
                          setBaseGroceryList(newBaseList);
                          if (isFirebaseReady) {
                            await FirebaseStorageManager.save('baseGroceryList', newBaseList);
                          }
                        }

                        const newCheckedItems = { ...checkedItems };
                        delete newCheckedItems[index];
                        // Reindex checked items
                        const reindexedCheckedItems = {};
                        Object.keys(newCheckedItems).forEach(key => {
                          const oldIndex = parseInt(key);
                          if (oldIndex > index) {
                            reindexedCheckedItems[oldIndex - 1] = newCheckedItems[key];
                          } else if (oldIndex < index) {
                            reindexedCheckedItems[oldIndex] = newCheckedItems[key];
                          }
                        });
                        setCheckedItems(reindexedCheckedItems);

                        if (isFirebaseReady) {
                          await FirebaseStorageManager.save('groceryList', newList);
                        }
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                      title="Remove from grocery list"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {persistentGroceryList.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No items in grocery list</p>
                )}
              </div>
              {persistentGroceryList.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">
                    {persistentGroceryList.filter((_, index) => checkedItems[index]).length} / {persistentGroceryList.length}
                  </span>
                  {' '}items checked
                </div>
              )}
            </div>

            {/* Frequently Used Items */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Frequently Used</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {frequentItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                    <span className="text-sm text-gray-700">{item}</span>
                    <button
                      onClick={async () => {
                        const existingItem = baseGroceryList.find(gItem => gItem.name === item);
                        if (!existingItem) {
                          const newBaseList = [...baseGroceryList, { name: item }];
                          setBaseGroceryList(newBaseList);
                          if (isFirebaseReady) {
                            await FirebaseStorageManager.save('baseGroceryList', newBaseList);
                          }
                        }
                      }}
                      className="text-green-600 hover:text-green-800 text-sm font-bold bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
                      title="Add to grocery list"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Masala List */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Masala List</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {masalaItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200">
                    <span className="text-sm text-gray-700">{item}</span>
                    <button
                      onClick={async () => {
                        const existingItem = baseGroceryList.find(gItem => gItem.name === item);
                        if (!existingItem) {
                          const newBaseList = [...baseGroceryList, { name: item }];
                          setBaseGroceryList(newBaseList);
                          if (isFirebaseReady) {
                            await FirebaseStorageManager.save('baseGroceryList', newBaseList);
                          }
                        }
                      }}
                      className="text-orange-600 hover:text-orange-800 text-sm font-bold bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded"
                      title="Add to grocery list"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Modal */}
        {showIngredientsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
                  {selectedMealType} Management
                </h2>
                <button
                  onClick={handleIngredientsModalClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Add New Meal Item Section */}
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New {selectedMealType} Item</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Enter new ${selectedMealType} item name`}
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const newMealName = e.target.value.trim();
                        if (!MEALS[selectedMealType].includes(newMealName) && !customMeals[selectedMealType].includes(newMealName)) {
                          const newCustomMeals = {
                            ...customMeals,
                            [selectedMealType]: [...customMeals[selectedMealType], newMealName]
                          };
                          setCustomMeals(newCustomMeals);

                          if (isFirebaseReady) {
                            await FirebaseStorageManager.save(COLLECTIONS.CUSTOM_MEALS, newCustomMeals);
                          }

                          if (!editableIngredients[newMealName]) {
                            const newIngredients = {
                              ...editableIngredients,
                              [newMealName]: []
                            };
                            setEditableIngredients(newIngredients);

                            if (isFirebaseReady) {
                              await FirebaseStorageManager.save(COLLECTIONS.INGREDIENTS, newIngredients);
                            }
                          }

                          e.target.value = '';
                        } else {
                          alert('This meal item already exists!');
                        }
                      }
                    }}
                  />
                  <button
                    onClick={async (e) => {
                      const input = e.target.previousElementSibling;
                      if (input.value.trim()) {
                        const newMealName = input.value.trim();
                        if (!MEALS[selectedMealType].includes(newMealName) && !customMeals[selectedMealType].includes(newMealName)) {
                          const newCustomMeals = {
                            ...customMeals,
                            [selectedMealType]: [...customMeals[selectedMealType], newMealName]
                          };
                          setCustomMeals(newCustomMeals);

                          if (isFirebaseReady) {
                            await FirebaseStorageManager.save(COLLECTIONS.CUSTOM_MEALS, newCustomMeals);
                          }

                          if (!editableIngredients[newMealName]) {
                            const newIngredients = {
                              ...editableIngredients,
                              [newMealName]: []
                            };
                            setEditableIngredients(newIngredients);

                            if (isFirebaseReady) {
                              await FirebaseStorageManager.save(COLLECTIONS.INGREDIENTS, newIngredients);
                            }
                          }

                          input.value = '';
                        } else {
                          alert('This meal item already exists!');
                        }
                      }
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {(() => {
                    const hiddenMealsKey = `hidden${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}`;
                    const hiddenMeals = customMeals[hiddenMealsKey] || [];
                    const visibleBuiltInMeals = MEALS[selectedMealType].filter(meal => !hiddenMeals.includes(meal));

                    return [...visibleBuiltInMeals, ...customMeals[selectedMealType]];
                  })().map(mealName => {
                    const isCustomMeal = customMeals[selectedMealType].includes(mealName);
                    const isBuiltInMeal = MEALS[selectedMealType].includes(mealName);
                    return (
                      <div key={mealName} className="border border-gray-200 rounded-lg p-4 relative">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                            {mealName}
                            {isBuiltInMeal && <span className="text-xs text-gray-500 ml-2">(Built-in)</span>}
                          </h3>
                          <div className="flex gap-2">
                            {isCustomMeal && (
                              <button
                                onClick={async () => {
                                  if (confirm(`Are you sure you want to delete "${mealName}"? This will also remove its ingredients.`)) {
                                    const newCustomMeals = {
                                      ...customMeals,
                                      [selectedMealType]: customMeals[selectedMealType].filter(meal => meal !== mealName)
                                    };
                                    setCustomMeals(newCustomMeals);

                                    const newIngredients = { ...editableIngredients };
                                    delete newIngredients[mealName];
                                    setEditableIngredients(newIngredients);

                                    if (isFirebaseReady) {
                                      await Promise.all([
                                        FirebaseStorageManager.save(COLLECTIONS.CUSTOM_MEALS, newCustomMeals),
                                        FirebaseStorageManager.save(COLLECTIONS.INGREDIENTS, newIngredients)
                                      ]);
                                    }
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                                title="Delete this custom meal item"
                              >
                                Delete
                              </button>
                            )}
                            {isBuiltInMeal && (
                              <button
                                onClick={async () => {
                                  if (confirm(`Are you sure you want to hide "${mealName}" from the ${selectedMealType} list? You can add it back later if needed.`)) {
                                    // Add to a hidden meals list instead of deleting
                                    const hiddenMealsKey = `hidden${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}`;
                                    const currentHidden = customMeals[hiddenMealsKey] || [];
                                    const newCustomMeals = {
                                      ...customMeals,
                                      [hiddenMealsKey]: [...currentHidden, mealName]
                                    };
                                    setCustomMeals(newCustomMeals);

                                    if (isFirebaseReady) {
                                      await FirebaseStorageManager.save(COLLECTIONS.CUSTOM_MEALS, newCustomMeals);
                                    }
                                  }
                                }}
                                className="text-orange-500 hover:text-orange-700 text-sm font-bold bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded"
                                title="Hide this built-in meal item"
                              >
                                Hide
                              </button>
                            )}
                          </div>
                        </div>
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
                              className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between sm:justify-end gap-4 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <button
                  onClick={handleIngredientsModalClose}
                  className="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      if (isFirebaseReady) {
                        await Promise.all([
                          FirebaseStorageManager.save(COLLECTIONS.INGREDIENTS, editableIngredients),
                          FirebaseStorageManager.save(COLLECTIONS.CUSTOM_MEALS, customMeals)
                        ]);
                        alert('Changes saved successfully!');
                      } else {
                        alert('Firebase not ready. Changes saved locally only.');
                      }
                      handleIngredientsModalClose();
                    } catch (error) {
                      console.error('Failed to save:', error);
                      alert('Failed to save changes. Please try again.');
                    }
                  }}
                  className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
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