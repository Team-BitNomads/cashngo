/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Clock,
  BarChart3,
  User,
  CheckCircle,
  X,
  BookOpen,
  Tag,
  Info,
  DollarSign,
  AlertCircle
} from "lucide-react";
import useLocalStorage  from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { mockCourses } from "@/data/mockCourses";
import type { Course } from "@/types/course";

// --- Helper Course Card Component ---
const CourseCard: React.FC<{
  course: Course;
  isEnrolledInThis: boolean;
  isEnrolledInAnother: boolean;
  onCardClick: (course: Course) => void;
  onEnrollClick: (course: Course) => void;
}> = ({ course, isEnrolledInThis, isEnrolledInAnother, onCardClick, onEnrollClick }) => {
  const navigate = useNavigate();
  const isDisabled = isEnrolledInAnother;

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button
    if (!isDisabled) {
      if (isEnrolledInThis) {
        console.log("Navigating to course player for:", course.id);
        navigate(`/learn/player/${course.id}`); // Navigate to the new course player route
      } else {
        // Open details sidebar to enroll (or handle direct enrollment if preferred)
        onEnrollClick(course); // Keep this to open the sidebar for enrollment confirmation
      }
    }
  };

  return (
    <Card
      key={course.id}
      className={cn(
        "bg-slate-900/60 border border-slate-800 backdrop-blur-sm transition-all duration-300 flex flex-col overflow-hidden group",
        isDisabled ? "opacity-60 cursor-not-allowed" : "hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5 cursor-pointer"
      )}
      onClick={() => !isDisabled && onCardClick(course)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.coverImageUrl}
          alt={`${course.title} cover`}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/600x400/334155/FFF?text=Image+Error`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <Badge className="absolute top-3 right-3 bg-green-600/80 text-white border-none text-xs">{course.level}</Badge>
      </div>

      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-base font-bold text-white leading-snug line-clamp-2 mb-1">{course.title}</CardTitle>
        <CardDescription className="text-xs text-slate-400 flex items-center gap-1.5">
          <User className="h-3 w-3" /> {course.instructor}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {course.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs font-normal bg-slate-800/50 border-slate-700 text-slate-300">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4 px-4 flex items-center justify-between">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{course.duration}</span>
        </div>
        <Button
          size="sm"
          variant={isEnrolledInThis ? "outline" : "default"}
          className={cn(
            "text-xs h-8",
            isDisabled
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : isEnrolledInThis
              ? "border-green-500 text-green-400 hover:bg-green-500/10 hover:text-green-300"
              : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
          )}
          onClick={handleButtonClick}
        >
          {isEnrolledInAnother ? "Enrolled" : isEnrolledInThis ? "Continue" : "Enroll"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export function LearnSkillsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useLocalStorage<string | null>("cashngo_currentCourseId", null);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDetailSidebarOpen(true);
  };

  const closeDetailSidebar = () => {
    setIsDetailSidebarOpen(false);
    setTimeout(() => setSelectedCourse(null), 300);
  };

  const handleEnroll = (courseId: string) => {
    console.log("Enrolling in course:", courseId);
    setCurrentCourseId(courseId);
    closeDetailSidebar();
  };

  return (
    <DashboardLayout
      title="Learn Skills"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <AnimatedSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-green-400" />
            Skill Up, Earn More
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Invest in yourself by learning in-demand skills. Enroll in a course (one at a time) to gain valuable knowledge, earn badges, and unlock higher-paying gigs on CashnGo.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {mockCourses.map((course) => {
            const isEnrolledInThis = currentCourseId === course.id;
            const isEnrolledInAnother = currentCourseId !== null && currentCourseId !== course.id;

            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolledInThis={isEnrolledInThis}
                isEnrolledInAnother={isEnrolledInAnother}
                onCardClick={handleCourseClick}
                onEnrollClick={handleCourseClick}
              />
            )
          })}
        </div>
      </AnimatedSection>

      {/* Course Detail Sidebar */}
      {selectedCourse && (
        <>
          {/* Overlay */}
          <div
            className={cn(
              "fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ease-in-out lg:hidden",
              isDetailSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={closeDetailSidebar}
          />
          {/* Sidebar Content */}
          <div
            className={cn(
              "fixed top-0 right-0 h-screen w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col",
              isDetailSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10">
              <h2 className="text-lg font-semibold text-white">Course Details</h2>
              <Button variant="ghost" size="icon" onClick={closeDetailSidebar} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-video w-full">
              <img
                src={selectedCourse.coverImageUrl}
                alt={`${selectedCourse.title} cover`}
                className="object-cover w-full h-full"
                onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://placehold.co/600x400/334155/FFF?text=Error`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>

            {/* Course Info */}
            <div className="p-6 space-y-5 flex-grow">
              <h3 className="text-2xl font-bold text-white">{selectedCourse.title}</h3>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {selectedCourse.instructor}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {selectedCourse.duration}</span>
                <span className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4" /> {selectedCourse.level}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedCourse.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs font-normal bg-slate-800/50 border-slate-700 text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-cyan-400" /> Description
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedCourse.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-400" /> What You'll Learn
                </h4>
                <ul className="space-y-2">
                  {selectedCourse.curriculum.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-cyan-400" /> Primary Skill Badge
                </h4>
                <Badge variant="default" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-none">
                  <GraduationCap className="h-4 w-4 mr-1.5" />
                  {selectedCourse.primarySkill}
                </Badge>
              </div>

              {/* Pricing / Enrollment Info */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  Enrollment & Payment
                </h4>
                <p className="text-sm text-slate-300 mb-3">
                  Course Price: <span className="font-bold text-lg text-green-400">₦{selectedCourse.price.toLocaleString()}</span>
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-300 mb-1">
                        Enroll Now, Pay Later!
                      </p>
                      <p className="text-xs text-slate-400">
                        Enroll in this course for free. The cost will be deducted in small installments from your future gig earnings on CashnGo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Action Button */}
            <div className="p-4 border-t border-slate-700 sticky bottom-0 bg-slate-900/80 backdrop-blur-sm z-10">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold"
                onClick={() => handleEnroll(selectedCourse.id)}
                disabled={currentCourseId !== null && currentCourseId !== selectedCourse.id}
              >
                {currentCourseId === selectedCourse.id
                  ? (<><BookOpen className="h-5 w-5 mr-2" /> Continue Course</>)
                  : currentCourseId !== null
                  ? (<>Already Enrolled in a Course</>)
                  : (<><GraduationCap className="h-5 w-5 mr-2" /> Start Course (Pay Later)</>)
                }
              </Button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}