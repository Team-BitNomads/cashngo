import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { NavLink } from "react-router-dom";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Lock,
  Wallet,
  CheckCircle,
  BarChart3,
} from "lucide-react";

const earningsData = [
  { name: "Jan", earnings: 180 },
  { name: "Feb", earnings: 220 },
  { name: "Mar", earnings: 200 },
  { name: "Apr", earnings: 280 },
  { name: "May", earnings: 260 },
  { name: "Jun", earnings: 320 },
  { name: "Jul", earnings: 300 },
];
const categoryData = [
  { name: "Data Entry", value: 450 },
  { name: "Social Media", value: 300 },
  { name: "Copywriting", value: 200 },
  { name: "Other", value: 189 },
];
const COLORS = ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"]; // Cyan, Purple, Pink, Orange
const allAvailableGigs = [
  {
    title: "Social Media Content Creation",
    payout: 25,
    skill: "Canva Basics",
    company: "Innovate Inc.",
  },
  {
    title: "Transcribe Audio Interview",
    payout: 15,
    skill: "Fast Typing",
    company: "Media Group",
  },
  {
    title: "User Testing for Mobile App",
    payout: 30,
    skill: "Attention to Detail",
    company: "Appify Ltd.",
  },
  {
    title: "Data Cleaning in Excel",
    payout: 20,
    skill: "Excel Basics",
    company: "Data Solutions",
  },
];
const allLockedGigs = [
  {
    title: "Advanced Financial Modeling",
    payout: 75,
    skill: "Python/SQL",
    company: "Fintech Solutions",
  },
  {
    title: "AI Prompt Engineering",
    payout: 50,
    skill: "Creative Writing",
    company: "Future AI",
  },
  {
    title: "React Component Development",
    payout: 120,
    skill: "React.js",
    company: "DevHouse",
  },
  {
    title: "SEO Keyword Research",
    payout: 60,
    skill: "SEO Tools",
    company: "RankUp",
  },
];

const StudentDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAvailableGigs = useMemo(
    () =>
      allAvailableGigs.filter(
        (gig) =>
          gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gig.company.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );
  const filteredLockedGigs = useMemo(
    () =>
      allLockedGigs.filter(
        (gig) =>
          gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gig.company.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <DashboardLayout
      title="Overview"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedSection delay="delay-100">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Available Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">$84.50</div>
                <p className="text-xs text-slate-500">+15% from last month</p>
              </CardContent>
            </Card>
          </AnimatedSection>
          <AnimatedSection delay="delay-200">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Gigs Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">12</div>
                <p className="text-xs text-slate-500">+2 from last month</p>
              </CardContent>
            </Card>
          </AnimatedSection>
          <AnimatedSection delay="delay-300">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Skill Level
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  Intermediate
                </div>
                <p className="text-xs text-slate-500">Top 30% of users</p>
              </CardContent>
            </Card>
          </AnimatedSection>
          <AnimatedSection delay="delay-400">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Jobs to Unlock
                </CardTitle>
                <Lock className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">4</div>
                <p className="text-xs text-slate-500">
                  High-paying opportunities
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        <div className="space-y-10">
          <AnimatedSection>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-100">
                Available Gigs
              </h2>
              <Button
                variant="ghost"
                asChild
                className="text-green-400 hover:text-green-400"
              >
                <NavLink to="/gigs">
                  View All <ArrowUpRight className="h-4 w-4 ml-2" />
                </NavLink>
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAvailableGigs.map((gig) => (
                <Card
                  key={gig.title}
                  className="relative bg-slate-900 border-slate-800 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 glow-on-hover"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-slate-400">{gig.company}</p>
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-400"
                      >
                        New
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2">
                      {gig.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Required Skill: {gig.skill}
                    </p>
                  </div>
                  <div className="flex items-end justify-between mt-6">
                    <div>
                      <p className="text-sm text-slate-500">Payout</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${gig.payout.toFixed(2)}
                      </p>
                    </div>
                    <Button className="bg-green-500 hover:bg-green-600 text-slate-900 font-bold">
                      Apply Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="text-2xl font-bold text-slate-100">
              Unlock Higher Pay with Skill-Synth
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLockedGigs.map((gig) => (
                <Card
                  key={gig.title}
                  className="relative bg-slate-900 border-slate-800 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 glow-on-hover"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-slate-400">{gig.company}</p>
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2">
                      {gig.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Required Skill: {gig.skill}
                    </p>
                  </div>
                  <div className="flex items-end justify-between mt-6">
                    <div>
                      <p className="text-sm text-slate-500">Payout</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        ${gig.payout.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                      Take Quiz to Unlock
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatedSection delay="delay-100" className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Earnings Trend</CardTitle>
                <CardDescription>
                  Your earnings over the last 7 months.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={earningsData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorEarnings"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        color: "#e2e8f0",
                      }}
                      cursor={{ stroke: "#334155" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8, fill: "#10b981", stroke: "#fff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>
          <AnimatedSection delay="delay-200">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Earnings by Category
                </CardTitle>
                <CardDescription>
                  How your income is distributed.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        color: "#e2e8f0",
                      }}
                    />
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={70}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
