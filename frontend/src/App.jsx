import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import { onAuthStateChangedListener } from './utils/auth'; // Import auth state change listener
// import SideDrawer from './components/SideDrawer';
import LegalAdvice from './pages/LegalAdvice';
import PdfChat from './components/PdfChat';
import Header from './components/Header';
// import SpeechTranslator from './pages/SpeechTranslator';
import LegalNews from './pages/LegalNews';
import CaseStudies from './pages/CaseStudies';
import FAQ from './pages/FAQ';
import LandingPage from './pages/LandingPage';
// import Translator from './Translator';
import LawyersLandingPage from './pages/Lawyers_Directory/LawyersLandingPage';
import LawyerDetailsPage from './pages/Lawyers_Directory/LawyerDetailsPage';
// import Summarizer from './pages/Summarizer';
// import UserForm from './pages/UserForm';
import LawyersForm from './pages/Lawyers_Directory/LawyersForm';
import SignUp from './pages/Login_System/SignUp';
import Login from './pages/Login_System/Login';
// import NotFound from './pages/NotFound';

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
    });
    return () => unsubscribe(); // Unsubscribe on component unmount
  }, []);

  return (
    <Router>
      <Header setHeaderHeight={setHeaderHeight} user={user} />
      <div style={{ marginTop: headerHeight + 'px' }}>
        <Routes>
          {/* Public Routes */}
          {!user ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              {/* Redirect all other routes to the landing page if not logged in */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              {/* Private Routes (only accessible when logged in) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/legal-advice" element={<LegalAdvice />} />
              <Route path="/legal-chat" element={<PdfChat />} />
              <Route path="/legal-news" element={<LegalNews />} />
              <Route path="/lawyers-form" element={<LawyersForm />} />
              <Route path="/lawyers-directory" element={<LawyersLandingPage />} />
              <Route path="/lawyer-directory/:lawyerId" element={<LawyerDetailsPage />} />
              <Route path="/legal-case-studies" element={<CaseStudies />} />
              {/* Redirect any non-existent routes when logged in */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
