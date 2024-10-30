'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const menuItems = [
  { title: "Surah Index", href: "/surah-index" },
  { title: "Para Index", href: "/para-index" },
  { title: "Read Quran", href: "/read-quran" },
  { title: "Verse Translation", href: "/verse-translation" },
  { title: "Go to", href: "/go-to" },
  { title: "Bookmarks", href: "/bookmarks" },
  { title: "Halal Jar", href: "/halal-jar" },
  { title: "Visit Hadith App", href: "/hadith-app" }
  // { title: "Settings", href: "/settings" },
];

export default function HomePage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-amber-200 dark:border-slate-700">
          <CardContent className="p-6 grid gap-4">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Link href={item.href}>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-medium transition-all duration-200 ease-in-out"
                    style={{
                      transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: hoveredIndex === index ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                  >
                    {item.title}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}