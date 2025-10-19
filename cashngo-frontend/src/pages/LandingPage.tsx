import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// --- Our Custom Components ---
import HeroBackground from "@/components/HeroBackground";
import SectionBackground from "@/components/SectionBackground";
import AnimatedSection from "@/components/AnimatedSection";

// --- shadcn/ui Component Imports ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Icon Imports ---
import {
  ArrowRight,
  Zap,
  BrainCircuit,
  ShieldCheck,
  CheckCircle,
  Users,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the navbar change after scrolling 50px
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses = {
    base: "fixed top-4 left-0 right-0 z-50 transition-all duration-300",
    transparent: "bg-black/20 backdrop-blur-lg border border-white/10",
    solid: "bg-white/80 backdrop-blur-lg border border-slate-200 shadow-md",
  };

  const navLinkClasses = {
    transparent: "text-slate-300 hover:text-white",
    solid: "text-slate-600 hover:text-slate-900",
  };

  const logoClasses = {
    transparent: "text-white",
    solid: "text-slate-900",
  };

  return (
    <div className="font-sans">
      <header className={`${navClasses.base}`}>
        <div className="container mx-auto px-4">
          <nav
            className={`flex justify-between items-center rounded-2xl px-6 py-3 transition-colors duration-300 ${
              isScrolled ? navClasses.solid : navClasses.transparent
            }`}
          >
            <Link
              to="/"
              className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? logoClasses.solid : logoClasses.transparent
              }`}
            >
              CashnGo
            </Link>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a
                href="#how-it-works"
                className={`transition-colors duration-300 ${
                  isScrolled ? navLinkClasses.solid : navLinkClasses.transparent
                }`}
              >
                How It Works
              </a>
              <a
                href="#features"
                className={`transition-colors duration-300 ${
                  isScrolled ? navLinkClasses.solid : navLinkClasses.transparent
                }`}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className={`transition-colors duration-300 ${
                  isScrolled ? navLinkClasses.solid : navLinkClasses.transparent
                }`}
              >
                Testimonials
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                asChild
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "border-slate-400 text-slate-900 hover:bg-slate-200"
                    : "bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                asChild
                className="bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-bold"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative w-full h-screen flex flex-col justify-center items-center">
        <HeroBackground />
        <div className="container mx-auto px-6 text-center z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto text-white">
              Turn Your Skills Into{" "}
              <span className="text-cyan-400">Instant Cash</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay="delay-200">
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
              CashnGo is your secure gateway to instant-pay gigs. Complete
              tasks, learn new skills with our AI, and say goodbye to broke
              days—forever.
            </p>
          </AnimatedSection>
          <AnimatedSection delay="delay-300">
            <Button
              size="lg"
              className="mt-8 bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-bold rounded-lg"
              asChild
            >
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </main>

      <div className="relative isolate">
        {" "}
        {/* This wrapper contains the shared 3D background for content */}
        <SectionBackground />
        <section
          id="how-it-works"
          className="bg-white/80 backdrop-blur-md py-24 sm:py-32"
        >
          <div className="container mx-auto px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
                Simplify your financial journey. Find work, level up your
                skills, and get paid instantly—all in one place.
              </p>
            </AnimatedSection>
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <AnimatedSection>
                <Card className="text-left shadow-lg bg-white/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-cyan-500" /> Find a Gig
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500">
                      Automatically browse gigs that match your verified skills.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
              <AnimatedSection delay="delay-150">
                <Card className="text-left shadow-lg bg-white/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BrainCircuit className="mr-2 h-5 w-5 text-purple-500" />{" "}
                      Unlock Potential
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500">
                      Pass quick AI-generated quizzes to verify new skills and
                      unlock access to higher-paying tasks.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
              <AnimatedSection delay="delay-300">
                <Card className="text-left shadow-lg bg-white/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShieldCheck className="mr-2 h-5 w-5 text-pink-500" /> Get
                      Paid Instantly
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500">
                      Once your gig is approved, funds are released to your
                      wallet in minutes.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="py-24 sm:py-32 bg-slate-50/80 backdrop-blur-md"
        >
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                alt="Students collaborating"
                className="rounded-2xl shadow-2xl"
              />
            </AnimatedSection>
            <AnimatedSection delay="delay-150">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Everything you need to succeed in the gig economy
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                We built CashnGo to be more than just a marketplace; it's a
                career accelerator.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Instant Pay Escrow</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">AI Skill-Synth</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Verified Marketplace</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Skill-Based Ratings</span>
                  </div>
                </li>
              </ul>
            </AnimatedSection>
          </div>
        </section>
        <section
          id="testimonials"
          className="bg-white/80 backdrop-blur-md py-24 sm:py-32"
        >
          <div className="container mx-auto px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Loved by Students and Businesses
              </h2>
              <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what people are saying.
              </p>
            </AnimatedSection>
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <AnimatedSection>
                <Card className="text-left p-6 bg-slate-50/70">
                  <CardContent className="p-0">
                    <blockquote className="text-lg italic text-slate-900 mb-4">
                      "CashnGo ended my 'broke days'. The Skill-Synth quiz
                      unlocked a task that paid double!"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-200 border flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Bisi A.</p>
                        <p className="text-sm text-slate-500">
                          Computer Science Student
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              <AnimatedSection delay="delay-150">
                <Card className="text-left p-6 bg-slate-50/70">
                  <CardContent className="p-0">
                    <blockquote className="text-lg italic text-slate-900 mb-4">
                      "Finding reliable, verified students for short-term tasks
                      was a nightmare. With CashnGo, I posted a task and had a
                      skilled student complete it within two hours."
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-200 border flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Mr. Tunde Okoro</p>
                        <p className="text-sm text-slate-500">
                          SME Owner, Lagos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>
        <section className="py-24 sm:py-32 bg-slate-50/80 backdrop-blur-md">
          <AnimatedSection>
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight max-w-3xl mx-auto">
                Ready to End 'Broke Days' for Good?
              </h2>
              <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                Join the platform that invests in your skills and your wallet.
                Your first gig is just minutes away.
              </p>
              <Button
                size="lg"
                className="mt-8 bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-bold rounded-lg"
                asChild
              >
                <Link to="/signup">Sign Up Free - It's Instant</Link>
              </Button>
            </div>
          </AnimatedSection>
        </section>
      </div>

      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">CashnGo</h3>
            <p className="text-sm">Zero Broke Days.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">For Students</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-cyan-400 transition-colors">
                <Link to="/dashboard">Find Gigs</Link>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#features">Skill-Synth</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#">About Us</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 py-6 border-t border-slate-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CashnGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
