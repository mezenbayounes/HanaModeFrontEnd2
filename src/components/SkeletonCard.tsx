// components/SkeletonCard.tsx
import React from 'react';

interface SkeletonCardProps {
  size?: 'home' | 'default';
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ size = 'default' }) => {
  const height = size === 'home' ? 'h-80 sm:h-96' : 'h-64 sm:h-72';
  return (
    <div className={`animate-pulse bg-gray-200 rounded-2xl ${height} w-full`}>
      <div className="bg-gray-300 h-3/4 rounded-t-2xl w-full" />
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );
};

export default SkeletonCard;
