import React, { useState, useEffect } from "react"; // Added useEffect
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
import { NavLink, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Wallet,
  CheckCircle,
  BarChart3,
  Briefcase,
  ArrowUpRight,
  // Star, // Keep if needed by MiniGigCard
  Lightbulb,
  BookOpen,
  // User, // Added User for MiniGigCard instructor
  // Clock,  // Added Clock for MiniGigCard duration
} from "lucide-react";
import { cn } from "@/lib/utils";
import useLocalStorage from "@/hooks/useLocalStorage"; // Added useLocalStorage import
type DashboardGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DashboardGuideModal: React.FC<DashboardGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 z-10 max-w-lg w-full">
        <h3 className="text-lg font-bold text-white mb-2">Welcome</h3>
        <p className="text-sm text-slate-400 mb-4">
          This quick guide will help you get started with finding and unlocking gigs.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 text-white rounded"
            type="button"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Mock Data (Earnings, Category, Gigs) ---
const earningsData = [
  { name: "Apr", earnings: 0 },
  { name: "May", earnings: 0 },
  { name: "Jun", earnings: 0 },
  { name: "Jul", earnings: 0 },
  { name: "Aug", earnings: 0 },
  { name: "Sep", earnings: 0 },
  { name: "Oct", earnings: 0 },
];
const categoryData = [
  { name: "Development", value: 450 },
  { name: "Design", value: 300 },
  { name: "Writing", value: 200 },
  { name: "Other", value: 189 },
];
const COLORS = ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"];
interface Gig {
  id: string;
  title: string;
  company: string;
  logo: string;
  category: string;
  skill: string;
  payout: number;
  payoutType: "fixed" | "hourly";
  location: string;
  duration: string;
  isFeatured?: boolean;
  isLocked: boolean;
  rating?: number;
  instructor?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
}
const recommendedGigs: Gig[] = [
  {
    id: "3",
    title: "Content Writer",
    company: "ContentPro",
    logo: "CP",
    category: "Writing",
    skill: "Copywriting",
    payout: 80000,
    payoutType: "fixed",
    location: "Remote",
    duration: "2 weeks",
    isLocked: false,
    rating: 4.4,
    instructor: "David Okoye",
    level: "Beginner",
  },
  {
    id: "4",
    title: "Data Analyst",
    company: "DataInsights",
    logo: "DI",
    category: "Data",
    skill: "Python",
    payout: 3500,
    payoutType: "hourly",
    location: "Hybrid",
    duration: "3 months",
    isLocked: false,
    rating: 4.7,
    instructor: "Emeka Okafor",
    level: "Beginner",
  },
  {
    id: "7",
    title: "Backend Developer",
    company: "ServerStack",
    logo: "SS",
    category: "Development",
    skill: "Node.js",
    payout: 5000,
    payoutType: "hourly",
    location: "Remote",
    duration: "2 months",
    isLocked: false,
    rating: 4.8,
    instructor: "Fatima Ibrahim",
    level: "Intermediate",
  },
];
const gigsToUnlock: Gig[] = [
  {
    id: "2",
    title: "UI/UX Designer",
    company: "DesignStudio",
    logo: "DS",
    category: "Design",
    skill: "Figma",
    payout: 4500,
    payoutType: "hourly",
    location: "Remote",
    duration: "1 month",
    isLocked: true,
    rating: 4.6,
    instructor: "Chiamaka Nwosu",
    level: "Beginner",
  },
  {
    id: "5",
    title: "Mobile App Developer",
    company: "AppCraft",
    logo: "AC",
    category: "Development",
    skill: "React Native",
    payout: 180000,
    payoutType: "fixed",
    location: "Remote",
    duration: "1 month",
    isLocked: true,
    rating: 4.9,
    level: "Intermediate",
  },
  {
    id: "8",
    title: "Graphic Designer",
    company: "VisualArts",
    logo: "VA",
    category: "Design",
    skill: "Illustrator",
    payout: 120000,
    payoutType: "fixed",
    location: "On-site",
    duration: "3 weeks",
    isLocked: true,
    rating: 4.5,
    instructor: "Tunde Balogun",
    level: "Beginner",
  },
];

