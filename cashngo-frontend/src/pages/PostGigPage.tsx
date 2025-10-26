import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Briefcase,
  DollarSign,
  FileText,
  Layers,
  ListChecks,
  Clock,
  CheckCircle,
} from "lucide-react";

// --- Layout & Animation Imports (from StudentDashboard) ---
import { EmployerDashboardLayout } from "@/components/layout/EmployerDashboardLayout"; // <-- UPDATED IMPORT
import AnimatedSection from "@/components/AnimatedSection";

// --- Shadcn/ui Imports ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- 1. Define Form Schema (No Zod) ---
type GigFormValues = {
  title: string;
  category: string;
  description: string;
  requirements: string;
  payoutAmount: number;
  payoutType: "fixed" | "hourly";
};

// Mock data for dropdowns
const mockCategories = [
  { id: "dev", name: "Web Development" },
  { id: "design", name: "UI/UX Design" },
  { id: "ai", name: "AI/ML" },
  { id: "writing", name: "Content Writing" },
  { id: "marketing", name: "Social Media" },
];

// --- 2. The Page Component ---
const PostGigPage: React.FC = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // --- 3. Setup React Hook Form ---
  const form = useForm<GigFormValues>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      requirements: "",
      payoutAmount: 100,
      payoutType: "fixed",
    },
  });

  // --- 4. Form Submission Handler ---
  const onSubmit: SubmitHandler<GigFormValues> = (data) => {
    console.log("New Gig Data:", data);
    // In a real app, you'd send this to your mock API context
    // and update the global gigs list.
    setIsSuccessModalOpen(true);
    form.reset(); // Clear the form after submission
  };

  return (
    // 5. Use EmployerDashboardLayout wrapper
    <EmployerDashboardLayout title="Post a New Gig">
      {/* 6. Use AnimatedSection wrapper (like StudentDashboard) */}
      <AnimatedSection delay="delay-100">
        <Card className="bg-slate-900/60 border border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-cyan-500/10 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Post a New Gig
            </CardTitle>
            <CardDescription className="text-slate-400">
              Fill out the details below to find the perfect student for your task.
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <CardContent className="space-y-8 pt-6">
                {/* --- Form Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* --- Gig Title --- */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-slate-300">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          Gig Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 'Build a React Landing Page'"
                            className="bg-slate-950/70 border-slate-700 ring-offset-slate-950 focus:ring-cyan-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* --- Category --- */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-slate-300">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          Category
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-950/70 border-slate-700 ring-offset-slate-950 focus:ring-cyan-500">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            {mockCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name} className="focus:bg-cyan-900/50">
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* --- Payout Amount --- */}
                  <FormField
                    control={form.control}
                    name="payoutAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-slate-300">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          Payout Amount (in ₦)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 50000"
                            className="bg-slate-950/70 border-slate-700 ring-offset-slate-950 focus:ring-cyan-500"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* --- Payout Type --- */}
                  <FormField
                    control={form.control}
                    name="payoutType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-green-400" />
                          Payout Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-950/7Type border-slate-700 ring-offset-slate-950 focus:ring-cyan-500">
                              <SelectValue placeholder="Select payout type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            <SelectItem value="fixed" className="focus:bg-cyan-900/50">Fixed Price</SelectItem>
                            <SelectItem value="hourly" className="focus:bg-cyan-900/50">Hourly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* --- Description --- */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2 text-slate-300">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          Gig Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of the task..."
                            className="bg-slate-950/70 border-slate-700 ring-offset-slate-950 focus:ring-cyan-500 min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* --- Requirements --- */}
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2 text-slate-300">
                          <ListChecks className="w-4 h-4 text-cyan-400" />
                          Requirements
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List the skills or requirements (e.g., 'Proficient in React', '3+ projects', 'Good communication')"
                            className="bg-slate-950/70 border-slate-700 ring-offset-slate-950 focus:ring-cyan-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end pt-6 border-t border-slate-800/50">
                <Button
                  type="submit"
                  className="bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
                >
                  Post Gig
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </AnimatedSection>

      {/* --- Success Modal (Remains outside layout) --- */}
      <AlertDialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <AlertDialogContent className="bg-slate-900 border-green-500/50 text-white shadow-lg shadow-green-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle />
              Gig Posted Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Your new gig has been created. For this hackathon demo, the
              form data has been logged to the console.
            </AlertDialogDescription>
              Your new gig has been created. For this hackathon demo, the
              form data has been logged to the console.
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-green-500 text-slate-950 font-bold hover:bg-green-400 focus:ring-green-300"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Great!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EmployerDashboardLayout>
  );
};

export default PostGigPage;



