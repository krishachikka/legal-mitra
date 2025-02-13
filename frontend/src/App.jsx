import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideDrawer from './components/SideDrawer';
import LegalAdvice from './pages/LegalAdvice';
import PdfChat from './components/PdfChat'; // Import PdfChat
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div>
        <Header />
        {/* <SideDrawer /> */}

        {/* Define Routes using Routes component */}
        <Routes>
          <Route path="/legal-advice" element={<LegalAdvice />} />
          <Route path="/legal-chat" element={<PdfChat />} /> {/* Use PdfChat here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
