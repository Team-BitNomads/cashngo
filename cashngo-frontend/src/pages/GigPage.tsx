import React, { useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  DollarSign,
  Clock,
  MapPin,
  Star,
  Lock,
  Zap,
  Building,
  Calendar,
  BookOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  isFeatured: boolean;
  isLocked: boolean;
  rating: number;
  applications: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

const mockGigs: Gig[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechFlow Inc",
    logo: "TF",
    category: "Development",
    skill: "React.js",
    payout: 2500,
    payoutType: "fixed",
    location: "Remote",
    duration: "2 weeks",
    isFeatured: true,
    isLocked: false,
    rating: 4.8,
    applications: 12,
    description:
      "Join our dynamic team to build cutting-edge web applications using React and modern frontend technologies.",
    requirements: [
      "3+ years React experience",
      "TypeScript proficiency",
      "REST API integration",
    ],
    responsibilities: [
      "Develop new user-facing features",
      "Build reusable components",
      "Optimize applications for performance",
    ],
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "DesignStudio",
    logo: "DS",
    category: "Design",
    skill: "Figma",
    payout: 45,
    payoutType: "hourly",
    location: "Remote",
    duration: "1 month",
    isFeatured: true,
    isLocked: true,
    rating: 4.6,
    applications: 8,
    description:
      "Create beautiful and intuitive user interfaces for our client projects.",
    requirements: [
      "Figma expertise",
      "Design system experience",
      "User research skills",
    ],
    responsibilities: [
      "Design wireframes and prototypes",
      "Create design systems",
      "Collaborate with developers",
    ],
  },
  {
    id: "3",
    title: "Content Writer",
    company: "ContentPro",
    logo: "CP",
    category: "Writing",
    skill: "Copywriting",
    payout: 800,
    payoutType: "fixed",
    location: "Remote",
    duration: "2 weeks",
    isFeatured: true,
    isLocked: false,
    rating: 4.4,
    applications: 15,
    description:
      "Craft compelling content that engages audiences and drives results.",
    requirements: [
      "2+ years writing experience",
      "SEO knowledge",
      "Portfolio required",
    ],
    responsibilities: [
      "Write blog posts and articles",
      "Optimize content for SEO",
      "Edit and proofread content",
    ],
  },
  {
    id: "4",
    title: "Data Analyst",
    company: "DataInsights",
    logo: "DI",
    category: "Data",
    skill: "Python",
    payout: 35,
    payoutType: "hourly",
    location: "Hybrid",
    duration: "3 months",
    isFeatured: false,
    isLocked: false,
    rating: 4.7,
    applications: 6,
    description:
      "Analyze complex datasets to provide actionable insights for business decisions.",
    requirements: [
      "Python/R experience",
      "SQL proficiency",
      "Statistical analysis",
    ],
    responsibilities: [
      "Clean and process data",
      "Create dashboards and reports",
      "Identify trends and patterns",
    ],
  },
  {
    id: "5",
    title: "Mobile App Developer",
    company: "AppCraft",
    logo: "AC",
    category: "Development",
    skill: "React Native",
    payout: 1800,
    payoutType: "fixed",
    location: "Remote",
    duration: "1 month",
    isFeatured: false,
    isLocked: true,
    rating: 4.9,
    applications: 9,
    description: "Build cross-platform mobile applications using React Native.",
    requirements: [
      "React Native experience",
      "Mobile UI/UX understanding",
      "App store deployment",
    ],
    responsibilities: [
      "Develop mobile features",
      "Optimize app performance",
      "Fix bugs and issues",
    ],
  },
  {
    id: "6",
    title: "Social Media Manager",
    company: "BuzzMedia",
    logo: "BM",
    category: "Marketing",
    skill: "Social Media",
    payout: 600,
    payoutType: "fixed",
    location: "Remote",
    duration: "2 weeks",
    isFeatured: false,
    isLocked: false,
    rating: 4.3,
    applications: 11,
    description:
      "Manage social media presence and create engaging content across platforms.",
    requirements: [
      "Social media management",
      "Content creation",
      "Analytics tracking",
    ],
    responsibilities: [
      "Schedule posts",
      "Engage with audience",
      "Analyze performance metrics",
    ],
  },
  {
    id: "7",
    title: "Backend Developer",
    company: "ServerStack",
    logo: "SS",
    category: "Development",
    skill: "Node.js",
    payout: 50,
    payoutType: "hourly",
    location: "Remote",
    duration: "2 months",
    isFeatured: false,
    isLocked: false,
    rating: 4.8,
    applications: 7,
    description:
      "Develop robust backend systems and APIs for web applications.",
    requirements: ["Node.js expertise", "Database design", "API development"],
    responsibilities: [
      "Build RESTful APIs",
      "Optimize database queries",
      "Implement authentication",
    ],
  },
  {
    id: "8",
    title: "Graphic Designer",
    company: "VisualArts",
    logo: "VA",
    category: "Design",
    skill: "Illustrator",
    payout: 1200,
    payoutType: "fixed",
    location: "On-site",
    duration: "3 weeks",
    isFeatured: false,
    isLocked: true,
    rating: 4.5,
    applications: 10,
    description:
      "Create stunning visual designs for branding and marketing materials.",
    requirements: [
      "Adobe Creative Suite",
      "Branding experience",
      "Portfolio required",
    ],
    responsibilities: [
      "Design logos and branding",
      "Create marketing materials",
      "Collaborate with clients",
    ],
  },
];

