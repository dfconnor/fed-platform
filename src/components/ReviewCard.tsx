'use client';

import ReviewStars from './ReviewStars';

interface ReviewCardProps {
  author: {
    name: string;
    image?: string;
  };
  rating: number;
  date: string;
  comment: string;
  hostResponse?: string;
  subcategories?: {
    cleanliness?: number;
    accuracy?: number;
    communication?: number;
    value?: number;
  };
}

export function ReviewCard({
  author,
  rating,
  date,
  comment,
  hostResponse,
  subcategories,
}: ReviewCardProps) {
  return (
    <div className="border-b border-gray-100 pb-6 last:border-0">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-brand-400 to-forest-500 flex items-center justify-center text-white font-semibold text-sm">
          {author.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{author.name}</p>
              <p className="text-sm text-gray-500">{date}</p>
            </div>
            <ReviewStars rating={rating} size="sm" />
          </div>

          {subcategories && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              {subcategories.cleanliness && (
                <span>Cleanliness {subcategories.cleanliness}/5</span>
              )}
              {subcategories.accuracy && (
                <span>Accuracy {subcategories.accuracy}/5</span>
              )}
              {subcategories.communication && (
                <span>Communication {subcategories.communication}/5</span>
              )}
              {subcategories.value && (
                <span>Value {subcategories.value}/5</span>
              )}
            </div>
          )}

          <p className="mt-3 text-gray-700 leading-relaxed">{comment}</p>

          {hostResponse && (
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Host Response
              </p>
              <p className="text-sm text-gray-700">{hostResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
