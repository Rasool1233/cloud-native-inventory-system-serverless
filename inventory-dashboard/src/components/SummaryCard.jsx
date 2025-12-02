import React from 'react';

const SummaryCard = ({ title, value, icon, trend, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
