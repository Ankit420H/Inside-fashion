import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="prata-regular text-6xl sm:text-8xl text-gray-800 mb-4">404</h1>
      <p className="text-xl sm:text-2xl text-gray-600 mb-2">Page Not Found</p>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition-colors duration-300"
      >
        BACK TO HOME
      </Link>
    </div>
  );
};

export default NotFound;
