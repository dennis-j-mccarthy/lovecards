"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { PublicContribution } from "@/types/tribute"

export interface TributeStatus {
  status: string
  pdfUrl: string | null
}

export function useLiveContributions(tributeId: string) {
  const [contributions, setContributions] = useState<PublicContribution[]>([])
  const [newArrivals, setNewArrivals] = useState<PublicContribution[]>([])
  const [tributeStatus, setTributeStatus] = useState<TributeStatus | null>(null)
  const [connected, setConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const es = new EventSource(`/api/tributes/${tributeId}/stream`)
    eventSourceRef.current = es

    es.onopen = () => setConnected(true)

    es.addEventListener("contributions", (event) => {
      const incoming: PublicContribution[] = JSON.parse(event.data)

      setContributions((prev) => {
        const existingIds = new Set(prev.map((c) => c.id))
        const genuinelyNew = incoming.filter((c) => !existingIds.has(c.id))
        if (genuinelyNew.length === 0) return prev
        setNewArrivals((prev) => [...prev, ...genuinelyNew])
        return [...prev, ...genuinelyNew]
      })
    })

    es.addEventListener("status", (event) => {
      const status: TributeStatus = JSON.parse(event.data)
      setTributeStatus(status)
    })

    es.onerror = () => {
      setConnected(false)
      es.close()
      // Reconnect after 5 seconds
      reconnectTimeout.current = setTimeout(connect, 5000)
    }
  }, [tributeId])

  useEffect(() => {
    connect()
    return () => {
      eventSourceRef.current?.close()
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
    }
  }, [connect])

  const dismissArrival = useCallback((id: string) => {
    setNewArrivals((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return { contributions, newArrivals, dismissArrival, tributeStatus, connected }
}
