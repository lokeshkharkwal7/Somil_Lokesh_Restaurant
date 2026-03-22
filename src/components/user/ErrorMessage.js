import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-700">{message || 'Something went wrong. Please try again.'}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;
