import React, { useState } from "react";
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
import {
  // ArrowUpRight,
  Lock,
  Wallet,
  CheckCircle,
  BarChart3,
  Briefcase,
} from "lucide-react";

// --- Mock Data for Charts ---
const earningsData = [
  { name: "Apr", earnings: 200 },
  { name: "May", earnings: 260 },
  { name: "Jun", earnings: 320 },
  { name: "Jul", earnings: 300 },
  { name: "Aug", earnings: 350 },
  { name: "Sep", earnings: 400 },
  { name: "Oct", earnings: 380 },
];
const categoryData = [
  { name: "Development", value: 450 },
  { name: "Design", value: 300 },
  { name: "Writing", value: 200 },
  { name: "Other", value: 189 },
];
const COLORS = ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"]; // Cyan, Purple, Pink, Orange

const StudentDashboard: React.FC = () => {
  // The dashboard (overview) page doesn't need search functionality
  // We pass empty values to the layout, which will still render the search bar
  // but it will be non-functional on this specific page.
  // The GigPage will handle the real search state.
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardLayout
      title="Overview"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div className="space-y-10">
        {/* --- Top Stat Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedSection delay="delay-100">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Available Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">₦45,000.00</div>
                <p className="text-xs text-slate-500">+15% from last month</p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-200">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Gigs Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">5</div>
                <p className="text-xs text-slate-500">+2 from last month</p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-300">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Skill Level
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-cyan-400" />
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
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Gigs to Unlock
                </CardTitle>
                <Lock className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">3</div>
                <p className="text-xs text-slate-500">
                  High-paying opportunities
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* --- "Find Gigs" Call-to-Action --- */}
        <AnimatedSection delay="delay-200">
          <Card className="bg-slate-900/60 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10 overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-6 gap-6">
            <div className="z-10">
              <h3 className="text-2xl font-bold text-white">
                Find Your Next Gig
              </h3>
              <p className="text-slate-400 max-w-lg mt-2">
                Browse, search, and filter through all available gigs. Take
                skill quizzes to unlock higher-paying opportunities.
              </p>
            </div>
            <Button
              asChild
              className="bg-green-500 text-slate-950 font-bold hover:bg-green-400 focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] z-10 w-full md:w-auto flex-shrink-0"
            >
              <NavLink to="/gigs">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse All Gigs
              </NavLink>
            </Button>
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-green-500/10 to-transparent opacity-30 animate-spin-slow" />
          </Card>
        </AnimatedSection>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatedSection delay="delay-100" className="lg:col-span-2">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Earnings Trend</CardTitle>
                <CardDescription className="text-slate-500">
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
                        borderRadius: "8px",
                      }}
                      cursor={{ stroke: "#334155" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 8,
                        fill: "#10b981",
                        stroke: "#0f172a",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-200">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Earnings by Category
                </CardTitle>
                <CardDescription className="text-slate-500">
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
                        borderRadius: "8px",
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
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default StudentDashboard;
