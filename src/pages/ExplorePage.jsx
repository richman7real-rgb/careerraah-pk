import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useThemeContext';
import { motion } from 'framer-motion';
import careers from '../data/careers.json';
import { Search, ArrowRight, TrendingUp, Minus, TrendingDown, Clock, DollarSign } from 'lucide-react';

const CATEGORIES = ['all', 'tech', 'medical', 'engineering', 'business', 'creative', 'government', 'law', 'trades'];

export default function ExplorePage() {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = i18n.language;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('default');

  const getName = (career) => career.name[lang === 'roman-ur' ? 'ru' : 'en'] || career.name.en;
  const getDesc = (career) => career.description[lang === 'roman-ur' ? 'ru' : 'en'] || career.description.en;

  const filtered = useMemo(() => {
    let result = [...careers];

    if (category !== 'all') {
      result = result.filter(c => c.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        getName(c).toLowerCase().includes(q) ||
        getDesc(c).toLowerCase().includes(q) ||
        c.category.includes(q)
      );
    }

    switch (sortBy) {
      case 'salaryHigh':
        result.sort((a, b) => b.salaryPKR.fresher[1] - a.salaryPKR.fresher[1]);
        break;
      case 'competitionLow': {
        const order = { 'Low': 0, 'Medium': 1, 'High': 2, 'Very High': 3 };
        result.sort((a, b) => (order[a.competition.level] || 2) - (order[b.competition.level] || 2));
        break;
      }
      case 'shortestTime':
        result.sort((a, b) => {
          const getMonths = (s) => {
            const str = s.toLowerCase();
            if (str.includes('year')) return (parseInt(str) || 1) * 12;
            return parseInt(str) || 6;
          };
          return getMonths(a.learningCurve.timeToJobReady) - getMonths(b.learningCurve.timeToJobReady);
        });
        break;
    }

    return result;
  }, [careers, category, search, sortBy, lang]);

  const TrendIcon = ({ trend }) => {
    if (trend === 'Growing') return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
    if (trend === 'Declining') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-yellow-500" />;
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gradient-dark' : 'bg-gradient-light'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('explore.title')}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('explore.subtitle')}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('explore.searchPlaceholder')}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-sm ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500'
              } outline-none transition-colors`}
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setSearchParams(cat === 'all' ? {} : { category: cat }); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'btn-gradient text-white shadow-md'
                    : isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? t('explore.allCategories') : t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('explore.sortBy')}:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm ${
                isDark ? 'bg-white/5 text-white border border-white/10' : 'bg-white text-gray-900 border border-gray-200'
              } outline-none`}
            >
              {Object.entries(t('explore.sortOptions', { returnObjects: true })).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Career Grid */}
        {filtered.length === 0 ? (
          <div className={`text-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <p>{t('explore.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((career, i) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5) }}
              >
                <Link
                  to={`/career/${career.id}`}
                  className={`block h-full p-6 rounded-2xl ${isDark ? 'glass hover:bg-white/10' : 'glass-light hover:shadow-xl shadow-md'} transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full cat-${career.category} bg-cat-${career.category}/15`}>
                      {t(`categories.${career.category}`)}
                    </span>
                    <TrendIcon trend={career.competition.demandTrend} />
                  </div>

                  <h3 className={`text-lg font-bold mb-2 group-hover:text-primary-500 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {getName(career)}
                  </h3>

                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getDesc(career)}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                      PKR {(career.salaryPKR.fresher[0]/1000).toFixed(0)}k-{(career.salaryPKR.fresher[1]/1000).toFixed(0)}k
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {career.learningCurve.timeToJobReady}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium level-${career.competition.level.toLowerCase().replace(' ', '-')}`}>
                      {career.competition.level} Competition
                    </span>
                    <span className="text-primary-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('explore.viewDetails')} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
