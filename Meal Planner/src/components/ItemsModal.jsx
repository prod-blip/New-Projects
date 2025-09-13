import React, { useState } from 'react';

const ItemsModal = ({
  showModal,
  modalType,
  items,
  onClose,
  onAddItem,
  onEditItem,
  onRemoveItem,
  onSave
}) => {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  if (!showModal) return null;

  const handleAddItem = () => {
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleEditItem = (index, value) => {
    onEditItem(index, value);
    setEditingIndex(null);
  };

  const modalTitle = modalType === 'frequent' ? 'Frequently Used Items' : 'Masala Items';
  const colorClasses = modalType === 'frequent'
    ? 'bg-green-50 border-green-300 text-green-700 hover:text-green-800'
    : 'bg-orange-50 border-orange-300 text-orange-700 hover:text-orange-800';
  const buttonColor = modalType === 'frequent'
    ? 'bg-green-500 hover:bg-green-600'
    : 'bg-orange-500 hover:bg-orange-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {modalTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Add New Item Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Item</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Enter new ${modalType === 'frequent' ? 'frequent' : 'masala'} item`}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem();
                }
              }}
            />
            <button
              onClick={handleAddItem}
              className={`px-4 py-2 ${buttonColor} text-white rounded-lg text-sm transition-colors`}
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className={`flex items-center p-3 ${colorClasses} rounded-lg`}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    defaultValue={item}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onBlur={(e) => handleEditItem(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditItem(index, e.target.value);
                      }
                      if (e.key === 'Escape') {
                        setEditingIndex(null);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 text-sm cursor-pointer hover:font-medium"
                    onClick={() => setEditingIndex(index)}
                  >
                    {item}
                  </span>
                )}
                <button
                  onClick={() => onRemoveItem(index)}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                  title="Remove item"
                >
                  Delete
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No items added yet. Add your first item above!
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between sm:justify-end gap-4 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave();
              onClose();
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

export default ItemsModal;