/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Clock,
  MapPin,
  Star,
  Lock,
  Zap,
  Building,
  BookOpen,
  X,
  Check,
  AlertCircle,
  Briefcase,
  Send,
  FileText,
} from "lucide-react";

// Our existing hooks and layout
import useLocalStorage  from "@/hooks/useLocalStorage";
import { DashboardLayout } from "@/components/layout/DashboardLayout"; // Corrected layout import
import { Textarea } from "@/components/ui/textarea"; // Import Textarea for the form
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Types
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

interface Application {
  id: string;
  gigId: string;
  gigTitle: string;
  company: string;
  coverLetter: string;
  portfolioLink: string;
  timestamp: number;
  status: "pending" | "accepted" | "rejected";
}

interface QuizResult {
  gigId: string;
  completedAt: number;
  score: number;
}

// Mock Data (Expanded to 30 Gigs)
const mockGigs: Gig[] = [
  // Original 6
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
  // New Gigs (7-30)
  {
    id: "7",
    title: "Junior Frontend Developer",
    company: "WebWeavers",
    logo: "WW",
    category: "Development",
    skill: "React.js",
    payout: 25,
    payoutType: "hourly",
    location: "Remote",
    duration: "3 months",
    isFeatured: false,
    isLocked: false,
    rating: 4.2,
    applications: 25,
    description: "Assist senior developers in building and maintaining React components.",
    requirements: [
      "HTML, CSS, JavaScript",
      "Basic React knowledge",
      "Git experience",
    ],
    responsibilities: [
      "Convert Figma designs to pixel-perfect HTML/CSS",
      "Write and test simple React components",
      "Fix UI bugs",
    ],
  },
  {
    id: "8",
    title: "SEO Content Specialist",
    company: "RankUp",
    logo: "RU",
    category: "Writing",
    skill: "SEO",
    payout: 1200,
    payoutType: "fixed",
    location: "Hybrid",
    duration: "1 month",
    isFeatured: false,
    isLocked: true,
    rating: 4.5,
    applications: 7,
    description: "Develop and execute SEO-driven content strategies to boost organic traffic.",
    requirements: [
      "Proven SEO experience",
      "Keyword research skills (Ahrefs, SEMrush)",
      "Excellent writing skills",
    ],
    responsibilities: [
      "Conduct keyword research",
      "Write long-form blog posts",
      "Track content performance",
    ],
  },
  {
    id: "9",
    title: "Brand Identity Designer",
    company: "DesignStudio",
    logo: "DS",
    category: "Design",
    skill: "Illustrator",
    payout: 2200,
    payoutType: "fixed",
    location: "Remote",
    duration: "3 weeks",
    isFeatured: true,
    isLocked: true,
    rating: 4.9,
    applications: 5,
    description: "Create a complete brand identity for a new tech startup.",
    requirements: [
      "Strong portfolio in branding",
      "Adobe Illustrator & Photoshop",
      "Logo design expertise",
    ],
    responsibilities: [
      "Design logo and variations",
      "Create brand guidelines (colors, typography)",
      "Design social media kit",
    ],
  },
  {
    id: "10",
    title: "Python Backend Engineer",
    company: "ServerStack",
    logo: "SS",
    category: "Development",
    skill: "Python",
    payout: 60,
    payoutType: "hourly",
    location: "Remote",
    duration: "2 months",
    isFeatured: false,
    isLocked: true,
    rating: 4.7,
    applications: 10,
    description: "Build scalable REST APIs using Django Rest Framework.",
    requirements: [
      "3+ years Python experience",
      "Django or Flask",
      "PostgreSQL",
    ],
    responsibilities: [
      "Design and implement RESTful APIs",
      "Write unit tests",
      "Optimize database queries",
    ],
  },
  {
    id: "11",
    title: "TikTok Content Creator",
    company: "BuzzMedia",
    logo: "BM",
    category: "Marketing",
    skill: "Social Media",
    payout: 750,
    payoutType: "fixed",
    location: "Remote",
    duration: "1 week",
    isFeatured: true,
    isLocked: false,
    rating: 4.6,
    applications: 30,
    description: "Create 5 engaging TikTok videos for our new product launch.",
    requirements: [
      "Proven experience with TikTok trends",
      "Video editing skills (CapCut, etc.)",
      "On-camera confidence",
    ],
    responsibilities: [
      "Brainstorm video concepts",
      "Film and edit 5 videos",
      "Incorporate brand messaging",
    ],
  },
  {
    id: "12",
    title: "SQL Database Administrator",
    company: "DataInsights",
    logo: "DI",
    category: "Data",
    skill: "SQL",
    payout: 40,
    payoutType: "hourly",
    location: "On-site",
    duration: "1 month",
    isFeatured: false,
    isLocked: true,
    rating: 4.4,
    applications: 4,
    description: "Maintain and optimize our client-facing production databases.",
    requirements: [
      "Deep SQL knowledge (MySQL, PostgreSQL)",
      "Database performance tuning",
      "Backup and recovery",
    ],
    responsibilities: [
      "Monitor database performance",
      "Write complex queries and stored procedures",
      "Ensure data integrity",
    ],
  },
  {
    id: "13",
    title: "Technical Writer (API Docs)",
    company: "TechFlow Inc",
    logo: "TF",
    category: "Writing",
    skill: "Technical Writing",
    payout: 1500,
    payoutType: "fixed",
    location: "Remote",
    duration: "3 weeks",
    isFeatured: false,
    isLocked: false,
    rating: 4.8,
    applications: 8,
    description: "Create clear and concise documentation for our public API.",
    requirements: [
      "Experience writing developer documentation",
      "Ability to read and understand code (JS, Python)",
      "Markdown proficiency",
    ],
    responsibilities: [
      "Document all API endpoints",
      "Write 'Getting Started' guides",
      "Maintain documentation accuracy",
    ],
  },
  {
    id: "14",
    title: "Canva Graphic Designer",
    company: "ContentPro",
    logo: "CP",
    category: "Design",
    skill: "Canva",
    payout: 300,
    payoutType: "fixed",
    location: "Remote",
    duration: "1 week",
    isFeatured: false,
    isLocked: false,
    rating: 4.1,
    applications: 40,
    description: "Design 20 social media graphics using our Canva brand templates.",
    requirements: [
      "Proficient in Canva",
      "Good eye for design and layout",
      "Ability to follow brand guidelines",
    ],
    responsibilities: [
      "Create 20 graphics for Instagram and Facebook",
      "Resize graphics for different platforms",
      "Deliver high-quality PNGs",
    ],
  },
  {
    id: "15",
    title: "Flutter Developer",
    company: "AppCraft",
    logo: "AC",
    category: "Development",
    skill: "Flutter",
    payout: 50,
    payoutType: "hourly",
    location: "Remote",
    duration: "6 weeks",
    isFeatured: false,
    isLocked: true,
    rating: 4.7,
    applications: 6,
    description: "Develop a new cross-platform mobile app for a health tech client.",
    requirements: [
      "2+ years Flutter and Dart experience",
      "Firebase integration",
      "State management (Riverpod, Bloc)",
    ],
    responsibilities: [
      "Build UI from Figma designs",
      "Connect to Firebase backend",
      "Write integration tests",
    ],
  },
  {
    id: "16",
    title: "Email Marketing Specialist",
    company: "BuzzMedia",
    logo: "BM",
    category: "Marketing",
    skill: "Email Marketing",
    payout: 900,
    payoutType: "fixed",
    location: "Remote",
    duration: "2 weeks",
    isFeatured: false,
    isLocked: false,
    rating: 4.3,
    applications: 14,
    description: "Design and run a 3-part email nurture sequence in Mailchimp.",
    requirements: [
      "Mailchimp or similar platform",
      "Email copywriting skills",
      "Understanding of customer segmentation",
    ],
    responsibilities: [
      "Design email templates",
      "Write email copy",
      "Set up automation and analyze results",
    ],
  },
  {
    id: "17",
    title: "WordPress Developer",
    company: "WebWeavers",
    logo: "WW",
    category: "Development",
    skill: "WordPress",
    payout: 1300,
    payoutType: "fixed",
    location: "Remote",
    duration: "10 days",
    isFeatured: false,
    isLocked: false,
    rating: 4.0,
    applications: 18,
    description: "Build a 5-page custom WordPress theme for a small business.",
    requirements: [
      "PHP and WordPress theme development",
      "Advanced Custom Fields (ACF)",
      "Basic JavaScript",
    ],
    responsibilities: [
      "Develop custom theme from scratch",
      "Integrate ACF for editable content",
      "Ensure mobile responsiveness",
    ],
  },
  {
    id: "18",
    title: "Excel Data Cleaning",
    company: "DataInsights",
    logo: "DI",
    category: "Data",
    skill: "Excel",
    payout: 400,
    payoutType: "fixed",
    location: "Remote",
    duration: "3 days",
    isFeatured: false,
    isLocked: false,
    rating: 4.1,
    applications: 55,
    description: "Clean and format a large Excel spreadsheet (10k rows).",
    requirements: [
      "Expert in Excel (VLOOKUP, Pivot Tables)",
      "Attention to detail",
      "Data entry accuracy",
    ],
    responsibilities: [
      "Remove duplicates",
      "Correct formatting errors",
      "Validate data integrity",
    ],
  },
  {
    id: "19",
    title: "Next.js Developer",
    company: "TechFlow Inc",
    logo: "TF",
    category: "Development",
    skill: "Next.js",
    payout: 65,
    payoutType: "hourly",
    location: "Remote",
    duration: "1 month",
    isFeatured: true,
    isLocked: true,
    rating: 4.9,
    applications: 11,
    description: "Refactor our marketing site from CRA to Next.js for SSR and SEO.",
    requirements: [
      "Expert in React and Next.js",
      "Understanding of SSR, SSG, ISR",
      "Vercel deployment",
    ],
    responsibilities: [
      "Migrate React components to Next.js",
      "Implement `getStaticProps` / `getServerSideProps`",
      "Improve Lighthouse scores",
    ],
  },
  {
    id: "20",
    title: "Video Editor (YouTube)",
    company: "ContentPro",
    logo: "CP",
    category: "Design",
    skill: "Video Editing",
    payout: 1000,
    payoutType: "fixed",
    location: "Remote",
    duration: "1 week",
    isFeatured: false,
    isLocked: true,
    rating: 4.6,
    applications: 9,
    description: "Edit 3 'talking head' style YouTube videos (10-15 mins each).",
    requirements: [
      "Proficient in Adobe Premiere Pro or DaVinci Resolve",
      "Fast-paced editing style (cuts, motion graphics)",
      "Good sense of timing and pacing",
    ],
    responsibilities: [
      "Edit raw footage",
      "Add B-roll and motion graphics",
      "Color grade and mix audio",
    ],
  },
  {
    id: "21",
    title: "Community Manager (Discord)",
    company: "BuzzMedia",
    logo: "BM",
    category: "Marketing",
    skill: "Community Management",
    payout: 30,
    payoutType: "hourly",
    location: "Remote",
    duration: "Ongoing",
    isFeatured: true,
    isLocked: false,
    rating: 4.7,
    applications: 22,
    description: "Manage and grow our developer community on Discord.",
    requirements: [
      "Experience managing a Discord server",
      "Excellent communication skills",
      "Passion for tech",
    ],
    responsibilities: [
      "Engage with members",
      "Organize online events",
      "Enforce server rules",
    ],
  },
  {
    id: "22",
    title: "3D Modeler (Blender)",
    company: "DesignStudio",
    logo: "DS",
    category: "Design",
    skill: "Blender",
    payout: 1600,
    payoutType: "fixed",
    location: "Remote",
    duration: "2 weeks",
    isFeatured: false,
    isLocked: true,
    rating: 4.8,
    applications: 3,
    description: "Create 5 low-poly 3D models of furniture for an AR app.",
    requirements: [
      "Expert in Blender",
      "Low-poly modeling",
      "UV unwrapping and texturing",
    ],
    responsibilities: [
      "Model 5 assets",
      "Optimize models for real-time performance",
      "Deliver in .glb format",
    ],
  },
  {
    id: "23",
    title: "QA Tester (Mobile)",
    company: "AppCraft",
    logo: "AC",
    category: "Data",
    skill: "QA Testing",
    payout: 20,
    payoutType: "hourly",
    location: "Remote",
    duration: "1 week",
    isFeatured: false,
    isLocked: false,
    rating: 4.0,
    applications: 35,
    description: "Perform manual testing on our new iOS and Android app build.",
    requirements: [
      "Meticulous attention to detail",
      "Experience with bug tracking software (Jira)",
      "Owns both an iOS and Android device",
    ],
    responsibilities: [
      "Execute test cases",
      "Find and report bugs",
      "Verify bug fixes",
    ],
  },
  {
    id: "24",
    title: "Node.js Developer",
    company: "ServerStack",
    logo: "SS",
    category: "Development",
    skill: "Node.js",
    payout: 55,
    payoutType: "hourly",
    location: "Remote",
    duration: "1 month",
    isFeatured: false,
    isLocked: true,
    rating: 4.6,
    applications: 8,
    description: "Build a microservice for handling user authentication.",
    requirements: [
      "Strong Node.js experience",
      "Express.js or Nest.js",
      "JWT and password hashing",
    ],
    responsibilities: [
      "Develop authentication API",
      "Integrate with PostgreSQL",
      "Write secure and efficient code",
    ],
  },
  {
    id: "25",
    title: "UX Researcher",
    company: "DesignStudio",
    logo: "DS",
    category: "Design",
    skill: "UX Research",
    payout: 40,
    payoutType: "hourly",
    location: "Remote",
    duration: "3 weeks",
    isFeatured: false,
    isLocked: true,
    rating: 4.7,
    applications: 5,
    description: "Conduct user interviews and usability testing for a new feature.",
    requirements: [
      "Experience with user interview moderation",
      "Usability testing",
      "Synthesizing research into reports",
    ],
    responsibilities: [
      "Recruit 5-8 users",
      "Conduct moderated usability tests",
      "Deliver an actionable insights report",
    ],
  },
  {
    id: "26",
    title: "Copywriter (Ad Copy)",
    company: "BuzzMedia",
    logo: "BM",
    category: "Writing",
    skill: "Copywriting",
    payout: 500,
    payoutType: "fixed",
    location: "Remote",
    duration: "3 days",
    isFeatured: false,
    isLocked: false,
    rating: 4.2,
    applications: 28,
    description: "Write 10 variations of Facebook Ad copy and headlines.",
    requirements: [
      "Proven direct-response copywriting",
      "Understanding of A/B testing",
      "Ability to write punchy, persuasive copy",
    ],
    responsibilities: [
      "Write 10 ad variations",
      "Focus on different user pain points",
      "Collaborate with the design team",
    ],
  },
  {
    id: "27",
    title: "Vue.js Developer",
    company: "WebWeavers",
    logo: "WW",
    category: "Development",
    skill: "Vue.js",
    payout: 45,
    payoutType: "hourly",
    location: "Remote",
    duration: "1 month",
    isFeatured: false,
    isLocked: true,
    rating: 4.5,
    applications: 7,
    description: "Help maintain and add features to a large Vue.js application.",
    requirements: [
      "2+ years Vue.js experience",
      "Vuex/Pinia",
      "TypeScript",
    ],
    responsibilities: [
      "Fix bugs in the existing codebase",
      "Develop new components",
      "Write unit tests for components",
    ],
  },
  {
    id: "28",
    title: "Power BI Dashboard",
    company: "DataInsights",
    logo: "DI",
    category: "Data",
    skill: "Power BI",
    payout: 700,
    payoutType: "fixed",
    location: "Remote",
    duration: "1 week",
    isFeatured: false,
    isLocked: true,
    rating: 4.6,
    applications: 4,
    description: "Create an interactive sales dashboard in Power BI.",
    requirements: [
      "Expert in Power BI and DAX",
      "Data modeling",
      "Strong visualization skills",
    ],
    responsibilities: [
      "Connect to data sources",
      "Build data model",
      "Design interactive dashboard",
    ],
  },
  {
    id: "29",
    title: "Photoshop Retoucher",
    company: "ContentPro",
    logo: "CP",
    category: "Design",
    skill: "Photoshop",
    payout: 200,
    payoutType: "fixed",
    location: "Remote",
    duration: "2 days",
    isFeatured: false,
    isLocked: false,
    rating: 4.3,
    applications: 20,
    description: "Retouch 15 product photos for an e-commerce store.",
    requirements: [
      "Advanced Photoshop skills",
      "Color correction",
      "Masking and compositing",
    ],
    responsibilities: [
      "Remove blemishes",
      "Correct colors",
      "Deliver high-res JPGs",
    ],
  },
  {
    id: "30",
    title: "Google Ads Specialist",
    company: "RankUp",
    logo: "RU",
    category: "Marketing",
    skill: "Google Ads",
    payout: 35,
    payoutType: "hourly",
    location: "Remote",
    duration: "Ongoing",
    isFeatured: false,
    isLocked: true,
    rating: 4.7,
    applications: 9,
    description: "Manage and optimize Google Ads campaigns for B2B clients.",
    requirements: [
      "Google Ads certification",
      "Experience with keyword research",
      "Budget management",
    ],
    responsibilities: [
      "Optimize campaigns",
      "A/B test ad copy",
      "Provide monthly reports",
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
const payoutRanges = ["Any", "₦0-₦20,000", "₦20,000-₦50,000", "₦50,000+"];

// Quiz questions by skill
const quizQuestions: Record<string, any[]> = {
  Figma: [
    {
      question: "What is Figma primarily used for?",
      options: ["UI/UX Design", "Video Editing", "3D Modeling", "Data Analysis"],
      correct: 0,
    },
    {
      question: "Which feature allows real-time collaboration?",
      options: ["Multiplayer mode", "Auto Layout", "Components", "Plugins"],
      correct: 0,
    },
    {
      question: "What are Components in Figma?",
      options: ["Reusable design elements", "Color palettes", "Fonts", "Images"],
      correct: 0,
    },
  ],
  "React Native": [
    {
      question: "React Native uses which language?",
      options: ["JavaScript", "Swift", "Kotlin", "C++"],
      correct: 0,
    },
    {
      question: "What does React Native compile to?",
      options: ["Native mobile code", "WebView", "HTML5", "Flutter"],
      correct: 0,
    },
    {
      question: "Which component renders scrollable content?",
      options: ["ScrollView", "ListView", "FlatView", "ContentView"],
      correct: 0,
    },
  ],
  default: [
    {
      question: "This skill requires practical knowledge. Ready to learn?",
      options: [
        "Yes, I'm ready",
        "Show me resources",
        "I'll come back",
        "Tell me more",
      ],
      correct: 0,
    },
    {
      question: "What's most important in this role?",
      options: ["Attention to detail", "Speed", "Creativity", "Communication"],
      correct: 0,
    },
    {
      question: "How do you handle tight deadlines?",
      options: ["Prioritize and plan", "Work faster", "Ask for help", "Take breaks"],
      correct: 0,
    },
  ],
};

// Main Component
export default function GigPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPayoutRange, setSelectedPayoutRange] = useState("Any");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"browse" | "applications">("browse");

  // Data states using our useLocalStorage hook
  const [unlockedGigIds, setUnlockedGigIds] = useLocalStorage<string[]>(
    "cashngo_unlocked_gigs",
    []
  );
  const [applications, setApplications] = useLocalStorage<Application[]>(
    "cashngo_applications",
    []
  );
  const [quizResults, setQuizResults] = useLocalStorage<QuizResult[]>(
    "cashngo_quiz_results",
    []
  );

  // Modal states
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [modalType, setModalType] = useState<
    "detail" | "quiz" | "apply" | "success" | null
  >(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);

  // Form states
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Process gigs based on unlocked status
  const processedGigs = mockGigs.map((gig) => ({
    ...gig,
    isLocked: gig.isLocked && !unlockedGigIds.includes(gig.id),
  }));

  const featuredGigs = processedGigs.filter((gig) => gig.isFeatured);

  const filteredGigs = processedGigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || gig.category === selectedCategory;
    const matchesPayout =
      selectedPayoutRange === "Any" ||
      (selectedPayoutRange === "₦0-₦20,000" && gig.payout <= 20000) ||
      (selectedPayoutRange === "₦20,000-₦50,000" &&
        gig.payout > 20000 &&
        gig.payout <= 50000) ||
      (selectedPayoutRange === "₦50,000+" && gig.payout > 50000);

    return (
      matchesSearch && matchesCategory && matchesPayout && !gig.isFeatured
    );
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredGigs.length / itemsPerPage);
  const paginatedGigs = filteredGigs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const openModal = (gig: Gig, type: "detail" | "quiz" | "apply") => {
    setSelectedGig(gig);
    setModalType(type);
    if (type === "quiz") {
      setCurrentQuestion(0);
      setQuizAnswers([]);
    }
    if (type === "apply") {
      setCoverLetter("");
      setPortfolioLink("");
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedGig(null);
    setIsSubmitting(false);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);

    const questions =
      quizQuestions[selectedGig?.skill || "default"] || quizQuestions.default;

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      // Quiz complete
      setTimeout(() => {
        const score = newAnswers.filter(
          (ans, idx) => ans === questions[idx].correct
        ).length;
        const quizResult: QuizResult = {
          gigId: selectedGig!.id,
          completedAt: Date.now(),
          score: (score / questions.length) * 100,
        };

        const updatedResults = [...quizResults, quizResult];
        const updatedUnlocked = [...unlockedGigIds, selectedGig!.id];

        setQuizResults(updatedResults);
        setUnlockedGigIds(updatedUnlocked);

        setModalType("success");
      }, 500);
    }
  };

  const handleSubmitApplication = () => {
    if (!coverLetter.trim()) {
      // No alert(), just return
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const application: Application = {
        id: `app_${Date.now()}`,
        gigId: selectedGig!.id,
        gigTitle: selectedGig!.title,
        company: selectedGig!.company,
        coverLetter,
        portfolioLink,
        timestamp: Date.now(),
        status: "pending",
      };

      const updatedApplications = [...applications, application];
      setApplications(updatedApplications);

      setIsSubmitting(false);
      setModalType("success");
    }, 1500);
  };

  const hasApplied = (gigId: string) =>
    applications.some((app) => app.gigId === gigId);

  // Render Functions
  const renderGigCard = (gig: Gig, featured = false) => {
    const applied = hasApplied(gig.id);

    return (
      <Card
        key={gig.id}
        className={`bg-slate-900/50 border-slate-800/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 group ${
          featured ? "hover:scale-[1.02]" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                  featured
                    ? "from-emerald-500 to-cyan-500"
                    : "from-cyan-500 to-blue-500"
                } flex items-center justify-center text-white font-bold shadow-lg`}
              >
                {gig.logo}
              </div>
              <div>
                <h3 className="font-semibold text-white">{gig.company}</h3>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{gig.rating}</span>
                  <span className="text-xs">• {gig.applications} applicants</span>
                </div>
              </div>
            </div>
            {gig.isLocked ? (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            ) : applied ? (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Check className="h-3 w-3 mr-1" />
                Applied
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Available
              </Badge>
            )}
          </div>

          <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
            {gig.title}
          </h4>
        </CardHeader>

        <CardContent className="pb-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-slate-800/50 border-slate-700 text-slate-300 text-xs"
            >
              {gig.skill}
            </Badge>
            <Badge
              variant="outline"
              className="bg-slate-800/50 border-slate-700 text-slate-300 text-xs"
            >
              {gig.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{gig.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{gig.duration}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/50">
            <div className="text-2xl font-bold text-emerald-400">
              {gig.payoutType === "hourly"
                ? `$${gig.payout}/hr`
                : `$${gig.payout}`}
            </div>
            <div className="text-xs text-slate-500">
              {gig.payoutType === "hourly" ? "Hourly rate" : "Fixed price"}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-0">
          <Button
            variant="outline"
            className="flex-1 border-slate-700 text-gray-900 hover:bg-slate-800 hover:text-white"
            onClick={() => openModal(gig, "detail")}
          >
            View Details
          </Button>
          <Button
            className={`flex-1 ${
              gig.isLocked
                ? "bg-amber-600 hover:bg-amber-700"
                : applied
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            } text-white transition-all`}
            onClick={() =>
              gig.isLocked ? openModal(gig, "quiz") : openModal(gig, "apply")
            }
            disabled={applied}
          >
            {gig.isLocked ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Take Quiz
              </>
            ) : applied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Applied
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Apply Now
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <DashboardLayout
      title="Find Gigs"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div className="space-y-8">
        {/* Header Tabs */}
        <div className="flex gap-2 border-b border-slate-800">
          <Button
            variant="ghost"
            className={`rounded-none ${
              activeTab === "browse"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("browse")}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Browse Gigs
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none ${
              activeTab === "applications"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("applications")}
          >
            <FileText className="h-4 w-4 mr-2" />
            My Applications ({applications.length})
          </Button>
        </div>

        {activeTab === "browse" ? (
          <>
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Using shadcn/ui Select */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="focus:bg-slate-800"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Using shadcn/ui Select */}
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

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-gray-900 hover:bg-slate-800"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedPayoutRange("Any");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Featured Gigs */}
            {featuredGigs.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Featured Gigs
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredGigs.map((gig) => renderGigCard(gig, true))}
                </div>
              </section>
            )}

            {/* All Gigs */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">
                All Gigs ({filteredGigs.length})
              </h2>
              {paginatedGigs.length === 0 ? (
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-4">
                    No gigs found matching your criteria
                  </p>
                  <Button
                    variant="outline"
                    className="border-slate-700 text-gray-900 hover:bg-slate-800"
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedGigs.map((gig) => renderGigCard(gig))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage((p) => Math.max(1, p - 1));
                            }}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                          )
                          .map((page, index, arr) => (
                            <React.Fragment key={page}>
                              {index > 0 && page - arr[index - 1] > 1 && (
                                <PaginationItem>
                                  <span className="px-3 py-2">...</span>
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage((p) =>
                                Math.min(totalPages, p + 1)
                              );
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
                  )}
                </>
              )}
            </section>
          </>
        ) : (
          /* Applications Tab */
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              My Applications
            </h2>
            {applications.length === 0 ? (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-12 text-center">
                <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-4">
                  You haven't applied to any gigs yet
                </p>
                <Button
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                  onClick={() => setActiveTab("browse")}
                >
                  Browse Gigs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((app) => {
                    const gig = mockGigs.find((g) => g.id === app.gigId);
                    return (
                      <Card
                        key={app.id}
                        className="bg-slate-900/50 border-slate-800/50"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                {gig?.logo || app.company.slice(0, 2)}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white">
                                  {app.gigTitle}
                                </h3>
                                <p className="text-slate-400">{app.company}</p>
                              </div>
                            </div>
                            <Badge
                              className={
                                app.status === "accepted"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : app.status === "rejected"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              }
                            >
                              {app.status.charAt(0).toUpperCase() +
                                app.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-slate-400 mb-1">
                                Cover Letter
                              </p>
                              <p className="text-gray-900 text-sm bg-slate-800/30 rounded-lg p-3">
                                {app.coverLetter}
                              </p>
                            </div>

                            {app.portfolioLink && (
                              <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">
                                  Portfolio
                                </p>
                                <a
                                  href={app.portfolioLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                                >
                                  {app.portfolioLink}
                                </a>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              Applied{" "}
                              {new Date(app.timestamp).toLocaleDateString()} at{" "}
                              {new Date(app.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Modals */}
      {modalType && selectedGig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Detail Modal */}
            {modalType === "detail" && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedGig.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeModal}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {selectedGig.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {selectedGig.company}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedGig.rating}</span>
                        <span>•</span>
                        <span>{selectedGig.applications} applicants</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <DollarSign className="h-5 w-5 text-emerald-400 mb-1" />
                      <p className="text-white font-semibold">
                        {selectedGig.payoutType === "hourly"
                          ? `$${selectedGig.payout}/hr`
                          : `$${selectedGig.payout}`}
                      </p>
                      <p className="text-xs text-slate-400">Payout</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <MapPin className="h-5 w-5 text-cyan-400 mb-1" />
                      <p className="text-white font-semibold">
                        {selectedGig.location}
                      </p>
                      <p className="text-xs text-slate-400">Location</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <Clock className="h-5 w-5 text-blue-400 mb-1" />
                      <p className="text-white font-semibold">
                        {selectedGig.duration}
                      </p>
                      <p className="text-xs text-slate-400">Duration</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <Building className="h-5 w-5 text-purple-400 mb-1" />
                      <p className="text-white font-semibold">
                        {selectedGig.category}
                      </p>
                      <p className="text-xs text-slate-400">Category</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                      Description
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedGig.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {selectedGig.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-slate-300"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3 text-emerald-400" />
                          </div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {selectedGig.responsibilities.map((resp, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-slate-300"
                        >
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3 text-cyan-400" />
                          </div>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-800 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700 text-gray-900 hover:bg-slate-800"
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                  {selectedGig.isLocked ? (
                    <Button
                      onClick={() => setModalType("quiz")}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Take Skill Quiz
                    </Button>
                  ) : hasApplied(selectedGig.id) ? (
                    <Button
                      disabled
                      className="flex-1 bg-slate-700 text-slate-400"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Already Applied
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setModalType("apply")}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* Quiz Modal */}
            {modalType === "quiz" && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white">
                    Skill Assessment
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeModal}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-slate-400">
                        Question {currentQuestion + 1} of{" "}
                        {
                          (
                            quizQuestions[selectedGig.skill] ||
                            quizQuestions.default
                          ).length
                        }
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        {selectedGig.skill} Quiz
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            ((currentQuestion + 1) /
                              (
                                quizQuestions[selectedGig.skill] ||
                                quizQuestions.default
                              ).length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-6">
                      {
                        (
                          quizQuestions[selectedGig.skill] ||
                          quizQuestions.default
                        )[currentQuestion].question
                      }
                    </h3>

                    <div className="space-y-3">
                      {(
                        quizQuestions[selectedGig.skill] ||
                        quizQuestions.default
                      )[currentQuestion].options.map(
                        (option: string, index: number) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start h-auto py-4 px-5 text-left border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group"
                            onClick={() => handleQuizAnswer(index)}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 transition-colors">
                                <span className="text-slate-400 group-hover:text-emerald-400 font-semibold">
                                  {String.fromCharCode(65 + index)}
                                </span>
                              </div>
                              <span className="text-gray-900 group-hover:text-white transition-colors">
                                {option}
                              </span>
                            </div>
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-300 mb-1">
                          Take your time
                        </p>
                        <p className="text-xs text-slate-400">
                          This quick assessment helps us match you with the right
                          opportunities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Apply Modal */}
            {modalType === "apply" && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-white">Apply for Gig</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeModal}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6 bg-slate-800/30 rounded-xl p-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {selectedGig.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {selectedGig.title}
                      </h3>
                      <p className="text-slate-400">{selectedGig.company}</p>
                      <p className="text-emerald-400 font-semibold mt-1">
                        {selectedGig.payoutType === "hourly"
                          ? `$${selectedGig.payout}/hr`
                          : `$${selectedGig.payout}`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">
                        Cover Letter <span className="text-red-400">*</span>
                      </label>
                      <Textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all min-h-[150px]"
                        placeholder="Tell the employer why you're the perfect fit for this role..."
                        rows={6}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {coverLetter.length} characters
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 block">
                        Portfolio Link{" "}
                        <span className="text-slate-500">(Optional)</span>
                      </label>
                      <Input
                        type="url"
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <div className="flex gap-3">
                        <Zap className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-emerald-300 mb-1">
                            Zero Broke Days
                          </p>
                          <p className="text-xs text-slate-400">
                            Get paid within minutes of approval. Your earnings
                            go directly to your CashnGo wallet.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-800 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700 text-gray-900 hover:bg-slate-800"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting || !coverLetter.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Success Modal */}
            {modalType === "success" && (
              <>
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                    <Check className="h-10 w-10 text-white" />
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-3">
                    {/* Check if the quiz was just completed */}
                    {quizResults.some(
                      (q) =>
                        q.gigId === selectedGig.id &&
                        Date.now() - q.completedAt < 5000 // 5 seconds threshold
                    )
                      ? "Quiz Completed!"
                      : "Application Submitted!"}
                  </h2>

                  <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    {quizResults.some(
                      (q) =>
                        q.gigId === selectedGig.id &&
                        Date.now() - q.completedAt < 5000
                    )
                      ? `Congratulations! You've unlocked "${selectedGig.title}". You can now apply for this opportunity.`
                      : `Your application for "${selectedGig.title}" has been submitted successfully. The employer will review it soon.`}
                  </p>

                  {quizResults.some(
                    (q) =>
                      q.gigId === selectedGig.id &&
                      Date.now() - q.completedAt < 5000
                  ) ? (
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={closeModal}
                        className="border-slate-700 text-gray-900 hover:bg-slate-800"
                      >
                        Continue Browsing
                      </Button>
                      <Button
                        onClick={() => {
                          // Reset form fields before opening apply modal
                          setCoverLetter("");
                          setPortfolioLink("");
                          setModalType("apply");
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => {
                          closeModal();
                          setActiveTab("browse");
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                      >
                        Continue Browsing
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          closeModal();
                          setActiveTab("applications");
                        }}
                        className="border-slate-700 text-gray-900 hover:bg-slate-800"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Applications
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

