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
import { NavLink, useNavigate } from "react-router-dom"; // Added useNavigate
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter, // Make sure CardFooter is imported if used (added for Withdraw button)
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Added Badge
import {
  Lock,
  Wallet,
  CheckCircle,
  BarChart3,
  Briefcase,
  ArrowUpRight, // Added for Withdraw button
  // Star,         // Added Star (Keep if needed by MiniGigCard)
  Lightbulb,    // Added Lightbulb
  BookOpen,     // Added BookOpen
  // User,         // Added User for MiniGigCard instructor
  // Clock         // Added Clock for MiniGigCard duration
} from "lucide-react";
import { cn } from "@/lib/utils"; // Added cn

// --- Mock Data for Charts (Updated to start at 0) ---
const earningsData = [
  { name: "Apr", earnings: 0 },
  { name: "May", earnings: 0 },
  { name: "Jun", earnings: 0 },
  { name: "Jul", earnings: 0 },
  { name: "Aug", earnings: 0 },
  { name: "Sep", earnings: 0 },
  { name: "Oct", earnings: 0 },
];
// Keep Pie Chart data as is, assuming it reflects potential distribution
const categoryData = [
  { name: "Development", value: 450 },
  { name: "Design", value: 300 },
  { name: "Writing", value: 200 },
  { name: "Other", value: 189 },
];
const COLORS = ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"]; // Cyan, Purple, Pink, Orange


// --- Mock Gig Data (subset for dashboard) ---
// Define Gig type matching GigPage.tsx for consistency
interface Gig {
  id: string;
  title: string;
  company: string;
  logo: string; // Or some identifier
  category: string;
  skill: string;
  payout: number;
  payoutType: "fixed" | "hourly";
  location: string;
  duration: string;
  isFeatured?: boolean; // Optional for this context
  isLocked: boolean;
  rating?: number; // Optional
  instructor?: string; // Add instructor if needed by MiniGigCard
  level?: "Beginner" | "Intermediate" | "Advanced"; // Add level if needed by MiniGigCard
  // other fields from GigPage not strictly needed here
}

// Assume these are fetched or filtered based on recommendations/unlock status
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
    instructor: "David Okoye", // Added instructor
    level: "Beginner", // Added level
  },
  {
    id: "4",
    title: "Data Analyst",
    company: "DataInsights",
    logo: "DI",
    category: "Data",
    skill: "Python",
    payout: 3500, // Assuming per hour
    payoutType: "hourly",
    location: "Hybrid",
    duration: "3 months",
    isLocked: false,
    rating: 4.7,
    instructor: "Emeka Okafor", // Added instructor
    level: "Beginner", // Added level
  },
   {
    id: "7",
    title: "Backend Developer",
    company: "ServerStack",
    logo: "SS",
    category: "Development",
    skill: "Node.js",
    payout: 5000, // Assuming per hour
    payoutType: "hourly",
    location: "Remote",
    duration: "2 months",
    isLocked: false,
    rating: 4.8,
    instructor: "Fatima Ibrahim", // Added instructor
    level: "Intermediate", // Added level
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
    payout: 4500, // Assuming per hour
    payoutType: "hourly",
    location: "Remote",
    duration: "1 month",
    isLocked: true,
    rating: 4.6,
    instructor: "Chiamaka Nwosu", // Added instructor
    level: "Beginner", // Added level
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
    // No instructor specified in mock, add if needed
    level: "Intermediate", // Added level
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
    instructor: "Tunde Balogun", // Added instructor
    level: "Beginner", // Added level
  },
];


