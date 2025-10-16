import React from "react";
import { Link } from "react-router-dom";

// A simple Icon component for the features section
const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-green-100 text-green-600 rounded-lg h-12 w-12 flex items-center justify-center text-2xl mb-4">
    {children}
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      {/* --- Navbar --- */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center sticky top-0 bg-gray-50/80 backdrop-blur-md z-10">
        <div className="text-2xl font-bold text-green-600">CashnGo</div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a
            href="#features"
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            Testimonials
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/login"
            className="text-sm font-medium text-gray-600 hover:text-green-600"
          >
            Log In
          </Link>
          <Link
            to="/dashboard/signup"
            className="px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="container mx-auto px-6 pt-24 pb-24 text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter max-w-4xl">
            From Zero Balance to{" "}
            <span className="text-green-600">Paid in Minutes.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl">
            CashnGo connects you with instant-pay gigs and uses AI to teach you
            the skills needed for higher-paying work. Stop waiting, start
            earning.
          </p>
          <Link
            to="/dashboard/signup"
            className="mt-8 px-8 py-4 text-lg font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
          >
            Get Started For Free
          </Link>
        </div>
      </main>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="container mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:space-x-8 max-w-5xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold text-brand-purple">1</div>
            <div>
              <h3 className="font-bold">Find a Gig</h3>
              <p className="text-sm text-gray-500">Browse available tasks.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold text-brand-yellow">2</div>
            <div>
              <h3 className="font-bold">Unlock a Skill</h3>
              <p className="text-sm text-gray-500">
                Pass an AI quiz to level up.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold text-brand-orange">3</div>
            <div>
              <h3 className="font-bold">Get Paid Instantly</h3>
              <p className="text-sm text-gray-500">Funds are in your wallet.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <img
            src="/workflow-cards.png"
            alt="Workflow cards"
            className="max-w-4xl w-full"
          />
        </div>
      </section>

      {/* --- Detailed Features Section --- */}
      <section id="features" className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight">
              The CashnGo Difference
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We're more than a gig board. We're a platform designed for your
              financial stability and career growth.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <FeatureIcon>⚡️</FeatureIcon>
              <h3 className="text-xl font-bold mb-2">Instant Pay Escrow</h3>
              <p className="text-gray-600">
                Employer funds are secured upfront. The moment your task is
                approved, the cash is released to your wallet. No more chasing
                payments.
              </p>
            </div>
            <div className="text-center">
              <FeatureIcon>🧠</FeatureIcon>
              <h3 className="text-xl font-bold mb-2">AI Skill-Synth</h3>
              <p className="text-gray-600">
                Our AI identifies your skill gaps for high-paying gigs and
                instantly trains you with micro-quizzes, unlocking your earning
                potential.
              </p>
            </div>
            <div className="text-center">
              <FeatureIcon>🛡️</FeatureIcon>
              <h3 className="text-xl font-bold mb-2">Verified & Secure</h3>
              <p className="text-gray-600">
                With mandatory ID verification for everyone, you can engage in
                tasks with the confidence that you're in a safe, scam-free
                environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section id="testimonials" className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Loved by Students and Businesses
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md border">
              <blockquote className="text-gray-600 italic">
                "CashnGo ended my 'broke days'. I paid for my data subscription
                and lunch this week with two small gigs. The Skill-Synth quiz
                unlocked a task that paid double!"
              </blockquote>
              <div className="mt-4 flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">Bisi A.</p>
                  <p className="text-sm text-gray-500">
                    Computer Science Student
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border">
              <blockquote className="text-gray-600 italic">
                "Finding reliable, verified students for short-term tasks was a
                nightmare. With CashnGo, I posted a task and had a skilled
                student complete it within two hours. The quality was
                excellent."
              </blockquote>
              <div className="mt-4 flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">Mr. Tunde Okoro</p>
                  <p className="text-sm text-gray-500">SME Owner, Lagos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Ready to End 'Broke Days' for Good?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join the platform that invests in your skills and your wallet. Your
            first gig is just minutes away.
          </p>
          <Link
            to="/dashboard/signup"
            className="mt-8 inline-block px-8 py-4 text-lg font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">CashnGo</h3>
            <p className="text-sm">Zero Broke Days.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">For Students</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Find Gigs
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-white">
                  Skill-Synth
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Post a Gig
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Employer FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 py-6 border-t border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CashnGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
