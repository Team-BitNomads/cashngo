import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

// --- Our Custom Components & Hooks ---
import { SelfieCaptureModal } from "@/components/SelfieCaptureModal";
import GeneralSkillQuizModal from "@/components/QuizModal"; // Using existing QuizModal
import { useAuth } from "@/hooks/useAuth";
import  useLocalStorage  from "@/hooks/useLocalStorage"; // Import useLocalStorage

// --- shadcn/ui Component Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/FileUpload"; // Import FileUpload
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // For Completion Modal

// --- Icon Imports ---
import {
  Upload,
  GraduationCap,
  User,
  Calendar,
  Home,
  CircleUserRound,
  FileText, // For certificate/portfolio
  Link, // For portfolio link
  CheckCircle, // For success modal
  Award, // For Skills
  Brain, // For Quiz
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Increased MAX_STEPS ---
const MAX_STEPS = 6;

// File validation types and helpers
type AllowedFileType = 'image/jpeg' | 'image/png' | 'application/pdf';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const validateFile = (file: File | null | undefined) => {
  if (!file) return true; // Skip validation if no file (for optional files)
  
  const allowedTypes: AllowedFileType[] = ['image/jpeg', 'image/png', 'application/pdf'];
  
  if (!allowedTypes.includes(file.type as AllowedFileType)) {
    return 'File must be a JPG, PNG, or PDF';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 5MB';
  }
  
  return true;
};

// --- Updated Data Type ---
interface OnboardingData {
  // Personal Info
  firstName: string;
  lastName: string;
  middleName?: string;
  dob: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  // Address
  streetAddress: string;
  city: string;
  state: string;
  lga: string;
  // Identification
  idType: "NIN" | "DriverLicense" | "IntPassport" | "VoterCard" | "SchoolID";
  idNumber: string;
  idDocument?: File | null;
  // Education/Employment
  currentStatus: "student" | "employed" | "unemployed";
  institutionName?: string;
  matriculationNumber?: string;
  courseOfStudy?: string;
  expectedGraduationYear?: string;
  studentIdCard?: File | null;
  // --- NEW Skill Verification ---
  skillVerificationMethod?: "upload" | "quiz";
  certificateUpload?: File | null;
  portfolioLink?: string;
  // Biometric
  selfieImage?: File | null;
  consentBiometric: boolean;
  // Final
  termsAccepted: boolean;
}

// Helper to format keys for summary
const formatKey = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false); // State for quiz modal
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false); // State for completion modal
  const [initialSkillLevel, setInitialSkillLevel] = useLocalStorage<
    string | null
  >("cashngo_initialSkillLevel", null); // Store skill level

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<OnboardingData>({
    mode: "onChange", // Validate on change for better UX
    defaultValues: {
      // Set default values to avoid uncontrolled inputs
      firstName: "",
      lastName: "",
      dob: "",
      gender: undefined,
      phoneNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      lga: "",
      idType: undefined,
      idNumber: "",
      idDocument: null,
      currentStatus: undefined,
      institutionName: "",
      matriculationNumber: "",
      skillVerificationMethod: undefined,
      certificateUpload: null,
      portfolioLink: "",
      selfieImage: null,
      consentBiometric: false,
      termsAccepted: false,
    },
  });

  const formData = watch(); // Watch all form data for conditional rendering & summary

  // --- Updated Validation Logic ---
  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingData)[] = [];
    switch (currentStep) {
      case 1: // Personal Info
        fieldsToValidate = [
          "firstName",
          "lastName",
          "dob",
          "gender",
          "phoneNumber",
        ];
        break;
      case 2: // Address & ID
        fieldsToValidate = [
          "streetAddress",
          "city",
          "state",
          "lga",
          "idType",
          "idNumber",
          "idDocument",
        ];
        break;
      case 3: // Education/Employment
        fieldsToValidate = ["currentStatus"];
        if (watch("currentStatus") === "student") {
          fieldsToValidate.push("institutionName", "matriculationNumber"); // Add others if needed
        }
        break;
      case 4: // NEW: Skill Verification
        fieldsToValidate = ["skillVerificationMethod"];
        if (watch("skillVerificationMethod") === "upload") {
          // Uploads are optional, no required validation needed unless specified
        } else if (
          watch("skillVerificationMethod") === "quiz" &&
          !initialSkillLevel
        ) {
          // If quiz is selected but not completed, trigger error conceptually (button handles modal)
          console.error("Please complete the skill assessment quiz.");
          // In a real scenario, you might visually indicate the button needs clicking
          // For now, prevent proceeding if quiz selected but level not set
          setValue("skillVerificationMethod", "quiz", { shouldValidate: true }); // Trigger validation potentially
          // Manually add error if needed: setError('skillVerificationMethod', { type: 'manual', message: 'Please complete the quiz.'});
          return; // Stop execution
        }
        break;
      case 5: // Biometric (Old Step 4)
        // Ensure selfieImage is required
        register("selfieImage", {
          required: "Live selfie is required for verification.",
          validate: validateFile
        });
        fieldsToValidate = ["consentBiometric", "selfieImage"];
        break;
      case 6: // Review (Old Step 5)
        fieldsToValidate = ["termsAccepted"];
        break;
    }

    // Trigger validation and move to next step if valid
    const result = await trigger(fieldsToValidate, { shouldFocus: true });
    if (result) {
      if (currentStep === MAX_STEPS) {
        // If on the last step and valid, call submit handler directly
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, MAX_STEPS));
      }
    } else {
      console.log(
        "Validation failed for step:",
        currentStep,
        "Fields:",
        fieldsToValidate,
        "Errors:",
        errors
      );
    }
  };

  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- Updated Submit Logic ---
  const onSubmit = async (data: OnboardingData) => {
    try {
      console.log("Final Onboarding Data:", data);
      
      // In a real implementation, this would be an API call
      // const response = await submitOnboardingData({ ...data, initialSkillLevel });
      
      // Update user object to mark onboarding as complete
      const updatedUser = {
        ...user,
        onboardingComplete: true,
        skillLevel: initialSkillLevel || 'Beginner',
        // Add other user profile updates from the form
        name: `${data.firstName} ${data.lastName}`,
        status: data.currentStatus,
        institution: data.institutionName,
        matricNumber: data.matriculationNumber
      };

      // Store the updated user data
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      // Show completion modal
      setIsCompletionModalOpen(true);
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      // Here you would show an error notification to the user
    }
  };

  const handleQuizComplete = (success: boolean) => {
    setIsQuizModalOpen(false);
    if (success) {
      // Set initial skill level based on quiz outcome (e.g., 'Beginner' or 'Intermediate')
      const determinedLevel = "Beginner"; // Mock: Always set to Beginner if passed
      setInitialSkillLevel(determinedLevel);
      setValue("skillVerificationMethod", "quiz", { shouldValidate: true }); // Mark quiz as method
      trigger("skillVerificationMethod"); // Re-validate the step field
      console.log(
        "Quiz completed successfully, skill level set to:",
        determinedLevel
      );
    } else {
      // Handle quiz failure if needed (e.g., allow retry?)
      setInitialSkillLevel(null); // Or keep as null/unverified
      console.log("Quiz failed or not passed sufficiently.");
      // Optionally show an error message to the user
    }
  };

  const closeCompletionModal = () => {
    setIsCompletionModalOpen(false);
    navigate("/dashboard"); // Navigate after closing the modal
  };

  const userProfileImage = user?.name
    ? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}`
    : `https://api.dicebear.com/7.x/pixel-art/svg?seed=default`;

  // --- Updated Step Titles ---
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information";
      case 2:
        return "Identification & Address";
      case 3:
        return "Educational & Employment Details";
      case 4:
        return "Skill Verification"; // New Step
      case 5:
        return "Biometric & Liveness Check"; // Shifted
      case 6:
        return "Review & Submit"; // Shifted
      default:
        return "";
    }
  };

  // --- Helper to render summary value ---
  const renderSummaryValue = (key: keyof OnboardingData, value: OnboardingData[keyof OnboardingData]) => {
    if (value === null || value === undefined || value === "")
      return <span className="text-slate-500 italic">Not Provided</span>;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value instanceof File)
      return (
        <span className="flex items-center gap-1 text-green-400">
          <FileText className="h-3 w-3" />
          {value.name}
        </span>
      );
    // Obfuscate sensitive info like ID number
    if (key === "idNumber") return `********${String(value).slice(-4)}`;
    if (key === "skillVerificationMethod") {
      const method = value as "upload" | "quiz";
      return method.charAt(0).toUpperCase() + method.slice(1); // Capitalize
    }
    return String(value);
  };

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 p-4 bg-cover bg-center bg-onboarding"
    >
      {/* Background Overlays and Effects */}
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] animate-[shimmer_20s_ease-in-out_infinite] bg-[radial-gradient(circle_farthest-side_at_center,rgba(5,150,105,0.15),transparent_40%)]"></div>
        <div className="absolute -bottom-1/2 -right-1/2 h-[200%] w-[200%] animate-[shimmer_25s_ease-in-out_infinite_reverse] bg-[radial-gradient(circle_farthest-side_at_center,rgba(139,92,246,0.1),transparent_50%)]"></div>
      </div>

      {/* Main Card */}
      <div className="z-10 w-full max-w-5xl animate-fade-in-up rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[2fr_1fr] backdrop-blur-xl">
        {/* Left Side: Form Content */}
        <div className="p-6 md:p-10 space-y-8 text-gray-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
          {/* Step Indicator and Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
                Step {currentStep} of {MAX_STEPS}: {getStepTitle()}
              </h2>
              <div className="flex space-x-1.5 md:space-x-2">
                {Array.from({ length: MAX_STEPS }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "block h-1.5 md:h-2 w-6 md:w-8 rounded-full transition-all duration-300",
                      index + 1 <= currentStep ? "bg-green-500" : "bg-slate-700"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Form Area */}
          {/* Use onSubmit on the form tag, not needed on button explicitly */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Conditional Rendering of Steps */}
            <div key={currentStep} className="animate-fade-in-up space-y-6">
              {/* --- STEP 1: Personal Information --- */}
              {currentStep === 1 && (
                <>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-100">
                    Tell us about yourself.
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-gray-100">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        className="h-11"
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-400">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-gray-100">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        className="h-11"
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-400">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="dob" className="text-gray-100">
                      Date of Birth
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="date"
                        id="dob"
                        {...register("dob", {
                          required: "Date of birth is required",
                        })}
                        className="pl-10 h-11"
                      />
                    </div>
                    {errors.dob && (
                      <p className="text-xs text-red-400">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-100">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: "Please select a gender" }}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4 pt-2"
                        >
                          <Label className="flex items-center space-x-2 cursor-pointer text-gray-300">
                            <RadioGroupItem value="male" />
                            <span>Male</span>
                          </Label>
                          <Label className="flex items-center space-x-2 cursor-pointer text-gray-300">
                            <RadioGroupItem value="female" />
                            <span>Female</span>
                          </Label>
                          <Label className="flex items-center space-x-2 cursor-pointer text-gray-300">
                            <RadioGroupItem value="other" />
                            <span>Other</span>
                          </Label>
                        </RadioGroup>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-xs text-red-400">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phoneNumber" className="text-gray-100">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="080XXXXXXXX"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0]\d{10}$/,
                          message:
                            "Enter a valid Nigerian phone number (e.g., 080...)",
                        },
                      })}
                      className="h-11"
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-400">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* --- STEP 2: Address & ID --- */}
              {currentStep === 2 && (
                <>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-100">
                    Address & Identification
                  </h3>
                  <div className="space-y-1">
                    <Label htmlFor="streetAddress" className="text-gray-100">
                      Residential Address
                    </Label>
                    <Input
                      id="streetAddress"
                      {...register("streetAddress", {
                        required: "Street address is required",
                      })}
                      className="h-11"
                    />
                    {errors.streetAddress && (
                      <p className="text-xs text-red-400">
                        {errors.streetAddress.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="city" className="text-gray-100">
                        City
                      </Label>
                      <Input
                        id="city"
                        {...register("city", { required: "City is required" })}
                        className="h-11"
                      />
                      {errors.city && (
                        <p className="text-xs text-red-400">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="state" className="text-gray-100">
                        State
                      </Label>
                      <Input
                        id="state"
                        {...register("state", {
                          required: "State is required",
                        })}
                        className="h-11"
                      />
                      {errors.state && (
                        <p className="text-xs text-red-400">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lga" className="text-gray-100">
                        LGA
                      </Label>
                      <Input
                        id="lga"
                        {...register("lga", { required: "LGA is required" })}
                        className="h-11"
                      />
                      {errors.lga && (
                        <p className="text-xs text-red-400">
                          {errors.lga.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-100">
                      Means of Identification
                    </Label>
                    <Controller
                      name="idType"
                      control={control}
                      rules={{ required: "Please select an ID type" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select ID Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            <SelectItem value="NIN">
                              National ID Card (NIN Slip)
                            </SelectItem>
                            <SelectItem value="DriverLicense">
                              Driver's License
                            </SelectItem>
                            <SelectItem value="IntPassport">
                              International Passport
                            </SelectItem>
                            <SelectItem value="VoterCard">
                              Voter's Card
                            </SelectItem>
                            <SelectItem value="SchoolID">
                              Student ID Card
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.idType && (
                      <p className="text-xs text-red-400">
                        {errors.idType.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="idNumber" className="text-gray-100">
                      ID Number
                    </Label>
                    <Input
                      id="idNumber"
                      {...register("idNumber", {
                        required: "ID number is required",
                      })}
                      className="h-11"
                    />
                    {errors.idNumber && (
                      <p className="text-xs text-red-400">
                        {errors.idNumber.message}
                      </p>
                    )}
                  </div>
                  <FileUpload
                    label="Upload ID Document"
                    id="idDocument"
                    helperText="Upload a clear picture or scan (JPG, PNG, PDF)"
                    error={errors.idDocument?.message as string | undefined}
                    onFileSelect={(file) =>
                      setValue("idDocument", file, { shouldValidate: true })
                    }
                    {...register("idDocument", {
                      required: "ID document is required",
                      validate: validateFile
                    })}
                  />
                </>
              )}

              {/* --- STEP 3: Education/Employment --- */}
              {currentStep === 3 && (
                <>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-100">
                    Background Information
                  </h3>
                  <div className="space-y-1 pt-2">
                    <Label className="text-base font-medium text-white">
                      Current Status
                    </Label>
                    <Controller
                      name="currentStatus"
                      control={control}
                      rules={{ required: "Please select a status" }}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2 pt-2"
                        >
                          <Label
                            className={cn(
                              "flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer",
                              field.value === "student"
                                ? "border-green-500 bg-green-900/20 ring-1 ring-green-500"
                                : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                            )}
                          >
                            <RadioGroupItem
                              value="student"
                              id="status-student"
                            />
                            <span>Currently a Student</span>
                          </Label>
                          <Label
                            className={cn(
                              "flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer",
                              field.value === "employed"
                                ? "border-green-500 bg-green-900/20 ring-1 ring-green-500"
                                : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                            )}
                          >
                            <RadioGroupItem
                              value="employed"
                              id="status-employed"
                            />
                            <span>Graduate - Employed</span>
                          </Label>
                          <Label
                            className={cn(
                              "flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer",
                              field.value === "unemployed"
                                ? "border-green-500 bg-green-900/20 ring-1 ring-green-500"
                                : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                            )}
                          >
                            <RadioGroupItem
                              value="unemployed"
                              id="status-unemployed"
                            />
                            <span>Graduate - Unemployed</span>
                          </Label>
                        </RadioGroup>
                      )}
                    />
                    {errors.currentStatus && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.currentStatus.message}
                      </p>
                    )}
                  </div>
                  {formData.currentStatus === "student" && (
                    <div className="space-y-4 pt-4 animate-fade-in-up border-t border-slate-800 mt-6">
                      <h4 className="font-semibold text-slate-300">
                        Student Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="institutionName">
                            Institution Name
                          </Label>
                          <Input
                            id="institutionName"
                            {...register("institutionName", {
                              required:
                                formData.currentStatus === "student"
                                  ? "Required"
                                  : false,
                            })}
                            className="h-11"
                          />
                          {errors.institutionName && (
                            <p className="text-xs text-red-400">
                              {errors.institutionName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="matriculationNumber">
                            Matriculation Number
                          </Label>
                          <Input
                            id="matriculationNumber"
                            {...register("matriculationNumber", {
                              required:
                                formData.currentStatus === "student"
                                  ? "Required"
                                  : false,
                            })}
                            className="h-11"
                          />
                          {errors.matriculationNumber && (
                            <p className="text-xs text-red-400">
                              {errors.matriculationNumber.message}
                            </p>
                          )}
                        </div>
                        {/* Optional: Add Course of Study */}
                        <div className="space-y-1 md:col-span-2">
                          <Label htmlFor="courseOfStudy">
                            Course of Study (Optional)
                          </Label>
                          <Input
                            id="courseOfStudy"
                            {...register("courseOfStudy")}
                            className="h-11"
                          />
                        </div>
                      </div>
                      {/* Optional: Add Student ID Card Upload */}
                      <FileUpload
                        label="Upload Student ID Card (Optional)"
                        id="studentIdCard"
                        helperText="Helps with verification (JPG, PNG, PDF)"
                        error={
                          errors.studentIdCard?.message as string | undefined
                        }
                        onFileSelect={(file) => setValue("studentIdCard", file, { shouldValidate: true })}
                        {...register("studentIdCard", {
                          validate: validateFile
                        })}
                      />
                    </div>
                  )}
                </>
              )}

              {/* --- STEP 4: Skill Verification --- */}
              {currentStep === 4 && (
                <>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-100">
                    Verify Your Skills
                  </h3>
                  <p className="text-sm text-slate-400">
                    Help us understand your current skill level. This helps
                    match you with better gigs faster.
                  </p>

                  <Controller
                    name="skillVerificationMethod"
                    control={control}
                    rules={{
                      required:
                        "Please choose a verification method or complete the quiz",
                    }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          trigger("skillVerificationMethod");
                        }}
                        value={field.value}
                        className="space-y-3 pt-4"
                      >
                        {/* Option 1: Upload Proof */}
                        <Label
                          className={cn(
                            "block rounded-lg border p-4 transition-all cursor-pointer",
                            field.value === "upload"
                              ? "border-green-500 bg-green-900/20 ring-1 ring-green-500"
                              : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                          )}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <RadioGroupItem value="upload" id="verify-upload" />
                            <div className="font-medium text-white">
                              Upload Proof (Optional)
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 pl-8 mb-4">
                            Showcase your existing skills by uploading
                            certificates or linking your portfolio.
                          </p>
                          {/* Only show inputs if this option is selected */}
                          {field.value === "upload" && (
                            <div className="pl-8 space-y-4 animate-fade-in-up">
                              <FileUpload
                                label="Upload Certificate(s)"
                                id="certificateUpload"
                                accept=".pdf, image/*"
                                helperText="Upload relevant skill certificates (PDF, JPG, PNG)"
                                error={
                                  errors.certificateUpload?.message as
                                    | string
                                    | undefined
                                }
                                onFileSelect={(file) =>
                                  setValue("certificateUpload", file, { shouldValidate: true })
                                }
                                {...register("certificateUpload", {
                                  validate: validateFile
                                })}
                              />
                              <div className="space-y-1">
                                <Label
                                  htmlFor="portfolioLink"
                                  className="text-gray-100"
                                >
                                  Portfolio Link
                                </Label>
                                <div className="relative">
                                  <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    id="portfolioLink"
                                    type="url"
                                    placeholder="e.g., https://github.com/yourname, Behance, etc."
                                    {...register("portfolioLink")}
                                    className="pl-10 h-11"
                                  />
                                </div>
                                {/* Add URL validation if desired */}
                                {errors.portfolioLink && (
                                  <p className="text-xs text-red-400">
                                    {errors.portfolioLink.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </Label>

                        {/* Option 2: Take Assessment */}
                        <Label
                          className={cn(
                            "block rounded-lg border p-4 transition-all cursor-pointer",
                            field.value === "quiz"
                              ? "border-green-500 bg-green-900/20 ring-1 ring-green-500"
                              : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                          )}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <RadioGroupItem value="quiz" id="verify-quiz" />
                            <div className="font-medium text-white">
                              Take General Skill Assessment
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 pl-8 mb-4">
                            Take a short quiz (approx. 2-3 mins) to gauge your
                            foundational skills.
                          </p>
                          {/* Show button only if this option is selected */}
                          {field.value === "quiz" && (
                            <div className="pl-8 mt-4 animate-fade-in-up">
                              {initialSkillLevel ? (
                                <div className="flex items-center gap-2 text-green-400 border border-green-500/30 bg-green-500/10 p-3 rounded-md text-sm">
                                  <CheckCircle className="h-5 w-5" /> Assessment
                                  Completed (Level: {initialSkillLevel})
                                </div>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                                  onClick={() => setIsQuizModalOpen(true)}
                                >
                                  <Brain className="h-4 w-4 mr-2" /> Start
                                  Assessment
                                </Button>
                              )}
                            </div>
                          )}
                        </Label>
                      </RadioGroup>
                    )}
                  />
                  {/* Display validation error for the radio group itself */}
                  {errors.skillVerificationMethod && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.skillVerificationMethod.message}
                    </p>
                  )}
                </>
              )}

              {/* --- STEP 5: Biometric --- */}
              {currentStep === 5 && (
                <>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-100">
                    Biometric & Liveness Check
                  </h3>
                  <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-slate-700 bg-slate-800/50">
                    <div className="w-40 h-40 md:w-48 md:h-48 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-center overflow-hidden border-2 border-dashed border-slate-600">
                      {formData.selfieImage ? (
                        <img
                          src={URL.createObjectURL(formData.selfieImage)}
                          alt="Selfie preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <CircleUserRound className="h-20 w-20 md:h-24 md:w-24" />
                      )}
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      Position your face within the circle.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCameraOpen(true)}
                      className="mt-4 px-6 py-2 text-gray-400 border-slate-600 hover:bg-slate-700/50"
                    >
                      <Upload className="mr-2 h-4 w-4" />{" "}
                      {formData.selfieImage
                        ? "Recapture"
                        : "Capture Live Selfie"}
                    </Button>
                    {/* Ensure selfieImage error displays */}
                    {errors.selfieImage && (
                      <p className="text-xs text-red-400 mt-2">
                        {errors.selfieImage.message}
                      </p>
                    )}
                  </div>
                  <div className="pt-4">
                    <Controller
                      name="consentBiometric"
                      control={control}
                      rules={{
                        validate: (value) =>
                          value === true || "You must consent to continue.",
                      }}
                      render={({ field }) => (
                        <div className="flex items-start space-x-2 p-3 bg-slate-800/30 border border-slate-700 rounded-md">
                          <Checkbox
                            id="consent"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                          <label
                            htmlFor="consent"
                            className="text-sm text-gray-400 leading-relaxed cursor-pointer"
                          >
                            {" "}
                            I consent to the capture and use of my biometric
                            data (facial image) solely for the purpose of
                            identity verification and liveness detection
                            required for onboarding onto the CashnGo platform.{" "}
                          </label>
                        </div>
                      )}
                    />
                    {errors.consentBiometric && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.consentBiometric.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* --- STEP 6: Review & Submit --- */}
              {currentStep === 6 && (
                <>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-100">
                    Review Your Details
                  </h3>
                  <p className="text-sm text-slate-400">
                    Please confirm all information is accurate before
                    submitting.
                  </p>

                  {/* Improved Summary Display */}
                  <div className="max-h-[50vh] overflow-y-auto pr-3 space-y-5 custom-scrollbar rounded-lg border border-slate-700 bg-slate-800/50 p-4 mt-4 text-sm">
                    {[
                      {
                        title: "Personal",
                        keys: [
                          "firstName",
                          "lastName",
                          "dob",
                          "gender",
                          "phoneNumber",
                        ],
                      },
                      {
                        title: "Address",
                        keys: ["streetAddress", "city", "lga", "state"],
                      },
                      {
                        title: "Identification",
                        keys: ["idType", "idNumber", "idDocument"],
                      },
                      {
                        title: "Status & Education",
                        keys: [
                          "currentStatus",
                          "institutionName",
                          "matriculationNumber",
                          "studentIdCard",
                        ],
                      },
                      {
                        title: "Skills",
                        keys: [
                          "skillVerificationMethod",
                          "certificateUpload",
                          "portfolioLink",
                        ],
                      },
                      {
                        title: "Biometric",
                        keys: ["selfieImage", "consentBiometric"],
                      },
                    ].map((group) => {
                      const groupHasValue = group.keys.some(
                        (key) => !!getValues(key as keyof OnboardingData)
                      );
                      if (
                        !groupHasValue &&
                        !(group.title === "Skills" && initialSkillLevel)
                      )
                        return null; // Also show Skills group if level is set

                      return (
                        <div key={group.title}>
                          <h4 className="font-semibold text-cyan-400 mb-2 pb-1 border-b border-slate-700">
                            {group.title}
                          </h4>
                          <dl className="space-y-2">
                            {group.keys.map((key) => {
                              const value = getValues(
                                key as keyof OnboardingData
                              );
                              // Skip empty/invalid values within group, unless it's the method itself
                              if (
                                key !== "skillVerificationMethod" &&
                                (!value ||
                                  (typeof value === "object" &&
                                    !value.name &&
                                    !(value instanceof File)))
                              )
                                return null;
                              // Skip specific education fields if not a student
                              if (
                                formData.currentStatus !== "student" &&
                                [
                                  "institutionName",
                                  "matriculationNumber",
                                  "studentIdCard",
                                ].includes(key)
                              )
                                return null;
                              // Skip specific skill upload fields if quiz was chosen
                              if (
                                formData.skillVerificationMethod === "quiz" &&
                                ["certificateUpload", "portfolioLink"].includes(
                                  key
                                )
                              )
                                return null;

                              return (
                                <div
                                  key={key}
                                  className="grid grid-cols-3 gap-2 items-start"
                                >
                                  <dt className="text-slate-400 col-span-1">
                                    {formatKey(key)}:
                                  </dt>
                                  <dd className="text-white col-span-2 break-words">
                                    {renderSummaryValue(
                                      key as keyof OnboardingData,
                                      value
                                    )}
                                  </dd>
                                </div>
                              );
                            })}
                            {/* Explicitly add initial skill level if determined by quiz */}
                            {group.title === "Skills" &&
                              formData.skillVerificationMethod === "quiz" &&
                              initialSkillLevel && (
                                <div className="grid grid-cols-3 gap-2 items-start">
                                  <dt className="text-slate-400 col-span-1">
                                    Assessed Skill Level:
                                  </dt>
                                  <dd className="text-white col-span-2 break-words">
                                    {initialSkillLevel}
                                  </dd>
                                </div>
                              )}
                          </dl>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800">
                    <Controller
                      name="termsAccepted"
                      control={control}
                      rules={{
                        validate: (value) =>
                          value === true ||
                          "You must certify your information is accurate.",
                      }}
                      render={({ field }) => (
                        <div className="flex items-start space-x-2 p-3 bg-slate-800/30 border border-slate-700 rounded-md">
                          <Checkbox
                            id="terms"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm text-gray-400 leading-relaxed cursor-pointer"
                          >
                            {" "}
                            I certify that all information provided is accurate
                            and truthful to the best of my knowledge.{" "}
                          </label>
                        </div>
                      )}
                    />
                    {errors.termsAccepted && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-10 pt-6 border-t border-slate-800 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="w-full sm:w-auto px-8 py-3 bg-transparent border-slate-600 hover:bg-slate-800 hover:border-slate-500 text-white font-bold"
              >
                {" "}
                Previous{" "}
              </Button>

              {/* Conditionally render Next or Submit */}
              <Button
                // Change type to submit ONLY on the last step
                type={currentStep === MAX_STEPS ? "submit" : "button"}
                // Call handleNext for intermediate steps
                onClick={currentStep < MAX_STEPS ? handleNext : undefined}
                className="w-full sm:w-auto px-10 py-3 bg-green-500 hover:bg-green-600 text-slate-950 font-bold text-base transition-transform hover:scale-105"
                // Disable submit if terms not accepted on last step
                disabled={currentStep === MAX_STEPS && !watch("termsAccepted")}
              >
                {currentStep < MAX_STEPS ? "Next Step" : "Submit Onboarding"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side: Profile Summary Preview */}
        <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-slate-800/30 border-l border-white/10">
          <div className="text-center text-white space-y-4">
            <h3 className="text-xl font-bold text-green-400 flex items-center justify-center gap-2">
              <GraduationCap className="h-6 w-6" /> Your CashnGo Profile
            </h3>
            <div className="mt-4 flex flex-col items-center">
              <img
                src={
                  formData.selfieImage
                    ? URL.createObjectURL(formData.selfieImage)
                    : userProfileImage
                }
                alt="Profile Preview"
                className="h-24 w-24 rounded-full border-2 border-green-500 shadow-lg object-cover bg-slate-700"
              />
            </div>
            {/* Dynamic Summary Card */}
            <div className="mt-6 text-left space-y-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700 w-full max-w-xs text-xs">
              <div className="flex items-center text-gray-300">
                {" "}
                <User className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />{" "}
                <span className="flex-grow truncate font-medium text-white">
                  {formData.firstName || "..."} {formData.lastName || "..."}
                </span>{" "}
              </div>
              <div className="flex items-center text-gray-300">
                {" "}
                <GraduationCap className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />{" "}
                <span className="flex-grow truncate">
                  {formData.currentStatus === "student"
                    ? formData.matriculationNumber || "..."
                    : formData.currentStatus || "..."}
                </span>{" "}
              </div>
              <div className="flex items-center text-gray-300">
                {" "}
                <Home className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />{" "}
                <span className="flex-grow truncate">
                  {formData.currentStatus === "student"
                    ? formData.institutionName || "..."
                    : formData.city
                    ? `${formData.city}, ${formData.state}`
                    : "..."}
                </span>{" "}
              </div>
              {/* Add initial skill level display */}
              {initialSkillLevel && (
                <div className="flex items-center text-gray-300">
                  {" "}
                  <Award className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />{" "}
                  <span className="flex-grow truncate">
                    Skill Level:{" "}
                    <span className="font-medium text-white">
                      {initialSkillLevel}
                    </span>
                  </span>{" "}
                </div>
              )}
            </div>
            <p className="mt-4 text-xs text-gray-400 max-w-xs">
              {" "}
              Your profile information helps us match you with the best gigs.{" "}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SelfieCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => {
          setValue("selfieImage", file, { shouldValidate: true });
          trigger("selfieImage"); // Manually trigger validation after capture
        }}
      />
      <GeneralSkillQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onComplete={handleQuizComplete}
      />
      {/* Completion Modal */}
      <Dialog open={isCompletionModalOpen} onOpenChange={closeCompletionModal}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-white">
          <DialogHeader className="items-center text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Onboarding Complete!
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              Welcome to CashnGo! Your profile is set up. We've assessed your
              initial skill level as **{initialSkillLevel || "Beginner"}**. You
              can now explore gigs and start earning.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={closeCompletionModal}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold"
            >
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Scrollbar Style if not global */}
      <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; border-radius: 3px; } /* slate-800 */
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; } /* slate-600 */
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; } /* slate-500 */
       `}</style>
    </main>
  );
};

export default OnboardingPage;
