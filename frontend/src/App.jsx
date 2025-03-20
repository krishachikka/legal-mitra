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
import Translator from './Translator';
import LawyersLandingPage from './pages/Lawyers_Directory/LawyersLandingPage';
import LawyerDetailsPage from './pages/Lawyers_Directory/LawyerDetailsPage';

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

          {/* Not so important features */}
          <Route path="/legal-case-studies" element={<CaseStudies />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
