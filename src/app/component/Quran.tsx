"use client";

import reciters from "./reciter.json";
import surahs from "./surah.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface VerseData {
  text: string;
  translation: string;
  surah: {
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

interface BookmarkData {
  id: number;
  surah: number;
  verse: number;
  text: string;
}

interface Reciter {
  id: number;
  name: string;
  subfolder: string;
}

export default function Component() {
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [currentSurah, setCurrentSurah] = useState<string>(surahs[0].name);
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [versePictureUrl, setVersePictureUrl] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedQari, setSelectedQari] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchVerseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSurahNumber, currentVerse, selectedLanguage, selectedQari]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("quranBookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("ended", handleAudioEnd);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnd);
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.pause();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, isLooping]);

  useEffect(() => {
    setImageError(false);
  }, [versePictureUrl]);

  const fetchVerseData = async () => {
    if (
      !currentVerse ||
      isNaN(currentVerse) ||
      !currentSurahNumber ||
      isNaN(currentSurahNumber)
    ) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid surah and verse numbers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const lang = selectedLanguage === "ur" ? "ur.ahmedali" : "en.asad";
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${currentSurahNumber}:${currentVerse}/${lang}`
      );
      if (!response.ok) {
        throw new Error("Invalid verse number or API error");
      }

      const result = await response.json();
      setVerseData(result.data);
      setVersePictureUrl(
        `https://cdn.islamic.network/quran/images/${currentSurahNumber}_${currentVerse}.png`
      );

      const selectedReciter = reciters.find(
        (r: Reciter) => r.id === selectedQari
      );
      if (selectedReciter) {
        const audioUrl = `https://everyayah.com/data/${
          selectedReciter.subfolder
        }/${currentSurahNumber.toString().padStart(3, "0")}${currentVerse
          .toString()
          .padStart(3, "0")}.mp3`;
        setAudioUrl(audioUrl);
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setVerseData(null);
      setAudioUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const nextVerse = () => {
    if (verseData && currentVerse < verseData.surah.numberOfAyahs) {
      setCurrentVerse((prev) => prev + 1);
    } else {
      const nextSurahIndex =
        surahs.findIndex((s) => s.name === currentSurah) + 1;
      if (nextSurahIndex < surahs.length) {
        setCurrentSurah(surahs[nextSurahIndex].name);
        setCurrentSurahNumber(surahs[nextSurahIndex].number);
        setCurrentVerse(1);
      }
    }
  };

  const previousVerse = () => {
    if (currentVerse > 1) {
      setCurrentVerse((prev) => prev - 1);
    } else {
      const prevSurahIndex =
        surahs.findIndex((s) => s.name === currentSurah) - 1;
      if (prevSurahIndex >= 0) {
        setCurrentSurah(surahs[prevSurahIndex].name);
        setCurrentSurahNumber(surahs[prevSurahIndex].number);
        setCurrentVerse(surahs[prevSurahIndex].verses);
      }
    }
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleReset = () => {
    setCurrentSurah(surahs[0].name);
    setCurrentSurahNumber(1);
    setCurrentVerse(1);
  };

  const addBookmark = () => {
    if (verseData) {
      const newBookmark: BookmarkData = {
        id: Date.now(),
        surah: currentSurahNumber,
        verse: currentVerse,
        text: verseData.text,
      };
      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);
      localStorage.setItem("quranBookmarks", JSON.stringify(updatedBookmarks));
      toast({
        title: "Bookmark Added",
        description: `Surah ${currentSurah}, Verse ${currentVerse} has been bookmarked.`,
      });
    }
  };

  const isBookmarked = bookmarks.some(
    (b) => b.surah === currentSurahNumber && b.verse === currentVerse
  );

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setIsPlaying(false);
      nextVerse();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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
                    <Link href="/surah-list" passHref>
                      <Button variant="ghost" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Surah List
                      </Button>
                    </Link>
                    <Link href="/bookmarks" passHref>
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
                    <Link href="/help" passHref>
                      <Button variant="ghost" className="w-full justify-start">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help & FAQ
                      </Button>
                    </Link>
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
              <div className="flex flex-col w-48">
                {" "}
                {/* Updated width here */}
                <Label htmlFor="surah-input" className="mb-1">
                  Surah
                </Label>
                <Select
                  value={currentSurah}
                  onValueChange={(value) => {
                    setCurrentSurah(value);
                    const selectedSurah = surahs.find((s) => s.name === value);
                    if (selectedSurah) {
                      setCurrentSurahNumber(selectedSurah.number);
                      setCurrentVerse(1);
                    }
                  }}
                >
                  <SelectTrigger id="surah-input" className="w-full">
                    <SelectValue>{currentSurah}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {surahs.map((surah) => (
                      <SelectItem key={surah.number} value={surah.name}>
                        {surah.name} ({surah.verses})
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
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
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
                    {reciters.map((reciter) => (
                      <SelectItem
                        key={reciter.id}
                        value={reciter.id.toString()}
                      >
                        {reciter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && (
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-amber-600 dark:text-amber-400" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading...
                </p>
              </div>
            )}

            {verseData && !isLoading && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-4">
                  Surah: {verseData.surah.name} (Verse {currentVerse})
                </h2>
                <div className="relative w-full aspect-[4/3] mt-8 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-amber-600 dark:text-amber-400" />
                    </div>
                  ) : (
                    <Image
                      src={versePictureUrl}
                      alt={`Verse ${currentVerse} of Surah ${verseData?.surah.name}`}
                      fill
                      className="object-contain"
                      onError={() => setImageError(true)}
                    />
                  )}
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <p>Failed to load image</p>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex items-center justify-center">
                  <p className="text-2xl text-amber-800 dark:text-amber-200 font-arabic mr-2">
                    {verseData.text}
                  </p>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 mb-16">
                  {verseData.translation}
                </p>
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={previousVerse}
                    disabled={currentSurahNumber === 1 && currentVerse === 1}
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
                      disabled={currentSurahNumber === 1 && currentVerse === 1}
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
  );
}
