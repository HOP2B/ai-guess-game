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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col p-4">
      <h1 className="text-6xl font-bold text-white text-center mt-16 mb-16">
        Leaderboard
      </h1>

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
          <div className="space-y-6">
            {users.length === 0 ? (
              <div className="text-white text-lg text-center">No players yet</div>
            ) : (
              users.map((user, index) => (
                <div key={user.id} className="flex justify-between text-white text-lg">
                  <span>{index + 1}. {user.username}</span>
                  <span>{user.score} points</span>
                </div>
              ))
            )}
          </div>

          <Link href="/">
            <button className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Back to Game
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}