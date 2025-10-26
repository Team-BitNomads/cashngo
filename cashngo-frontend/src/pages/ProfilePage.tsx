import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  GraduationCap,
  // BadgeCheck,
  Award,
  Star,
  type LucideIcon, // Import the LucideIcon type
} from "lucide-react";

// --- 1. NEW: Local type for Badge DISPLAY ---
// This prevents conflict with the `Badge` type from `types.ts`
type BadgeDisplayInfo = {
  id: number;
  name: string;
  icon: LucideIcon; // Use the imported LucideIcon type
  color: string;
  bgColor: string;
  borderColor: string;
};

// Mock data for earned badges
// Use the new BadgeDisplayInfo type
const mockBadges: BadgeDisplayInfo[] = [
  {
    id: 1,
    name: "React Basics",
    icon: Star,
    color: "text-cyan-400",
    bgColor: "bg-cyan-900/50",
    borderColor: "border-cyan-500/30",
  },
  {
    id: 2,
    name: "Excel Formulas",
    icon: Award,
    color: "text-green-400",
    bgColor: "bg-green-900/50",
    borderColor: "border-green-500/30",
  },
  {
    id: 3,
    name: "Canva Design",
    icon: Award,
    color: "text-pink-400",
    bgColor: "bg-pink-900/50",
    borderColor: "border-pink-500/30",
  },
  {
    id: 4,
    name: "Fast Typing",
    icon: Star,
    color: "text-purple-400",
    bgColor: "bg-purple-900/50",
    borderColor: "border-purple-500/30",
  },
  {
    id: 5,
    name: "SEO Fundamentals",
    icon: Award,
    color: "text-yellow-400",
    bgColor: "bg-yellow-900/50",
    borderColor: "border-yellow-500/30",
  },
  {
    id: 6,
    name: "Python (Basic)",
    icon: Star,
    color: "text-blue-400",
    bgColor: "bg-blue-900/50",
    borderColor: "border-blue-500/30",
  },
];

// --- 2. The Page Component ---
const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState(""); // Stub for layout

  return (
    <DashboardLayout
      title="My Profile"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: User Details --- */}
        <AnimatedSection delay="delay-100" className="lg:col-span-1">
          <Card className="bg-slate-900/60 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10 h-full">
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-green-500/50">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${
                    user?.name || "User"
                  }`}
                />
                <AvatarFallback className="text-3xl bg-slate-800">
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 pt-4">
                {user?.name || "Student User"}
              </CardTitle>
              <CardDescription className="text-slate-400">
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-400 font-bold"
                >
                  <Badge className="w-4 h-4 mr-1.5" />
                  Verified Student
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">
                  {user?.email || "student@cashngo.com"}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <User className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">
                  {user?.username || "student_user"}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <GraduationCap className="w-5 h-5 text-green-400" />
                <span className="text-slate-300 text-sm">
                  {user?.major || "Computer Science"}
                </span>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* --- Right Column: Earned Badges --- */}
        <AnimatedSection delay="delay-200" className="lg:col-span-2">
          <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-green-400" />
                My Skill Badges
              </CardTitle>
              <CardDescription className="text-slate-400">
                All skills you've verified through Skill-Synth quizzes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockBadges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border ${badge.borderColor} ${badge.bgColor} transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1`}
                    >
                      <badge.icon
                        className={`w-10 h-10 ${badge.color} mb-2`}
                        strokeWidth={1.5}
                      />
                      <span className="text-sm font-medium text-slate-200 text-center">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-700 rounded-lg">
                  <p className="text-slate-400">No badges earned yet.</p>
                  <p className="text-slate-500 text-sm">
                    Go to the Gigs page to unlock new skills!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