const categories = [
  "All",
  "Development",
  "Design",
  "Writing",
  "Data",
  "Marketing",
];
const payoutRanges = ["Any", "$0-$25", "$25-$100", "$100+"];

// Modal Components
const GigDetailModal: React.FC<{
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
  onApply: (gigId: string) => void;
  onTakeQuiz: (gigId: string) => void;
}> = ({ gig, isOpen, onClose, onApply, onTakeQuiz }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">{gig.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
              {gig.logo}
            </div>
            <div>
              <h3 className="font-semibold text-white">{gig.company}</h3>
              <div className="flex items-center gap-2 text-slate-400">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{gig.rating}</span>
                <span>•</span>
                <span>{gig.applications} applicants</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <DollarSign className="h-4 w-4" />
              <span>
                {gig.payoutType === "hourly"
                  ? `$${gig.payout}/hr`
                  : `$${gig.payout}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="h-4 w-4" />
              <span>{gig.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span>{gig.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Building className="h-4 w-4" />
              <span>{gig.category}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Description</h4>
            <p className="text-slate-400">{gig.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Requirements</h4>
            <ul className="text-slate-400 space-y-1">
              {gig.requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Responsibilities</h4>
            <ul className="text-slate-400 space-y-1">
              {gig.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          {gig.isLocked ? (
            <Button
              onClick={() => onTakeQuiz(gig.id)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Take Skill Quiz to Unlock
            </Button>
          ) : (
            <Button
              onClick={() => onApply(gig.id)}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const QuizModal: React.FC<{
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (gigId: string) => void;
}> = ({ gig, isOpen, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      question: "What is JSX in React?",
      options: [
        "A JavaScript syntax extension",
        "A CSS framework",
        "A database query language",
        "A testing library",
      ],
      correct: 0,
    },
    {
      question: "Which hook is used for side effects?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 1,
    },
    {
      question: "How do you pass data to a child component?",
      options: ["Using state", "Using props", "Using context", "Using refs"],
      correct: 1,
    },
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex.toString()];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      setTimeout(() => {
        onComplete(gig.id);
        onClose();
        setCurrentQuestion(0);
        setAnswers([]);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Skill Assessment</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-emerald-400">{gig.skill} Quiz</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-4">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 text-left border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                onClick={() => handleAnswer(index)}
              >
                <span className="text-slate-300">{option}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationModal: React.FC<{
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (gigId: string) => void;
}> = ({ gig, isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSuccess(gig.id);
      onClose();
      setIsSubmitting(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Apply for Gig</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
              {gig.logo}
            </div>
            <div>
              <h3 className="font-semibold text-white">{gig.title}</h3>
              <p className="text-slate-400">{gig.company}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Cover Letter
              </label>
              <textarea
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                rows={4}
                placeholder="Why are you interested in this gig?"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Portfolio Link (Optional)
              </label>
              <Input
                type="url"
                placeholder="https://"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
          >
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  type: "application" | "quiz";
  gigTitle: string;
}> = ({ isOpen, onClose, type, gigTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-md w-full text-center p-6">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <Star className="h-5 w-5 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {type === "application"
            ? "Application Submitted!"
            : "Quiz Completed!"}
        </h2>

        <p className="text-slate-400 mb-6">
          {type === "application"
            ? `Your application for "${gigTitle}" has been submitted successfully.`
            : `Congratulations! You've unlocked "${gigTitle}". You can now apply for this gig.`}
        </p>

        <Button
          onClick={onClose}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
        >
          Continue Browsing
        </Button>
      </div>
    </div>
  );
};

const GigPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPayoutRange, setSelectedPayoutRange] = useState("Any");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalType, setSuccessModalType] = useState<
    "application" | "quiz"
  >("application");

  const itemsPerPage = 6;

  const featuredGigs = mockGigs.filter((gig) => gig.isFeatured);
  const allGigs = mockGigs.filter((gig) => !gig.isFeatured);

  const filteredGigs = allGigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.skill.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || gig.category === selectedCategory;

    const matchesPayout =
      selectedPayoutRange === "Any" ||
      (selectedPayoutRange === "$0-$25" && gig.payout <= 25) ||
      (selectedPayoutRange === "$25-$100" &&
        gig.payout > 25 &&
        gig.payout <= 100) ||
      (selectedPayoutRange === "$100+" && gig.payout > 100);

    return matchesSearch && matchesCategory && matchesPayout;
  });

  const totalPages = Math.ceil(filteredGigs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGigs = filteredGigs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Modal handlers
  const handleViewDetails = (gig: Gig) => {
    setSelectedGig(gig);
    setIsDetailModalOpen(true);
  };

  const handleApply = (gigId: string) => {
    const gig = mockGigs.find((g) => g.id === gigId);
    if (gig) {
      setSelectedGig(gig);
      setIsApplicationModalOpen(true);
    }
  };

  const handleTakeQuiz = (gigId: string) => {
    const gig = mockGigs.find((g) => g.id === gigId);
    if (gig) {
      setSelectedGig(gig);
      setIsQuizModalOpen(true);
    }
  };

  const handleQuizComplete = () => {
    // In a real app, you'd update the gig's locked status via API
    setSuccessModalType("quiz");
    setIsSuccessModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    setSuccessModalType("application");
    setIsSuccessModalOpen(true);
  };

  return (
    <DashboardLayout
      title="Find Gigs"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div className="space-y-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="focus:bg-slate-800"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select
              value={selectedPayoutRange}
              onValueChange={setSelectedPayoutRange}
            >
              <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                <SelectValue placeholder="Payout Range" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                {payoutRanges.map((range) => (
                  <SelectItem
                    key={range}
                    value={range}
                    className="focus:bg-slate-800"
                  >
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Gigs Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="h-6 w-6 text-emerald-400" />
            Featured Gigs
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredGigs.map((gig) => (
              <Card
                key={gig.id}
                className="bg-slate-900/80 border-slate-800 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 group glow-on-hover"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                        {gig.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {gig.company}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{gig.rating}</span>
                          <span className="text-xs">
                            • {gig.applications} applicants
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={gig.isLocked ? "secondary" : "default"}
                      className={cn(
                        gig.isLocked
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      )}
                    >
                      {gig.isLocked ? <Lock className="h-3 w-3 mr-1" /> : null}
                      {gig.isLocked ? "Quiz Required" : "Available"}
                    </Badge>
                  </div>

                  <h4 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {gig.title}
                  </h4>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="bg-slate-800/50 border-slate-700 text-slate-300"
                    >
                      {gig.skill}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-slate-800/50 border-slate-700 text-slate-300"
                    >
                      {gig.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {gig.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {gig.duration}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {gig.payoutType === "hourly"
                          ? `$${gig.payout}/hr`
                          : `$${gig.payout}`}
                      </div>
                      <div className="text-xs text-slate-400">
                        {gig.payoutType === "hourly"
                          ? "Estimated payout"
                          : "Fixed price"}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => handleViewDetails(gig)}
                  >
                    View Details
                  </Button>
                  <Button
                    className={cn(
                      "flex-1 transition-all duration-300 transform group-hover:scale-105",
                      gig.isLocked
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                    )}
                    onClick={() =>
                      gig.isLocked
                        ? handleTakeQuiz(gig.id)
                        : handleApply(gig.id)
                    }
                  >
                    {gig.isLocked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Take Quiz
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* All Gigs Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">All Gigs</h2>

          {paginatedGigs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                No gigs found matching your criteria
              </div>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedPayoutRange("Any");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedGigs.map((gig) => (
                <Card
                  key={gig.id}
                  className="bg-slate-900/60 border-slate-800 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 group glow-on-hover"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                          {gig.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">
                            {gig.company}
                          </h3>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{gig.rating}</span>
                          </div>
                        </div>
                      </div>
                      {gig.isLocked && (
                        <Lock className="h-4 w-4 text-amber-400" />
                      )}
                    </div>

                    <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-base">
                      {gig.title}
                    </h4>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge
                        variant="outline"
                        className="bg-slate-800/30 border-slate-700 text-slate-300 text-xs"
                      >
                        {gig.skill}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {gig.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {gig.duration}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-cyan-400">
                        {gig.payoutType === "hourly"
                          ? `$${gig.payout}/hr`
                          : `$${gig.payout}`}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
                      onClick={() => handleViewDetails(gig)}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      className={cn(
                        "flex-1 text-xs transition-all duration-300",
                        gig.isLocked
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                          : "bg-cyan-600 hover:bg-cyan-700 text-white"
                      )}
                      onClick={() =>
                        gig.isLocked
                          ? handleTakeQuiz(gig.id)
                          : handleApply(gig.id)
                      }
                    >
                      {gig.isLocked ? "Take Quiz" : "Apply"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {paginatedGigs.length > 0 && totalPages > 1 && (
          <section>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className={
                          currentPage === page
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : ""
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        )}
      </div>

      {/* Modals */}
      {selectedGig && (
        <>
          <GigDetailModal
            gig={selectedGig}
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            onApply={handleApply}
            onTakeQuiz={handleTakeQuiz}
          />

          <QuizModal
            gig={selectedGig}
            isOpen={isQuizModalOpen}
            onClose={() => setIsQuizModalOpen(false)}
            onComplete={handleQuizComplete}
          />

          <ApplicationModal
            gig={selectedGig}
            isOpen={isApplicationModalOpen}
            onClose={() => setIsApplicationModalOpen(false)}
            onSuccess={handleApplicationSuccess}
          />

          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            type={successModalType}
            gigTitle={selectedGig.title}
          />
        </>
      )}

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .glow-on-hover {
          position: relative;
          overflow: hidden;
        }

        .glow-on-hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(16, 185, 129, 0.1),
            rgba(6, 182, 212, 0.1),
            transparent
          );
          transition: left 0.5s;
        }

        .glow-on-hover:hover::before {
          left: 100%;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default GigPage;
