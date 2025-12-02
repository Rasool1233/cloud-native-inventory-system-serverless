import React, { useState, useEffect } from 'react';
import AlertList from '../components/AlertList';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAlerts, getProducts } from '../api/products';
import { useToast } from '../context/ToastContext';

const Alerts = () => {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertsData, productsData] = await Promise.all([
        getAlerts(),
        getProducts(),
      ]);
      setAlerts(alertsData);
      setProducts(productsData);
    } catch (error) {
      showToast(error.message || 'Failed to load alerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading alerts..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600 mt-1">
            {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'} requiring attention
          </p>
        </div>
        <button
          onClick={fetchData}
          className="btn-secondary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <div className="card">
        <AlertList alerts={alerts} products={products} loading={false} />
      </div>
    </div>
  );
};

export default Alerts;
