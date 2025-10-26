import { Suspense } from "react";
import QuranReader from "./quran-reader";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuranReader />
    </Suspense>
  )
}