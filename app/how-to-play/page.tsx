import Link from 'next/link';

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-700 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">How to Play AI Guess Game</h1>

        <div className="space-y-6 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Objective</h2>
            <p>
              The goal of AI Guess Game is to provide hints to an AI so it can correctly guess the character you're thinking of.
              You'll earn points for each successful guess!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Enter your username on the home page</li>
              <li>Click "Play" to start</li>
              <li>Choose a theme from the available options</li>
              <li>A random character from that theme will be selected for you</li>
            </ol>
          </section>

          <section>
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

          <section>
            <h2 className="text-2xl font-semibold mb-4">Submitting Hints</h2>
            <p>
              Once you've added your hints, click "Submit Hints". The AI will analyze your hints and try to guess the character.
              If the AI guesses correctly, you'll earn points and can continue with more characters in the theme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Scoring</h2>
            <p>
              You earn points for each character the AI guesses correctly. The more characters you help the AI guess in a theme,
              the higher your score! Check the leaderboard to see how you rank against other players.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tips for Success</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Use creative descriptions that don't include the forbidden words</li>
              <li>Think about unique characteristics of the character</li>
              <li>Multiple hints work better than one - give the AI more information</li>
              <li>Remember, the AI is guessing from all characters in the theme</li>
            </ul>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <button className="bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}