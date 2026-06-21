'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false })

export default function ChatWidgetLoader() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show for logged-in non-admin users
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (data.accountId && data.type !== -1) setShow(true)
    }).catch(() => {})
  }, [])

  if (!show) return null
  return <ChatWidget />
}
