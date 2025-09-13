import React, { useEffect, useRef } from 'react';
import { COLLECTIONS } from '../firebaseService';

const IngredientsModal = ({
  showModal,
  selectedMealType,
  newlyAddedItem,
  MEALS,
  customMeals,
  editableIngredients,
  isFirebaseReady,
  onClose,
  onIngredientUpdate,
  onIngredientAdd,
  onIngredientRemove,
  onAddCustomMeal,
  onDeleteCustomMeal,
  FirebaseStorageManager
}) => {
  const scrollContainerRef = useRef(null);

  // Scroll to newly added item when modal opens
  useEffect(() => {
    if (showModal && newlyAddedItem && scrollContainerRef.current) {
      // Wait a bit for the modal to render
      setTimeout(() => {
        const targetElement = scrollContainerRef.current.querySelector(`[data-meal-name="${newlyAddedItem}"]`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a highlight effect
          targetElement.style.backgroundColor = '#fef3c7';
          setTimeout(() => {
            targetElement.style.backgroundColor = '';
            targetElement.style.transition = 'background-color 1s ease';
          }, 2000);
        }
      }, 100);
    }
  }, [newlyAddedItem, showModal]);

  if (!showModal) return null;

  const handleAddCustomMeal = async (mealName) => {
    if (mealName && !MEALS[selectedMealType].includes(mealName) && !customMeals[selectedMealType].includes(mealName)) {
      await onAddCustomMeal(selectedMealType, mealName);
    } else {
      alert('This meal item already exists!');
    }
  };

  const handleDeleteCustomMeal = async (mealName) => {
    if (confirm(`Are you sure you want to delete "${mealName}"? This will also remove its ingredients.`)) {
      await onDeleteCustomMeal(selectedMealType, mealName);
    }
  };

  const hiddenMealsKey = `hidden${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}`;
  const hiddenMeals = customMeals[hiddenMealsKey] || [];
  const visibleBuiltInMeals = MEALS[selectedMealType].filter(meal => !hiddenMeals.includes(meal));
  const allVisibleMeals = [...visibleBuiltInMeals, ...customMeals[selectedMealType]];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
            {selectedMealType} Management
          </h2>
          <button
            onClick={onClose}
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
                  await handleAddCustomMeal(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={async (e) => {
                const input = e.target.previousElementSibling;
                if (input.value.trim()) {
                  await handleAddCustomMeal(input.value.trim());
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6" ref={scrollContainerRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {allVisibleMeals.map(mealName => {
              const isCustomMeal = customMeals[selectedMealType].includes(mealName);
              const isBuiltInMeal = MEALS[selectedMealType].includes(mealName);

              return (
                <div key={mealName} data-meal-name={mealName} className="border border-gray-200 rounded-lg p-4 relative">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                      {mealName}
                      {isBuiltInMeal && <span className="text-xs text-gray-500 ml-2">(Built-in)</span>}
                    </h3>
                    <div className="flex gap-2">
                      {isCustomMeal && (
                        <button
                          onClick={() => handleDeleteCustomMeal(mealName)}
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
                              const currentHidden = customMeals[hiddenMealsKey] || [];
                              const newCustomMeals = {
                                ...customMeals,
                                [hiddenMealsKey]: [...currentHidden, mealName]
                              };
                              await onAddCustomMeal('updateCustomMeals', newCustomMeals);
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
                            onIngredientUpdate(mealName, newIngredients);
                          }}
                          className="flex-1 bg-transparent border-none outline-none text-sm"
                        />
                        <button
                          onClick={() => onIngredientRemove(mealName, index)}
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
                            onIngredientAdd(mealName, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          if (input.value.trim()) {
                            onIngredientAdd(mealName, input.value);
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
            onClick={onClose}
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
                onClose();
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
  );
};

export default IngredientsModal;