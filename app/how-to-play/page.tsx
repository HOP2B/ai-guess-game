"use client";

import { useRouter } from 'next/navigation';
import { useSound } from '../hooks/useSound';
import { useState } from 'react';

export default function HowToPlay() {
  const router = useRouter();
  const { playClick } = useSound();
  const [language, setLanguage] = useState<'en' | 'mn'>('mn');

  const translations = {
    en: {
      title: "How to Play",
      step1: "Enter Username",
      step1Desc: "Username input",
      step1Text: "Start by entering your username",
      step2: "Choose Theme",
      step2Text: "Pick a character theme",
      step3: "Study Character",
      step3Text: "View character & avoid forbidden words",
      step4: "Add Hints",
      step4Text: "Create descriptive hints (up to 3)",
      step5: "Submit & Win Points",
      step5Text: "AI guesses correctly = points earned!",
      proTip: "💡 Pro Tip",
      proTipText: "Use creative descriptions! Multiple hints help the AI guess better.",
      backButton: "Back to Game",
      theme1: "Theme 1",
      theme2: "Theme 2",
      forbidden: "Forbidden: word1, word2",
      charDesc: "Character image + forbidden words",
      addButton: "Add",
      hint1: "Hint 1",
      submitButton: "Submit Hints",
      correct: "✓ Correct!",
      points: "+10 points"
    },
    mn: {
      title: "Хэрхэн тоглох вэ",
      step1: "Хэрэглэгчийн нэр оруулах",
      step1Desc: "Нэр оруулах талбар",
      step1Text: "Тоглоомоо эхлэхийн тулд нэрээ оруулна",
      step2: "Сэдэв сонгох",
      step2Text: "Дүрийн сэдвийг сонгоно",
      step3: "Дүрийг судлах",
      step3Text: "Дүрийг хараад хориглосон үгсийг бүү ашигла",
      step4: "Санамж нэмэх",
      step4Text: "Тайлбарласан санамж бич (хамгийн ихдээ 3)",
      step5: "Илгээж оноо авах",
      step5Text: "AI зөв таавал оноо авна!",
      proTip: "💡 Зөвлөгөө",
      proTipText: "Бүтээлчээр тайлбарла! Олон санамж AI-д илүү сайн таахад тусална.",
      backButton: "Тоглоом руу буцах",
      theme1: "Сэдэв 1",
      theme2: "Сэдэв 2",
      forbidden: "Хориглосон: үг1, үг2",
      charDesc: "Дүрийн зураг + хориглосон үгс",
      addButton: "Нэмэх",
      hint1: "Санамж 1",
      submitButton: "Санамж илгээх",
      correct: "✓ Зөв!",
      points: "+10 оноо"
    }
  };

  const t = translations[language];

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
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'mn' : 'en')}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 transition-colors duration-200"
          >
            {language === 'en' ? '🇲🇳 MN' : '🇺🇸 EN'}
          </button>
        </div>
        <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">
          {t.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {/* Step 1 */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 animate-fade-in">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
              <h3 className="text-xl font-semibold">{t.step1}</h3>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-3 h-24 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-8 bg-gray-600 rounded mx-auto mb-2"></div>
                <div className="text-xs text-gray-400">{t.step1Desc}</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">{t.step1Text}</p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 animate-fade-in delay-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
              <h3 className="text-xl font-semibold">{t.step2}</h3>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-3 h-24 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-600 rounded p-2 text-center text-xs">{t.theme1}</div>
                <div className="bg-gray-600 rounded p-2 text-center text-xs">{t.theme2}</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">{t.step2Text}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 animate-fade-in delay-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
              <h3 className="text-xl font-semibold">{t.step3}</h3>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-3 h-24 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-16 bg-gray-600 rounded"></div>
                <div className="flex-1">
                  <div className="text-xs text-red-400 mb-1">
                    {t.forbidden}
                  </div>
                  <div className="text-xs text-gray-400">
                    {t.charDesc}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              {t.step3Text}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 animate-fade-in delay-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold mr-3">4</div>
              <h3 className="text-xl font-semibold">{t.step4}</h3>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-3 h-24 flex items-center justify-center">
              <div className="space-y-2 w-full">
                <div className="flex space-x-2">
                  <div className="flex-1 h-6 bg-gray-600 rounded"></div>
                  <div className="w-16 h-6 bg-green-600 rounded text-xs flex items-center justify-center">
                    {t.addButton}
                  </div>
                </div>
                <div className="h-4 bg-gray-700 rounded text-xs flex items-center px-2">
                  {t.hint1}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              {t.step4Text}
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 animate-fade-in delay-400 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold mr-3">5</div>
              <h3 className="text-xl font-semibold">{t.step5}</h3>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 mb-3 h-24 flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="w-20 h-8 bg-blue-600 rounded mb-1"></div>
                  <div className="text-xs text-gray-400">{t.submitButton}</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="text-green-400 text-lg font-bold">
                    {t.correct}
                  </div>
                  <div className="text-xs text-gray-400">
                    {t.points}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              {t.step5Text}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center animate-fade-in delay-500">
          <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-4 inline-block">
            <div className="text-yellow-300 font-semibold mb-2">
              {t.proTip}
            </div>
            <div className="text-sm text-gray-300">
              {t.proTipText}
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 animate-fade-in delay-500 px-4 pt-10">
          <button
            onClick={() => {
              playClick();
              router.back();
            }}
            className="w-full max-w-xs bg-white text-black hover:bg-gray-200 font-semibold py-5 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black text-lg min-h-[60px] touch-manipulation"
          >
            {t.backButton}
          </button>
        </div>
      </div>
    </div>
  );
}
