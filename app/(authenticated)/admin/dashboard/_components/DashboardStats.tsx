"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Vote, TrendingUp, BarChart3 } from "lucide-react";
import { format } from "date-fns";

interface Election {
  id: string;
  title: string;
}

interface Stats {
  id: string;
  title: string;
  totalVoters: number;
  votesCast: number;
  turnoutPercentage: number;
  totalPositions: number;
  totalCandidates: number;
  start_date: string;
  end_date: string;
}

interface DashboardStatsProps {
  activeElections: Election[];
  initialStats: Stats;
}

export default function DashboardStats({
  activeElections,
  initialStats,
}: DashboardStatsProps) {
  const [selectedElectionId, setSelectedElectionId] = useState(initialStats.id);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [isLoading, setIsLoading] = useState(false);

  const handleElectionChange = async (electionId: string) => {
    setIsLoading(true);
    setSelectedElectionId(electionId);

    try {
      const response = await fetch(
        `/api/dashboard/election-stats?electionId=${electionId}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching election stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const electionStart = stats.start_date ? new Date(stats.start_date) : null;
  const electionEnd = stats.end_date ? new Date(stats.end_date) : null;

  return (
    <div className="space-y-6 pt-6 p-4 md:p-6">
      {/* Header with Selector */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Current Running Election Statistics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor and manage your election campaign
          </p>
        </div>
        {activeElections && activeElections.length > 1 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="dashboard-election-switch"
              className="text-sm font-medium text-foreground hidden sm:inline"
            >
              Current Election:
            </label>
            <div className="relative">
              <select
                id="dashboard-election-switch"
                value={selectedElectionId}
                onChange={(e) => handleElectionChange(e.target.value)}
                disabled={isLoading}
                className="appearance-none px-3 py-2 pr-8 border border-input rounded-lg bg-background text-sm font-medium text-foreground hover:border-border focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeElections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Active Election Card - Compact */}
      <Card className="border-2 border-green-600 rounded-2xl">
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <Vote className="w-5 h-5 text-green-600" />
              <div>
                <h2 className="font-semibold text-foreground">
                  Current Election
                </h2>
                <p className="text-sm text-muted-foreground">{stats.title}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
              Active
            </span>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-6">
            {/* Voting Period */}
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">
                Voting Period
              </p>
              <p className="font-semibold text-foreground text-sm md:text-base">
                {electionStart
                  ? format(electionStart, "MMM dd, yyyy")
                  : "Not set"}{" "}
                -{" "}
                {electionEnd ? format(electionEnd, "MMM dd, yyyy") : "Not set"}
              </p>
            </div>

            {/* Voter Turnout with Progress */}
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">
                Voter Turnout
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-xl font-bold text-foreground">
                  {stats.votesCast || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  / {stats.totalVoters || 0}
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${stats.turnoutPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.turnoutPercentage}% turnout
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-start md:items-end gap-2 md:gap-3">
              <Link href={`/admin/elections/${stats.id}`}>
                <Button className="bg-background text-foreground border border-input hover:bg-accent px-4 py-2 text-sm font-medium w-full sm:w-auto">
                  View Results
                </Button>
              </Link>
              <Link href={`/admin/elections/${stats.id}`}>
                <Button className="bg-background text-foreground border border-input hover:bg-accent px-4 py-2 text-sm font-medium w-full sm:w-auto">
                  Manage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Voters */}
        <Card className="border border-border">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Registered Voters
              </h3>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {stats.totalVoters || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Active student accounts
            </p>
          </div>
        </Card>

        {/* Votes Cast */}
        <Card className="border border-border">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Votes Cast</h3>
              <Vote className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {stats.votesCast || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">+13 from last hour</p>
          </div>
        </Card>

        {/* Active Positions */}
        <Card className="border border-border">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Active Positions
              </h3>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {stats.totalPositions || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Presidential, VP, and more
            </p>
          </div>
        </Card>

        {/* Real-time Updates */}
        <Card className="border border-border">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Real-time Updates
              </h3>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-green-600">Live</p>
            <p className="text-xs text-muted-foreground mt-2">Results updating</p>
          </div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/admin/elections/${stats.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-border">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-foreground">
                  View Live Results
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Monitor real-time voting progress and preliminary results
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/admin/elections/${stats.id}/positions`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-border">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-foreground">
                  Manage Candidates
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Add, edit, or review candidate registrations and profiles
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/admin/elections/${stats.id}/settings`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-border">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-foreground">
                  Settings & Configuration
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Adjust election settings, timing, and other configurations
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
