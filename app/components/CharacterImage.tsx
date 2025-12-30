"use client";

import Image from 'next/image';

export default function CharacterImage({
  src,
  alt,
  size = 'medium',
  aspect = '2/3',
  className = '',
}: {
  src?: string | null;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  aspect?: '2/3' | '4/3' | '1/1';
  className?: string;
}) {
  const maxWidths: Record<string, string> = {
    small: 'max-w-[320px]',
    medium: 'max-w-[480px]',
    large: 'max-w-[720px]',
  };

  const aspectClass = aspect === '4/3' ? 'aspect-[4/3]' : aspect === '1/1' ? 'aspect-square' : 'aspect-[2/3]';

  const placeholder = 'https://via.placeholder.com/720x1080?text=No+Image';

  return (
    <div className={`mx-auto w-full ${maxWidths[size]} ${aspectClass} relative ${className}`}>
      <Image
        src={src || placeholder}
        alt={alt || 'image'}
        fill
        sizes="(max-width: 640px) 90vw, 640px"
        className="rounded-lg shadow-2xl border border-gray-700 object-cover"
        loading="eager"
        priority
      />
    </div>
  );
}
