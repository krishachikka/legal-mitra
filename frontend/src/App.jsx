import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideDrawer from './components/SideDrawer';
import LegalAdvice from './pages/LegalAdvice';
import PdfChat from './components/PdfChat'; // Import PdfChat
import Header from './components/Header';
import SpeechTranslator from './pages/SpeechTranslator';
import LegalNews from './pages/LegalNews';
import CaseStudies from './pages/CaseStudies';
import FAQ from './pages/FAQ';
import LandingPage from './pages/LandingPage';

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <Router>
      <Header setHeaderHeight={setHeaderHeight} />
      <div style={{ marginTop: headerHeight + 'px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/legal-advice" element={<LegalAdvice />} />
          <Route path="/legal-chat" element={<PdfChat />} />
          <Route path="/translate" element={<SpeechTranslator />} />
          <Route path="/legal-news" element={<LegalNews />} />
          <Route path="/legal-case-studies" element={<CaseStudies />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
