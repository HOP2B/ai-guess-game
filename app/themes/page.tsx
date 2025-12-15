'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Theme {
  id: number;
  name: string;
  image: string;
}

export default function Themes() {
  const [themes, setThemes] = useState<Theme[]>([
    { id: 1, name: 'historical', image: 'https://i.pinimg.com/736x/0f/5a/26/0f5a26c4a9bda3ae056cb625d585cd9a.jpg' },
    { id: 2, name: 'attack on titan', image: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/10/the-survey-corps-in-attack-on-titan.jpg?q=49&fit=crop&w=825&dpr=2' },
    { id: 3, name: 'harry potter', image: 'https://i.pinimg.com/736x/cb/0d/0c/cb0d0ceb2d5c075a4cafc1829a0ea159.jpg' },
    { id: 7, name: 'superheroes', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8KxddOPMhSD4l3JZlGSx3v4pkcUvTkJP-xQ&s' },
    { id: 4, name: 'celebrities', image: 'https://i.pinimg.com/736x/86/14/ca/8614ca4dbcd1f475f218dbdd05cf56c3.jpg' },
    { id: 5, name: 'footballers', image: 'https://sportsandgames.co.tt/wp-content/uploads/2022/05/blog_football.jpg' },
    { id: 6, name: 'demon slayer', image: 'https://i.pinimg.com/1200x/f7/65/7f/f7657fb7cb0fccd376496f3c757a503d.jpg' },
  ]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col p-4">
      <h1 className="text-6xl font-bold text-white text-center mt-16 mb-16">
        Choose a Theme
      </h1>

      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-3 gap-10 mb-40">
            {themes.map((theme) => (
              <Link key={theme.id} href={`/character?theme=${theme.id}`}>
                <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-12 px-16 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 text-4xl cursor-pointer relative overflow-hidden">
                  <img src={theme.image} alt={theme.name} className="w-full h-full object-cover absolute inset-0" onError={(e) => { console.log('Image failed to load:', theme.image); e.currentTarget.style.display = 'none'; }} />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded px-2 py-1">
                    <span className="text-white text-lg">{theme.name}</span>
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