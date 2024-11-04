'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import parasData from '@/data/para.json'

interface Para {
  number: number
  name: string
  totalPages: number
}

const paras: Para[] = parasData

export default function GoToPage() {
  const [paraNumber, setParaNumber] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [selectedParaPages, setSelectedParaPages] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (paraNumber) {
      const para = paras.find(p => p.number === paraNumber)
      if (para) {
        setSelectedParaPages(para.totalPages)
      } else {
        setSelectedParaPages(null)
      }
    } else {
      setSelectedParaPages(null)
    }
  }, [paraNumber])

  const handleParaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null
    setParaNumber(value)
    setPageNumber(null) // Reset page number when para changes
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null
    setPageNumber(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (paraNumber === null || pageNumber === null) {
      toast({
        title: "Error",
        description: "Please enter both Para and Page numbers.",
        variant: "destructive",
      })
      return
    }
    if (paraNumber < 1 || paraNumber > 30 || pageNumber < 1 || (selectedParaPages && pageNumber > selectedParaPages)) {
      toast({
        title: "Invalid Input",
        description: `Para number should be between 1 and 30, and Page number should be between 1 and ${selectedParaPages || 'the total pages for the selected para'}.`,
        variant: "destructive",
      })
      return
    }
    console.log('Navigating to Para:', paraNumber, 'Page:', pageNumber)
    router.push(`/read-quran?para=${paraNumber}&page=${pageNumber}`)
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-500">
      <div className="w-full max-w-[280px] h-auto">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="number"
              value={paraNumber !== null ? paraNumber : ''}
              onChange={handleParaChange}
              className="bg-white dark:bg-slate-800 border-amber-300 dark:border-slate-600 text-amber-800 dark:text-amber-200 placeholder-amber-400 dark:placeholder-amber-600"
              placeholder="Para Number (1-30)"
              min={1}
              max={30}
            />
          </div>
          <div>
            <Input
              type="number"
              value={pageNumber !== null ? pageNumber : ''}
              onChange={handlePageChange}
              className="bg-white dark:bg-slate-800 border-amber-300 dark:border-slate-600 text-amber-800 dark:text-amber-200 placeholder-amber-400 dark:placeholder-amber-600"
              placeholder={selectedParaPages ? `Page Number (1-${selectedParaPages})` : "Page Number"}
              min={1}
              max={selectedParaPages || undefined}
              disabled={paraNumber === null}
            />
          </div>
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-800 dark:hover:bg-amber-900">
            GO
          </Button>
        </form>
      </div>
    </div>
  )
}