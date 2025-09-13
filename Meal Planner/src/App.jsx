import React, { useState, useEffect } from 'react';
import './index.css';
import { FirebaseStorageManager, COLLECTIONS } from './firebaseService';
import { WeeklyMealTable, ConfirmedMenu, GroceryLists, ManageIngredients, IngredientsModal, ItemsModal } from './components';

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
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
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
  const [newlyAddedItem, setNewlyAddedItem] = useState('');
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
  const [frequentItems, setFrequentItems] = useState(['Potato', 'Tomato', 'Ginger', 'Lemon', 'Dhaniya', 'Adrak']);
  const [masalaItems, setMasalaItems] = useState(['Garam Masala', 'Coriander Powder', 'Amchur', 'Pepper', 'Dhaniya Powder']);
  const [otherItems, setOtherItems] = useState([]);

  // Modal states for ItemsModal
  const [showFrequentItemsModal, setShowFrequentItemsModal] = useState(false);
  const [showMasalaItemsModal, setShowMasalaItemsModal] = useState(false);
  const [currentModalType, setCurrentModalType] = useState('');

  // Initialize Firebase and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = await FirebaseStorageManager.initAuth();
        if (user) {
          setUserId(user.uid);
          setIsFirebaseReady(true);

          // Load data from Firebase
          const [ingredients, customMealsData, confirmedMealsData, groceryData, baseGroceryData, checkedItemsData, frequentItemsData, masalaItemsData, otherItemsData] = await Promise.all([
            FirebaseStorageManager.load(COLLECTIONS.INGREDIENTS, { ...INGREDIENTS }),
            FirebaseStorageManager.load(COLLECTIONS.CUSTOM_MEALS, { breakfast: [], lunch: [], dinner: [] }),
            FirebaseStorageManager.load(COLLECTIONS.CONFIRMED_MEALS, {}),
            FirebaseStorageManager.load('groceryList', []),
            FirebaseStorageManager.load('baseGroceryList', []),
            FirebaseStorageManager.load('checkedItems', {}),
            FirebaseStorageManager.load('frequentItems', ['Potato', 'Tomato', 'Ginger', 'Lemon', 'Dhaniya', 'Adrak']),
            FirebaseStorageManager.load('masalaItems', ['Garam Masala', 'Coriander Powder', 'Amchur', 'Pepper', 'Dhaniya Powder']),
            FirebaseStorageManager.load('otherItems', [])
          ]);

          setEditableIngredients(ingredients);
          setCustomMeals(customMealsData);
          setPersistentGroceryList(groceryData);
          setGroceryList(groceryData);
          setBaseGroceryList(baseGroceryData);
          setCheckedItems(checkedItemsData);
          setFrequentItems(frequentItemsData);
          setMasalaItems(masalaItemsData);
          setOtherItems(otherItemsData);

          if (confirmedMealsData.meals) {
            setConfirmedMeals(confirmedMealsData.meals);
            setWeeklyMeals(confirmedMealsData.meals); // Populate the planner with confirmed meals
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
    const updateGroceryFromMeals = async () => {
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

  // Save persistent grocery list whenever it changes
  useEffect(() => {
    const savePersistentGroceryList = async () => {
      if (isFirebaseReady && persistentGroceryList.length > 0) {
        await FirebaseStorageManager.save('groceryList', persistentGroceryList);
      }
    };

    savePersistentGroceryList();
  }, [persistentGroceryList, isFirebaseReady]);

  // Save checked items whenever they change
  useEffect(() => {
    const saveCheckedItems = async () => {
      if (isFirebaseReady && Object.keys(checkedItems).length > 0) {
        await FirebaseStorageManager.save('checkedItems', checkedItems);
      }
    };

    saveCheckedItems();
  }, [checkedItems, isFirebaseReady]);

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

      // Open the ingredients modal for the meal type and focus on the new item
      setSelectedMealType(mealType);
      setNewlyAddedItem(customMeal);
      setShowIngredientsModal(true);
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
    setNewlyAddedItem('');
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
    // Note: We don't reset the planner anymore so users can update their menu
  };

  const handleGroceryCheck = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


  const isComplete = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].every(day =>
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

    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
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
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
      clearedMeals[day] = {
        breakfast: '',
        lunch: '',
        dinner: ''
      };
    });
    setWeeklyMeals(clearedMeals);
  };

  // Helper functions for components
  const handleRemoveGroceryItem = async (index) => {
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
  };

  const handleAddToGrocery = async (item) => {
    const existingItem = persistentGroceryList.find(gItem => gItem.name === item);
    if (!existingItem) {
      const newItem = { name: item };
      const newPersistentList = [...persistentGroceryList, newItem];
      const newBaseList = [...baseGroceryList, newItem];

      setPersistentGroceryList(newPersistentList);
      setBaseGroceryList(newBaseList);

      if (isFirebaseReady) {
        await Promise.all([
          FirebaseStorageManager.save('groceryList', newPersistentList),
          FirebaseStorageManager.save('baseGroceryList', newBaseList)
        ]);
      }
    }
  };

  const handleAddCustomMeal = async (mealType, mealName) => {
    if (mealType === 'updateCustomMeals') {
      // Special case for updating custom meals (like hiding items)
      setCustomMeals(mealName);
      if (isFirebaseReady) {
        await FirebaseStorageManager.save(COLLECTIONS.CUSTOM_MEALS, mealName);
      }
      return;
    }

    if (mealName && !MEALS[mealType].includes(mealName) && !customMeals[mealType].includes(mealName)) {
      const newCustomMeals = {
        ...customMeals,
        [mealType]: [...customMeals[mealType], mealName]
      };
      setCustomMeals(newCustomMeals);

      if (isFirebaseReady) {
        await FirebaseStorageManager.save(COLLECTIONS.CUSTOM_MEALS, newCustomMeals);
      }

      if (!editableIngredients[mealName]) {
        const newIngredients = {
          ...editableIngredients,
          [mealName]: []
        };
        setEditableIngredients(newIngredients);

        if (isFirebaseReady) {
          await FirebaseStorageManager.save(COLLECTIONS.INGREDIENTS, newIngredients);
        }
      }
    }
  };

  const handleDeleteCustomMeal = async (mealType, mealName) => {
    const newCustomMeals = {
      ...customMeals,
      [mealType]: customMeals[mealType].filter(meal => meal !== mealName)
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
  };

  // Functions to handle frequent and masala items
  const handleAddFrequentItem = async (item) => {
    if (item.trim() && !frequentItems.includes(item.trim())) {
      const newItems = [...frequentItems, item.trim()];
      setFrequentItems(newItems);
      if (isFirebaseReady) {
        await FirebaseStorageManager.save('frequentItems', newItems);
      }
    }
  };

  const handleRemoveFrequentItem = async (index) => {
    const newItems = frequentItems.filter((_, i) => i !== index);
    setFrequentItems(newItems);
    if (isFirebaseReady) {
      await FirebaseStorageManager.save('frequentItems', newItems);
    }
  };

  const handleEditFrequentItem = async (index, newValue) => {
    if (newValue.trim()) {
      const newItems = [...frequentItems];
      newItems[index] = newValue.trim();
      setFrequentItems(newItems);
      if (isFirebaseReady) {
        await FirebaseStorageManager.save('frequentItems', newItems);
      }
    }
  };

  const handleAddMasalaItem = async (item) => {
    if (item.trim() && !masalaItems.includes(item.trim())) {
      const newItems = [...masalaItems, item.trim()];
      setMasalaItems(newItems);
      if (isFirebaseReady) {
        await FirebaseStorageManager.save('masalaItems', newItems);
      }
    }
  };

  const handleRemoveMasalaItem = async (index) => {
    const newItems = masalaItems.filter((_, i) => i !== index);
    setMasalaItems(newItems);
    if (isFirebaseReady) {
      await FirebaseStorageManager.save('masalaItems', newItems);
    }
  };

  const handleEditMasalaItem = async (index, newValue) => {
    if (newValue.trim()) {
      const newItems = [...masalaItems];
      newItems[index] = newValue.trim();
      setMasalaItems(newItems);
      if (isFirebaseReady) {
        await FirebaseStorageManager.save('masalaItems', newItems);
      }
    }
  };

  // Other items management functions
  const handleAddOtherItem = async (item) => {
    if (item.trim() && !otherItems.includes(item.trim())) {
      const newItems = [...otherItems, item.trim()];
      setOtherItems(newItems);
      if (isFirebaseReady) {
        await FirebaseStorageManager.save('otherItems', newItems);
      }
    }
  };

  const handleRemoveOtherItem = async (index) => {
    const newItems = otherItems.filter((_, i) => i !== index);
    setOtherItems(newItems);
    if (isFirebaseReady) {
      await FirebaseStorageManager.save('otherItems', newItems);
    }
  };

  const handleEditOtherItem = async (index, newValue) => {
    if (newValue.trim()) {
      const newItems = [...otherItems];
      newItems[index] = newValue.trim();
      setOtherItems(newItems);
      if (isFirebaseReady) {
        await FirebaseStorageManager.save('otherItems', newItems);
      }
    }
  };

  // Modal handlers for ItemsModal
  const handleFrequentItemsModalOpen = () => {
    setCurrentModalType('frequent');
    setShowFrequentItemsModal(true);
  };

  const handleMasalaItemsModalOpen = () => {
    setCurrentModalType('masala');
    setShowMasalaItemsModal(true);
  };

  const handleItemsModalClose = () => {
    setShowFrequentItemsModal(false);
    setShowMasalaItemsModal(false);
    setCurrentModalType('');
  };

  const handleItemsModalSave = async () => {
    // Items are already saved when modified, just show success message
    if (isFirebaseReady) {
      alert('Changes saved successfully!');
    } else {
      alert('Firebase not ready. Changes saved locally only.');
    }
  };

  // Search and add item function for grocery list (focused on ingredients)
  const handleSearchAndAddItem = async (searchTerm) => {
    const term = searchTerm.toLowerCase().trim();

    // Check if item exists in ingredient-focused databases (no meals for grocery shopping)
    const groceryRelevantItems = [
      ...Object.values(editableIngredients).flat(),
      ...frequentItems,
      ...masalaItems,
      ...otherItems
    ];

    const foundItem = groceryRelevantItems.find(item =>
      item.toLowerCase().includes(term) || term.includes(item.toLowerCase())
    );

    if (foundItem) {
      // Add to grocery list if found
      await handleAddToGrocery(foundItem);
    } else {
      // Add to other items if not found
      await handleAddOtherItem(searchTerm);
      await handleAddToGrocery(searchTerm);
    }
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

        <WeeklyMealTable
          weeklyMeals={weeklyMeals}
          onMealChange={handleMealChange}
          onCustomMealAdd={handleCustomMealAdd}
          getMealOptions={getMealOptions}
        />

        {isComplete && (
          <div className="text-center mb-8 animate-bounce-subtle">
            <button
              onClick={handleConfirm}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
            >
              {isConfirmed ? 'Update Weekly Menu' : 'Confirm Weekly Menu'}
            </button>
          </div>
        )}

        {isConfirmed && (
          <ConfirmedMenu
            confirmedMeals={confirmedMeals}
            confirmationTime={confirmationTime}
          />
        )}

        <GroceryLists
          persistentGroceryList={persistentGroceryList}
          checkedItems={checkedItems}
          frequentItems={frequentItems}
          masalaItems={masalaItems}
          otherItems={otherItems}
          baseGroceryList={baseGroceryList}
          isFirebaseReady={isFirebaseReady}
          onGroceryCheck={handleGroceryCheck}
          onRemoveGroceryItem={handleRemoveGroceryItem}
          onAddToGrocery={handleAddToGrocery}
          onSearchAndAddItem={handleSearchAndAddItem}
          onRemoveOtherItem={handleRemoveOtherItem}
          editableIngredients={editableIngredients}
          MEALS={MEALS}
          FirebaseStorageManager={FirebaseStorageManager}
        />

        <ManageIngredients
          onIngredientsModalOpen={handleIngredientsModalOpen}
          onFrequentItemsModalOpen={handleFrequentItemsModalOpen}
          onMasalaItemsModalOpen={handleMasalaItemsModalOpen}
        />

        <IngredientsModal
          showModal={showIngredientsModal}
          selectedMealType={selectedMealType}
          newlyAddedItem={newlyAddedItem}
          MEALS={MEALS}
          customMeals={customMeals}
          editableIngredients={editableIngredients}
          isFirebaseReady={isFirebaseReady}
          onClose={handleIngredientsModalClose}
          onIngredientUpdate={handleIngredientUpdate}
          onIngredientAdd={handleIngredientAdd}
          onIngredientRemove={handleIngredientRemove}
          onAddCustomMeal={handleAddCustomMeal}
          onDeleteCustomMeal={handleDeleteCustomMeal}
          FirebaseStorageManager={FirebaseStorageManager}
        />

        <ItemsModal
          showModal={showFrequentItemsModal || showMasalaItemsModal}
          modalType={currentModalType}
          items={currentModalType === 'frequent' ? frequentItems : masalaItems}
          onClose={handleItemsModalClose}
          onAddItem={currentModalType === 'frequent' ? handleAddFrequentItem : handleAddMasalaItem}
          onEditItem={currentModalType === 'frequent' ? handleEditFrequentItem : handleEditMasalaItem}
          onRemoveItem={currentModalType === 'frequent' ? handleRemoveFrequentItem : handleRemoveMasalaItem}
          onSave={handleItemsModalSave}
        />
      </div>
    </div>
  );
}

export default App;