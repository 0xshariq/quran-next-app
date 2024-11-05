'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import surahsData from '@/data/surah.json'
import parasData from '@/data/para.json'

interface Surah {
  number: number
  name: string
  englishName: string
  verses: number
  revelationPlace: string
  totalPages: number
}

interface Para {
  number: number
  name: string
  totalPages: number
}

const surahs: Surah[] = surahsData
const paras: Para[] = parasData

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuranReader />
    </Suspense>
  )
}

function QuranReader() {
  const searchParams = useSearchParams()
  const surahParam = searchParams?.get('surah')
  const paraParam = searchParams?.get('para')
  const pageParam = searchParams?.get('page')

  return <QuranReaderContent initialSurah={surahParam ?? null} initialPara={paraParam ?? null} initialPage={pageParam ?? null} />
}

function QuranReaderContent({ initialSurah, initialPara, initialPage }: { initialSurah: string | null; initialPara: string | null; initialPage: string | null }) {
  const router = useRouter()
  const [selectedSurah, setSelectedSurah] = useState<Surah>(surahs[0])
  const [selectedPara, setSelectedPara] = useState<Para>(paras[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'surah' | 'para'>('surah')
  const [pageInput, setPageInput] = useState('1')

  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialSurah) {
      const surah = surahs.find(s => s.name === initialSurah)
      if (surah) {
        setSelectedSurah(surah)
        setViewMode('surah')
      }
    } else if (initialPara) {
      const para = paras.find(p => p.number === parseInt(initialPara))
      if (para) {
        setSelectedPara(para)
        setViewMode('para')
      }
    }

    if (initialPage) {
      const pageNumber = parseInt(initialPage)
      setCurrentPage(pageNumber)
      setPageInput(pageNumber.toString())
    }
  }, [initialSurah, initialPara, initialPage])

  useEffect(() => {
    if (viewMode === 'surah') {
      setCurrentPage(1)
      setPageInput('1')
    }
  }, [selectedSurah, viewMode])

  useEffect(() => {
    if (viewMode === 'para') {
      setCurrentPage(1)
      setPageInput('1')
    }
  }, [selectedPara, viewMode])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    setPageInput(newPage.toString())
    updateURL(newPage)
  }

  const handleNext = () => {
    const maxPages = viewMode === 'surah' ? selectedSurah.totalPages : selectedPara.totalPages
    handlePageChange(Math.min(currentPage + 1, maxPages))
  }

  const handlePrevious = () => {
    handlePageChange(Math.max(currentPage - 1, 1))
  }

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value)
  }

  const handlePageInputBlur = () => {
    const maxPages = viewMode === 'surah' ? selectedSurah.totalPages : selectedPara.totalPages
    const pageNumber = parseInt(pageInput)
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > maxPages) {
      toast({
        title: "Invalid Page Number",
        description: `Please enter a number between 1 and ${maxPages}.`,
        variant: "destructive",
      })
      setPageInput(currentPage.toString())
    } else {
      handlePageChange(pageNumber)
    }
  }

  const updateURL = (page: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    if (viewMode === 'surah') {
      params.set('surah', selectedSurah.name)
    } else {
      params.set('para', selectedPara.number.toString())
    }
    router.push(`/read-quran?${params.toString()}`)
  }

  const imagePath = viewMode === 'surah'
    ? `/assets/surah-images/${selectedSurah.number}.${selectedSurah.name}/${currentPage}.png`
    : `/assets/para-images/Para-${selectedPara.number}/${currentPage}.png`

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-amber-800 dark:text-amber-200 transition-colors duration-300">
              Explore the Holy Quran
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2 text-amber-600 dark:text-amber-400 transition-colors duration-300">
              Navigate through Surahs and Paras with ease
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center space-x-4 flex-wrap gap-4">
                <ViewModeSelect viewMode={viewMode} setViewMode={setViewMode} />
                {viewMode === 'surah' ? (
                  <SurahSelect selectedSurah={selectedSurah} setSelectedSurah={setSelectedSurah} />
                ) : (
                  <ParaSelect selectedPara={selectedPara} setSelectedPara={setSelectedPara} />
                )}
                <PageInput
                  pageInput={pageInput}
                  handlePageInputChange={handlePageInputChange}
                  handlePageInputBlur={handlePageInputBlur}
                  maxPages={viewMode === 'surah' ? selectedSurah.totalPages : selectedPara.totalPages}
                />
              </div>
              <PageNavigation
                currentPage={currentPage}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                totalPages={viewMode === 'surah' ? selectedSurah.totalPages : selectedPara.totalPages}
              />
            </div>
            <div 
              className="relative w-full h-[calc(100vh-300px)] max-h-[800px] overflow-hidden"
              ref={imageRef}
            >
              <Image
                src={imagePath}
                alt={`${viewMode === 'surah' ? selectedSurah.name : selectedPara.name} - Page ${currentPage}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function ViewModeSelect({ viewMode, setViewMode }: { viewMode: 'surah' | 'para', setViewMode: (mode: 'surah' | 'para') => void }) {
  return (
    <div>
      <Label htmlFor="view-mode" className="text-amber-800 dark:text-amber-200">View Mode</Label>
      <Select
        value={viewMode}
        onValueChange={(value: 'surah' | 'para') => setViewMode(value)}
      >
        <SelectTrigger id="view-mode" className="w-[180px] border-amber-300 dark:border-slate-600">
          <SelectValue placeholder="Select view mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="surah">Surah</SelectItem>
          <SelectItem value="para">Para</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function SurahSelect({ selectedSurah, setSelectedSurah }: { selectedSurah: Surah, setSelectedSurah: (surah: Surah) => void }) {
  return (
    <div>
      <Label htmlFor="surah-select" className="text-amber-800 dark:text-amber-200">Surah</Label>
      <Select
        value={selectedSurah.name}
        onValueChange={(value) => {
          const surah = surahs.find(s => s.name === value)
          if (surah) setSelectedSurah(surah)
        }}
      >
        <SelectTrigger id="surah-select" className="w-[180px] border-amber-300 dark:border-slate-600">
          <SelectValue placeholder="Select a Surah" />
        </SelectTrigger>
        <SelectContent>
          {surahs.map((surah) => (
            <SelectItem key={surah.number} value={surah.name}>
              {surah.number}. {surah.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ParaSelect({ selectedPara, setSelectedPara }: { selectedPara: Para, setSelectedPara: (para: Para) => void }) {
  return (
    <div>
      <Label htmlFor="para-select" className="text-amber-800 dark:text-amber-200">Para</Label>
      <Select
        value={selectedPara.number.toString()}
        onValueChange={(value) => {
          const para = paras.find(p => p.number === parseInt(value))
          if (para) setSelectedPara(para)
        }}
      >
        <SelectTrigger id="para-select" className="w-[180px] border-amber-300 dark:border-slate-600">
          <SelectValue placeholder="Select a Para" />
        </SelectTrigger>
        <SelectContent>
          {paras.map((para) => (
            <SelectItem key={para.number} value={para.number.toString()}>
              {para.number}. {para.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function PageInput({ pageInput, handlePageInputChange, handlePageInputBlur, maxPages }: { 
  pageInput: string, 
  handlePageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  handlePageInputBlur: () => void, 
  maxPages: number 
}) {
  return (
    <div>
      <Label htmlFor="page-input" className="text-amber-800 dark:text-amber-200">Page</Label>
      <Input
        id="page-input"
        type="number"
        value={pageInput}
        onChange={handlePageInputChange}
        onBlur={handlePageInputBlur}
        className="w-[100px] border-amber-300 dark:border-slate-600 text-amber-800 dark:text-amber-200"
        min={1}
        max={maxPages}
      />
    </div>
  )
}

function PageNavigation({ currentPage, handlePrevious, handleNext, totalPages }: { 
  currentPage: number, 
  handlePrevious: () => void, 
  handleNext: () => void, 
  totalPages: number 
}) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        variant="outline"
        size="icon"
        className="border-amber-300 dark:border-slate-600 text-amber-800 dark:text-amber-200"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        variant="outline"
        size="icon"
        className="border-amber-300 dark:border-slate-600 text-amber-800 dark:text-amber-200"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}