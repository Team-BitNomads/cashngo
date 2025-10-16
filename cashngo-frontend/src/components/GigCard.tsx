import React from 'react';
import type { Gig } from '../types';

interface GigCardProps {
  gig: Gig;
}

const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  const cardClasses = gig.is_locked
    ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60'
    : 'bg-white border-green-400 hover:shadow-lg transition-shadow';

  return (
    <div className={`p-4 rounded-lg border-2 ${cardClasses}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-800">{gig.title}</h3>
        <span className="bg-green-100 text-green-800 font-semibold py-1 px-3 rounded-full">${gig.price.toFixed(2)}</span>
      </div>
      {gig.is_locked ? (
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-bold">🔒 Locked</span> - Requires: {gig.required_skill}
        </div>
      ) : (
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Apply Now
        </button>
      )}
    </div>
  );
};

export default GigCard;