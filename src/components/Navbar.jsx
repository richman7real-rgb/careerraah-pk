import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Compass, Info, Home, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  const currentLang = i18n.language;
  
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'roman-ur' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('careerraah-lang', newLang);
  };

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/explore', label: t('nav.explore'), icon: Compass },
    { path: '/about', label: t('nav.about'), icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'glass' : 'glass-light'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Career<span className="text-primary-500">Raah</span>
              <span className="text-accent-500">.pk</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? isDark ? 'bg-white/10 text-white' : 'bg-gray-900/5 text-gray-900'
                    : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-0 px-2 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              aria-label="Toggle language"
            >
              <span className={`px-1.5 py-0.5 rounded ${currentLang === 'en' ? 'bg-primary-500 text-white' : ''}`}>EN</span>
              <span className={`px-1.5 py-0.5 rounded ${currentLang !== 'en' ? 'bg-accent-500 text-white' : ''}`}>RU</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'bg-white/10 hover:bg-white/15 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label={isDark ? t('nav.themeLight') : t('nav.themeDark')}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Start Quiz CTA */}
            <Link
              to="/quiz"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg btn-gradient text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200"
            >
              {t('nav.startQuiz')}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg ${isDark ? 'text-white' : 'text-gray-800'}`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${isDark ? 'border-white/10 bg-surface-dark/95' : 'border-gray-200 bg-white/95'} backdrop-blur-xl`}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
                      : isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <Link
                to="/quiz"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-gradient text-white text-sm font-semibold mt-2"
              >
                {t('nav.startQuiz')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
