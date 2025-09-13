import React from 'react';

const ManageIngredients = ({
  onIngredientsModalOpen,
  onFrequentItemsModalOpen,
  onMasalaItemsModalOpen
}) => {

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 mb-8 animate-slide-up">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Manage Ingredients</h3>

      {/* Meal Type Buttons */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Meal Types</h4>
        <div className="flex flex-wrap gap-4">
          {['breakfast', 'lunch', 'dinner'].map(mealType => (
            <button
              key={mealType}
              onClick={() => onIngredientsModalOpen(mealType)}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Frequently Used Items */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Frequently Used Items</h4>
          <button
            onClick={() => onFrequentItemsModalOpen()}
            className="w-full px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:scale-105 transform transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            Manage Frequent Items
          </button>
        </div>

        {/* Masala Items */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Masala Items</h4>
          <button
            onClick={() => onMasalaItemsModalOpen()}
            className="w-full px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:scale-105 transform transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            Manage Masala Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageIngredients;