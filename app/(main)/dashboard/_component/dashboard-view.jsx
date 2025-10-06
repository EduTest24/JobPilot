"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Lightbulb,
  Puzzle,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

{/* 🌐 Industry Insights Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-stretch">
  {/* --- ✨ Key Industry Trends --- */}
  <Card className="relative overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-b from-background to-muted/30 h-full flex flex-col">
    <CardHeader className="pb-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="text-primary h-5 w-5" />
          Key Industry Trends
        </CardTitle>
      </div>
      <CardDescription>
        Current trends shaping the industry
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul className="space-y-4">
        {insights.keyTrends.map((trend, index) => (
          <li
            key={index}
            className="flex items-start space-x-3 bg-muted/30 rounded-xl p-3 hover:bg-muted/50 transition-all"
          >
            <div className="h-2.5 w-2.5 mt-2 rounded-full bg-primary" />
            <span className="text-sm leading-relaxed">{trend}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>

  {/* --- 🧠 Recommended Skills --- */}
  <Card className="relative overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-b from-background to-muted/30 h-full flex flex-col">
    <CardHeader className="pb-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="text-primary h-5 w-5" />
          Recommended Skills
        </CardTitle>
      </div>
      <CardDescription>
        Skills to consider developing and where to learn them
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="space-y-6">
        {insights.recommendedSkills.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl hover:bg-muted/40 transition-all group"
          >
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
              <Puzzle className="h-5 w-5 text-primary" />
              {item.skill}
            </h4>

            <ul className="space-y-2">
              {item.sources.map((src, i) => (
                <li
                  key={i}
                  className="flex items-center text-sm text-muted-foreground"
                >
                  <span className="font-medium text-primary mr-2">
                    {src.type}:
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600 dark:text-blue-400 truncate max-w-[85%]"
                  >
                    {src.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>
    </div>
  );
};

export default DashboardView;
