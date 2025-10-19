import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

// --- Our Custom Components & Hooks ---
import { SelfieCaptureModal } from "@/components/SelfieCaptureModal";
import { useAuth } from "@/hooks/useAuth";

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

// --- Icon Imports ---
import {
  Upload,
  GraduationCap,
  User,
  Calendar,
  Home,
  CircleUserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_STEPS = 5;

// The full data type for our form
interface OnboardingData {
  firstName: string;
  lastName: string;
  middleName?: string;
  dob: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  lga: string;
  idType: "NIN" | "DriverLicense" | "IntPassport" | "VoterCard" | "SchoolID";
  idNumber: string;
  idDocument: FileList;
  currentStatus: "student" | "employed" | "unemployed";
  institutionName?: string;
  matriculationNumber?: string;
  courseOfStudy?: string;
  expectedGraduationYear?: string;
  studentIdCard?: FileList;
  selfieImage?: File;
  consentBiometric: boolean;
  termsAccepted: boolean;
}

const formatKey = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

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
    mode: "onChange",
  });

  const formData = watch();

  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingData)[] = [];
    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "firstName",
          "lastName",
          "dob",
          "gender",
          "phoneNumber",
          "streetAddress",
          "city",
          "state",
          "lga",
        ];
        break;
      case 2:
        fieldsToValidate = ["idType", "idNumber", "idDocument"];
        break;
      case 3:
        fieldsToValidate = ["currentStatus"];
        if (watch("currentStatus") === "student")
          fieldsToValidate.push("institutionName", "matriculationNumber");
        break;
      case 4:
        fieldsToValidate = ["consentBiometric", "selfieImage"];
        break;
      case 5:
        fieldsToValidate = ["termsAccepted"];
        break;
    }

    const result = await trigger(fieldsToValidate, { shouldFocus: true });
    if (result) setCurrentStep((prev) => Math.min(prev + 1, MAX_STEPS));
  };

  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data: OnboardingData) => {
    console.log("Final Onboarding Data:", data);
    alert("Onboarding Complete! See console for data.");
    navigate("/dashboard");
  };

  const userProfileImage = user?.name
    ? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}`
    : `https://api.dicebear.com/7.x/pixel-art/svg?seed=default`;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information";
      case 2:
        return "Identification & Address";
      case 3:
        return "Educational & Employment Details";
      case 4:
        return "Biometric & Liveness Check";
      case 5:
        return "Review & Submit";
      default:
        return "";
    }
  };

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/onboarding-bg.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] animate-[shimmer_20s_ease-in-out_infinite] bg-[radial-gradient(circle_farthest-side_at_center,rgba(5,150,105,0.2),transparent_40%)]"></div>
        <div className="absolute -bottom-1/2 -right-1/2 h-[200%] w-[200%] animate-[shimmer_25s_ease-in-out_infinite_reverse] bg-[radial-gradient(circle_farthest-side_at_center,rgba(139,92,246,0.15),transparent_50%)]"></div>
      </div>

      <div className="z-10 w-full max-w-5xl animate-fade-in-up rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[2fr_1fr] backdrop-blur-xl">
        <div className="p-10 space-y-8 text-gray-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Step {currentStep} of {MAX_STEPS}: {getStepTitle()}
              </h2>
              <div className="flex space-x-2">
                {Array.from({ length: MAX_STEPS }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "block h-2 w-8 rounded-full transition-all duration-300",
                      index + 1 <= currentStep ? "bg-green-500" : "bg-slate-700"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div key={currentStep} className="animate-fade-in-up space-y-6">
              {currentStep === 1 && (
                /* Fields from your PRD */ <>
                  <h3 className="text-2xl font-semibold text-gray-100">
                    Tell us about yourself.
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-100">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-400">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-100">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-400">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
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
                        className="pl-10"
                      />
                    </div>
                    {errors.dob && (
                      <p className="text-sm text-red-400">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
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
                      <p className="text-sm text-red-400">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-gray-100">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="080XXXXXXXX"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                      })}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-400">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress" className="text-gray-100">
                      Residential Address
                    </Label>
                    <Input
                      id="streetAddress"
                      {...register("streetAddress", {
                        required: "Street address is required",
                      })}
                    />
                    {errors.streetAddress && (
                      <p className="text-sm text-red-400">
                        {errors.streetAddress.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-100">
                        City
                      </Label>
                      <Input
                        id="city"
                        {...register("city", { required: "City is required" })}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-400">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-gray-100">
                        State
                      </Label>
                      <Input
                        id="state"
                        {...register("state", {
                          required: "State is required",
                        })}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-400">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lga" className="text-gray-100">
                        LGA
                      </Label>
                      <Input
                        id="lga"
                        {...register("lga", { required: "LGA is required" })}
                      />
                      {errors.lga && (
                        <p className="text-sm text-red-400">
                          {errors.lga.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
              {currentStep === 2 && (
                /* Fields from your PRD */ <>
                  <h3 className="text-2xl font-semibold text-gray-100">
                    Help us verify your identity.
                  </h3>
                  <div className="space-y-2">
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
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select ID Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NIN">
                              National ID Card (NIN)
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
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.idType && (
                      <p className="text-sm text-red-400">
                        {errors.idType.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber" className="text-gray-100">
                      ID Number
                    </Label>
                    <Input
                      id="idNumber"
                      {...register("idNumber", {
                        required: "ID number is required",
                      })}
                      className="h-12"
                    />
                    {errors.idNumber && (
                      <p className="text-sm text-red-400">
                        {errors.idNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idDocument" className="text-gray-100">
                      Upload ID Document
                    </Label>
                    <Input
                      id="idDocument"
                      type="file"
                      {...register("idDocument", {
                        required: "ID document is required",
                      })}
                    />
                    {errors.idDocument && (
                      <p className="text-sm text-red-400">
                        {errors.idDocument.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              {currentStep === 3 && (
                /* Fields from your PRD & screenshot inspo */ <>
                  <h3 className="text-2xl font-semibold text-gray-100">
                    Tell us about your background.
                  </h3>
                  <div className="space-y-3 pt-4">
                    <Label className="text-lg font-medium text-white">
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
                          className="space-y-3"
                        >
                          <Label
                            className={cn(
                              "flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer",
                              field.value === "student"
                                ? "border-green-500 bg-green-900/20 ring-1 ring-green-500"
                                : "border-slate-700 bg-slate-800/50"
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
                                : "border-slate-700 bg-slate-800/50"
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
                                : "border-slate-700 bg-slate-800/50"
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
                      <p className="text-sm text-red-400">
                        {errors.currentStatus.message}
                      </p>
                    )}
                  </div>
                  {formData.currentStatus === "student" && (
                    <div className="space-y-4 pt-4 animate-fade-in-up">
                      <Input
                        type="text"
                        placeholder="Matriculation Number"
                        {...register("matriculationNumber", {
                          required: "Matriculation number is required",
                        })}
                        className="h-12 border-slate-700 bg-slate-800/50"
                      />
                      {errors.matriculationNumber && (
                        <p className="text-sm text-red-400">
                          {errors.matriculationNumber.message}
                        </p>
                      )}
                      <Input
                        type="text"
                        placeholder="Institution Name"
                        {...register("institutionName", {
                          required: "Institution name is required",
                        })}
                        className="h-12 border-slate-700 bg-slate-800/50"
                      />
                      {errors.institutionName && (
                        <p className="text-sm text-red-400">
                          {errors.institutionName.message}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
              {currentStep === 4 && (
                /* Fields from your PRD */ <>
                  <h3 className="text-2xl font-semibold text-gray-100">
                    A quick check to ensure you're real.
                  </h3>
                  <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-slate-700 bg-slate-800/50">
                    <div className="w-48 h-48 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-center">
                      {formData.selfieImage ? (
                        <img
                          src={URL.createObjectURL(formData.selfieImage)}
                          alt="Selfie preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <CircleUserRound className="h-24 w-24" />
                      )}
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      Position your face within the circle.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCameraOpen(true)}
                      className="mt-4 px-6 py-2 text-gray-400"
                    >
                      <Upload className="mr-2 h-4 w-4" />{" "}
                      {formData.selfieImage
                        ? "Recapture"
                        : "Capture Live Selfie"}
                    </Button>
                    {errors.selfieImage && (
                      <p className="text-sm text-red-400 mt-2">
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
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="consent"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor="consent"
                            className="text-sm text-gray-400"
                          >
                            I consent to biometric capture for identity
                            verification.
                          </label>
                        </div>
                      )}
                    />
                    {errors.consentBiometric && (
                      <p className="text-sm text-red-400">
                        {errors.consentBiometric.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              {currentStep === 5 && (
                /* Recreation of your inspo */ <>
                  <h3 className="text-2xl font-semibold text-gray-100">
                    Please review your details before submission.
                  </h3>
                  <div className="max-h-96 overflow-y-auto pr-4 space-y-3 custom-scrollbar rounded-lg border border-slate-700 bg-slate-800/50 p-4 font-mono">
                    {Object.entries(getValues()).map(([key, value]) => {
                      if (
                        !value ||
                        (typeof value === "object" &&
                          !value.length &&
                          !(value instanceof File))
                      )
                        return null;
                      return (
                        <div
                          key={key}
                          className="flex justify-between items-start border-b border-slate-700 pb-2 text-sm"
                        >
                          <span className="text-cyan-400">
                            "{formatKey(key)}":
                          </span>
                          <span className="text-green-400 text-right">
                            "
                            {typeof value === "object" && value instanceof File
                              ? value.name
                              : String(value)}
                            "
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-4">
                    <Controller
                      name="termsAccepted"
                      control={control}
                      rules={{
                        validate: (value) =>
                          value === true ||
                          "You must certify your information is accurate.",
                      }}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm text-gray-400"
                          >
                            I certify that all information provided is accurate.
                          </label>
                        </div>
                      )}
                    />
                    {errors.termsAccepted && (
                      <p className="text-sm text-red-400">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-10 pt-6 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-8 py-3 bg-transparent border-slate-600 hover:bg-slate-800 hover:border-slate-500 text-white font-bold"
              >
                Previous
              </Button>
              {currentStep < MAX_STEPS ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-3 bg-green-500 hover:bg-green-600 text-slate-900 font-bold text-base transition-transform hover:scale-105"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="px-10 py-3 bg-green-500 hover:bg-green-600 text-slate-900 font-bold text-base transition-transform hover:scale-105"
                >
                  Submit Onboarding
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-slate-800/30 border-l border-white/10">
          <div className="text-center text-white space-y-6">
            <h3 className="text-2xl font-bold text-green-400 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 mr-2" /> CashnGo
            </h3>
            <div className="mt-6 flex flex-col items-center">
              <img
                src={userProfileImage}
                alt="User Profile"
                className="h-28 w-28 rounded-full border-2 border-green-500 shadow-lg"
              />
            </div>
            <div className="mt-8 text-left space-y-4 p-6 bg-slate-800/60 rounded-xl border border-slate-700 w-full max-w-xs">
              <div className="flex items-center text-gray-300 text-sm">
                <User className="h-4 w-4 mr-3 text-green-400 flex-shrink-0" />
                <span className="flex-grow truncate">
                  {formData.firstName || "Full Name"} {formData.lastName}
                </span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <GraduationCap className="h-4 w-4 mr-3 text-green-400 flex-shrink-0" />
                <span className="flex-grow truncate">
                  {formData.matriculationNumber || "Matriculation No."}
                </span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Home className="h-4 w-4 mr-3 text-green-400 flex-shrink-0" />
                <span className="flex-grow truncate">
                  {formData.institutionName || "Institution"}
                </span>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-400 max-w-xs">
              Almost there! Your profile is taking shape.
            </p>
          </div>
        </div>
      </div>

      <SelfieCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => {
          setValue("selfieImage", file, { shouldValidate: true });
        }}
      />
    </main>
  );
};

export default OnboardingPage;
