import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Our Custom Hooks, Components & API ---
import SignupBackground from '@/components/LoginBackground';
import { useAuth } from '@/hooks/useAuth'; // Using the correct path
import { signupUser } from '@/services/api';

// --- shadcn/ui Component Imports ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// --- Icon Imports ---
import { Loader2, CircleCheck, CircleX } from 'lucide-react';

// --- Type for our feedback modal state ---
type FeedbackState = {
  type: 'success' | 'error';
  message: string;
} | null;

const SignupPage: React.FC = () => {
    // Form State
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState<'worker' | 'employer'>('worker');
    const [status, setStatus] = useState<'undergraduate' | 'graduate'>();
    const [jobDescription, setJobDescription] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState>(null);
    
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setFeedback(null);
        setIsLoading(true);

        if (password !== confirmPassword) {
            setFeedback({ type: 'error', message: 'Passwords do not match. Please try again.' });
            setIsLoading(false);
            return;
        }

        if (role === 'worker' && !status) {
            setFeedback({ type: 'error', message: 'Please select your current status as a worker.' });
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                fullName, username, email, phoneNumber, role,
                status: role === 'worker' ? status : undefined,
                jobDescription: role === 'employer' ? jobDescription : undefined,
                location, password,
            };

            const { token, user } = await signupUser(payload);
            setFeedback({ type: 'success', message: 'Account Created! Redirecting to onboarding...' });
            
            setTimeout(() => {
                login(token, user); 
            }, 1500);

        } catch (err) {
            const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred during signup.';
            setFeedback({ type: 'error', message: errorMessage });
            setIsLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 p-4 md:p-8">
            <div className="z-10 w-full max-w-6xl animate-fade-in-up rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                
                {/* --- LEFT COLUMN (FORM) --- */}
                <div className="p-10 overflow-y-auto max-h-[90vh] custom-scrollbar">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-green-500">CashnGo</h1>
                        <p className="mt-3 text-base text-gray-300">Create your account to get started.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2"><Label htmlFor="fullName" className="text-sm font-medium text-gray-100">Full Name</Label><Input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="border-slate-700 bg-slate-800/50 text-gray-300" /></div>
                            <div className="space-y-2"><Label htmlFor="username" className="text-sm font-medium text-gray-100">Username</Label><Input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} required className="border-slate-700 bg-slate-800/50 text-gray-300" /></div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div className="space-y-2"><Label htmlFor="email" className="text-sm font-medium text-gray-100">Email</Label><Input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="border-slate-700 bg-slate-800/50 text-gray-300" /></div>
                           <div className="space-y-2"><Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-100">Phone</Label><Input type="tel" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required className="border-slate-700 bg-slate-800/50 text-gray-300" /></div>
                        </div>

                        <div className="space-y-2"><Label htmlFor="location" className="text-sm font-medium text-gray-100">Location</Label><Input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required placeholder="City, Country" className="border-slate-700 bg-slate-800/50 text-gray-300" /></div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-100">I am a...</Label>
                            <Select onValueChange={(value: 'worker' | 'employer') => setRole(value)} defaultValue="worker">
                                <SelectTrigger className="border-slate-700 bg-slate-800/50 text-gray-300"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="worker">Worker</SelectItem><SelectItem value="employer">Employer</SelectItem></SelectContent>
                            </Select>
                        </div>

                        {/* Conditional Fields */}
                        {role === 'worker' && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-100">Current Status</Label>
                                <Select onValueChange={(value: 'undergraduate' | 'graduate') => setStatus(value)}>
                                    <SelectTrigger className="border-slate-700 bg-slate-800/50 text-gray-300"><SelectValue placeholder="Select your status" /></SelectTrigger>
                                    <SelectContent><SelectItem value="undergraduate">Undergraduate</SelectItem><SelectItem value="graduate">Graduate</SelectItem></SelectContent>
                                </Select>
                            </div>
                        )}
                        {role === 'employer' && (
                            <div className="space-y-2">
                                <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-100">What kind of worker are you looking for?</Label>
                                <Textarea id="jobDescription" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="e.g., 'A graphic designer for a short-term logo project...'" className="border-slate-700 bg-slate-800/50 text-gray-300" />
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div className="space-y-2"><Label htmlFor="password" className="text-sm font-medium text-gray-100">Password</Label><Input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="border-slate-700 bg-slate-800/50 text-gray-300" /></div>
                           <div className="space-y-2"><Label htmlFor="confirm-password" className="text-sm font-medium text-gray-100">Confirm</Label><Input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="border-slate-700 bg-slate-800/50 text-gray-300" /></div>
                        </div>
                        
                        <Button type="submit" className="w-full text-base py-6 mt-4 bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-300 hover:scale-105" disabled={isLoading}>
                           {isLoading ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : 'Create Account'}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-400 pt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-green-500 hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>

                {/* --- RIGHT COLUMN (WELCOME & ANIMATION) --- */}
                <div className="relative hidden md:block bg-slate-950">
                    <SignupBackground />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-slate-900 to-transparent">
                        <h2 className="text-5xl font-bold text-white">Begin Your Journey.</h2>
                        <p className="mt-4 text-gray-300 max-w-sm">
                           Unlock your earning potential and say goodbye to broke days. Welcome to the future of work.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Feedback Modal --- */}
            <Dialog open={!!feedback} onOpenChange={() => setFeedback(null)}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            {feedback?.type === 'success' ? <CircleCheck className="text-green-500" /> : <CircleX className="text-red-500" />}
                            <span>{feedback?.type === 'success' ? 'Success' : 'Error'}</span>
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-slate-400">{feedback?.message}</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </main>
    );
};

export default SignupPage;