import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAdjustStock }) => {
  const navigate = useNavigate();
  const isLowStock = product.stock <= product.threshold;

  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={() => navigate(`/products/${product.id}`)}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
          {isLowStock && <span className="badge-low-stock">Low Stock</span>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Stock</p>
            <p className={`text-lg font-semibold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              {product.stock}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Threshold</p>
            <p className="text-lg font-semibold text-gray-700">{product.threshold}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-lg font-semibold text-gray-700">${product.price}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Sold</p>
            <p className="text-sm text-gray-700">
              {product.lastSoldDate ? new Date(product.lastSoldDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdjustStock(product);
          }}
          className="btn-primary flex-1 text-sm"
        >
          Adjust Stock
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product.id}`);
          }}
          className="btn-secondary text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
