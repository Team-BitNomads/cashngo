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
import PostGigPage from "./pages/PostGigPage"
import {WalletPage} from "./pages/WalletPage";
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
      <Route path="/wallet" element={<WalletPage />} />
<Route path="/gigs" element={<GigPage />} />
      {/* --- Authenticated App Routes --- */}
      <Route path="/dashboard" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="postgig" element={<PostGigPage />} />
      </Route>
    </Routes>
  );
}

export default App;
