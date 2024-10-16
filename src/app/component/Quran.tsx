'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Menu,
  Moon,
  Sun,
  RefreshCw,
  BookOpen,
  Bookmark,
  HelpCircle,
  Home,
  Volume2,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
} from "lucide-react"

interface VerseData {
  text: string
  translation: string
  surah: {
    name: string
    englishName: string
    englishNameTranslation: string
    revelationType: string
    numberOfAyahs: number
  }
}

interface SearchResult {
  surah: {
    number: number
    englishName: string
  }
  numberInSurah: number
  text: string
}

interface BookmarkData {
  id: number
  surah: number
  verse: number
  text: string
}

interface Reciter {
  id: number
  name: string
  subfolder: string
}

export default function Component() {
  const [currentVerse, setCurrentVerse] = useState<number>(1)
  const [currentSurah, setCurrentSurah] = useState<number>(1)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [verseData, setVerseData] = useState<VerseData | null>(null)
  const [versePictureUrl, setVersePictureUrl] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [selectedQari, setSelectedQari] = useState<number>(1)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [isLooping, setIsLooping] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  const reciters: Reciter[] = [
    {
      id: 1,
      name: "Abdul Basit Murattal",
      subfolder: "Abdul_Basit_Murattal_64kbps",
    },
    {
      id: 2,
      name: "Abdul Basit Murattal",
      subfolder: "Abdul_Basit_Murattal_192kbps",
    },
    {
      id: 3,
      name: "Abdul Basit Mujawwad",
      subfolder: "Abdul_Basit_Mujawwad_128kbps",
    },
    { id: 4, name: "Abdullah Basfar", subfolder: "Abdullah_Basfar_32kbps" },
    { id: 5, name: "Abdullah Basfar", subfolder: "Abdullah_Basfar_64kbps" },
    { id: 6, name: "Abdullah Basfar", subfolder: "Abdullah_Basfar_192kbps" },
    {
      id: 7,
      name: "Abdurrahmaan As-Sudais",
      subfolder: "Abdurrahmaan_As-Sudais_64kbps",
    },
    {
      id: 8,
      name: "Abdurrahmaan As-Sudais",
      subfolder: "Abdurrahmaan_As-Sudais_192kbps",
    },
    {
      id: 9,
      name: "AbdulSamad QuranExplorer.Com",
      subfolder: "AbdulSamad_64kbps_QuranExplorer.Com",
    },
    {
      id: 10,
      name: "Abu Bakr Ash-Shaatree",
      subfolder: "Abu_Bakr_Ash-Shaatree_64kbps",
    },
    {
      id: 11,
      name: "Abu Bakr Ash-Shaatree",
      subfolder: "Abu_Bakr_Ash-Shaatree_128kbps",
    },
    {
      id: 12,
      name: "Ahmed ibn Ali al-Ajamy QuranExplorer.Com",
      subfolder: "Ahmed_ibn_Ali_al-Ajamy_64kbps_QuranExplorer.Com",
    },
    {
      id: 13,
      name: "Ahmed ibn Ali al-Ajamy KetabAllah.Net",
      subfolder: "Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net",
    },
    { id: 14, name: "Alafasy", subfolder: "Alafasy_64kbps" },
    { id: 15, name: "Alafasy", subfolder: "Alafasy_128kbps" },
    { id: 16, name: "Ghamadi", subfolder: "Ghamadi_40kbps" },
    { id: 17, name: "Hani Rifai", subfolder: "Hani_Rifai_64kbps" },
    { id: 18, name: "Hani Rifai", subfolder: "Hani_Rifai_192kbps" },
    { id: 19, name: "Husary", subfolder: "Husary_64kbps" },
    { id: 20, name: "Husary", subfolder: "Husary_128kbps" },
    { id: 21, name: "Husary Mujawwad", subfolder: "Husary_Mujawwad_64kbps" },
    { id: 22, name: "Husary Mujawwad", subfolder: "Husary_128kbps_Mujawwad" },
    { id: 23, name: "Hudhaify", subfolder: "Hudhaify_32kbps" },
    { id: 24, name: "Hudhaify", subfolder: "Hudhaify_64kbps" },
    { id: 25, name: "Hudhaify", subfolder: "Hudhaify_128kbps" },
    { id: 26, name: "Ibrahim Akhdar", subfolder: "Ibrahim_Akhdar_32kbps" },
    { id: 27, name: "Ibrahim Akhdar", subfolder: "Ibrahim_Akhdar_64kbps" },
    { id: 28, name: "Maher Al Muaiqly", subfolder: "Maher_AlMuaiqly_64kbps" },
    { id: 29, name: "Maher Al Muaiqly", subfolder: "MaherAlMuaiqly128kbps" },
    { id: 30, name: "Menshawi", subfolder: "Menshawi_16kbps" },
    { id: 31, name: "Menshawi", subfolder: "Menshawi_32kbps" },
    {
      id: 32,
      name: "Minshawy Mujawwad",
      subfolder: "Minshawy_Mujawwad_64kbps",
    },
    {
      id: 33,
      name: "Minshawy Mujawwad",
      subfolder: "Minshawy_Mujawwad_192kbps",
    },
    {
      id: 34,
      name: "Minshawy Murattal",
      subfolder: "Minshawy_Murattal_128kbps",
    },
    {
      id: 35,
      name: "Mohammad al Tablaway",
      subfolder: "Mohammad_al_Tablaway_64kbps",
    },
    {
      id: 36,
      name: "Mohammad al Tablaway",
      subfolder: "Mohammad_al_Tablaway_128kbps",
    },
    { id: 37, name: "Muhammad Ayyoub", subfolder: "Muhammad_Ayyoub_128kbps" },
    { id: 38, name: "Muhammad Ayyoub", subfolder: "Muhammad_Ayyoub_64kbps" },
    { id: 39, name: "Muhammad Ayyoub", subfolder: "Muhammad_Ayyoub_32kbps" },
    { id: 40, name: "Muhammad Jibreel", subfolder: "Muhammad_Jibreel_64kbps" },
    { id: 41, name: "Muhammad Jibreel", subfolder: "Muhammad_Jibreel_128kbps" },
    { id: 42, name: "Mustafa Ismail", subfolder: "Mustafa_Ismail_48kbps" },
    {
      id: 43,
      name: "Saood bin Ibraaheem Ash-Shuraym",
      subfolder: "Saood_ash-Shuraym_64kbps",
    },
    {
      id: 44,
      name: "Saood bin Ibraaheem Ash-Shuraym",
      subfolder: "Saood_ash-Shuraym_128kbps",
    },
    {
      id: 45,
      name: "(English) Translated by Sahih International Recited by Ibrahim Walk",
      subfolder: "English/Sahih_Intnl_Ibrahim_Walk_192kbps",
    },
    {
      id: 46,
      name: "MultiLanguage/Basfar Walk",
      subfolder: "MultiLanguage/Basfar_Walk_192kbps",
    },
    {
      id: 47,
      name: "(Persian) Translated by Makarem Recited by Kabiri",
      subfolder: "translations/Makarem_Kabiri_16Kbps",
    },
    {
      id: 48,
      name: "(Persian) Translated by Fooladvand Recited by Hedayatfar",
      subfolder: "translations/Fooladvand_Hedayatfar_40Kbps",
    },
    { id: 49, name: "Parhizgar", subfolder: "Parhizgar_48kbps" },
    { id: 50, name: "Balayev", subfolder: "translations/azerbaijani/balayev" },
    {
      id: 51,
      name: "Salaah AbdulRahman Bukhatir",
      subfolder: "Salaah_AbdulRahman_Bukhatir_128kbps",
    },
    { id: 52, name: "Muhsin Al Qasim", subfolder: "Muhsin_Al_Qasim_192kbps" },
    {
      id: 53,
      name: "Abdullaah 3awwaad Al-Juhaynee",
      subfolder: "Abdullaah_3awwaad_Al-Juhaynee_128kbps",
    },
    { id: 54, name: "Salah Al Budair", subfolder: "Salah_Al_Budair_128kbps" },
    { id: 55, name: "Abdullah Matroud", subfolder: "Abdullah_Matroud_128kbps" },
    { id: 56, name: "Ahmed Neana", subfolder: "Ahmed_Neana_128kbps" },
    {
      id: 57,
      name: "Muhammad AbdulKareem",
      subfolder: "Muhammad_AbdulKareem_128kbps",
    },
    {
      id: 58,
      name: "Khalefa Al-Tunaiji",
      subfolder: "khalefa_al_tunaiji_64kbps",
    },
    {
      id: 59,
      name: "Mahmoud Ali Al-Banna",
      subfolder: "mahmoud_ali_al_banna_32kbps",
    },
    {
      id: 60,
      name: "(Warsh) Ibrahim Al-Dosary",
      subfolder: "warsh/warsh_ibrahim_aldosary_128kbps",
    },
    {
      id: 61,
      name: "(Warsh) Yassin Al-Jazaery",
      subfolder: "warsh/warsh_yassin_al_jazaery_64kbps",
    },
    {
      id: 62,
      name: "(Warsh) Abdul Basit",
      subfolder: "warsh/warsh_Abdul_Basit_128kbps",
    },
    {
      id: 63,
      name: "(Urdu) Shamshad Ali Khan",
      subfolder: "translations/urdu_shamshad_ali_khan_46kbps",
    },
    { id: 64, name: "Karim Mansoori", subfolder: "Karim_Mansoori_40kbps" },
    { id: 65, name: "Husary (Muallim)", subfolder: "Husary_Muallim_128kbps" },
    {
      id: 66,
      name: "Khalid Abdullah al-Qahtanee",
      subfolder: "Khaalid_Abdullaah_al-Qahtaanee_128kbps",
    },
    {
      id: 58,
      name: "Khalefa Al-Tunaiji",
      subfolder: "khalefa_al_tunaiji_64kbps",
    },
    {
      id: 59,
      name: "Mahmoud Ali Al-Banna",
      subfolder: "mahmoud_ali_al_banna_32kbps",
    },
    {
      id: 60,
      name: "(Warsh) Ibrahim Al-Dosary",
      subfolder: "warsh/warsh_ibrahim_aldosary_128kbps",
    },
    {
      id: 61,
      name: "(Warsh) Yassin Al-Jazaery",
      subfolder: "warsh/warsh_yassin_al_jazaery_64kbps",
    },
    {
      id: 62,
      name: "(Warsh) Abdul Basit",
      subfolder: "warsh/warsh_Abdul_Basit_128kbps",
    },
    {
      id: 63,
      name: "(Urdu) Shamshad Ali Khan",
      subfolder: "translations/urdu_shamshad_ali_khan_46kbps",
    },
    { id: 64, name: "Karim Mansoori", subfolder: "Karim_Mansoori_40kbps" },
    { id: 65, name: "Husary (Muallim)", subfolder: "Husary_Muallim_128kbps" },
    {
      id: 66,
      name: "Khalid Abdullah al-Qahtanee",
      subfolder: "Khaalid_Abdullaah_al-Qahtanee_64kbps",
    },
    {
      id: 67,
      name: "Yasser Ad-Dussary",
      subfolder: "Yasser_Ad-Dussary_128kbps",
    },
    { id: 68, name: "Nasser Alqatami", subfolder: "Nasser_Alqatami_128kbps" },
    {
      id: 69,
      name: "Ali Hajjaj Al-Suesy",
      subfolder: "Ali_Hajjaj_AlSuesy_128kbps",
    },
    { id: 70, name: "Sahl Yassin", subfolder: "Sahl_Yassin_128kbps" },
    {
      id: 71,
      name: "Ahmed Ibn Ali Al Ajamy",
      subfolder: "ahmed_ibn_ali_al_ajamy_128kbps",
    },
    {
      id: 72,
      name: "Besim Korkut (Bosnian)",
      subfolder: "translations/besim_korkut_ajet_po_ajet",
    },
    { id: 73, name: "Aziz Alili", subfolder: "aziz_alili_128kbps" },
    { id: 74, name: "Yaser Salamah", subfolder: "Yaser_Salamah_128kbps" },
    { id: 75, name: "Akram Al Alaqimy", subfolder: "Akram_AlAlaqimy_128kbps" },
    { id: 76, name: "Ali Jaber", subfolder: "Ali_Jaber_64kbps" },
    { id: 77, name: "Fares Abbad", subfolder: "Fares_Abbad_64kbps" },
    {
      id: 78,
      name: "Farhat Hashmi",
      subfolder: "translations/urdu_farhat_hashmi",
    },
    { id: 79, name: "Ayman Sowaid", subfolder: "Ayman_Sowaid_64kbps" },
  ];

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    fetchVerseData()
  }, [currentSurah, currentVerse, selectedLanguage, selectedQari])

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("quranBookmarks")
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.addEventListener("ended", handleAudioEnd)
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate)
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnd)
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        )
        audioRef.current.pause()
      }
    }
  }, [audioUrl, isLooping])

  const fetchVerseData = async () => {
    if (
      !currentVerse ||
      isNaN(currentVerse) ||
      !currentSurah ||
      isNaN(currentSurah)
    ) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid surah and verse numbers",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const lang = selectedLanguage === "ur" ? "ur.ahmedali" : "en.asad"
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${currentSurah}:${currentVerse}/${lang}`
      )
      if (!response.ok) {
        throw new Error("Invalid verse number or API error")
      }

      const result = await response.json()
      setVerseData(result.data)
      setVersePictureUrl(
        `https://cdn.islamic.network/quran/images/${currentSurah}_${currentVerse}.png`
      )

      const selectedReciter = reciters.find((r) => r.id === selectedQari)
      if (selectedReciter) {
        const audioUrl = `https://everyayah.com/data/${selectedReciter.subfolder}/${currentSurah.toString().padStart(3, '0')}${currentVerse.toString().padStart(3, '0')}.mp3`
        setAudioUrl(audioUrl)
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
      setVerseData(null)
      setAudioUrl(null)
    } finally {
      setIsLoading(false)
    }
  }

  const nextVerse = () => {
    if (verseData && currentVerse < verseData.surah.numberOfAyahs) {
      setCurrentVerse((prev) => prev + 1)
    } else {
      setCurrentSurah((prev) => prev + 1)
      setCurrentVerse(1)
    }
  }

  const previousVerse = () => {
    if (currentVerse > 1) {
      setCurrentVerse((prev) => prev - 1)
    } else if (currentSurah > 1) {
      setCurrentSurah((prev) => prev - 1)
      setCurrentVerse(1)
    }
  }

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)

  const handleSearchResultClick = (surah: number, verse: number) => {
    setCurrentSurah(surah)
    setCurrentVerse(verse)
    setSearchResults([])
  }

  const handleReset = () => {
    setCurrentSurah(1)
    setCurrentVerse(1)
    setSearchResults([])
  }

  const addBookmark = () => {
    if (verseData) {
      const newBookmark: BookmarkData = {
        id: Date.now(),
        surah: currentSurah,
        verse: currentVerse,
        text: verseData.text,
      }
      const updatedBookmarks = [...bookmarks, newBookmark]
      setBookmarks(updatedBookmarks)
      localStorage.setItem("quranBookmarks", JSON.stringify(updatedBookmarks))
      toast({
        title: "Bookmark Added",
        description: `Surah ${currentSurah}, Verse ${currentVerse} has been bookmarked.`,
      })
    }
  }

  const isBookmarked = bookmarks.some(
    (b) => b.surah === currentSurah && b.verse === currentVerse
  )

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnd = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      setIsPlaying(false)
      nextVerse()
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-600 dark:text-amber-400"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <h2 className="text-3xl font-semibold">Quran App Menu</h2>
                  </div>
                  <div className="space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleReset}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Button>
                    <Link href="/surah-list" passHref legacyBehavior>
                      <Button variant="ghost" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Surah List
                      </Button>
                    </Link>
                    <Link href="/bookmarks" passHref legacyBehavior>
                      <Button variant="ghost" className="w-full justify-start">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Bookmarks
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={toggleDarkMode}
                    >
                      {isDarkMode ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & FAQ
                    </Button>
                  </div>
                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => window.open("https://quran.com", "_blank")}
                    >
                      Quran.com
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() =>
                        window.open("https://sunnah.com", "_blank")
                      }
                    >
                      Sunnah.com
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="text-center">
              <h1 className="text-3xl font-bold flex items-center text-amber-800 dark:text-amber-200">
                <Book className="mr-2" aria-hidden="true" /> Quran App
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Input
                type="number"
                value={currentSurah}
                onChange={(e) => setCurrentSurah(Number(e.target.value))}
                placeholder="Surah"
                className="w-24"
                aria-label="Surah number"
              />
              <Input
                type="number"
                
                value={currentVerse}
                onChange={(e) => setCurrentVerse(Number(e.target.value))}
                placeholder="Verse"
                className="w-24"
                aria-label="Verse number"
              />
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ur">Urdu</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={isBookmarked ? () => {} : addBookmark}
                variant="outline"
                className={`border-amber-300 dark:border-slate-600 ${
                  isBookmarked
                    ? "text-amber-500"
                    : "text-amber-700 dark:text-amber-300"
                }`}
                disabled={isBookmarked}
              >
                <Bookmark className="h-4 w-4 mr-2" aria-hidden="true" />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-red-500 text-red-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Reset
              </Button>
              <Select
                value={selectedQari.toString()}
                onValueChange={(value) => setSelectedQari(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Qari" />
                </SelectTrigger>
                <SelectContent>
                  {reciters.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id.toString()}>
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading && (
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-amber-600 dark:text-amber-400" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading...
                </p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <Button
                    key={`${result.surah.number}-${result.numberInSurah}`}
                    variant="link"
                    className="text-left w-full justify-start"
                    onClick={() =>
                      handleSearchResultClick(
                        result.surah.number,
                        result.numberInSurah
                      )
                    }
                  >
                    {result.text} (Surah {result.surah.englishName}, Verse{" "}
                    {result.numberInSurah})
                  </Button>
                ))}
              </div>
            )}

            {verseData && !isLoading && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200">
                  Surah: {verseData.surah.name} (Verse {currentVerse})
                </h2>
                <div className="relative w-full h-[400px] mt-4 bg-white">
                  <Image
                    src={versePictureUrl}
                    alt={`Verse ${currentVerse} of Surah ${verseData.surah.name}`}
                    fill
                    className="rounded-lg shadow-lg object-contain"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <p className="text-lg text-amber-800 dark:text-amber-200 font-arabic mr-2">
                    {verseData.text}
                  </p>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {verseData.translation}
                </p>
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={previousVerse}
                    disabled={currentSurah === 1 && currentVerse === 1}
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" aria-hidden="true" />
                    Previous
                  </Button>
                  <Button onClick={nextVerse}>
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" aria-hidden="true" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <div className="flex items-center space-x-4 mb-2">
                    <Button
                      onClick={previousVerse}
                      variant="outline"
                      size="icon"
                      disabled={currentSurah === 1 && currentVerse === 1}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={toggleAudio}
                      variant="outline"
                      size="icon"
                      className="text-amber-600 dark:text-amber-400"
                      aria-label={isPlaying ? "Pause audio" : "Play audio"}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Volume2 className="h-6 w-6" />
                      )}
                    </Button>
                    <Button onClick={nextVerse} variant="outline" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={toggleLoop}
                      variant="outline"
                      size="icon"
                      className={
                        isLooping ? "text-amber-600 dark:text-amber-400" : ""
                      }
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="w-full max-w-md flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {formatTime(currentTime)}
                    </span>
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={handleSeek}
                      className="flex-grow"
                    />
                    <span className="text-sm text-gray-500">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}