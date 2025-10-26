"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Book, Menu, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export default function Navbar() {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-600 dark:text-amber-400"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={8}>
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/read-quran">Read Quran</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/hadith-app">Visit Hadith App</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/halal-jar">Halal Jar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/verse-translation">Verse Translation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/go-to">Go to</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/surah-index">Surah Index</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/para-index">Para Index</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/bookmarks">Bookmarks</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help">Help & FAQ</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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