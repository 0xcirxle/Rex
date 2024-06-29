import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import LandingPage from './pages/LandingPage';
import IndexerPage from './pages/IndexerPage';
import ResultPage from './pages/ResultPage';
import ArchitecturePage from './pages/ArchitecturePage';

function App() {
  return (
      <Router>
          <div className="App">
              <Navbar />
              <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/indexer" element={<IndexerPage />} />
                  <Route path="/result" element={<ResultPage />} />
                  <Route path="/arch" element={<ArchitecturePage />} />
              </Routes>
              <Footer />
          </div>
      </Router>
  )
}

export default App
