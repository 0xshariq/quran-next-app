'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function GoToPage() {
  const [paraNumber, setParaNumber] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [mounted, setMounted] = useState(false)
//   const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Navigating to Para:', paraNumber, 'Page:', pageNumber)
    // router.push(`/quran/para/${paraNumber}/page/${pageNumber}`)
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#121212] p-4 transition-colors duration-200 h-auto">
      <div className="w-full max-w-[280px] h-auto">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="number"
              value={paraNumber}
              onChange={(e) => setParaNumber(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Para Number"
            />
          </div>
          <div>
            <Input
              type="number"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Page Number"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-[#333] dark:hover:bg-[#444]">
            GO
          </Button>
        </form>
      </div>
    </div>
  )
}