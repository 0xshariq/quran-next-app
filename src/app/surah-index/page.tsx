'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Book, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import surahs from '@/data/surah.json'

interface Surah {
  number: number
  name: string
  verses: number
  revelationPlace: string
}

export default function SurahListPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSurahs = surahs.filter((surah: Surah) =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  )

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-amber-800 dark:text-amber-200">
              Surah List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search surah by number or name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Surah No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Verses</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSurahs.map((surah: Surah) => (
                    <TableRow key={surah.number}>
                      <TableCell className="font-medium">{surah.number}</TableCell>
                      <TableCell>{surah.name}{"\n"}({surah.revelationPlace})</TableCell>
                      <TableCell>{surah.verses}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/verse-translation/?surah=${surah.name}&verse=1`}>
                          <Button variant="outline" size="sm">
                            Translation
                          </Button>
                        </Link>
                        <Link href={``}>
                          <Button variant="outline" size="sm">
                            <Book className="mr-2 h-4 w-4" />
                            Read
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}