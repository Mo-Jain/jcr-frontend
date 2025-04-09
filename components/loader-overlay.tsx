'use client'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import Loader from './loader'

export default function LoaderOverlay() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <Loader />
    </div>,
    document.body
  )
}
