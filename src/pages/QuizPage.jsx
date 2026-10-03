import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const TOTAL_STEPS = 5;

function ProgressBar({ current, total, isDark }) {
  const progress = ((current) / total) * 100;
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Step {current} / {total}
        </span>
        <span className={`text-xs font-medium ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className={`h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'} overflow-hidden`}>
        <motion.div
          className="h-full rounded-full btn-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function OptionCard({ selected, onClick, children, isDark }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
          : isDark 
            ? 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8' 
            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? 'border-primary-500 bg-primary-500' : isDark ? 'border-gray-500' : 'border-gray-300'
        }`}>
          {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
        </div>
        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</span>
      </div>
    </button>
  );
}

function RatingScale({ value, onChange, labels, isDark }) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
      {[1, 2, 3, 4, 5].map(num => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-lg transition-all duration-200 ${
            value === num
              ? 'btn-gradient text-white shadow-lg scale-110'
              : isDark
                ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

export default function QuizPage() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  
  // Quiz state
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('careerraah-quiz');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      education: '',
      group: '',
      interests: Array(18).fill(0),
      skills: { math: 0, english: 0, coding: 0, creativity: 0, communication: 0, problemSolving: 0 },
      dailyTime: '',
      budget: '',
      timeline: '',
      city: '',
      relocate: '',
      workPreference: '',
    };
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('careerraah-quiz', JSON.stringify(answers));
  }, [answers]);

  const updateAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const updateInterest = (index, value) => {
    setAnswers(prev => {
      const newInterests = [...prev.interests];
      newInterests[index] = value;
      return { ...prev, interests: newInterests };
    });
  };

  const updateSkill = (key, value) => {
    setAnswers(prev => ({
      ...prev,
      skills: { ...prev.skills, [key]: value },
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return answers.education && answers.group;
      case 2: return answers.interests.every(v => v > 0);
      case 3: return Object.values(answers.skills).every(v => v > 0);
      case 4: return answers.dailyTime && answers.budget && answers.timeline;
      case 5: return answers.city && answers.relocate && answers.workPreference;
      default: return false;
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to results with answers
      localStorage.setItem('careerraah-quiz-complete', JSON.stringify(answers));
      navigate('/results');
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const interestQuestions = t('quiz.interestQuestions', { returnObjects: true });
  const skillKeys = ['math', 'english', 'coding', 'creativity', 'communication', 'problemSolving'];

  return (
    <div className={`min-h-screen pt-20 pb-32 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gradient-dark' : 'bg-gradient-light'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('quiz.title')}
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('quiz.subtitle')}
          </p>
        </motion.div>

        <ProgressBar current={step} total={TOTAL_STEPS} isDark={isDark} />

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Background */}
            {step === 1 && (
              <div className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'}`}>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('quiz.step1Title')}
                </h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('quiz.step1Subtitle')}
                </p>

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('quiz.educationLevel')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(t('quiz.educationOptions', { returnObjects: true })).map(([key, label]) => (
                        <OptionCard
                          key={key}
                          selected={answers.education === key}
                          onClick={() => updateAnswer('education', key)}
                          isDark={isDark}
                        >
                          {label}
                        </OptionCard>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('quiz.group')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(t('quiz.groupOptions', { returnObjects: true })).map(([key, label]) => (
                        <OptionCard
                          key={key}
                          selected={answers.group === key}
                          onClick={() => updateAnswer('group', key)}
                          isDark={isDark}
                        >
                          {label}
                        </OptionCard>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'}`}>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('quiz.step2Title')}
                </h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('quiz.step2Subtitle')}
                </p>

                <div className="space-y-6">
                  {interestQuestions.map((question, index) => (
                    <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {index + 1}. {question}
                      </p>
                      <RatingScale
                        value={answers.interests[index]}
                        onChange={(v) => updateInterest(index, v)}
                        isDark={isDark}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <div className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'}`}>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('quiz.step3Title')}
                </h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('quiz.step3Subtitle')}
                </p>

                <div className="space-y-6">
                  {skillKeys.map(skill => (
                    <div key={skill} className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t(`quiz.skills.${skill}`)}
                      </p>
                      <RatingScale
                        value={answers.skills[skill]}
                        onChange={(v) => updateSkill(skill, v)}
                        isDark={isDark}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Time & Budget */}
            {step === 4 && (
              <div className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'}`}>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('quiz.step4Title')}
                </h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('quiz.step4Subtitle')}
                </p>

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('quiz.dailyTime')}
                    </label>
                    <div className="space-y-3">
                      {Object.entries(t('quiz.timeOptions', { returnObjects: true })).map(([key, label]) => (
                        <OptionCard
                          key={key}
                          selected={answers.dailyTime === key}
                          onClick={() => updateAnswer('dailyTime', key)}
                          isDark={isDark}
                        >
                          {label}
                        </OptionCard>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('quiz.budget')}
                    </label>
                    <div className="space-y-3">
                      {Object.entries(t('quiz.budgetOptions', { returnObjects: true })).map(([key, label]) => (
                        <OptionCard
                          key={key}
                          selected={answers.budget === key}
                          onClick={() => updateAnswer('budget', key)}
                          isDark={isDark}
                        >
                          {label}
                        </OptionCard>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('quiz.timeline')}
                    </label>
                    <div className="space-y-3">
                      {Object.entries(t('quiz.timelineOptions', { returnObjects: true })).map(([key, label]) => (
                        <OptionCard
                          key={key}
                          selected={answers.timeline === key}
                          onClick={() => updateAnswer('timeline', key)}
                          isDark={isDark}
                        >
                          {label}
                        </OptionCard>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Location & Preferences */}
            {step === 5 && (
              <div className={`p-6 sm:p-8 rounded-2xl ${isDark ? 'glass' : 'glass-light shadow-lg'}`}>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('quiz.step5Title')}
                </h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('quiz.step5Subtitle')}
                </p>

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('quiz.city')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {t('quiz.cityOptions', { returnObjects: true }).map((city) => (
                        <OptionCard
                          key={city}
                          selected={answers.city === city}
                          onClick={() => updateAnswer('city', city)}
                          isDark={isDark}
                        >
                          {city}
                        </OptionCard>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('quiz.relocate')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.relocate === 'yes'} onClick={() => updateAnswer('relocate', 'yes')} isDark={isDark}>
                        {t('quiz.relocateYes')}
                      </OptionCard>
                      <OptionCard selected={answers.relocate === 'no'} onClick={() => updateAnswer('relocate', 'no')} isDark={isDark}>
                        {t('quiz.relocateNo')}
                      </OptionCard>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('quiz.workPreference')}
                    </label>
                    <div className="space-y-3">
                      {Object.entries(t('quiz.workOptions', { returnObjects: true })).map(([key, label]) => (
                        <OptionCard
                          key={key}
                          selected={answers.workPreference === key}
                          onClick={() => updateAnswer('workPreference', key)}
                          isDark={isDark}
                        >
                          {label}
                        </OptionCard>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 ${isDark ? 'glass' : 'glass-light shadow-[0_-4px_20px_rgba(0,0,0,0.1)]'}`}>
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all ${
                isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('quiz.back')}
            </button>
          )}
          
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-lg transition-all ${
              canProceed()
                ? 'btn-gradient text-white hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5'
                : isDark ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === TOTAL_STEPS ? (
              <>
                <Sparkles className="w-5 h-5" />
                {t('quiz.seeResults')}
              </>
            ) : (
              <>
                {t('quiz.next')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
