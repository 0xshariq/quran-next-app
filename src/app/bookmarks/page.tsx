'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, ChevronLeft, Trash2 } from "lucide-react"
import Link from "next/link"
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

// Define a type for the bookmark
interface Bookmark {
  id: number
  surah: string
  verse: string
  text: string
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
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
    router.push(`/?surah=${surah}&verse=${verse}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" passHref>
              <Button variant="ghost" size="icon" className="text-amber-600 dark:text-amber-400">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center text-amber-800 dark:text-amber-200">
              <Bookmark className="mr-2" aria-hidden="true" /> Bookmarks
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardContent className="p-6">
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              {bookmarks.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No bookmarks yet. Add some verses to your bookmarks!</p>
              ) : (
                <div className="space-y-4">
                  {bookmarks.map((bookmark) => (
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