import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useThemeContext';
import { motion } from 'framer-motion';
import careers from '../data/careers.json';
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus, Clock, DollarSign,
  GraduationCap, BookOpen, MapPin, Briefcase, ChevronDown, ChevronRight,
  AlertCircle, CheckCircle, ExternalLink, Calendar
} from 'lucide-react';

function LevelMeter({ level, type = 'competition', isDark }) {
  const levels = type === 'competition' 
    ? ['Low', 'Medium', 'High', 'Very High']
    : ['Easy', 'Medium', 'Hard'];
  
  const idx = levels.indexOf(level);
  const colors = type === 'competition'
    ? ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500']
    : ['bg-green-500', 'bg-yellow-500', 'bg-red-500'];

  return (
    <div className="flex gap-1.5">
      {levels.map((l, i) => (
        <div
          key={l}
          className={`h-3 flex-1 rounded-full transition-all ${
            i <= idx ? colors[idx] : isDark ? 'bg-white/10' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function SalaryBar({ label, range, maxVal, isDark }) {
  const [min, max] = range;
  const widthMin = (min / maxVal) * 100;
  const widthMax = (max / maxVal) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          PKR {(min / 1000).toFixed(0)}k - {(max / 1000).toFixed(0)}k
        </span>
      </div>
      <div className={`h-4 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} relative overflow-hidden`}>
        <div
          className="absolute top-0 h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000"
          style={{ left: `${widthMin}%`, width: `${widthMax - widthMin}%` }}
        />
      </div>
    </div>
  );
}

function TimelineStep({ step, index, total, isDark, t, showFree, lang }) {
  const [expanded, setExpanded] = useState(index === 0);
  const stepTitle = typeof step.title === 'object'
    ? (step.title[lang === 'roman-ur' ? 'ru' : 'en'] || step.title.en)
    : (step.title || '');
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8"
    >
      {/* Timeline line */}
      {index < total - 1 && (
        <div className={`absolute left-[11px] top-8 bottom-0 w-0.5 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
      )}
      
      {/* Timeline dot */}
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
        isDark ? 'border-primary-500 bg-surface-dark text-primary-400' : 'border-primary-500 bg-white text-primary-600'
      }`}>
        {index + 1}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left p-4 rounded-xl mb-4 ${isDark ? 'glass hover:bg-white/8' : 'glass-light hover:shadow-md shadow-sm'} transition-all`}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-xs font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              {step.period}
            </span>
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stepTitle}
            </h4>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-3"
          >
            {step.skills?.length > 0 && (
              <div>
                <p className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('career.skills')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {step.skills.map(s => (
                    <span key={s} className={`px-2 py-1 text-xs rounded-md ${isDark ? 'bg-primary-500/10 text-primary-300' : 'bg-primary-50 text-primary-700'}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {step.freeResources?.length > 0 && (
              <div>
                <p className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('career.freeResources')}</p>
                <ul className="space-y-1">
                  {step.freeResources.map(r => (
                    <li key={r} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!showFree && step.paidResources?.length > 0 && (
              <div>
                <p className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('career.paidResources')}</p>
                <ul className="space-y-1">
                  {step.paidResources.map(r => (
                    <li key={r} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <DollarSign className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.projects?.length > 0 && (
              <div>
                <p className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('career.projects')}</p>
                <ul className="space-y-1">
                  {step.projects.map(p => (
                    <li key={p} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <ChevronRight className="w-3.5 h-3.5 text-accent-400 flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.certifications?.length > 0 && (
              <div>
                <p className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('career.certifications')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {step.certifications.map(c => (
                    <span key={c} className={`px-2 py-1 text-xs rounded-md ${isDark ? 'bg-accent-500/10 text-accent-300' : 'bg-accent-50 text-accent-700'}`}>
                      🎓 {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </button>
    </motion.div>
  );
}

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [showFree, setShowFree] = useState(true);
  const lang = i18n.language;

  const career = useMemo(() => careers.find(c => c.id === id), [id]);

  if (!career) {
    return (
      <div className={`min-h-screen pt-24 flex flex-col items-center justify-center ${isDark ? 'bg-gradient-dark text-white' : 'bg-gradient-light text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">{t('common.notFound')}</h2>
        <Link to="/explore" className="px-6 py-3 rounded-xl btn-gradient text-white font-semibold">
          {t('nav.explore')}
        </Link>
      </div>
    );
  }

  const name = career.name[lang === 'roman-ur' ? 'ru' : 'en'] || career.name.en;
  const desc = career.description[lang === 'roman-ur' ? 'ru' : 'en'] || career.description.en;
  const dayInLife = career.dayInLife[lang === 'roman-ur' ? 'ru' : 'en'] || career.dayInLife.en;
  const compReason = career.competition.reason[lang === 'roman-ur' ? 'ru' : 'en'] || career.competition.reason.en;
  const freelanceNote = career.salaryPKR.freelanceNote[lang === 'roman-ur' ? 'ru' : 'en'] || career.salaryPKR.freelanceNote.en;
  const fresherEntry = career.fresherEntryPath[lang === 'roman-ur' ? 'ru' : 'en'] || career.fresherEntryPath.en;

  const maxSalary = career.salaryPKR.senior[1];
  const trendIcon = career.competition.demandTrend === 'Growing' ? TrendingUp : career.competition.demandTrend === 'Declining' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  const trendColor = career.competition.demandTrend === 'Growing' ? 'text-green-500' : career.competition.demandTrend === 'Declining' ? 'text-red-500' : 'text-yellow-500';
  const trendLabel = t(`career.${career.competition.demandTrend.toLowerCase()}`);

  const needLevels = { 'None': t('career.none'), 'Low': t('career.low'), 'Medium': t('career.medium'), 'High': t('career.high') };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gradient-dark' : 'bg-gradient-light'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/results');
            }
          }}
          className={`inline-flex items-center gap-1.5 text-sm font-medium mb-6 cursor-pointer transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('career.backToResults')}
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-cat-${career.category}/15 cat-${career.category}`}>
            {t(`categories.${career.category}`)}
          </span>
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {name}
          </h1>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {desc}
          </p>
        </motion.div>

        {/* Day in Life */}
        <Section title={t('career.dayInLife')} isDark={isDark}>
          <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dayInLife}</p>
        </Section>

        {/* Competition */}
        <Section title={t('career.competition')} isDark={isDark}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('career.competitionLevel')}</span>
                <span className={`text-sm font-bold level-${career.competition.level.toLowerCase().replace(' ', '-')}`}>
                  {t(`career.${career.competition.level.toLowerCase().replace(' ', '')}`)}
                </span>
              </div>
              <LevelMeter level={career.competition.level} type="competition" isDark={isDark} />
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('career.demandTrend')}: {trendLabel}
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{compReason}</p>
          </div>
        </Section>

        {/* Learning Curve */}
        <Section title={t('career.learningCurve')} isDark={isDark}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('career.difficulty')}</span>
                <span className={`text-sm font-bold`}>
                  {t(`career.${career.learningCurve.level.toLowerCase()}`)}
                </span>
              </div>
              <LevelMeter level={career.learningCurve.level} type="difficulty" isDark={isDark} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={Clock} label={t('career.timeToJobReady')} value={career.learningCurve.timeToJobReady} isDark={isDark} />
              <InfoItem icon={DollarSign} label={t('career.upfrontCost')} value={career.learningCurve.upfrontCostPKR === 0 ? t('career.free') : `PKR ${(career.learningCurve.upfrontCostPKR/1000).toFixed(0)}k`} isDark={isDark} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <MiniMeter label={t('career.mathNeeded')} level={needLevels[career.learningCurve.mathNeeded] || career.learningCurve.mathNeeded} isDark={isDark} />
              <MiniMeter label={t('career.codingNeeded')} level={needLevels[career.learningCurve.codingNeeded] || career.learningCurve.codingNeeded} isDark={isDark} />
              <MiniMeter label={t('career.englishNeeded')} level={needLevels[career.learningCurve.englishNeeded] || career.learningCurve.englishNeeded} isDark={isDark} />
            </div>
          </div>
        </Section>

        {/* Salary */}
        <Section title={t('career.salary')} isDark={isDark}>
          <p className={`text-xs mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('career.salaryDisclaimer')}</p>
          <div className="space-y-4">
            <SalaryBar label={t('career.fresher')} range={career.salaryPKR.fresher} maxVal={maxSalary} isDark={isDark} />
            <SalaryBar label={t('career.midLevel')} range={career.salaryPKR.mid} maxVal={maxSalary} isDark={isDark} />
            <SalaryBar label={t('career.senior')} range={career.salaryPKR.senior} maxVal={maxSalary} isDark={isDark} />
          </div>
          <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-accent-500/10' : 'bg-accent-50'}`}>
            <p className={`text-sm ${isDark ? 'text-accent-300' : 'text-accent-700'}`}>
              <strong>{t('career.freelance')}:</strong> {freelanceNote}
            </p>
          </div>
        </Section>

        {/* Eligibility */}
        <Section title={t('career.eligibility')} isDark={isDark}>
          <div className="space-y-3">
            <div>
              <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('career.requiredGroups')}</p>
              <div className="flex flex-wrap gap-2">
                {career.eligibleGroups.map(g => (
                  <span key={g} className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
            {career.entryExams.length > 0 && (
              <div>
                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('career.entryExams')}</p>
                <div className="flex flex-wrap gap-2">
                  {career.entryExams.map(e => (
                    <span key={e} className={`px-3 py-1 text-xs rounded-full font-semibold ${isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-700'}`}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Universities */}
        <Section title={t('career.universities')} isDark={isDark}>
          <div className="flex flex-wrap gap-2 mb-4">
            {career.topUniversities.map(u => (
              <span key={u} className={`px-3 py-1.5 text-xs rounded-lg ${isDark ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                <GraduationCap className="w-3 h-3 inline mr-1" />{u}
              </span>
            ))}
          </div>
          <div>
            <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('career.alternativePaths')}</p>
            <ul className="space-y-1.5">
              {career.alternativePaths.map(p => (
                <li key={p} className={`text-sm flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Fresher Entry */}
        <Section title={t('career.fresherEntry')} isDark={isDark}>
          <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{fresherEntry}</p>
        </Section>

        {/* Roadmap */}
        <Section title={t('career.roadmap')} isDark={isDark}>
          {/* Free/Paid toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setShowFree(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                showFree
                  ? 'btn-gradient text-white'
                  : isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('career.roadmapFree')}
            </button>
            <button
              onClick={() => setShowFree(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                !showFree
                  ? 'btn-gradient text-white'
                  : isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('career.roadmapPaid')}
            </button>
          </div>

          <div>
            {career.roadmap.map((step, i) => (
              <TimelineStep
                key={step.period}
                step={step}
                index={i}
                total={career.roadmap.length}
                isDark={isDark}
                t={t}
                showFree={showFree}
                lang={lang}
              />
            ))}
          </div>
        </Section>

        {/* Last Updated & Disclaimer */}
        <div className={`mt-12 p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Calendar className="w-3.5 h-3.5 inline mr-1" />
            {t('career.lastUpdated')}: {career.lastUpdated}
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
            {t('career.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, isDark }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-8 p-6 sm:p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'}`}
    >
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      {children}
    </motion.section>
  );
}

function InfoItem({ icon: Icon, label, value, isDark }) {
  return (
    <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
      </div>
      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

function MiniMeter({ label, level, isDark }) {
  return (
    <div className={`p-2.5 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
      <p className={`text-[10px] mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{level}</p>
    </div>
  );
}
