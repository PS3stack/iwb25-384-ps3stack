"use client"

import { useEffect, useState } from "react"

export default function TimestampTestPage() {
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    // Test data from backend
    const elections: Array<{
      id: string
      title: string
      start_time: [number, number]
      end_time: [number, number]
    }> = [
      {
        id: "3b1370b6-7c8c-4a2d-b4e4-b1e9d1c11ec6",
        title: "City Council Election 2025", 
        start_time: [1756598400, 0],
        end_time: [1767225599, 0]
      },
      {
        id: "test",
        title: "Test Election 2025",
        start_time: [1756717200, 0], 
        end_time: [1756746000, 0]
      }
    ]

    const now = new Date()
    const testResults = elections.map(election => {
      let startTime: Date
      let endTime: Date
      
      // Always use array format since that's what backend returns
      startTime = new Date(election.start_time[0] * 1000)
      endTime = new Date(election.end_time[0] * 1000)
      
      const isActive = now >= startTime && now <= endTime
      
      return {
        title: election.title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        now: now.toISOString(),
        isActive,
        startTimestamp: election.start_time[0],
        endTimestamp: election.end_time[0],
        currentTimestamp: Math.floor(now.getTime() / 1000),
        startCheck: now >= startTime,
        endCheck: now <= endTime
      }
    })
    
    setResults(testResults)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Timestamp Test Results</h1>
      {results.map((result, index) => (
        <div key={index} className="mb-6 p-4 border rounded">
          <h2 className="text-lg font-semibold">{result.title}</h2>
          <p><strong>Start:</strong> {result.startTime} (timestamp: {result.startTimestamp})</p>
          <p><strong>End:</strong> {result.endTime} (timestamp: {result.endTimestamp})</p>
          <p><strong>Now:</strong> {result.now} (timestamp: {result.currentTimestamp})</p>
          <p><strong>Start Check:</strong> {result.startCheck.toString()}</p>
          <p><strong>End Check:</strong> {result.endCheck.toString()}</p>
          <p><strong>Is Active:</strong> <span className={result.isActive ? 'text-green-600' : 'text-red-600'}>{result.isActive.toString()}</span></p>
        </div>
      ))}
    </div>
  )
}
