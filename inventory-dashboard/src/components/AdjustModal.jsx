import React, { useState, useEffect } from 'react';

const AdjustModal = ({ product, isOpen, onClose, onSubmit, loading }) => {
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDelta('');
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const deltaNum = parseInt(delta);
    if (isNaN(deltaNum) || deltaNum === 0) {
      alert('Please enter a valid number');
      return;
    }
    onSubmit(product.id, deltaNum, reason);
  };

  // Calculate new stock value
  const newStock = product.stock + (parseInt(delta) || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Adjust Stock</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Product</p>
            <p className="text-lg font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Stock:</span>
              <span className="text-lg font-semibold text-gray-900">{product.stock}</span>
            </div>
            {delta && !isNaN(parseInt(delta)) && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">New Stock:</span>
                <span className={`text-lg font-semibold ${newStock < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {newStock}
                </span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="delta" className="block text-sm font-medium text-gray-700 mb-2">
              Adjustment Amount *
            </label>
            <input
              type="number"
              id="delta"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              className="input-field"
              placeholder="e.g., 10 or -5"
              required
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Use positive numbers to add stock, negative to reduce
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
              rows="3"
              placeholder="e.g., Restocked from supplier"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustModal;
