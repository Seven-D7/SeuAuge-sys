// src/components/Common/ContinueWatchingCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ContinueWatchingCardProps {
  videoTitle: string;
  videoId: string;
  progress: number;
}

const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({
  videoTitle,
  videoId,
  progress,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 mb-4 bg-slate-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Continuar Assistindo</h2>
      <p className="text-sm mb-2">{videoTitle}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      <button
        onClick={() => navigate(`/video/${videoId}`)}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
      >
        Continuar
      </button>
    </div>
  );
};

export default ContinueWatchingCard;