// --- MiniGigCard Component ---
const MiniGigCard: React.FC<{
  gig: Gig;
  onTakeQuiz?: (gigId: string) => void;
}> = ({ gig, onTakeQuiz }) => {
  const navigate = useNavigate();
  const handleAction = () => {
    if (gig.isLocked && onTakeQuiz) {
      console.log("Trigger quiz for:", gig.id);
      navigate("/gigs", { state: { openQuizForGigId: gig.id } });
    } else if (!gig.isLocked) {
      navigate("/gigs", { state: { openDetailForGigId: gig.id } });
    }
  };
  return (
    <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50 transition-all hover:-translate-y-1 hover:border-emerald-500/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {gig.logo}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white leading-tight line-clamp-1 truncate">
                {gig.title}
              </h4>
              <p className="text-xs text-slate-400 truncate">{gig.company}</p>
            </div>
          </div>
          {gig.isLocked && (
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs flex-shrink-0 ml-1">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-1 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{gig.category}</span>
          <span className="font-medium text-emerald-400">
            {gig.payoutType === "hourly"
              ? `₦${gig.payout.toLocaleString()}/hr`
              : `₦${gig.payout.toLocaleString()}`}
          </span>
        </div>
        <Badge
          variant="outline"
          className="bg-slate-800/50 border-slate-700 text-slate-300 text-xs font-normal"
        >
          Skill: {gig.skill}
        </Badge>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          size="sm"
          variant={gig.isLocked ? "outline" : "default"}
          className={cn(
            "w-full text-xs",
            gig.isLocked
              ? "border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:text-amber-300"
              : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
          )}
          onClick={handleAction}
        >
          {gig.isLocked ? (
            <>
              <BookOpen className="h-3 w-3 mr-1.5" /> Take Quiz
            </>
          ) : (
            <>
              <Briefcase className="h-3 w-3 mr-1.5" /> View Gig
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const StudentDashboard: React.FC = () => {
  // Pass dummy search state to layout
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Set initial balance to 0
  const mockAvailableBalance = 0.0;

  // --- State for Guide Modal ---
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [guideShown, setGuideShown] = useLocalStorage<boolean>(
    "cashngo_guideShown_v2",
    false
  ); // Added versioning

  // --- Effect to show guide modal once ---
  useEffect(() => {
    // Show modal only if it hasn't been shown before
    if (!guideShown) {
      // Use a timeout to prevent modal from appearing too abruptly on load
      const timer = setTimeout(() => {
        setIsGuideModalOpen(true);
      }, 1500); // Show after 1.5 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [guideShown]); // Dependency array includes guideShown

  const handleCloseGuide = () => {
    setIsGuideModalOpen(false);
    setGuideShown(true); // Mark guide as shown in localStorage
  };

  return (
    <DashboardLayout
      title="Overview"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      {/* --- Render the Guide Modal --- */}
      <DashboardGuideModal
        isOpen={isGuideModalOpen}
        onClose={handleCloseGuide}
      />

      <div className="space-y-10">
        {/* --- Top Stat Cards (Mobile 2x2 Grid) --- */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatedSection delay="delay-100">
            {/* Available Balance Card */}
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Available Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-2xl md:text-3xl font-bold text-green-400">
                  ₦
                  {mockAvailableBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-slate-500">No earnings yet</p>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                  asChild
                >
                  <NavLink to="/wallet">
                    <ArrowUpRight className="h-3 w-3 mr-1.5" /> Withdraw
                  </NavLink>
                </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-200">
            {/* Gigs Completed Card */}
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Gigs Completed
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    0
                  </div>
                  <p className="text-xs text-slate-500">
                    Complete gigs to earn!
                  </p>
                </CardContent>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-300">
            {/* Skill Level Card */}
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Skill Level
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-3xl font-bold text-white">
                    Beginner
                  </div>
                  <p className="text-xs text-slate-500">
                    Take quizzes to level up
                  </p>
                </CardContent>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-400">
            {/* Gigs to Unlock Card */}
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50 h-full flex flex-col justify-between">
              <div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Gigs to Unlock
                  </CardTitle>
                  <Lock className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {gigsToUnlock.length}
                  </div>
                  <p className="text-xs text-slate-500">
                    High-paying opportunities
                  </p>
                </CardContent>
              </div>
            </Card>
          </AnimatedSection>
        </div>

        {/* --- "Find Gigs" Call-to-Action --- */}
        <AnimatedSection delay="delay-200">
          <Card className="bg-slate-900/60 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10 overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-6 gap-6">
            <div className="z-10">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Find Your Next Gig
              </h3>
              <p className="text-slate-400 max-w-lg mt-2 text-sm md:text-base">
                Browse, search, and filter through all available gigs. Take
                skill quizzes to unlock higher-paying opportunities.
              </p>
            </div>
            <Button
              asChild
              className="bg-green-500 text-slate-950 font-bold hover:bg-green-400 focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] z-10 w-full md:w-auto flex-shrink-0 text-sm md:text-base"
            >
              <NavLink to="/gigs">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse All Gigs
              </NavLink>
            </Button>
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-green-500/10 to-transparent opacity-30 animate-spin-slow" />
          </Card>
        </AnimatedSection>

        {/* --- Sections: Recommendations & Unlock --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {/* Recommended Gigs */}
          <AnimatedSection delay="delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-5 md:h-6 w-5 md:w-6 text-cyan-400" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">
                  Recommended For You
                </h2>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-cyan-400 px-0 text-xs md:text-sm"
                onClick={() => navigate("/gigs")}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {recommendedGigs.slice(0, 2).map((gig) => (
                <MiniGigCard key={gig.id} gig={gig} />
              ))}
            </div>
          </AnimatedSection>

          {/* Gigs to Unlock */}
          <AnimatedSection delay="delay-400">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 md:h-6 w-5 md:w-6 text-amber-400" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">
                  Unlock Higher Pay
                </h2>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-amber-400 px-0 text-xs md:text-sm"
                onClick={() =>
                  navigate("/gigs", { state: { filter: "locked" } })
                }
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {gigsToUnlock.slice(0, 2).map((gig) => (
                <MiniGigCard key={gig.id} gig={gig} />
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatedSection delay="delay-100" className="lg:col-span-2">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white text-lg md:text-xl">
                  Earnings Trend
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs md:text-sm">
                  Your earnings over the last 7 months.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 h-[250px] sm:h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={earningsData}
                    margin={{ top: 5, right: 10, bottom: 0, left: -20 }}
                  >
                    <defs>
                      {" "}
                      <linearGradient
                        id="colorEarnings"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        {" "}
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />{" "}
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />{" "}
                      </linearGradient>{" "}
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      dy={5}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₦${value / 1000}k`}
                      dx={-5}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        color: "#e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px",
                        padding: "4px 8px",
                      }}
                      cursor={{ stroke: "#334155" }}
                      formatter={(value: number) => [
                        `₦${value.toLocaleString()}`,
                        "Earnings",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 6,
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
                <CardTitle className="text-white text-lg md:text-xl">
                  Earnings by Category
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs md:text-sm">
                  Potential income distribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        color: "#e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px",
                        padding: "4px 8px",
                      }}
                      formatter={(value: number, name: string) => [
                        `${name}: ₦${value.toLocaleString()}`,
                      ]}
                    />
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={50}
                      outerRadius={80}
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
                    {mockAvailableBalance === 0 && (
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#64748b"
                        fontSize="12"
                      >
                        {" "}
                        No earnings yet{" "}
                      </text>
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </DashboardLayout>
  );
};

export default StudentDashboard;
