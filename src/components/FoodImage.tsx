import { useState } from 'react';
import { Utensils } from 'lucide-react';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function FoodImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}: FoodImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2A060C] via-[#1F191B] to-[#4A0D17] text-[#F5EBE1]/70 p-4 text-center"
        role="img"
        aria-label={alt}
      >
        <Utensils className="w-7 h-7 text-[#E5A93C]/70 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-[#FFF8EE]/80 line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
