'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  score: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-2xl">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gray-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-6xl font-bold text-white text-center mt-16 mb-16 animate-fade-in">
          Leaderboard
        </h1>

        <div className="flex-grow flex items-center justify-center">
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-2xl max-w-md w-full animate-scale-in">
            <div className="space-y-6">
              {users.length === 0 ? (
                <div className="text-gray-400 text-lg text-center animate-fade-in">No players yet</div>
              ) : (
                users.map((user, index) => (
                  <div key={user.id} className="flex justify-between text-white text-lg animate-slide-in-left"
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <span className="flex items-center">
                      <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      {user.username}
                    </span>
                    <span className="font-semibold">{user.score} points</span>
                  </div>
                ))
              )}
            </div>

            <Link href="/">
              <button className="w-full mt-8 bg-white text-black hover:bg-gray-200 font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white">
                Back to Game
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}