'use client'

import { useState } from 'react'
import { Book } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"

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
  const { theme } = useTheme()

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hadith. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen px-4 py-8 md:py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#fff9e6]'}`}>
      <div className="max-w-md mx-auto space-y-8">
        <h1 className={`text-4xl font-bold text-center ${theme === 'dark' ? 'text-amber-300' : 'text-[#8B4513]'}`}>Hadith App</h1>
        
        <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border-0`}>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-1.5">
              <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-amber-300' : 'text-[#8B4513]'}`}>Search Hadith</h2>
              <p className={`${theme === 'dark' ? 'text-amber-200' : 'text-[#D2691E]'}`}>Select a book and enter a Hadith number (optional)</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className={`font-medium ${theme === 'dark' ? 'text-amber-300' : 'text-[#8B4513]'}`}>Select Book</label>
                <Select
                  value={selectedBook.value}
                  onValueChange={(value) => setSelectedBook(books.find(book => book.value === value) || books[0])}
                >
                  <SelectTrigger className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-amber-300 text-amber-300' : 'bg-[#DEB887] border-[#8B4513] text-[#8B4513]'}`}>
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
                <label className={`font-medium ${theme === 'dark' ? 'text-amber-300' : 'text-[#8B4513]'}`}>Hadith Number (Optional)</label>
                <Input
                  type="number"
                  placeholder={`1 - ${selectedBook.limit}`}
                  value={hadithNumber}
                  onChange={(e) => setHadithNumber(e.target.value)}
                  className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-amber-300 text-amber-300 placeholder:text-amber-300/60' : 'bg-[#DEB887] border-[#8B4513] text-[#8B4513] placeholder:text-[#8B4513]/60'}`}
                />
              </div>

              <Button 
                onClick={fetchHadith} 
                disabled={loading}
                className={`w-full h-12 text-lg ${theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-[#B8860B] hover:bg-[#8B4513] text-white'}`}
              >
                <Book className="mr-2 h-5 w-5" />
                {loading ? 'Loading...' : hadithNumber ? 'Fetch Hadith' : 'Random Hadith'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hadith && (
          <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border-0`}>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className={`text-3xl font-arabic ${theme === 'dark' ? 'text-amber-300' : 'text-[#8B4513]'}`}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-amber-200' : 'text-[#D2691E]'}`}>Bismillahir Rahmanir Rahim</p>
              </div>
              <div>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-amber-300' : 'text-[#8B4513]'}`}>{hadith.book}</h3>
                <p className={theme === 'dark' ? 'text-amber-200' : 'text-[#D2691E]'}>{hadith.bookName.trim()}</p>
              </div>
              <div>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-amber-300' : 'text-[#8B4513]'}`}>Chapter:</h3>
                <p className={theme === 'dark' ? 'text-amber-200' : 'text-[#D2691E]'}>{hadith.chapterName}</p>
              </div>
              <div>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-amber-300' : 'text-[#8B4513]'}`}>Hadith:</h3>
                <p className={`italic ${theme === 'dark' ? 'text-amber-200' : 'text-[#D2691E]'}`}>{hadith.header}</p>
                <p className={`mt-2 ${theme === 'dark' ? 'text-amber-100' : 'text-[#8B4513]'}`}>{hadith.hadith_english}</p>
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-amber-200' : 'text-[#D2691E]'}`}>
                <p>Reference: {hadith.refno}</p>
                <p>Hadith Number: {hadith.id}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <Alert className={`${theme === 'dark' ? 'bg-gray-800 border-amber-300 text-amber-200' : 'bg-transparent border-[#D2691E] text-[#8B4513]'}`}>
          <AlertDescription>
            Disclaimer: The Hadiths provided by this app are sourced from an external API and may not be entirely reliable. Please verify important information with authenticated scholarly sources.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}