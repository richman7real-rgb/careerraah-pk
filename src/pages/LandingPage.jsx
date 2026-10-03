import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useThemeContext';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Target, Map, BarChart3, 
  GraduationCap, Shield, Award, Zap,
  Monitor, Stethoscope, Wrench, Briefcase, Palette, Landmark, Scale, HardHat
} from 'lucide-react';

const categoryIcons = {
  tech: Monitor,
  medical: Stethoscope,
  engineering: Wrench,
  business: Briefcase,
  creative: Palette,
  government: Landmark,
  law: Scale,
  trades: HardHat,
};

const categoryColors = {
  tech: 'from-cyan-500 to-blue-500',
  medical: 'from-red-500 to-rose-500',
  engineering: 'from-amber-500 to-yellow-500',
  business: 'from-emerald-500 to-green-500',
  creative: 'from-pink-500 to-fuchsia-500',
  government: 'from-blue-500 to-indigo-500',
  law: 'from-violet-500 to-purple-500',
  trades: 'from-orange-500 to-amber-500',
};

export default function LandingPage() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const categories = Object.entries(categoryIcons).map(([key, Icon]) => ({
    key,
    icon: Icon,
    label: t(`categories.${key}`),
    gradient: categoryColors[key],
  }));

  const stats = [
    { icon: BarChart3, value: t('landing.statCareers'), label: '' },
    { icon: GraduationCap, value: t('landing.statFields'), label: '' },
    { icon: Shield, value: t('landing.statData'), label: '' },
    { icon: Award, value: t('landing.statFree'), label: '' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-dark text-white' : 'bg-gradient-light text-gray-900'}`}>
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
              <Sparkles className="w-4 h-4" />
              {t('landing.badge')}
            </div>
            
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('landing.heroTitle')}
            </h1>
            
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('landing.heroSubtitle')}
            </p>

            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-gradient text-white text-lg font-bold hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('landing.startQuiz')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {t('landing.howItWorks')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: t('landing.step1Title'), desc: t('landing.step1Desc'), num: '01' },
              { icon: Zap, title: t('landing.step2Title'), desc: t('landing.step2Desc'), num: '02' },
              { icon: Map, title: t('landing.step3Title'), desc: t('landing.step3Desc'), num: '03' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`relative p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'} hover:shadow-xl transition-all duration-300 group`}
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-lg btn-gradient flex items-center justify-center text-white font-bold text-sm">
                  {step.num}
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'} group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {step.title}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-2xl sm:text-3xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {t('landing.statsTitle')}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl text-center ${isDark ? 'glass' : 'glass-light shadow-md'}`}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Preview Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {t('landing.categoriesTitle')}
          </motion.h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/explore?category=${cat.key}`}
                  className={`block p-6 rounded-2xl ${isDark ? 'glass hover:bg-white/10' : 'glass-light hover:shadow-lg'} transition-all duration-300 group text-center`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <cat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cat.label}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('landing.footerDisclaimer')}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('landing.footerBuiltWith')}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {t('landing.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
}
