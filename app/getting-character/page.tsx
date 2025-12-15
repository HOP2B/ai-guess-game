"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [inputs, setInputs] = useState<string[]>([]);

  return (
      <div className="p-5 flex flex-col min-h-screen bg-blue-400 text-black">
        <div className="text-center">
          <h1>Search if necessary</h1>
          <Image src="" alt="Character Image" width={400} height={600} />
          <h1>Character Name</h1>
          <div className="mt-30">
            <h1>Words you must avoid:</h1>
            <h1>NOW, provide a hint for the ai</h1>
            <input type="text" placeholder="Describe the character..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && inputs.length < 3 && inputValue.trim() !== '') { setInputs([...inputs, inputValue]); setInputValue(''); } }} disabled={inputs.length >= 3} className="bg-white bg-opacity-20 text-black m-5 px-4 py-2 rounded w-100" />
            {inputs.map((text, index) => (
              <div key={index} className="flex items-center justify-center justify-between gap-2">
                <p>{text}</p>
                <button onClick={() => setInputs(inputs.filter((_, i) => i !== index))} className="flex items-center justify-center w-5 h-5 px-1 py-0.5 bg-transparent bg-opacity-50 text-white rounded text-sm">x</button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto flex justify-between">
          <button className="px-8 py-4 bg-gray-100 text-black rounded-xl text-lg">Back</button>
          <button className="px-8 py-4 bg-gray-100 text-black rounded-xl text-lg">Next</button>
        </div>
      </div>
  );
}
