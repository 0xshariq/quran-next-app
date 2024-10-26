"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import paraData from "@/data/para.json";
import { Book, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Para {
  number: number;
  name: string;
  englishName: string;
  versesRange: string;
  pageRange: string;
}

export default function ParaIndexPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParas = paraData.filter(
    (para: Para) =>
      para.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      para.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      para.number.toString().includes(searchTerm)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-amber-800 dark:text-amber-200">
              Para (Juz) Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search para by number or name"
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
                    <TableHead className="w-[100px]">Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>English Name</TableHead>
                    <TableHead>Verses Range</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParas.map((para: Para) => (
                    <TableRow key={para.number}>
                      <TableCell className="font-medium">
                        {para.number}
                      </TableCell>
                      <TableCell>{para.name}</TableCell>
                      <TableCell>{para.englishName}</TableCell>
                      <TableCell>{para.versesRange}</TableCell>
                      <TableCell>{para.pageRange}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/para/${para.number}`}>
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
  );
}
