'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Volume2,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Bookmark
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import reciters from '@/data/reciter.json'
import surahs from '@/data/surah.json'

interface VerseData {
  text: string
  translation: string
  surah: {
    name: string
    englishName: string
    englishNameTranslation: string
    revelationType: string
    numberOfAyahs: number
    number: number
  }
}

interface BookmarkData {
  id: number
  surah: string
  verse: number
  text: string
}

interface Reciter {
  id: number
  name: string
  subfolder: string
}

interface Surah {
  number: number
  name: string
  englishName: string
  verses: number
  revelationPlace: string
}

const getSurahInfo = (surahName: string): Surah => {
  const surah = (surahs as Surah[]).find((s) => s.name === surahName)
  return (
    surah || {
      number: 1,
      name: 'Al-Fatihah',
      englishName: 'The Opening',
      revelationPlace: 'Meccan',
      verses: 7,
    }
  )
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

function VerseTranslationContent() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedQari, setSelectedQari] = useState(1)
  const [isLooping, setIsLooping] = useState(false)
  const [showNextVersePrompt, setShowNextVersePrompt] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [verseData, setVerseData] = useState<VerseData | null>(null)
  const [versePictureUrl, setVersePictureUrl] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [currentSurah, setCurrentSurah] = useState('')
  const [currentVerse, setCurrentVerse] = useState(1)

  useEffect(() => {
    const surah = searchParams.get('surah') || 'Al-Fatihah'
    const verse = parseInt(searchParams.get('verse') || '1', 10)
    setCurrentSurah(surah)
    setCurrentVerse(verse)
  }, [searchParams])

  useEffect(() => {
    fetchVerseData()
  }, [currentSurah, currentVerse, selectedLanguage, selectedQari])

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quranBookmarks')
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  useEffect(() => {
    if (showNextVersePrompt) {
      setTimeRemaining(3)
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            handleNextVerse()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [showNextVersePrompt])

  useEffect(() => {
    router.push(`/verse-translation/?surah=${currentSurah}&verse=${currentVerse}`)
  }, [currentSurah, currentVerse, router])

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.addEventListener('ended', handleAudioEnd)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd)
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audioRef.current.pause()
      }
    }
  }, [audioUrl])

  const fetchVerseData = useCallback(async () => {
    if (!currentVerse || isNaN(currentVerse)) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid verse number',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const lang = selectedLanguage === 'ur' ? 'ur.ahmedali' : 'en.asad'
      const surahInfo = getSurahInfo(currentSurah)
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surahInfo.number}:${currentVerse}/${lang}`
      )
      if (!response.ok) {
        throw new Error('Invalid verse number or API error')
      }

      const result = await response.json()
      setVerseData(result.data)
      setVersePictureUrl(
        `https://cdn.islamic.network/quran/images/${surahInfo.number}_${currentVerse}.png`
      )

      const selectedReciter = reciters.find(
        (r: Reciter) => r.id === selectedQari
      )
      if (selectedReciter) {
        const audioUrl = `https://everyayah.com/data/${
          selectedReciter.subfolder
        }/${surahInfo.number.toString().padStart(3, '0')}${currentVerse
          .toString()
          .padStart(3, '0')}.mp3`
        setAudioUrl(audioUrl)
      }
    } catch (err) {
      toast({
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      })
      setVerseData(null)
      setAudioUrl(null)
    } finally {
      setIsLoading(false)
    }
  }, [currentSurah, currentVerse, selectedLanguage, selectedQari, toast])

  const addBookmark = useCallback(() => {
    if (verseData) {
      const newBookmark: BookmarkData = {
        id: Date.now(),
        surah: currentSurah,
        verse: currentVerse,
        text: verseData.text,
      }
      const updatedBookmarks = [...bookmarks, newBookmark]
      setBookmarks(updatedBookmarks)
      localStorage.setItem('quranBookmarks', JSON.stringify(updatedBookmarks))
      toast({
        title: 'Bookmark Added',
        description: `Surah ${currentSurah}, Verse ${currentVerse} has been bookmarked.`,
      })
    }
  }, [bookmarks, currentSurah, currentVerse, verseData, toast])

  const isBookmarked = bookmarks.some(
    (b) => b.surah === currentSurah && b.verse === currentVerse
  )


  const handleReset = useCallback(() => {
    setCurrentSurah('Al-Fatihah')
    setCurrentVerse(1)
  }, [])

  const handleNextVerse = useCallback(() => {
    const currentSurahInfo = getSurahInfo(currentSurah)
    if (currentVerse < currentSurahInfo.verses) {
      setCurrentVerse((prev) => prev + 1)
    } else {
      const nextSurahIndex =
        (surahs as Surah[]).findIndex((s) => s.name === currentSurah) + 1
      if (nextSurahIndex < surahs.length) {
        setCurrentSurah(surahs[nextSurahIndex].name)
        setCurrentVerse(1)
      }
    }
    setShowNextVersePrompt(false)
  }, [currentSurah, currentVerse])

  const handlePreviousVerse = useCallback(() => {
    if (currentVerse > 1) {
      setCurrentVerse((prev) => prev - 1)
    } else {
      const prevSurahIndex =
        (surahs as Surah[]).findIndex((s) => s.name === currentSurah) - 1
      if (prevSurahIndex >= 0) {
        setCurrentSurah(surahs[prevSurahIndex].name)
        setCurrentVerse(surahs[prevSurahIndex].verses)
      }
    }
  }, [currentSurah, currentVerse])

  const handleAudioEnd = useCallback(() => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else {
      setIsPlaying(false)
      setShowNextVersePrompt(true)
    }
  }, [isLooping])

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Audio playback failed:', error)
          
          toast({
            title: 'Playback Error',
            description: 'Unable to play audio. Please try again.',
            variant: 'destructive',
          })
        })
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying, toast])

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }, [])

  const Controls = () => (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div className="flex flex-col w-24">
        <Label htmlFor="surah-input" className="mb-1">
          Surah
        </Label>
        <Select
          value={currentSurah}
          onValueChange={(value) => {
            setCurrentSurah(value)
            setCurrentVerse(1)
          }}
        >
          <SelectTrigger id="surah-input" className="w-full">
            <SelectValue>{currentSurah}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(surahs as Surah[]).map((surah) => (
              <SelectItem key={surah.number} value={surah.name}>
                {surah.number})&nbsp;{surah.name} ({surah.verses}) -{' '}
                {surah.englishName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col w-24">
        <Label htmlFor="verse-input" className="mb-1">
          Verse
        </Label>
        <Input
          id="verse-input"
          type="number"
          value={currentVerse}
          onChange={(e) => setCurrentVerse(Number(e.target.value))}
          placeholder="Verse"
          className="w-full"
          aria-label="Verse number"
        />
      </div>
      <div className="flex flex-col w-[180px]">
        <Label htmlFor="language-select" className="mb-1">
          Language
        </Label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger id="language-select" className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ur">Urdu</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={isBookmarked ? () => {} : addBookmark}
        variant="outline"
        className={`border-amber-300 dark:border-slate-600 ${
          isBookmarked ? 'text-amber-500' : 'text-amber-700 dark:text-amber-300'
        }`}
        disabled={isBookmarked}
      >
        <Bookmark className="h-4 w-4 mr-2" aria-hidden="true" />
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </Button>
      <Button
        onClick={handleReset}
        variant="outline"
        className="border-red-500 text-red-500"
      >
        <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
        Reset
      </Button>
      <div className="flex flex-col w-[180px]">
        <Label htmlFor="qari-select" className="mb-1">
          Qari
        </Label>
        <Select
          value={selectedQari.toString()}
          onValueChange={(value) => setSelectedQari(Number(value))}
        >
          <SelectTrigger id="qari-select" className="w-full">
            <SelectValue placeholder="Select Qari" />
          </SelectTrigger>
          <SelectContent>
            {reciters.map((reciter: Reciter) => (
              <SelectItem key={reciter.id} value={reciter.id.toString()}>
                {reciter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const VerseDisplay = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200">
        Surah: {verseData?.surah.name} (Verse {currentVerse})
      </h2>
      <div className="relative w-full h-[400px] mt-4 bg-white">
        <Image
          src={versePictureUrl}
          alt={`Verse ${currentVerse} of Surah ${verseData?.surah.name}`}
          fill
          className="rounded-lg shadow-lg object-contain"
        />
      </div>
      <div className="mt-4 flex items-center justify-center">
        <p className="text-2xl text-amber-800 dark:text-amber-200 font-arabic mr-2">
          {verseData?.text}
        </p>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400 mb-20">
        {verseData?.translation}
      </p>
    </div>
  )

  const NavigationButtons = () => (
    <div className="flex justify-between mt-4">
      <Button
        onClick={handlePreviousVerse}
        disabled={currentSurah === surahs[0].name && currentVerse === 1}
      >
        <ChevronLeft className="h-5 w-5 mr-2" aria-hidden="true" />
        Previous
      </Button>
      <Button onClick={handleNextVerse}>
        Next
        <ChevronRight className="h-5 w-5 ml-2" aria-hidden="true" />
      </Button>
    </div>
  )

  const AudioControls = () => (
    <div className="mt-4 flex flex-col items-center">
      <div className="flex items-center space-x-4 mb-2">
        <Button
          onClick={handlePreviousVerse}
          variant="outline"
          size="icon"
          disabled={currentSurah === surahs[0].name && currentVerse === 1}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          onClick={toggleAudio}
          variant="outline"
          size="icon"
          className="text-amber-600 dark:text-amber-400"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>
        <Button onClick={handleNextVerse} variant="outline" size="icon">
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setIsLooping(!isLooping)}
          variant="outline"
          size="icon"
          className={isLooping ? 'text-amber-600 dark:text-amber-400' : ''}
        >
          <Repeat className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-full max-w-md flex items-center space-x-2">
        <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="flex-grow"
        />
        <span className="text-sm text-gray-500">{formatTime(duration)}</span>
      </div>
    </div>
  )

  const AlertBox = () => (
    <AlertDialog
      open={showNextVersePrompt}
      onOpenChange={setShowNextVersePrompt}
    >
      <AlertDialogContent className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-amber-800 dark:text-amber-200">
            Next Verse
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            Do you want to go to the next verse? (Automatically proceeding in{' '}
            {timeRemaining} seconds)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setShowNextVersePrompt(false)}
            className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleNextVerse}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardContent className="p-6 space-y-6">
            <Controls />

            {isLoading && (
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-amber-600 dark:text-amber-400" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading...
                </p>
              </div>
            )}

            {verseData && !isLoading && (
              <>
                <VerseDisplay />
                <NavigationButtons />
                <AudioControls />
              </>
            )}
          </CardContent>
        </Card>
      </main>
      
      <AlertBox />
    </div>
    </Suspense>
  )
}
export default function VerseTranslation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerseTranslationContent />
    </Suspense>
  )
}