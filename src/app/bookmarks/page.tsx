'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, Trash2, Search } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Bookmark {
  id: number
  surah: string
  verse: string
  text: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("quranBookmarks")
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  const removeBookmark = (id: number) => {
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id)
    setBookmarks(updatedBookmarks)
    localStorage.setItem("quranBookmarks", JSON.stringify(updatedBookmarks))
  }

  const handleBookmarkClick = (surah: string, verse: string) => {
    router.push(`/verse-translation/?surah=${surah}&verse=${verse}`)
  }

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.surah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-amber-800 dark:text-amber-200 flex items-center justify-center">
              <Bookmark className="mr-2" aria-hidden="true" />
              Bookmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-250px)]">
              {filteredBookmarks.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No matching bookmarks found." : "No bookmarks yet. Add some verses to your bookmarks!"}
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredBookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="flex items-start justify-between p-4 bg-amber-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex-grow">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-left"
                          onClick={() => handleBookmarkClick(bookmark.surah, bookmark.verse)}
                        >
                          <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                            Surah {bookmark.surah}, Verse {bookmark.verse}
                          </h2>
                        </Button>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{bookmark.text}</p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this bookmark? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeBookmark(bookmark.id)}>Remove</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}