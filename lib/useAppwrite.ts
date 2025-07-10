"use client"

import { useEffect, useState, useCallback, useRef } from "react"

export const useAppwrite = <T, P = Record<string, unknown>>(
  fn: (params?: P) => Promise<T>,
  params?: P,
  options?: { skip?: boolean },
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(!options?.skip)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const paramsRef = useRef(params)

  // Update params ref when params change
  useEffect(() => {
    paramsRef.current = params
  }, [params])

  const fetchData = useCallback(
    async (customParams?: P) => {
      if (!mountedRef.current) return

      try {
        setLoading(true)
        setError(null)

        const finalParams = customParams || paramsRef.current
        const result = await fn(finalParams)

        if (mountedRef.current) {
          setData(result)
        }
      } catch (err: unknown) {
        if (!mountedRef.current) return

        const message = err instanceof Error ? err.message : "Unknown error"
        setError(message)

        // Only show alert for non-authentication errors
        if (!message.includes("401") && !message.includes("timeout")) {
          console.error("API Error:", message)
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    },
    [fn],
  )

  useEffect(() => {
    if (!options?.skip) {
      fetchData()
    }

    return () => {
      mountedRef.current = false
    }
  }, [fetchData, options?.skip])

  const refetch = useCallback(
    (customParams?: P) => {
      if (mountedRef.current) {
        fetchData(customParams)
      }
    },
    [fetchData],
  )

  return { data, loading, error, refetch }
}