// --- Helper Gig Card Component (Simplified for Dashboard) ---
const MiniGigCard: React.FC<{ gig: Gig; onTakeQuiz?: (gigId: string) => void }> = ({ gig, onTakeQuiz }) => {
    const navigate = useNavigate();

    const handleAction = () => {
        if (gig.isLocked && onTakeQuiz) {
            // Logic to potentially open quiz modal directly or navigate with state
             console.log("Trigger quiz for:", gig.id);
             // For now, navigate to GigPage and let it handle the modal opening
             navigate('/gigs', { state: { openQuizForGigId: gig.id } });
        } else if (!gig.isLocked) {
             // Navigate to GigPage and pass state to potentially open the detail modal
             navigate('/gigs', { state: { openDetailForGigId: gig.id } });
        }
    };

    return (
        <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50 transition-all hover:-translate-y-1 hover:border-emerald-500/30">
            <CardHeader className="pb-2">
                 <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 overflow-hidden"> {/* Added overflow-hidden */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {gig.logo}
                        </div>
                        <div className="flex-1 min-w-0"> {/* Added flex-1 and min-w-0 */}
                             <h4 className="text-sm font-semibold text-white leading-tight line-clamp-1 truncate">{gig.title}</h4> {/* Added truncate */}
                             <p className="text-xs text-slate-400 truncate">{gig.company}</p> {/* Added truncate */}
                        </div>
                    </div>
                     {gig.isLocked && <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs flex-shrink-0 ml-1"><Lock className="h-3 w-3 mr-1"/>Locked</Badge>}
                </div>
            </CardHeader>
            <CardContent className="pb-3 pt-1 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{gig.category}</span>
                    <span className="font-medium text-emerald-400">
                         {gig.payoutType === "hourly" ? `₦${gig.payout.toLocaleString()}/hr` : `₦${gig.payout.toLocaleString()}`}
                    </span>
                </div>
                 <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-300 text-xs font-normal">
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
                          : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white" // Use white for high contrast
                    )}
                    onClick={handleAction}
                >
                    {gig.isLocked ? (
                        <> <BookOpen className="h-3 w-3 mr-1.5"/> Take Quiz </>
                    ) : (
                        <> <Briefcase className="h-3 w-3 mr-1.5"/> View Gig </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};


const StudentDashboard: React.FC = () => {
  // Pass dummy search state to layout
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Set initial balance to 0
  const mockAvailableBalance = 0.00;

  return (
    <DashboardLayout
      title="Overview"
      searchTerm={searchTerm} // Pass dummy state
      setSearchTerm={setSearchTerm} // Pass dummy state
    >
      <div className="space-y-10">
        {/* --- Top Stat Cards (Updated Grid Layout for Mobile) --- */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"> {/* Use grid-cols-2 for mobile */}
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
                 {/* Updated Balance Display & smaller text for mobile */}
                <div className="text-2xl md:text-3xl font-bold text-green-400">₦{mockAvailableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-slate-500">No earnings yet</p>
              </CardContent>
              {/* Added Withdraw Button - Links to Wallet Page */}
              <CardFooter>
                 <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white text-xs" asChild>
                   <NavLink to="/wallet">
                    <ArrowUpRight className="h-3 w-3 mr-1.5" /> Withdraw
                   </NavLink>
                 </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-200">
            {/* Gigs Completed Card */}
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50 h-full flex flex-col justify-between"> {/* Flex utils for height consistency */}
              <div> {/* Wrapper for header and content */}
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Gigs Completed
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  {/* Updated Gigs Completed & smaller text for mobile */}
                  <div className="text-2xl md:text-3xl font-bold text-white">0</div>
                  <p className="text-xs text-slate-500">Complete gigs to earn!</p>
                </CardContent>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-300">
            {/* Skill Level Card */}
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50 h-full flex flex-col justify-between"> {/* Flex utils for height consistency */}
             <div> {/* Wrapper for header and content */}
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Skill Level
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  {/* Updated Skill Level & adjusted text size */}
                  <div className="text-xl md:text-3xl font-bold text-white">
                    Beginner
                  </div>
                  <p className="text-xs text-slate-500">Take quizzes to level up</p>
                </CardContent>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-400">
             {/* Gigs to Unlock Card */}
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50 h-full flex flex-col justify-between"> {/* Flex utils for height consistency */}
              <div> {/* Wrapper for header and content */}
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    Gigs to Unlock
                  </CardTitle>
                  <Lock className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  {/* Use dynamic length & smaller text for mobile */}
                  <div className="text-2xl md:text-3xl font-bold text-white">{gigsToUnlock.length}</div>
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
              <h3 className="text-xl md:text-2xl font-bold text-white"> {/* Adjusted text size */}
                Find Your Next Gig
              </h3>
              <p className="text-slate-400 max-w-lg mt-2 text-sm md:text-base"> {/* Adjusted text size */}
                Browse, search, and filter through all available gigs. Take
                skill quizzes to unlock higher-paying opportunities.
              </p>
            </div>
            <Button
              asChild
              className="bg-green-500 text-slate-950 font-bold hover:bg-green-400 focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] z-10 w-full md:w-auto flex-shrink-0 text-sm md:text-base" /* Adjusted text size */
            >
              <NavLink to="/gigs">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse All Gigs
              </NavLink>
            </Button>
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-green-500/10 to-transparent opacity-30 animate-spin-slow" />
          </Card>
        </AnimatedSection>

        {/* --- Added Sections: Recommendations & Unlock --- */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10"> {/* Adjusted gap */}
            {/* Recommended Gigs */}
             <AnimatedSection delay="delay-300">
                 <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <Lightbulb className="h-5 md:h-6 w-5 md:w-6 text-cyan-400" /> {/* Adjusted size */}
                        <h2 className="text-xl md:text-2xl font-bold text-slate-100">Recommended For You</h2> {/* Adjusted size */}
                     </div>
                      <Button variant="link" size="sm" className="text-cyan-400 px-0 text-xs md:text-sm" onClick={() => navigate('/gigs')}>View All</Button> {/* Adjusted size */}
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                     {recommendedGigs.slice(0, 2).map((gig) => ( // Show first 2 recommendations
                        <MiniGigCard key={gig.id} gig={gig} />
                     ))}
                 </div>
            </AnimatedSection>

            {/* Gigs to Unlock */}
            <AnimatedSection delay="delay-400">
                <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <Lock className="h-5 md:h-6 w-5 md:w-6 text-amber-400" /> {/* Adjusted size */}
                        <h2 className="text-xl md:text-2xl font-bold text-slate-100">Unlock Higher Pay</h2> {/* Adjusted size */}
                     </div>
                      <Button variant="link" size="sm" className="text-amber-400 px-0 text-xs md:text-sm" onClick={() => navigate('/gigs', { state: { filter: 'locked' } })}>View All</Button> {/* Adjusted size */}
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                     {gigsToUnlock.slice(0, 2).map((gig) => ( // Show first 2 unlockable
                        <MiniGigCard key={gig.id} gig={gig} />
                     ))}
                 </div>
            </AnimatedSection>
         </div>


        {/* --- Charts Section (Keeping both) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatedSection delay="delay-100" className="lg:col-span-2">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white text-lg md:text-xl">Earnings Trend</CardTitle> {/* Adjusted size */}
                <CardDescription className="text-slate-500 text-xs md:text-sm"> {/* Adjusted size */}
                  Your earnings over the last 7 months.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2 h-[250px] sm:h-[300px] md:h-[350px]"> {/* Adjusted height */}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={earningsData} // Updated data
                    margin={{ top: 5, right: 10, bottom: 0, left: -20 }} // Adjusted margins for mobile
                  >
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)"/>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={5}/> {/* Smaller font, dy */}
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${(value/1000)}k`} dx={-5}/> {/* Smaller font, dx */}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        color: "#e2e8f0",
                        borderRadius: "8px",
                        fontSize: '12px', // Smaller tooltip font
                        padding: '4px 8px' // Tighter tooltip padding
                      }}
                      cursor={{ stroke: "#334155" }}
                      formatter={(value: number) => [`₦${value.toLocaleString()}`, "Earnings"]} // Use NGN
                    />
                    <Line
                      type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} dot={false}
                      activeDot={{ r: 6, fill: "#10b981", stroke: "#0f172a", strokeWidth: 2 }} // Smaller active dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay="delay-200">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white text-lg md:text-xl">Earnings by Category</CardTitle> {/* Adjusted size */}
                <CardDescription className="text-slate-500 text-xs md:text-sm"> {/* Adjusted size */}
                  Potential income distribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[300px] md:h-[350px]"> {/* Adjusted height */}
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        color: "#e2e8f0",
                        borderRadius: "8px",
                         fontSize: '12px', // Smaller tooltip font
                         padding: '4px 8px' // Tighter tooltip padding
                      }}
                       formatter={(value: number, name: string) => [`${name}: ₦${value.toLocaleString()}`]} // Format tooltip content
                    />
                    <Pie
                      data={categoryData} cx="50%" cy="50%" labelLine={false}
                      innerRadius={50} outerRadius={80} // Smaller radius for mobile
                      fill="#8884d8" dataKey="value" stroke="none"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                     {/* Optional: Add text in the center if balance is 0 */}
                    {mockAvailableBalance === 0 && (
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="12"> {/* Smaller font */}
                        No earnings yet
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

