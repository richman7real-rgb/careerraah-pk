import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useThemeContext';
import { motion } from 'framer-motion';
import { matchCareers } from '../utils/matching';
import careers from '../data/careers.json';
import { 
  Trophy, Star, ArrowRight, RotateCcw, Share2, Download,
  AlertTriangle, Check, TrendingUp, Clock, DollarSign, Shield,
  ChevronDown, ChevronUp
} from 'lucide-react';

function CircularProgress({ percentage, size = 100, strokeWidth = 8, isDark }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const offset = circumference - (animatedPct / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="url(#matchGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <CountUp end={animatedPct} />%
        </span>
      </div>
    </div>
  );
}

function CountUp({ end, duration = 1500 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  
  return count;
}

function ResultCard({ result, rank, isDark, t, lang }) {
  const { career, score, reasons, cautions } = result;
  const isTop = rank === 1;
  const name = career.name[lang === 'roman-ur' ? 'ru' : 'en'] || career.name.en;
  const catKey = career.category;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.2, duration: 0.5 }}
      className={`relative p-6 sm:p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'} ${
        isTop ? 'ring-2 ring-primary-500/50' : ''
      }`}
    >
      {/* Rank Badge */}
      <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg ${
        rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
        'bg-gradient-to-br from-amber-600 to-amber-800'
      }`}>
        #{rank}
      </div>

      {isTop && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 mb-4">
          <Trophy className="w-4 h-4" />
          {t('results.topMatch')}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <CircularProgress percentage={score} isDark={isDark} />
        
        <div className="flex-1 text-center sm:text-left">
          <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2 bg-cat-${catKey}/15`}>
            <span className={`cat-${catKey}`}>{t(`categories.${catKey}`)}</span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {name}
          </h3>
          
          {/* Why Matched */}
          <div className="mb-4">
            <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('results.whyMatched')}
            </h4>
            <ul className="space-y-1.5">
              {reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cautions */}
          {cautions.length > 0 && (
            <div className={`p-3 rounded-lg ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'} mb-4`}>
              {cautions.map((caution, i) => (
                <p key={i} className="flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-yellow-300' : 'text-yellow-700'}>{caution}</span>
                </p>
              ))}
            </div>
          )}

          <Link
            to={`/career/${career.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradient text-white text-sm font-semibold hover:shadow-lg transition-all"
          >
            {t('results.viewRoadmap')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const lang = i18n.language;
  const [showCompare, setShowCompare] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  const answers = useMemo(() => {
    const saved = localStorage.getItem('careerraah-quiz-complete');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  }, []);

  const results = useMemo(() => {
    if (!answers) return [];
    return matchCareers(answers, careers, lang);
  }, [answers, lang]);

  if (!answers || results.length === 0) {
    return (
      <div className={`min-h-screen pt-24 px-4 flex flex-col items-center justify-center ${isDark ? 'bg-gradient-dark text-white' : 'bg-gradient-light text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Please complete the quiz first.
        </p>
        <Link to="/quiz" className="px-6 py-3 rounded-xl btn-gradient text-white font-semibold">
          {t('nav.startQuiz')}
        </Link>
      </div>
    );
  }

  const top3 = results.slice(0, 3);
  const others = results.slice(3, 8);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const getName = (career) => career.name[lang === 'roman-ur' ? 'ru' : 'en'] || career.name.en;

  const competitionLevelMap = { 'Low': t('career.low'), 'Medium': t('career.medium'), 'High': t('career.high'), 'Very High': t('career.veryHigh') };
  const difficultyMap = { 'Easy': t('career.easy'), 'Medium': t('career.medium'), 'Hard': t('career.hard') };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gradient-dark' : 'bg-gradient-light'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <Star className="w-4 h-4" />
            {t('results.title')}
          </div>
          <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('results.title')}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('results.subtitle')}
          </p>
        </motion.div>

        {/* Top 3 Cards */}
        <div className="space-y-6 mb-12">
          {top3.map((result, i) => (
            <ResultCard key={result.career.id} result={result} rank={i + 1} isDark={isDark} t={t} lang={lang} />
          ))}
        </div>

        {/* Compare Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <button
            onClick={() => setShowCompare(!showCompare)}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
              isDark ? 'glass hover:bg-white/10 text-white' : 'glass-light hover:shadow-md text-gray-900 shadow-sm'
            }`}
          >
            {t('results.compareTitle')}
            {showCompare ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showCompare && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-4 overflow-x-auto rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'}`}
            >
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className={`${isDark ? 'border-white/10' : 'border-gray-200'} border-b`}>
                    <th className={`p-4 text-left text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}></th>
                    {top3.map(r => (
                      <th key={r.career.id} className={`p-4 text-center text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {getName(r.career)}
                        <div className="text-primary-500 text-xs mt-1">{r.score}% match</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: t('results.competition'), key: 'competition', getValue: (c) => competitionLevelMap[c.competition.level] || c.competition.level },
                    { label: t('results.learningCurve'), key: 'difficulty', getValue: (c) => difficultyMap[c.learningCurve.level] || c.learningCurve.level },
                    { label: t('results.salary'), key: 'salary', getValue: (c) => `PKR ${(c.salaryPKR.fresher[0]/1000).toFixed(0)}k-${(c.salaryPKR.fresher[1]/1000).toFixed(0)}k` },
                    { label: t('results.timeToReady'), key: 'time', getValue: (c) => c.learningCurve.timeToJobReady },
                    { label: t('results.cost'), key: 'cost', getValue: (c) => c.learningCurve.upfrontCostPKR === 0 ? t('career.free') : `PKR ${(c.learningCurve.upfrontCostPKR/1000).toFixed(0)}k` },
                  ].map(row => (
                    <tr key={row.key} className={`${isDark ? 'border-white/5' : 'border-gray-100'} border-b last:border-0`}>
                      <td className={`p-4 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{row.label}</td>
                      {top3.map(r => (
                        <td key={r.career.id} className={`p-4 text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {row.getValue(r.career)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>

        {/* Other Options */}
        {others.length > 0 && (
          <div className="mb-12">
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('results.otherOptions')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {others.map((result, i) => (
                <motion.div
                  key={result.career.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <Link
                    to={`/career/${result.career.id}`}
                    className={`block p-5 rounded-xl ${isDark ? 'glass hover:bg-white/10' : 'glass-light hover:shadow-md shadow-sm'} transition-all`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold cat-${result.career.category}`}>
                        {t(`categories.${result.career.category}`)}
                      </span>
                      <span className="text-sm font-bold text-primary-500">{result.score}%</span>
                    </div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {getName(result.career)}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => {
              localStorage.removeItem('careerraah-quiz');
              localStorage.removeItem('careerraah-quiz-complete');
              navigate('/quiz');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${
              isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            {t('results.retakeQuiz')}
          </button>
          
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${
              isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            {linkCopied ? t('results.linkCopied') : t('results.shareResult')}
          </button>
        </div>
      </div>
    </div>
  );
}
