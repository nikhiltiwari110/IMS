import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    STOCK_IN: 'bg-green-100 text-green-800',
    STOCK_OUT: 'bg-red-100 text-red-800',
    ADJUSTMENT: 'bg-amber-100 text-amber-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
