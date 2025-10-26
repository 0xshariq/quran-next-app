'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import versesData from '@/data/halal-jar.json'

type Emotion = keyof typeof versesData
type Verse = {
  verse: string
  text: string
  translation: string
}

export default function HalalJar() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null)
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null)

  const handleEmotionClick = (emotion: Emotion) => {
    setSelectedEmotion(emotion)
    getRandomVerse(emotion)
  }

  const getRandomVerse = (emotion: Emotion) => {
    const verses = versesData[emotion]
    const randomIndex = Math.floor(Math.random() * verses.length)
    const verse = verses[randomIndex]
    setCurrentVerse({
      verse: verse.verse,
      text: verse.text,
      translation: verse.translation
    })
  }

  const handleGetAnotherVerse = () => {
    if (selectedEmotion) {
      getRandomVerse(selectedEmotion)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-[#e6d7c3] dark:bg-slate-800 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-amber-800 dark:text-amber-200">
            I&apos;m feeling...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {(Object.keys(versesData) as Emotion[]).map((emotion) => (
              <Button
                key={emotion}
                onClick={() => handleEmotionClick(emotion)}
                variant="outline"
                className="bg-[#d9c8b4] text-amber-800 border-amber-600 hover:bg-[#c9b8a4] dark:bg-slate-700 dark:text-amber-200 dark:border-amber-400 dark:hover:bg-slate-600"
              >
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              </Button>
            ))}
          </div>
          {currentVerse && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-200 font-amiri">{currentVerse.verse}</h2>
                <p className="text-right font-arabic text-lg text-amber-900 dark:text-amber-100">{currentVerse.text}</p>
                <p className="italic text-amber-700 dark:text-amber-300">{currentVerse.translation}</p>
              </div>
              <Button
                onClick={handleGetAnotherVerse}
                className="w-full bg-[#b0a090] text-amber-50 hover:bg-[#a09080] dark:bg-amber-700 dark:text-slate-100 dark:hover:bg-amber-600"
              >
                Get Another Verse
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}