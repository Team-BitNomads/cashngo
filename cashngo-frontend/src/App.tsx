import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

// --- Page Components ---
// These are the top-level views for your application.
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GigFeedPage from './pages/GigFeedPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';

// --- Layout Components ---
// This is the shared UI for the authenticated part of your app.
import Navbar from './components/Navbar';

/**
 * The AppLayout component serves as the main frame for your application
 * AFTER a user is logged in. It includes the shared Navbar and a space
 * where the different pages (like Gigs and Profile) will be rendered.
 * 
 * The <Outlet /> component is a placeholder provided by react-router-dom.
 * It dynamically renders the correct child route that matches the current URL.
 */
const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

/**
 * This is the root component of your entire application.
 * It sets up all the URL routes and determines which component to show for each URL.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/*
         * --- PUBLIC ROUTES ---
         * These routes are accessible to everyone. They do NOT render the AppLayout,
         * so they will not have the main application's Navbar.
         */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} /> 

        {/*
         * --- PRIVATE / AUTHENTICATED ROUTES ---
         * These routes are nested under the "/dashboard" path. The parent route
         * uses the <AppLayout /> component. This means any child route defined
         * inside will be rendered within that layout (i.e., inside the <Outlet />).
         */}
        <Route path="/dashboard" element={<AppLayout />}>
          
          {/* The `index` route is the default page for the parent route.
              So, when the user navigates to "/dashboard", this is what they will see. */}
          <Route index element={<GigFeedPage />} />

          {/* This route defines the component for the "/dashboard/profile" URL. */}
          <Route path="profile" element={<ProfilePage />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;