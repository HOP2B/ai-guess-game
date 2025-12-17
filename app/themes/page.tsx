'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Theme {
  id: number;
  name: string;
  imageUrl: string | null;
  _count: {
    characters: number;
  };
}

export default function Themes() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch('/api/themes');
        if (response.ok) {
          const data = await response.json();
          setThemes(data.themes);
        }
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading themes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col p-4">
      <h1 className="text-6xl font-bold text-white text-center mt-16 mb-16">
        Choose a Theme
      </h1>

      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-2 gap-12 mb-40">
            {themes.map((theme) => (
              <Link key={theme.id} href={`/character?theme=${theme.id}`}>
                <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-16 px-20 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 text-5xl cursor-pointer relative overflow-hidden h-80">
                  <img src={theme.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} alt={theme.name} className="w-full h-full object-cover absolute inset-0" onError={(e) => { console.log('Image failed to load:', theme.imageUrl); e.currentTarget.style.display = 'none'; }} />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded px-2 py-1">
                    <span className="text-white text-lg">{theme.name} ({theme._count.characters} characters)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/">
              <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 text-lg">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}