/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
// Removed unused imports: useNavigate, Link
import EmployerDashboardLayout from "@/components/layout/EmployerDashboardLayout";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// --- Added Dialog imports ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Users,
  FileText,
  Check,
  X,
  Clock,
  Link as LinkIcon,
} from "lucide-react"; // Added LinkIcon
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

// --- Types (Should align with types used elsewhere) ---
interface PostedGig {
  id: string;
  title: string;
  // ... other gig fields if needed ...
}

interface Application {
  id: string;
  gigId: string;
  gigTitle: string;
  company: string;
  applicantName: string;
  applicantId: string;
  coverLetter: string;
  portfolioLink?: string;
  timestamp: number;
  status: "pending" | "accepted" | "rejected";
}

// --- Mock Applicant Names ---
const mockApplicantNames = [
  "Aisha Bello",
  "Emeka Okafor",
  "Fatima Ibrahim",
  "David Okoye",
  "Chiamaka Nwosu",
  "Tunde Balogun",
];
const getRandomApplicantName = () =>
  mockApplicantNames[Math.floor(Math.random() * mockApplicantNames.length)];

// --- Applicant Detail Modal Component ---
const ApplicantDetailModal: React.FC<{
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ application, isOpen, onClose }) => {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-700 text-white custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${application.applicantId}`}
              />
              <AvatarFallback>
                {application.applicantName?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            {application.applicantName}'s Application
          </DialogTitle>
          <DialogDescription className="text-slate-400 pt-1">
            For Gig:{" "}
            <span className="font-medium text-cyan-400">
              {application.gigTitle}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
          {/* Cover Letter */}
          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" /> Cover Letter
            </h4>
            <p className="text-slate-300 text-sm bg-slate-800/50 rounded-lg p-3 border border-slate-700 whitespace-pre-wrap">
              {application.coverLetter || (
                <i className="text-slate-500">No cover letter provided.</i>
              )}
            </p>
          </div>

          {/* Portfolio Link */}
          {application.portfolioLink && (
            <div>
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-cyan-400" /> Portfolio Link
              </h4>
              <a
                href={application.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm underline break-all"
              >
                {application.portfolioLink}
              </a>
            </div>
          )}

          {/* Application Info */}
          <div className="text-xs text-slate-500 pt-3 border-t border-slate-800">
            Applied on:{" "}
            {new Date(application.timestamp).toLocaleString("en-NG", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        </div>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Close
            </Button>
          </DialogClose>
          {/* Optionally add Accept/Reject buttons here too */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function ApplicantsPage() {
  // Dummy search state for Layout (can be adapted later)
  const [searchTerm, setSearchTerm] = useState("");
  // Removed unused navigate

  // --- Fetch Data from localStorage ---
  const [postedGigs] = useLocalStorage<PostedGig[]>("cashngo_postedGigs", []);
  // --- Use setter for applications to update status ---
  const [allApplications, setAllApplications] = useLocalStorage<Application[]>(
    "cashngo_applications",
    []
  );

  // --- Filter applications relevant to this employer's gigs ---
  const employerGigIds = useMemo(
    () => new Set(postedGigs.map((gig: { id: any; }) => gig.id)),
    [postedGigs]
  );

  const relevantApplications = useMemo(() => {
    return (
      allApplications
        .filter((app: Application) => employerGigIds.has(app.gigId))
        // Add mock applicant names if they don't exist in stored data
        .map((app: Application) => ({
          ...app,
          applicantName: app.applicantName || getRandomApplicantName(),
          applicantId:
            app.applicantId ||
            `user_${Math.random().toString(36).substring(2, 9)}`,
        }))
        .sort((a: Application, b: Application) => b.timestamp - a.timestamp)
    ); // Sort newest first
  }, [allApplications, employerGigIds]);

  // Helper to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // --- State for Applicant Detail Modal ---
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const openDetailModal = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    // Optional: Delay clearing selection for smoother animation
    // setTimeout(() => setSelectedApplication(null), 300);
    setSelectedApplication(null);
  };

  // --- Handlers for Accept/Reject ---
  const updateApplicationStatus = (
    applicationId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    const updatedApplications = allApplications.map((app: Application) => {
      if (app.id === applicationId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setAllApplications(updatedApplications); // Save updated list to localStorage
    console.log(`Application ${applicationId} status updated to ${newStatus}`);
  };

  return (
    <EmployerDashboardLayout
      title="Applicants"
      searchTerm={searchTerm} // Can be used to filter applicants later
      setSearchTerm={setSearchTerm}
    >
      <AnimatedSection>
        <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              Review Applications
            </CardTitle>
            <CardDescription className="text-slate-500">
              View and manage students who have applied to your posted gigs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {relevantApplications.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="h-10 w-10 mx-auto mb-3 text-slate-600" />
                No applications received yet for your open gigs.
              </div>
            ) : (
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-800/50 hover:bg-slate-800/50 border-b-slate-700">
                      <TableHead className="text-slate-300">
                        Applicant
                      </TableHead>
                      <TableHead className="text-slate-300">
                        Gig Title
                      </TableHead>
                      <TableHead className="text-slate-300">
                        Applied On
                      </TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300 text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relevantApplications.map((app: Application) => (
                      <TableRow
                        key={app.id}
                        className="border-slate-800 hover:bg-slate-800/30"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${app.applicantId}`}
                              />
                              <AvatarFallback>
                                {app.applicantName?.[0] || "A"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-white truncate">
                              {app.applicantName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 max-w-[200px] truncate">
                          {app.gigTitle}
                        </TableCell>{" "}
                        {/* Adjusted max-width */}
                        <TableCell className="text-slate-400 text-xs">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            {" "}
                            {/* Added whitespace-nowrap */}
                            <Clock className="h-3 w-3" />
                            {formatDate(app.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              app.status === "accepted"
                                ? "default"
                                : app.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                            className={cn(
                              "text-xs px-2 py-0.5", // Explicit size
                              app.status === "accepted"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : app.status === "rejected"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/30" // Pending
                            )}
                          >
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center space-x-1">
                          {/* --- Updated View Details Button --- */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                            onClick={() => openDetailModal(app)} // Open modal
                            title="View Details"
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          {/* --- Updated Accept Button --- */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              updateApplicationStatus(app.id, "accepted")
                            }
                            disabled={app.status === "accepted"} // Disable if already accepted
                            title="Accept"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          {/* --- Updated Reject Button --- */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              updateApplicationStatus(app.id, "rejected")
                            }
                            disabled={app.status === "rejected"} // Disable if already rejected
                            title="Reject"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* --- Render Applicant Detail Modal --- */}
      <ApplicantDetailModal
        application={selectedApplication}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
    </EmployerDashboardLayout>
  );
}
