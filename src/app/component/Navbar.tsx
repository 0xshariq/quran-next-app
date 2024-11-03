'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Book, Menu, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for user's preference in localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev
      if (newMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      return newMode
    })
  }

  return (
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
                  <h2 className="text-3xl font-semibold">Quran App</h2>
                </div>
                <div className="space-y-4">
                  <Link href="/">
                    <Button variant="ghost" className="w-full justify-start">
                      Home
                    </Button>
                  </Link>
                  <Link href="/read-quran">
                    <Button variant="ghost" className="w-full justify-start">
                      Read Quran
                    </Button>
                  </Link>
                  <Link href="/hadith-app">
                    <Button variant="ghost" className="w-full justify-start">
                      Visit Hadith App
                    </Button>
                  </Link>
                  <Link href="/verse-translation">
                    <Button variant="ghost" className="w-full justify-start">
                      Verse Translation
                    </Button>
                  </Link>
                  <Link href="/surah-index">
                    <Button variant="ghost" className="w-full justify-start">
                      Surah Index
                    </Button>
                  </Link>
                  <Link href="/para-index">
                    <Button variant="ghost" className="w-full justify-start">
                      Para Index
                    </Button>
                  </Link>
                  <Link href="/bookmarks">
                    <Button variant="ghost" className="w-full justify-start">
                      Bookmarks
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="ghost" className="w-full justify-start">
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
        <div className="flex items-center">
          <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="text-amber-600 dark:text-amber-400">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}