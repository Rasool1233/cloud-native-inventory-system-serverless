import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdjustModal from '../components/AdjustModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProduct, adjustStock } from '../api/products';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (error) {
      showToast(error.message || 'Failed to load product', 'error');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdjustment = async (productId, delta, reason) => {
    setAdjusting(true);

    // Optimistic update
    setProduct((prev) => ({ ...prev, stock: prev.stock + delta }));

    try {
      const updatedProduct = await adjustStock(productId, delta, reason);
      setProduct(updatedProduct);
      showToast('Stock adjusted successfully', 'success');
      setIsModalOpen(false);
    } catch (error) {
      // Revert on error
      fetchProduct();
      showToast(error.message || 'Failed to adjust stock', 'error');
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (!product) {
    return null;
  }

  const isLowStock = product.stock <= product.threshold;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-2 card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-500 mt-1">SKU: {product.sku}</p>
            </div>
            {isLowStock && <span className="badge-low-stock">Low Stock</span>}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Stock</p>
              <p className={`text-3xl font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                {product.stock}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Stock Threshold</p>
              <p className="text-3xl font-bold text-gray-700">{product.threshold}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Unit Price</p>
              <p className="text-3xl font-bold text-gray-900">${product.price}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(product.stock * product.price).toLocaleString()}
              </p>
            </div>
          </div>

          {product.lastSoldDate && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">Last Sold</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {new Date(product.lastSoldDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary w-full"
            >
              Adjust Stock
            </button>
            <button className="btn-secondary w-full">
              Edit Product
            </button>
            <button className="btn-danger w-full">
              Delete Product
            </button>
          </div>

          {isLowStock && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
                  <p className="mt-1 text-sm text-red-700">
                    This product is running low. Consider restocking soon.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      <AdjustModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitAdjustment}
        loading={adjusting}
      />
    </div>
  );
};

export default ProductDetail;
