import { Suspense } from 'react'
import QuranApp from './component/Quran'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuranApp />
    </Suspense>
  )
}