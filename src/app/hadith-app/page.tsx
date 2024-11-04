'use client'

import { useState, useEffect } from 'react'
import { Book, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

const books = [
  { name: 'Bukhari', value: 'bukhari', limit: 7563 },
  { name: 'Muslim', value: 'muslim', limit: 3032 },
  { name: 'Abu Dawud', value: 'abudawud', limit: 3998 },
  { name: 'Ibn Majah', value: 'ibnmajah', limit: 4342 },
  { name: 'Al-Tirmidhi', value: 'tirmidhi', limit: 3956 },
]

interface HadithData {
  book: string;
  bookName: string;
  chapterName: string;
  hadith_english: string;
  header: string;
  id: number;
  refno: string;
}

export default function HadithExplorer() {
  const [selectedBook, setSelectedBook] = useState(books[0])
  const [hadithNumber, setHadithNumber] = useState('')
  const [hadith, setHadith] = useState<HadithData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchHadith = async () => {
    setLoading(true)
    setError('')
    try {
      const number = hadithNumber ? parseInt(hadithNumber) : Math.floor(Math.random() * selectedBook.limit) + 1
      if (number < 1 || number > selectedBook.limit) {
        throw new Error(`Invalid Hadith number. Please enter a number between 1 and ${selectedBook.limit}.`)
      }
      const response = await fetch(`https://random-hadith-generator.vercel.app/${selectedBook.value}/${number}`)
      if (!response.ok) throw new Error('Failed to fetch hadith')
      const data = await response.json()
      setHadith(data.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch hadith. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#fff9e6] dark:bg-gray-900 px-4 py-8 md:py-12 transition-colors duration-300">
      <div className="max-w-md mx-auto space-y-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold text-[#8B4513] dark:text-[#DEB887]">Search Hadith</h2>
              <p className="text-[#D2691E] dark:text-[#F4A460]">Select a book and enter a Hadith number (optional)</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[#8B4513] dark:text-[#DEB887] font-medium">Select Book</label>
                <Select
                  value={selectedBook.value}
                  onValueChange={(value) => setSelectedBook(books.find(book => book.value === value) || books[0])}
                >
                  <SelectTrigger className="w-full bg-[#DEB887] dark:bg-gray-700 border-[#8B4513] dark:border-[#DEB887] text-[#8B4513] dark:text-[#DEB887]">
                    <SelectValue placeholder="Select a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.value} value={book.value}>
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#8B4513] dark:text-[#DEB887] font-medium">Hadith Number (Optional)</label>
                <Input
                  type="number"
                  placeholder={`1 - ${selectedBook.limit}`}
                  value={hadithNumber}
                  onChange={(e) => setHadithNumber(e.target.value)}
                  className="w-full bg-[#DEB887] dark:bg-gray-700 border-[#8B4513] dark:border-[#DEB887] text-[#8B4513] dark:text-[#DEB887] placeholder:text-[#8B4513]/60 dark:placeholder:text-[#DEB887]/60"
                />
              </div>

              <Button 
                onClick={fetchHadith} 
                disabled={loading}
                className="w-full bg-[#B8860B] hover:bg-[#8B4513] dark:bg-[#DEB887] dark:hover:bg-[#D2691E] text-white dark:text-[#8B4513] h-12 text-lg"
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Book className="mr-2 h-5 w-5" />}
                {loading ? 'Loading...' : hadithNumber ? 'Fetch Hadith' : 'Random Hadith'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hadith && (
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-arabic text-[#8B4513] dark:text-[#DEB887]">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                <p className="text-sm text-[#D2691E] dark:text-[#F4A460] mt-1">Bismillahir Rahmanir Rahim</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#8B4513] dark:text-[#DEB887]">{hadith.book}</h3>
                <p className="text-[#D2691E] dark:text-[#F4A460]">{hadith.bookName.trim()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#8B4513] dark:text-[#DEB887]">Chapter:</h3>
                <p className="text-[#D2691E] dark:text-[#F4A460]">{hadith.chapterName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#8B4513] dark:text-[#DEB887]">Hadith:</h3>
                <p className="italic text-[#D2691E] dark:text-[#F4A460]">{hadith.header}</p>
                <p className="mt-2 text-[#8B4513] dark:text-[#DEB887]">{hadith.hadith_english}</p>
              </div>
              <div className="text-sm text-[#D2691E] dark:text-[#F4A460]">
                <p>Reference: {hadith.refno}</p>
                <p>Hadith Number: {hadith.id}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert className="bg-transparent border-[#D2691E] dark:border-[#F4A460] text-[#8B4513] dark:text-[#DEB887]">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Alert className="bg-transparent border-[#D2691E] dark:border-[#F4A460] text-[#8B4513] dark:text-[#DEB887]">
          <AlertDescription>
            Disclaimer: The Hadiths provided by this app are sourced from an external API and may not be entirely reliable. Please verify important information with authenticated scholarly sources.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}