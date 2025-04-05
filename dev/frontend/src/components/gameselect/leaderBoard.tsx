"use client";
import { useState, useEffect } from "react";
import { Trophy, Medal, Brain, ArrowUp, ArrowDown } from "lucide-react";
import Header from "./header";
import Navbar from "../navbar/navbar";

type LeaderboardEntry = {
  uid: string;
  username: string;
  rating: number;
  rank: number;
};

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [sortBy, setSortBy] = useState<"rank" | "score" | "name">("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [timeframe, setTimeframe] = useState<
    "daily" | "weekly" | "monthly" | "all-time"
  >("weekly");

  // ✅ Fetching leaderboard data using Fetch API
  const getLeaderboard = async () => {
    try {
      const response = await fetch(
        "/api/leaderboard"
      );
      const data: { uid: string; username: string; rating: number }[] =
        await response.json();

      const sortedData: LeaderboardEntry[] = data
        .sort((a, b) => b.rating - a.rating)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

      setLeaderboardData(sortedData);
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
    }
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  // Sorting function
  const handleSort = (criteria: "rank" | "score" | "name") => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortDirection("asc");
    }
  };

  // Icon for top ranks
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-300" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="flex h-5 w-5 items-center justify-center text-green-300">
            {rank}
          </span>
        );
    }
  };

  return (
    <div className="flex bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] bg-cover bg-center h-screen overflow-hidden">
      <Navbar />
      <div className="w-full">
        <Header />
        <div className="w-full max-w-4xl mx-auto rounded-xl shadow-lg border border-green-900 flex flex-col h-[89vh]">
          {/* Header */}
          <div className="p-6 bg-black bg-opacity-80 border-b border-green-900 flex flex-col items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">
                  Leaderboard
                </h2>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-black bg-opacity-70 text-green-300 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-1 flex items-center">
                <button
                  onClick={() => handleSort("rank")}
                  className="flex items-center gap-1 hover:text-green-400 transition-colors"
                >
                  Rank
                  {sortBy === "rank" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    ))}
                </button>
              </div>
              <div className="col-span-7 flex items-center">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-green-400 transition-colors"
                >
                  Name
                  {sortBy === "name" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    ))}
                </button>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <button
                  onClick={() => handleSort("score")}
                  className="flex items-center gap-1 hover:text-green-400 transition-colors"
                >
                  Score
                  {sortBy === "score" &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    ))}
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
            <div className="divide-y divide-green-900/30">
              {leaderboardData.map((entry) => (
                <div
                  key={entry.uid}
                  className="px-6 py-4 bg-black hover:bg-opacity-70 transition-colors bg-opacity-70"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="col-span-7 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-green-800 flex-shrink-0">
                        <img
                          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${entry.username}`}
                          alt={`${entry.username}'s avatar`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-white">
                        {entry.username}
                      </span>
                    </div>
                    <div className="col-span-3 text-right">
                      <span className="font-mono font-bold text-green-300 text-white">
                        {entry.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-black bg-opacity-80 text-center text-xs text-green-600">
            Last updated: {new Date().toLocaleDateString()} •{" "}
            {timeframe.charAt(0).toUpperCase() +
              timeframe.slice(1).replace("-", " ")}{" "}
            Rankings
          </div>
        </div>
      </div>
    </div>
  );
}
