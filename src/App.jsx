import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './hooks/useThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import CareerDetailPage from './pages/CareerDetailPage';
import ExplorePage from './pages/ExplorePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import './i18n';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/career/:id" element={<CareerDetailPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
