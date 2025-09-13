import React, { useState, useEffect, useRef } from 'react';

const GroceryLists = ({
  persistentGroceryList,
  checkedItems,
  frequentItems,
  masalaItems,
  otherItems,
  baseGroceryList,
  isFirebaseReady,
  onGroceryCheck,
  onRemoveGroceryItem,
  onAddToGrocery,
  onSearchAndAddItem,
  onRemoveOtherItem,
  editableIngredients,
  MEALS,
  FirebaseStorageManager
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const handleAddToGrocery = async (item) => {
    const existingItem = baseGroceryList.find(gItem => gItem.name === item);
    if (!existingItem) {
      await onAddToGrocery(item);
    }
  };

  const handleSearchAndAdd = async (term = searchTerm) => {
    if (term.trim()) {
      await onSearchAndAddItem(term.trim());
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  // Generate suggestions based on search term (prioritize ingredients for grocery shopping)
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase();

      // Build ingredient lists by priority (most relevant for grocery shopping)
      const ingredients = Object.values(editableIngredients || {}).flat();
      const groceryRelevantItems = [
        ...ingredients,           // Ingredients from meals (highest priority)
        ...frequentItems,        // Frequently used items
        ...masalaItems,          // Masala items
        ...otherItems           // Custom other items
        // Note: Excluding MEALS as they are not ingredients
      ];

      const filteredSuggestions = [...new Set(groceryRelevantItems)]
        .filter(item =>
          item &&
          item.toLowerCase().includes(term) &&
          !persistentGroceryList.some(groceryItem => groceryItem.name.toLowerCase() === item.toLowerCase())
        )
        .slice(0, 8); // Limit to 8 suggestions

      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, frequentItems, masalaItems, otherItems, persistentGroceryList, editableIngredients]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 mb-8 animate-slide-up">
      {/* Search Input */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Add Custom Item</h3>
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for items or add new one..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchAndAdd();
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSearchAndAdd(suggestion)}
                    >
                      <span className="font-medium">{suggestion}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {frequentItems.includes(suggestion) ? '(Frequent)' :
                         masalaItems.includes(suggestion) ? '(Masala)' :
                         otherItems.includes(suggestion) ? '(Other)' : '(Ingredient)'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSearchAndAdd}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              Add to Grocery
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Start typing to see suggestions. Items will be added to "Other Items" if not found in database.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  onChange={() => onGroceryCheck(index)}
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
                  onClick={() => onRemoveGroceryItem(index)}
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
                  onClick={() => handleAddToGrocery(item)}
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
                  onClick={() => handleAddToGrocery(item)}
                  className="text-orange-600 hover:text-orange-800 text-sm font-bold bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded"
                  title="Add to grocery list"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Other Items */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Other Items</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {otherItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                <span className="text-sm text-gray-700 flex-1">{item}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleAddToGrocery(item)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-bold bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded"
                    title="Add to grocery list"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemoveOtherItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                    title="Delete this item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {otherItems.length === 0 && (
              <p className="text-gray-500 text-sm italic">No custom items added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryLists;