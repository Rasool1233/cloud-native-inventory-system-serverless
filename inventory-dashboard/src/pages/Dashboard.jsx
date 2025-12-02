import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import ChartSales from '../components/ChartSales';
import AlertList from '../components/AlertList';
import { getProducts, getAlerts, getSalesTrends } from '../api/products';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [productsData, alertsData, salesTrends] = await Promise.all([
        getProducts().catch(() => []),
        getAlerts().catch(() => []),
        getSalesTrends(30).catch(() => []),
      ]);

      setProducts(productsData);
      setAlerts(alertsData);
      setSalesData(salesTrends);
    } catch (error) {
      showToast(error.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= p.threshold).length;
  const totalStockValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const recentAlertsCount = alerts.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your inventory overview.</p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary"
        >
          View All Products
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Products"
          value={loading ? '...' : totalProducts}
          icon={
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <SummaryCard
          title="Low Stock Items"
          value={loading ? '...' : lowStockCount}
          icon={
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />

        <SummaryCard
          title="Total Stock Value"
          value={loading ? '...' : `$${totalStockValue.toLocaleString()}`}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <SummaryCard
          title="Active Alerts"
          value={loading ? '...' : recentAlertsCount}
          icon={
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
        />
      </div>

      {/* Sales Trend Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sales Trend (30 Days)</h2>
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
        <ChartSales data={salesData} loading={loading} />
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          <button
            onClick={() => navigate('/alerts')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </button>
        </div>
        <AlertList alerts={alerts.slice(0, 5)} products={products} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
