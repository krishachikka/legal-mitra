import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideDrawer from './components/SideDrawer';
import LegalAdvice from './pages/LegalAdvice';
import PdfChat from './components/PdfChat'; // Import PdfChat
import Header from './components/Header';
import SpeechTranslator from './pages/SpeechTranslator';
import LegalNews from './pages/LegaNews';
import CaseStudies from './pages/CaseStudies';
import FAQ from './pages/FAQ';
import LandingPage from './pages/LandingPage';
import Translator from './Translator';
import LawyersLandingPage from './pages/Lawyers_Directory/LawyersLandingPage';
import LawyerDetailsPage from './pages/Lawyers_Directory/LawyerDetailsPage';
import Summarizer from './pages/Summarizer';
// import LegalNews from './pages/LegaNews';
import UserForm from './pages/UserForm'; // Import UserForm

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <Router>
      <Header setHeaderHeight={setHeaderHeight} />
      <div style={{ marginTop: headerHeight + 'px' }}>
        <Routes>

          {/* Basic Features */}
          <Route path="/" element={<LandingPage />} />


          {/* Main Features */}
          <Route path="/legal-advice" element={<LegalAdvice />} />
          <Route path="/legal-chat" element={<PdfChat />} />
          <Route path="/translate" element={<Translator />} />
          {/* <Route path="/translate" element={<SpeechTranslator />} /> */}
          <Route path="/legal-news" element={<LegalNews />} />

          {/* Lawyers Directory */}
          <Route path='/lawyers-directory' element={<LawyersLandingPage />} />
          <Route path="/lawyer-details/:lawyerId" element={<LawyerDetailsPage />} />
          <Route path="/summarize" element={<Summarizer />} />


          {/* Not so important features */}
          <Route path="/legal-case-studies" element={<CaseStudies />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Add UserForm route */}
          <Route path="/user-form" element={<UserForm />} /> {/* New route for UserForm */}

          {/* Fallback route for 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
