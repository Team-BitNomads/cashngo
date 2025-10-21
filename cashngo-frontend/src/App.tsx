// in src/App.tsx

import { Routes, Route, Outlet } from "react-router-dom";

// --- Page Components ---
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage"; // <-- IMPORT THE NEW PAGE
import ProfilePage from "./pages/ProfilePage";
import GigPage from "./pages/GigPage";

// --- Layout Components ---
// import Navbar from './components/Navbar';

const AppLayout = () => (
  <>
    {/* <Navbar />  */}
    <main>
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
<Route path="/gigs" element={<GigPage />} />
      {/* --- Authenticated App Routes --- */}
      <Route path="/dashboard" element={<AppLayout />}>
        
        {/*
          CRITICAL CHANGE:
          The index route now points to our smart DashboardPage router.
          It will decide whether to show the Student or Employer dashboard.
        */}
        <Route index element={<DashboardPage />} />

        {/* Other authenticated routes like the profile page remain the same */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
