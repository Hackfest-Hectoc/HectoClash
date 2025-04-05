"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Brain, ArrowUp, ArrowDown } from "lucide-react"
import { div } from "framer-motion/client"
import Header from "./header"
import Navbar from "../navbar/navbar"

// Sample data for the leaderboard
const initialLeaderboardData = [
  { id: 1, name: "Alex Thompson", score: 985, rank: 1, change: 0, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Morgan Lee", score: 875, rank: 2, change: 2, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Jamie Chen", score: 830, rank: 3, change: -1, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "Taylor Kim", score: 790, rank: 4, change: 1, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "Jordan Smith", score: 765, rank: 5, change: -2, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 6, name: "Casey Wilson", score: 720, rank: 6, change: 0, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 7, name: "Riley Johnson", score: 695, rank: 7, change: 3, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 8, name: "Quinn Martinez", score: 680, rank: 8, change: -1, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 9, name: "Avery Garcia", score: 650, rank: 9, change: 2, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 10, name: "Dakota Brown", score: 635, rank: 10, change: -1, avatar: "/placeholder.svg?height=40&width=40" },
]

type LeaderboardEntry = {
  id: number
  name: string
  score: number
  rank: number
  change: number
  avatar: string
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(initialLeaderboardData)
  const [sortBy, setSortBy] = useState<"rank" | "score" | "name">("rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "all-time">("weekly")

  // Sort the leaderboard data based on the selected criteria
  useEffect(() => {
    const sortedData = [...initialLeaderboardData].sort((a, b) => {
      if (sortBy === "rank") {
        return sortDirection === "asc" ? a.rank - b.rank : b.rank - a.rank
      } else if (sortBy === "score") {
        return sortDirection === "asc" ? a.score - b.score : b.score - a.score
      } else {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
    })

    setLeaderboardData(sortedData)
  }, [sortBy, sortDirection])

  // Function to handle sorting
  const handleSort = (criteria: "rank" | "score" | "name") => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(criteria)
      setSortDirection("asc")
    }
  }

  // Function to get rank icon based on position
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-300" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="flex h-5 w-5 items-center justify-center text-green-300">{rank}</span>
    }
  }

  // Function to get change indicator
  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return <ArrowUp className="h-4 w-4 text-green-400" />
    } else if (change < 0) {
      return <ArrowDown className="h-4 w-4 text-red-400" />
    }
    return null
  }

  return (
    <div className="flex bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center h-screen overflow-hidden">
        <Navbar></Navbar>
        <div className="w-full">
    <Header></Header>
    <div
      className="w-full max-w-4xl mx-auto rounded-xl  shadow-lg border border-green-900  flex flex-col h-[89vh] ">
      {/* Header */}
      <div className="p-6 bg-black bg-opacity-80 border-b border-green-900 flex flex-col items-center ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">Leaderboard</h2>
          </div>

          {/* Timeframe selector */}

        </div>
      </div>

      {/* Table header */}
      <div className="bg-black bg-opacity-70 text-green-300 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 flex items-center">
            <button
              onClick={() => handleSort("rank")}
              className="flex items-center gap-1 hover:text-green-400 transition-colors"
            >
              Rank
              {sortBy === "rank" &&
                (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
            </button>
          </div>
          <div className="col-span-7 flex items-center">
            <button
              onClick={() => handleSort("name")}
              className="flex items-center gap-1 hover:text-green-400 transition-colors"
            >
              Name
              {sortBy === "name" &&
                (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
            </button>
          </div>
          <div className="col-span-3 flex items-center justify-end">
            <button
              onClick={() => handleSort("score")}
              className="flex items-center gap-1 hover:text-green-400 transition-colors"
            >
              Score
              {sortBy === "score" &&
                (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
            </button>
          </div>

        </div>
      </div>

      {/* Leaderboard entries */}
      <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent ">


      <div className="divide-y divide-green-900/30    ">
        {leaderboardData.map((entry) => (
            <div
            key={entry.id}
            className={`px-6 py-4 bg-black bg-opacity-60 hover:bg-opacity-70 transition-colors ${
              entry.rank <= 3 ? "bg-opacity-70" : ""
            }`}
          >
            <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 flex justify-center">{getRankIcon(entry.rank)}</div>
              <div className="col-span-7 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-green-800 flex-shrink-0">
                  <img
                    src={entry.avatar || "/placeholder.svg"}
                    alt={`${entry.name}'s avatar`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-medium text-green-100">{entry.name}</span>
              </div>
              <div className="col-span-3 text-right">
                <span className="font-mono font-bold text-green-300">{entry.score.toLocaleString()}</span>
              </div>

            </div>
          </div>
        ))}
      </div>
      </div>
      {/* Footer */}
      <div className="p-4 bg-black bg-opacity-80 text-center text-xs text-green-600">
        Last updated: {new Date().toLocaleDateString()} •{" "}
        {timeframe.charAt(0).toUpperCase() + timeframe.slice(1).replace("-", " ")} Rankings
      </div>
    </div>
    </div>
    </div>
  )
}

