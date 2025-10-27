import React, { useState } from "react"; // Added React import
import { useNavigate } from "react-router-dom";
import EmployerDashboardLayout from "@/components/layout/EmployerDashboardLayout"; // Use default export
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  DollarSign,
  PlusCircle,
  Clock, // Added for date
} from "lucide-react";
import useLocalStorage  from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

// --- Define Posted Gig Type (Should match PostGigPage) ---
interface PostedGig {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements: string;
  payoutAmount: number;
  payoutType: "fixed" | "hourly";
  status: "Open" | "Closed" | "In Progress";
  createdAt: number;
}

export default function EmployerDashboard() {
  // Dummy search state for Layout
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // --- Fetch Posted Gigs from localStorage ---
  const [postedGigs] = useLocalStorage<PostedGig[]>("cashngo_postedGigs", []);

  // --- Mock Stats ---
  const activeGigsCount = postedGigs.filter(
    (gig: { status: string; }) => gig.status === "Open"
  ).length;
  const totalApplicants = 15; // Mock data
  const totalSpent = 125000; // Mock data

  // Helper to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper to format payout
  const formatPayout = (gig: PostedGig) => {
    const amount = gig.payoutAmount.toLocaleString();
    return gig.payoutType === "hourly" ? `₦${amount}/hr` : `₦${amount}`;
  };

  return (
    <EmployerDashboardLayout
      title="Dashboard"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <AnimatedSection>
        <div className="space-y-8">
          {/* --- Top Stat Cards --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Active Gigs
                </CardTitle>
                <Briefcase className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {activeGigsCount}
                </div>
                <p className="text-xs text-slate-500">
                  Currently open for applications
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Total Applicants
                </CardTitle>
                <Users className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {totalApplicants}
                </div>
                <p className="text-xs text-slate-500">Across all active gigs</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-lg shadow-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Total Spent
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  ₦{totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500">On completed gigs</p>
              </CardContent>
            </Card>
          </div>

          {/* --- Post Gig Call-to-Action --- */}
          <Card className="bg-slate-900/60 border border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-cyan-500/10 overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-6 gap-6">
            <div className="z-10">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Need Help with a Task?
              </h3>
              <p className="text-slate-400 max-w-lg mt-2 text-sm md:text-base">
                Post a new gig and connect with talented students ready to work.
              </p>
            </div>
            <Button
              onClick={() => navigate("/post-gig")} // Navigate to the PostGigPage
              className="bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] z-10 w-full md:w-auto flex-shrink-0 text-sm md:text-base px-6 py-3" // Adjusted style
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Post a New Gig
            </Button>
            {/* Optional subtle background animation */}
            <div
              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-30 animate-pulse"
              style={{ animationDuration: "10s" }}
            />
          </Card>

          {/* --- Posted Gigs Table --- */}
          <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">
                  My Posted Gigs
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Manage your active and past job postings.
                </CardDescription>
              </div>
              {/* Optional: Add filtering or sorting controls here later */}
            </CardHeader>
            <CardContent>
              {postedGigs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Briefcase className="h-10 w-10 mx-auto mb-3 text-slate-600" />
                  You haven't posted any gigs yet.
                </div>
              ) : (
                <div className="border border-slate-800 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-800/50 hover:bg-slate-800/50 border-b-slate-700">
                        <TableHead className="text-slate-300">Title</TableHead>
                        <TableHead className="text-slate-300">
                          Category
                        </TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">
                          Posted On
                        </TableHead>
                        <TableHead className="text-slate-300 text-right">
                          Payout
                        </TableHead>
                        <TableHead className="text-slate-300 text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sort gigs by creation date, newest first */}
                      {postedGigs
                        .sort((a: { createdAt: number; }, b: { createdAt: number; }) => b.createdAt - a.createdAt)
                        .map((gig: PostedGig) => (
                          <TableRow
                            key={gig.id}
                            className="border-slate-800 hover:bg-slate-800/30"
                          >
                            <TableCell className="font-medium text-white max-w-xs truncate">
                              {gig.title}
                            </TableCell>
                            <TableCell className="text-slate-400">
                              {gig.category}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  gig.status === "Open"
                                    ? "default"
                                    : "secondary"
                                }
                                className={cn(
                                  gig.status === "Open"
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : gig.status === "In Progress"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                    : "bg-slate-700/50 text-slate-400 border-slate-600"
                                )}
                              >
                                {gig.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-400 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                {formatDate(gig.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-cyan-400">
                              {formatPayout(gig)}
                            </TableCell>
                            <TableCell className="text-center">
                              {/* Add action buttons later (e.g., View Applicants, Edit, Close) */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white h-8 px-2"
                              >
                                {/* Placeholder for future actions */}
                                ...
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            {postedGigs.length > 0 && (
              <CardFooter className="text-xs text-slate-500 pt-4">
                Showing {postedGigs.length} posted gig(s).
              </CardFooter>
            )}
          </Card>
        </div>
      </AnimatedSection>
    </EmployerDashboardLayout>
  );
}
