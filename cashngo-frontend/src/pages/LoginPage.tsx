import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Our Custom Hooks, Components & API ---
import AuroraBackground from '@/components/LoginBackground';
import { useAuth } from '@/hooks/useAuth';
import { loginUser } from '@/services/api';

// --- shadcn/ui Component Imports ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// --- Icon Imports ---
import { User, Lock, Loader2, CircleCheck, CircleX } from 'lucide-react';

// --- Type for our feedback modal state ---
type FeedbackState = {
  type: 'success' | 'error';
  message: string;
} | null;

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState>(null);
    
    const { login } = useAuth();
    // const navigate = useNavigate(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            const { token, user } = await loginUser(username, password);
            setFeedback({ type: 'success', message: 'Login Successful! Redirecting...' });
            
            // Wait a moment so the user can see the success message before redirecting
            setTimeout(() => {
                login(token, user); 
                // The useAuth hook will handle navigation to /onboarding or /dashboard
            }, 1000);

        } catch (err) {
            const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred.';
            setFeedback({ type: 'error', message: errorMessage });
            setIsLoading(false);
        }
    };

    return (
        <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-950 p-4 md:p-8">
            {/* <AuroraBackground />  */}

            {/* The main login card */}
            <div className="z-10 w-full max-w-4xl animate-fade-in-up rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                
                {/* --- LEFT COLUMN (FORM) --- */}
                <div className="p-8 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-green-400">CashnGo</h1>
                        <p className="mt-2 text-sm text-gray-300">Log in to your account.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="username" className="text-gray-300">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_username" required className="pl-10 border-slate-700 bg-slate-800/50 text-gray-200 focus:ring-green-500" />
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="pl-10 border-slate-700 bg-slate-800/50 text-gray-200 focus:ring-green-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={() => setRememberMe(!rememberMe)} />
                                <Label htmlFor="remember-me" className="text-sm text-gray-400 select-none cursor-pointer">Remember me</Label>
                            </div>
                            <a href="#" className="text-xs font-medium text-green-400 hover:underline">Forgot Password?</a>
                        </div>
                        
                        <Button type="submit" className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white font-bold transition-transform hover:scale-105" disabled={isLoading}>
                           {isLoading ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : 'Login'}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-green-400 hover:underline">Sign Up</Link>
                    </div>
                </div>

                {/* --- RIGHT COLUMN (WELCOME & ANIMATION) --- */}
                <div className="relative hidden md:block bg-black/30">
                    <AuroraBackground />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-slate-900/50 to-transparent">
                        <h2 className="text-4xl font-bold text-white">Welcome.</h2>
                        <p className="mt-3 text-gray-300 max-w-sm">Your financial future, reimagined. Secure, fast, and reliable.</p>
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

export default LoginPage;