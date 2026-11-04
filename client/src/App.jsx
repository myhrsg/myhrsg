import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

export const ConfigContext = createContext();
import { ArrowRight } from "lucide-react";

// --- Components ---            //  
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { MentorCards } from "./components/MentorCards.jsx";
import DomeGallery from "./components/DomeGallery.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// --- Features ---
import { EventsList } from "./features/events/EventsList.jsx";
import { HRQuiz } from "./features/quiz/HRQuiz.jsx";
import { AdminDashboard } from "./features/admin/Dashboard.jsx";
import { api } from "./services/api.js";

// --- Pages ---
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Partners from "./pages/Partners.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import HRCertifications from "./pages/HRCertifications.jsx";
import Contact from "./pages/Contact.jsx";
import Membership from "./pages/Membership.jsx";
import Waitlist from "./pages/Waitlist.jsx";
import { CompleteProfile } from "./pages/CompleteProfile.jsx";
import { VerifyOTP } from "./pages/VerifyOTP.jsx";
import Articles from "./pages/Articles.jsx";
import Blog from "./pages/Blog.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";

// --- Waitlist Gate: redirects pending members away from protected routes ---
// --- Also forces incomplete profiles to /complete-profile ---
const WaitlistGate = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) return;

    try {
      const user = JSON.parse(stored);
      const isProfileComplete = user.isProfileComplete;

      // Pages that should never be redirected away from
      const exemptPaths = ["/login", "/verify-otp", "/complete-profile", "/waitlist", "/privacy-policy"];
      const isExempt = exemptPaths.some(p => location.pathname.startsWith(p));
      if (isExempt) return;

      // If profile is NOT complete, redirect to complete-profile
      if (!isProfileComplete) {
        navigate("/complete-profile", { replace: true });
        return;
      }

      // Protected routes that pending members cannot access
      const protectedPaths = ["/profile", "/admin", "/quiz"];
      const isProtected = protectedPaths.some(p => location.pathname.startsWith(p));

      if (user.status === "pending" && isProfileComplete && isProtected) {
        navigate("/waitlist", { replace: true });
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, [location.pathname, navigate]);

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isWaitlistPath = location.pathname === "/waitlist";

  const [isQuizEnabled, setIsQuizEnabled] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await api.getConfig("isQuizEnabled");
        // If config exists and has a value, use it, else default to true
        if (data && data.value !== undefined) {
          setIsQuizEnabled(data.value);
        }
      } catch (error) {
        // Fallback to true if config not found
        setIsQuizEnabled(true);
      }
    };
    fetchConfig();
  }, []);

  // Waitlist page renders without Navbar/Footer for a clean isolated experience
  if (isWaitlistPath) {
    return (
      <WaitlistGate>
        <Routes>
          <Route path="/waitlist" element={<Waitlist />} />
        </Routes>
      </WaitlistGate>
    );
  }

  return (
    <ConfigContext.Provider value={{ isQuizEnabled, setIsQuizEnabled }}>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <WaitlistGate>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/hr-certifications" element={<HRCertifications />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              {isQuizEnabled && <Route path="/quiz" element={<HRQuiz />} />}
              <Route 
                path="/admin" 
                element={
                  localStorage.getItem("token") ? (
                    JSON.parse(localStorage.getItem("user"))?.role?.toLowerCase() === "admin" ? (
                      <AdminDashboard />
                    ) : (
                      <Home />
                    )
                  ) : (
                    <Login />
                  )
                } 
              />
            </Routes>
          </WaitlistGate>
        </main>
        <Footer />
      </div>
    </ConfigContext.Provider>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
