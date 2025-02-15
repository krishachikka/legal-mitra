import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideDrawer from './components/SideDrawer';
import LegalAdvice from './pages/LegalAdvice';
import PdfChat from './components/PdfChat'; // Import PdfChat
import Header from './components/Header';
import SpeechTranslator from './pages/SpeechTranslator';

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <Router>
      <Header setHeaderHeight={setHeaderHeight} />
      <div style={{ marginTop: headerHeight + 'px' }}>
        <Routes>
          <Route path="/legal-advice" element={<LegalAdvice />} />
          <Route path="/legal-chat" element={<PdfChat />} /> {/* Use PdfChat here */}
          <Route path="/translate" element={<SpeechTranslator />} /> {/* Use PdfChat here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
