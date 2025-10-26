"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import surahs from "@/data/surah.json";

interface Surah {
  number: number;
  name: string;
  verses: number;
  revelationPlace: string;
}

export default function SurahListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredSurahs = surahs.filter(
    (surah: Surah) =>
      surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.number.toString().includes(searchTerm)
  );

  const handleReadClick = (surahName: string) => {
    router.push(`/read-quran/?surah=${surahName}`);
  };

  const handleTranslationClick = (surahName: string) => {
    router.push(`/verse-translation/?surah=${surahName}`);
  };

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
                      <TableCell className="font-medium">
                        {surah.number}
                      </TableCell>
                      <TableCell>
                        {surah.name}
                        <br />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({surah.revelationPlace})
                        </span>
                      </TableCell>
                      <TableCell>{surah.verses}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTranslationClick(surah.name)}
                        >
                          Translation
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReadClick(surah.name)}
                        >
                          Read
                        </Button>
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
  );
}
