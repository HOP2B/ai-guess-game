import Link from 'next/link';

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col p-4">
      <h1 className="text-6xl font-bold text-white text-center mt-16 mb-16">
        Leaderboard
      </h1>

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
          <div className="space-y-6">
            <div className="flex justify-between text-white text-lg">
              <span>Player1</span>
              <span>100 points</span>
            </div>
            <div className="flex justify-between text-white text-lg">
              <span>Player2</span>
              <span>90 points</span>
            </div>
            <div className="flex justify-between text-white text-lg">
              <span>Player3</span>
              <span>80 points</span>
            </div>
            <div className="flex justify-between text-white text-lg">
              <span>Player4</span>
              <span>70 points</span>
            </div>
            <div className="flex justify-between text-white text-lg">
              <span>Player5</span>
              <span>60 points</span>
            </div>
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