import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useThemeContext';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${isDark ? 'bg-gradient-dark text-white' : 'bg-gradient-light text-gray-900'}`}>
      <div className="text-center">
        <h1 className="text-8xl font-extrabold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('common.notFound')}
        </h2>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('common.notFoundText')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gradient text-white font-semibold hover:shadow-lg transition-all"
        >
          <Home className="w-4 h-4" />
          {t('common.goHome')}
        </Link>
      </div>
    </div>
  );
}
