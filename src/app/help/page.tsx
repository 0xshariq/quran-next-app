'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Book, Search, ChevronLeft, Mail } from "lucide-react"
import Link from 'next/link'

export default function HelpFAQ() {
  const [searchTerm, setSearchTerm] = useState('')

  
  const faqs = [
    {
      question: "How do I navigate between verses?",
      answer: "You can use the 'Previous' and 'Next' buttons to move between verses. You can also directly input a verse number in the 'Verse' field."
    },
    {
      question: "How do I change the Surah?",
      answer: "Use the 'Surah' dropdown menu to select a different Surah. The app will automatically load the first verse of the selected Surah."
    },
    {
      question: "Can I bookmark verses?",
      answer: "Yes, you can bookmark verses by clicking the 'Bookmark' button when viewing a verse. You can access your bookmarks from the sidebar menu."
    },
    {
      question: "How do I change the translation language?",
      answer: "Use the 'Language' dropdown to switch between available translations. Currently, English and Urdu translations are supported."
    },
    {
      question: "Can I listen to audio recitations?",
      answer: "Yes, you can play audio recitations by clicking the play button below the verse. You can also choose different reciters from the 'Qari' dropdown menu."
    },
    {
      question: "How do I switch between light and dark mode?",
      answer: "You can toggle between light and dark mode by clicking the sun/moon icon in the sidebar menu."
    },
    {
      question: "Is the app available offline?",
      answer: "Currently, the app requires an internet connection to fetch verse data and audio recitations. We're working on an offline mode for future updates."
    },
    {
      question: "How accurate are the translations?",
      answer: "We use reputable translations, but please note that any translation may have limitations. For deep understanding, consulting multiple translations and tafsirs is recommended."
    },
    {
      question: "Can I share verses on social media?",
      answer: "We're working on implementing a share feature. For now, you can manually copy the verse text and share it on your preferred platform."
    },
    {
      question: "How do I report an issue or suggest a feature?",
      answer: "Please contact our support team at support@quranapp.com with any issues or suggestions. We appreciate your feedback!"
    }
  ]

  const filteredFaqs = useMemo(() => 
    faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchTerm]
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" className="text-amber-600 dark:text-amber-400" aria-label="Back to home">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="sr-only">Quran App Help & FAQ</h1>
        </div>
        <Card className={`w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700 transition-all duration-500 ease-in-out`}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-amber-800 dark:text-amber-200">
              <Book className="inline-block mr-2 h-8 w-8 animate-pulse" aria-hidden="true" />
              Quran App Help & FAQ
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2 text-amber-600 dark:text-amber-400">
              Find answers to common questions about using the Quran App
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 dark:text-amber-400" aria-hidden="true" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 w-full bg-amber-50 dark:bg-slate-700 text-amber-800 dark:text-amber-200 placeholder-amber-400 dark:placeholder-amber-500 border-amber-300 dark:border-slate-600 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
                  aria-label="Search FAQs"
                />
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="overflow-hidden">
                  <AccordionTrigger className="text-left text-amber-700 dark:text-amber-300 transition-all duration-300 ease-in-out hover:text-amber-500 dark:hover:text-amber-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-amber-800 dark:text-amber-200 transition-all duration-300 ease-in-out">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredFaqs.length === 0 && (
              <p className="text-center text-amber-600 dark:text-amber-400 mt-4 animate-bounce" role="alert">
                No matching questions found. Please try a different search term.
              </p>
            )}
            <div className="mt-8 text-center">
              <p className="mb-4 text-amber-700 dark:text-amber-300">Didn&apos;t find what you&apos;re looking for?</p>
              <Link href="/contact" passHref>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 transition-all duration-300 ease-in-out transform hover:scale-105">
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Contact Support
              </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
