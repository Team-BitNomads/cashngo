import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge"; 
import { ArrowLeft, PlayCircle, CheckCircle, BookOpen } from "lucide-react";
import { mockCourses } from "@/data/mockCourses";
import { cn } from "@/lib/utils";

// Find course function (can be moved to a service/util later)
const findCourseById = (id: string) => mockCourses.find(course => course.id === id);

export function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<typeof mockCourses[0] | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    if (courseId) {
      const foundCourse = findCourseById(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        // Handle course not found, maybe navigate back or show error
        console.error("Course not found!");
        navigate("/learn");
      }
    }
  }, [courseId, navigate]);

  if (!course) {
    // Optional: Add a loading state
    return (
      <DashboardLayout title="Loading Course...">
        <div className="text-center text-slate-400">Loading...</div>
      </DashboardLayout>
    );
  }

  const currentLesson = course.curriculum[currentLessonIndex];
  const totalLessons = course.curriculum.length;

  return (
    <DashboardLayout title={course.title}>
      <AnimatedSection>
        <Button
          variant="outline"
          className="mb-6 border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={() => navigate("/learn")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (Video + Text) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mock Video Player */}
            <div className="aspect-video bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden">
              <img
                src={course.coverImageUrl.replace('400', '720')} // Try higher res placeholder
                alt={`${course.title} video placeholder`}
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30"
                onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://placehold.co/1280x720/334155/FFF?text=Error`; }}
              />
               <div className="z-10 text-center">
                    <PlayCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4 opacity-80" />
                    <p className="text-slate-300 font-semibold">Video Player Placeholder</p>
                    <p className="text-xs text-slate-500">Lesson {currentLessonIndex + 1}: {currentLesson}</p>
               </div>
            </div>

            {/* Mock Lesson Content */}
            <Card className="bg-slate-900/60 border border-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Lesson {currentLessonIndex + 1}: {currentLesson}</CardTitle>
                <div className="text-sm text-slate-400 pt-2">Instructor: {course.instructor}</div>
              </CardHeader>
              <CardContent className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-300 space-y-4">
                <p>
                  Welcome to this lesson on **{currentLesson}**. In this section, we will cover the fundamental concepts related to the topic.
                  Understanding {currentLesson.toLowerCase()} is crucial for mastering {course.primarySkill}.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Key concept one related to {currentLesson}.</li>
                    <li>Another important point to remember.</li>
                    <li>Practical application example.</li>
                </ul>
                <p>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Make sure to practice the examples provided.
                </p>
                 {/* Mock Code Block */}
                 {course.tags.includes("Web Development") && (
                     <pre className="bg-slate-800/70 p-4 rounded-md overflow-x-auto text-xs">
                        <code>
{`// Example code snippet
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('CashnGo User');`}
                        </code>
                    </pre>
                 )}

              </CardContent>
            </Card>

             {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => setCurrentLessonIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentLessonIndex === 0}
                >
                  Previous Lesson
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                  onClick={() => setCurrentLessonIndex(prev => Math.min(totalLessons - 1, prev + 1))}
                  disabled={currentLessonIndex === totalLessons - 1}
                >
                  Next Lesson
                </Button>
              </div>

          </div>

          {/* Sidebar (Lesson List) */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/60 border border-slate-800 sticky top-24"> {/* Added sticky top */}
              <CardHeader>
                <CardTitle className="text-xl text-white">Course Curriculum</CardTitle>
                <CardDescription className="text-slate-400">{totalLessons} Lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {course.curriculum.map((lesson, index) => (
                    <li key={index}>
                      <button
                        className={cn(
                          "w-full text-left p-3 rounded-md transition-colors flex items-center justify-between text-sm",
                          index === currentLessonIndex
                            ? "bg-emerald-500/20 text-emerald-300 font-medium"
                            : "text-slate-300 hover:bg-slate-800/50"
                        )}
                        onClick={() => setCurrentLessonIndex(index)}
                      >
                         <span className="flex items-center gap-2">
                            {/* Icon based on completion status (mocked here) */}
                            {index < currentLessonIndex ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : index === currentLessonIndex ? <PlayCircle className="h-4 w-4 text-emerald-300"/> : <BookOpen className="h-4 w-4 text-slate-500"/> }
                            Lesson {index + 1}: {lesson}
                         </span>
                         {/* Optional: Add duration per lesson if available */}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>
    </DashboardLayout>
  );
}

// You might need to export mockCourses from LearnSkillsPage if it's not already
// Or redefine/import it here if kept separate. For simplicity, assuming imported.
