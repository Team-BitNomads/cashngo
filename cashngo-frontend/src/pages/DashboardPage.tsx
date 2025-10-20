/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- Our Custom Hooks & Components ---
import { useAuth } from '@/hooks/useAuth';
import StudentDashboard from '@/pages/StudentDashboard';
import EmployerDashboard from '@/pages/EmployerDashboard';

// --- Icon Imports ---
import { Loader2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // 1. Handle the initial loading state while the auth context is being populated.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 text-green-400 animate-spin" />
      </div>
    );
  }

  // 2. This is a safeguard. If loading is done and there's still no user, redirect to login.
  // This protects the dashboard route.
  if (!user) {
    // Using useEffect to handle side-effects like navigation during render
    React.useEffect(() => {
      navigate('/login');
    }, [navigate]);
    return null; // Render nothing while redirecting
  }

  // 3. The core logic: Check the user's role and render the correct dashboard.
  // We are using the 'major' field as a stand-in for 'role' as per our setup.
  if (user.major === 'Employer') {
    return <EmployerDashboard />;
  } else {
    return <StudentDashboard />;
  }
};

export default DashboardPage;