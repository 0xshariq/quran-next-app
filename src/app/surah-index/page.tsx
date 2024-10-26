'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Search } from "lucide-react"
import surahs from "@/data/surah.json"

export default function SurahList() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
  )

  const handleSurahClick = (surahNumber: number, surahName: string) => {
    router.push(`/verse-translation/?surah=${surahName}&verse=1`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold flex items-center text-amber-800 dark:text-amber-200">
              <Book className="mr-2" aria-hidden="true" /> Surah List
            </h1>
          </div>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search surahs..."
              className="w-64 bg-amber-50 dark:bg-slate-800 border-amber-300 dark:border-slate-600 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search surahs"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardContent className="p-6">
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              <div className="flex flex-col space-y-4">
                {filteredSurahs.map((surah) => (
                  <Button
                    key={surah.number}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4 border-amber-300 dark:border-slate-600 hover:bg-amber-100 dark:hover:bg-slate-700"
                    onClick={() => handleSurahClick(surah.number, surah.name)}
                  >
                    <div className="flex justify-between w-full">
                      <div className="flex-grow">
                        <div className="font-bold text-amber-800 dark:text-amber-200 text-lg">
                          {surah.number}. {surah.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {surah.englishName}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-500">
                      <div>Verses: {surah.verses}</div>&nbsp;&nbsp;
                      <div>{surah.revelationPlace}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}