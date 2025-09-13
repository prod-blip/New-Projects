import React from 'react';
import MealInput from './MealInput';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyMealTable = ({ weeklyMeals, onMealChange, onCustomMealAdd, getMealOptions }) => {
  return (
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
                      onMealChange={onMealChange}
                      onCustomMealAdd={onCustomMealAdd}
                      getMealOptions={getMealOptions}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyMealTable;