import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useThemeContext';
import { motion } from 'framer-motion';
import { Target, Database, AlertTriangle, BarChart3, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const factors = [
    t('about.factor1'),
    t('about.factor2'),
    t('about.factor3'),
    t('about.factor4'),
    t('about.factor5'),
  ];

  const sources = t('about.sources', { returnObjects: true });

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gradient-dark' : 'bg-gradient-light'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('about.title')}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Mission */}
        <Section icon={Target} title={t('about.missionTitle')} isDark={isDark}>
          <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('about.missionText')}
          </p>
        </Section>

        {/* Methodology */}
        <Section icon={BarChart3} title={t('about.methodologyTitle')} isDark={isDark}>
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('about.methodologyText')}
          </p>
          <div className="space-y-3">
            {factors.map((factor, i) => (
              <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{factor}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Data Sources */}
        <Section icon={Database} title={t('about.dataSourcesTitle')} isDark={isDark}>
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('about.dataSourcesText')}
          </p>
          <ul className="space-y-2">
            {sources.map((source, i) => (
              <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <BookOpen className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                {source}
              </li>
            ))}
          </ul>
        </Section>

        {/* Disclaimer */}
        <Section icon={AlertTriangle} title={t('about.disclaimerTitle')} isDark={isDark} warning>
          <p className={`leading-relaxed ${isDark ? 'text-yellow-200/80' : 'text-yellow-800'}`}>
            {t('about.disclaimerText')}
          </p>
          <p className={`mt-3 text-sm ${isDark ? 'text-yellow-300/50' : 'text-yellow-700'}`}>
            {t('about.updateNote')}
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, isDark, warning }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-8 p-6 sm:p-8 rounded-2xl ${
        warning 
          ? isDark ? 'bg-yellow-500/5 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
          : isDark ? 'glass' : 'glass-light shadow-lg'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          warning
            ? isDark ? 'bg-yellow-500/10' : 'bg-yellow-100'
            : isDark ? 'bg-primary-500/10' : 'bg-primary-50'
        }`}>
          <Icon className={`w-5 h-5 ${warning ? 'text-yellow-500' : 'text-primary-500'}`} />
        </div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
