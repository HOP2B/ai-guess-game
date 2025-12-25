'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

  const handleThemeClick = (themeId: number) => {
    router.push(`/character?theme=${themeId}`);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-2xl">Loading themes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gray-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-6xl font-bold text-white text-center mt-16 mb-16 animate-fade-in">
          Choose a Theme
        </h1>

        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-7xl w-full">
            <div className="grid grid-cols-2 gap-12 mb-40">
              {themes.map((theme, index) => (
                <div
                  key={theme.id}
                  onClick={() => handleThemeClick(theme.id)}
                  className={`w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-16 px-20 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white text-5xl cursor-pointer relative overflow-hidden h-80 animate-scale-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={theme.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={theme.name}
                    className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300 hover:opacity-80"
                    onError={(e) => { console.log('Image failed to load:', theme.imageUrl); e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded px-3 py-2">
                    <span className="text-white text-lg font-medium">{theme.name}</span>
                    <span className="text-gray-300 text-sm block">({theme._count.characters} characters)</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 animate-fade-in delay-500">
              <Link href="/">
                <button className="bg-white text-black hover:bg-gray-200 font-semibold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white text-lg">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}