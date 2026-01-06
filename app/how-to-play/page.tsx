"use client";

import { useRouter } from 'next/navigation';

export default function HowToPlay() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black flex flex-col p-4 relative overflow-hidden text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gray-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gray-600 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gray-500 rounded-full animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">How to Play AI Guess Game</h1>

        <div className="space-y-6 text-lg leading-relaxed animate-slide-up">
          <section className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Objective</h2>
            <p>
              The goal of AI Guess Game is to provide hints to an AI so it can correctly guess the character you're thinking of.
              You'll earn points for each successful guess!
            </p>
          </section>

          <section className="animate-fade-in delay-100">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Enter your username on the home page</li>
              <li>Click "Play" to start</li>
              <li>Choose a theme from the available options</li>
              <li>A random character from that theme will be selected for you</li>
            </ol>
          </section>

          <section className="animate-fade-in delay-200">
            <h2 className="text-2xl font-semibold mb-4">Creating Hints</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Look at the character image and read the forbidden words</li>
              <li>Forbidden words cannot be used in your hints</li>
              <li>Type descriptive hints in the input field</li>
              <li>Click "Add Hint" to add each hint to your list</li>
              <li>You can add up to 3 hints</li>
              <li>Be creative but avoid the forbidden words!</li>
            </ul>
          </section>

          <section className="animate-fade-in delay-300">
            <h2 className="text-2xl font-semibold mb-4">Submitting Hints</h2>
            <p>
              Once you've added your hints, click "Submit Hints". The AI will analyze your hints and try to guess the character.
              If the AI guesses correctly, you'll earn points and can continue with more characters in the theme.
            </p>
          </section>

          <section className="animate-fade-in delay-400">
            <h2 className="text-2xl font-semibold mb-4">Scoring</h2>
            <p>
              You earn points for each character the AI guesses correctly. The more characters you help the AI guess in a theme,
              the higher your score! Check the leaderboard to see how you rank against other players.
            </p>
          </section>

          <section className="animate-fade-in delay-500">
            <h2 className="text-2xl font-semibold mb-4">Tips for Success</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Use creative descriptions that don't include the forbidden words</li>
              <li>Think about unique characteristics of the character</li>
              <li>Multiple hints work better than one - give the AI more information</li>
              <li>Remember, the AI is guessing from all characters in the theme</li>
            </ul>
          </section>
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 animate-fade-in delay-500 px-4">
          <button
            onClick={() => router.back()}
            className="w-full max-w-xs bg-white text-black hover:bg-gray-200 font-semibold py-5 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black text-lg min-h-[60px] touch-manipulation"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
}