/**
 * CareerRaah.pk — Career Matching Algorithm
 * 
 * Scores each career 0-100 using weighted factors:
 *   - Interest fit (RIASEC similarity): 35%
 *   - Skill fit: 25%
 *   - Eligibility (group/education): 15%
 *   - Budget & time fit: 15%
 *   - Preferences fit: 10%
 * 
 * Returns top matches with percentage and human-readable reasons.
 */

// Budget levels ordered from lowest to highest
const BUDGET_LEVELS = ['free', 'upto-20k', 'upto-100k', 'full-degree'];

// RIASEC mapping: which quiz questions map to which RIASEC dimension
// Questions are 0-indexed. Each RIASEC type has 3 questions.
const RIASEC_QUESTION_MAP = {
  R: [0, 1],       // Realistic: hands-on, tools/machines
  I: [2, 3],       // Investigative: puzzles/research, scientific
  A: [4, 5],       // Artistic: art/writing, expression
  S: [6, 7],       // Social: helping, teamwork
  E: [8, 9],       // Enterprising: leading, risk-taking
  C: [10, 11],     // Conventional: organizing, numbers
};

// Additional questions that contribute to multiple types
const BONUS_QUESTION_MAP = {
  12: { I: 0.5, R: 0.5 },  // curious about tech
  13: { I: 0.5, A: 0.5 },  // reading/learning
  14: { E: 0.5, R: 0.5 },  // competitive
  15: { C: 0.5, R: 0.5 },  // structured routine
  16: { C: 0.5, S: 0.5 },  // job security
  17: { A: 0.5, I: 0.5 },  // creative problem-solving
};

/**
 * Calculate user's RIASEC profile from quiz interest answers
 * @param {number[]} answers - Array of 18 interest ratings (1-5)
 * @returns {Object} RIASEC profile with scores 0-5 for each type
 */
export function calculateRIASEC(answers) {
  const profile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  // Primary questions (each contributes fully to one RIASEC type)
  Object.entries(RIASEC_QUESTION_MAP).forEach(([type, questionIndices]) => {
    questionIndices.forEach(idx => {
      if (answers[idx] !== undefined) {
        profile[type] += answers[idx];
        counts[type] += 1;
      }
    });
  });

  // Bonus questions (contribute partially to multiple types)
  Object.entries(BONUS_QUESTION_MAP).forEach(([idx, contributions]) => {
    const answer = answers[parseInt(idx)];
    if (answer !== undefined) {
      Object.entries(contributions).forEach(([type, weight]) => {
        profile[type] += answer * weight;
        counts[type] += weight;
      });
    }
  });

  // Normalize to 0-5 scale
  Object.keys(profile).forEach(type => {
    if (counts[type] > 0) {
      profile[type] = Math.min(5, profile[type] / counts[type]);
    }
  });

  return profile;
}

/**
 * Calculate cosine similarity between two RIASEC profiles
 * @param {Object} profile1 - First RIASEC profile
 * @param {Object} profile2 - Second RIASEC profile
 * @returns {number} Similarity score 0-1
 */
function riasecSimilarity(profile1, profile2) {
  const types = ['R', 'I', 'A', 'S', 'E', 'C'];
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  types.forEach(type => {
    const v1 = profile1[type] || 0;
    const v2 = profile2[type] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  return dotProduct / (mag1 * mag2);
}

/**
 * Calculate skill fit between user skills and career required skills
 * @param {Object} userSkills - User's self-rated skills (1-5)
 * @param {Object} requiredSkills - Career's required skills (0-5)
 * @returns {number} Fit score 0-1
 */
function calculateSkillFit(userSkills, requiredSkills) {
  const skillKeys = ['math', 'english', 'coding', 'creativity', 'communication', 'problemSolving'];
  let totalWeight = 0;
  let weightedScore = 0;

  skillKeys.forEach(skill => {
    const required = requiredSkills[skill] || 0;
    const userLevel = userSkills[skill] || 1;
    
    // Weight by how important the skill is to the career
    const importance = required / 5;
    totalWeight += importance;
    
    if (required === 0) {
      // Skill not needed — full score for this skill
      weightedScore += importance;
    } else {
      // Score based on how close user is to requirement
      const ratio = Math.min(1, userLevel / required);
      weightedScore += importance * ratio;
    }
  });

  return totalWeight > 0 ? weightedScore / totalWeight : 0.5;
}

/**
 * Check if user's academic group is eligible for a career
 * @param {string} userGroup - User's academic group
 * @param {string[]} eligibleGroups - Career's eligible groups
 * @returns {Object} { eligible: boolean, score: number }
 */
function checkEligibility(userGroup, eligibleGroups) {
  // Map user's group selection to career data format
  const groupMap = {
    'pre-medical': 'Pre-Medical',
    'pre-engineering': 'Pre-Engineering',
    'ics': 'ICS',
    'commerce': 'Commerce',
    'arts': 'Arts/Humanities',
    'other': 'Other',
  };

  const mappedGroup = groupMap[userGroup] || userGroup;
  
  if (eligibleGroups.includes(mappedGroup) || eligibleGroups.includes('Fresher')) {
    return { eligible: true, score: 1.0 };
  }
  
  // Not directly eligible but might have alternative paths
  if (eligibleGroups.includes('Other')) {
    return { eligible: true, score: 0.7 };
  }
  
  return { eligible: false, score: 0.15 };
}

/**
 * Calculate budget and time fit
 * @param {Object} userPrefs - User's budget, time, and timeline preferences
 * @param {Object} career - Career data
 * @returns {Object} { score: number, cautions: string[] }
 */
function calculateBudgetTimeFit(userPrefs, career) {
  let score = 0;
  const cautions = [];
  
  // Budget fit (50% of this factor)
  const userBudgetIdx = BUDGET_LEVELS.indexOf(userPrefs.budget);
  const careerBudgetIdx = BUDGET_LEVELS.indexOf(career.minBudgetLevel);
  
  if (userBudgetIdx >= careerBudgetIdx) {
    score += 0.5; // User can afford it
  } else {
    // Partial credit based on how far off
    const gap = careerBudgetIdx - userBudgetIdx;
    score += Math.max(0, 0.5 - (gap * 0.2));
    cautions.push('budget');
  }
  
  // Timeline fit (50% of this factor)
  const timeToReady = career.learningCurve.timeToJobReady.toLowerCase();
  const userTimeline = userPrefs.timeline;
  
  // Parse approximate months from career's timeToJobReady
  let careerMonths = 12; // default
  if (timeToReady.includes('year')) {
    const years = parseInt(timeToReady) || 1;
    careerMonths = years * 12;
  } else {
    const months = parseInt(timeToReady) || 6;
    careerMonths = months;
  }
  
  let userMonths = 12;
  if (userTimeline === '6months') userMonths = 6;
  else if (userTimeline === '1-2years') userMonths = 18;
  else if (userTimeline === '4years+') userMonths = 60;
  
  if (userMonths >= careerMonths) {
    score += 0.5;
  } else {
    const ratio = userMonths / careerMonths;
    score += 0.5 * ratio;
    if (ratio < 0.5) cautions.push('timeline');
  }
  
  return { score, cautions };
}

/**
 * Calculate preferences fit (work type, city)
 * @param {Object} userPrefs - User preferences
 * @param {Object} career - Career data
 * @returns {number} Score 0-1
 */
function calculatePreferencesFit(userPrefs, career) {
  let score = 0.5; // Base score
  
  const workPref = userPrefs.workPreference;
  const category = career.category;
  
  // Work preference matching
  if (workPref === 'freelance') {
    // Tech, creative, and some business careers are great for freelancing
    if (['tech', 'creative'].includes(category)) score += 0.3;
    else if (category === 'business') score += 0.15;
    else score += 0.05;
  } else if (workPref === 'government') {
    if (category === 'government') score += 0.4;
    else if (['medical', 'engineering', 'law'].includes(category)) score += 0.15;
    else score += 0.0;
  } else {
    // Local job — most careers work
    score += 0.2;
  }
  
  // Relocation bonus for specific careers
  if (userPrefs.relocate === 'yes') {
    score += 0.1; // More options available
  }
  
  return Math.min(1, score);
}

/**
 * Generate human-readable reasons for why a career matched
 * @param {Object} factors - Individual factor scores and details
 * @param {Object} career - Career data
 * @param {string} lang - Language code ('en' or 'ru')
 * @returns {string[]} Array of reason strings
 */
function generateReasons(factors, career, lang, userAnswers) {
  const reasons = [];
  const isRU = lang === 'roman-ur' || lang === 'ru';
  
  // Interest fit reasons
  if (factors.interestScore > 0.7) {
    reasons.push(isRU 
      ? 'Aap ki dilchaspiyan is career ke saath bohat match karti hain'
      : 'Your interests strongly align with this career');
  } else if (factors.interestScore > 0.5) {
    reasons.push(isRU
      ? 'Aap ki dilchaspiyan is career ke liye achi hain'
      : 'Your interests are a good fit for this career');
  }
  
  // Skill fit reasons
  if (factors.skillScore > 0.75) {
    reasons.push(isRU
      ? 'Aap ki current skills is career ke liye bohat strong hain'
      : 'Your current skills are very strong for this career');
  } else if (factors.skillScore > 0.5) {
    reasons.push(isRU
      ? 'Aap ki skills is career ke liye achi base provide karti hain'
      : 'Your skills provide a good foundation for this career');
  }

  // Specific skill mentions
  const skills = userAnswers?.skills || {};
  const reqSkills = career.requiredSkills;
  if (reqSkills.coding >= 4 && skills.coding >= 3) {
    reasons.push(isRU ? 'Aap ki coding skills is field mein kaam aayengi' : 'Your coding skills are valuable for this field');
  }
  if (reqSkills.creativity >= 4 && skills.creativity >= 3) {
    reasons.push(isRU ? 'Aap ki creativity is career mein bohat kaam aayegi' : 'Your creativity is a great asset for this career');
  }
  if (reqSkills.communication >= 4 && skills.communication >= 3) {
    reasons.push(isRU ? 'Aap ki communication skills is field mein bohat important hain' : 'Your communication skills are crucial for this field');
  }
  
  // Eligibility
  if (factors.eligibilityScore >= 1.0) {
    reasons.push(isRU
      ? 'Aap ka academic background is career ke liye eligible hai'
      : 'Your academic background qualifies you for this career');
  }
  
  // Budget fit
  if (factors.budgetScore > 0.8) {
    reasons.push(isRU
      ? 'Ye career aap ke budget mein fit hota hai'
      : 'This career fits within your budget');
  }

  // Competition
  if (career.competition.level === 'Low') {
    reasons.push(isRU
      ? 'Is field mein competition kam hai — achi opportunity hai'
      : 'Low competition in this field — great opportunity');
  }

  // Demand trend
  if (career.competition.demandTrend === 'Growing') {
    reasons.push(isRU
      ? 'Is career ki demand Pakistan mein barh rahi hai'
      : 'Demand for this career is growing in Pakistan');
  }

  // Work preference
  if (userAnswers?.workPreference === 'freelance' && ['tech', 'creative'].includes(career.category)) {
    reasons.push(isRU
      ? 'Is career mein freelancing ke bohat ache options hain'
      : 'Great freelancing opportunities in this career');
  }
  if (userAnswers?.workPreference === 'government' && career.category === 'government') {
    reasons.push(isRU
      ? 'Ye sarkari naukri hai — aap ki pasand ke mutabiq'
      : 'This is a government career — matches your preference');
  }
  
  // Limit to top 4 reasons
  return reasons.slice(0, 4);
}

/**
 * Generate caution notes for weak factors
 * @param {Object} factors - Individual factor scores
 * @param {string[]} budgetCautions - Budget/time caution flags
 * @param {Object} career - Career data
 * @param {string} lang - Language code
 * @returns {string[]} Array of caution strings
 */
function generateCautions(factors, budgetCautions, career, lang) {
  const cautions = [];
  const isRU = lang === 'roman-ur' || lang === 'ru';
  
  if (!factors.eligible) {
    const groups = career.eligibleGroups.join(', ');
    cautions.push(isRU
      ? `Is career ke liye ${groups} background chahiye`
      : `This career typically requires ${groups} background`);
  }
  
  if (budgetCautions.includes('budget')) {
    cautions.push(isRU
      ? 'Is career ke liye aap ke selected budget se zyada kharcha ho sakta hai'
      : 'This career may require more budget than you selected');
  }
  
  if (budgetCautions.includes('timeline')) {
    cautions.push(isRU
      ? 'Job-ready hone mein aap ki expected timeline se zyada waqt lag sakta hai'
      : 'Getting job-ready may take longer than your desired timeline');
  }

  if (career.competition.level === 'Very High') {
    cautions.push(isRU
      ? 'Is field mein competition bohat zyada hai'
      : 'Competition in this field is very high');
  }
  
  return cautions;
}

/**
 * Main matching function — scores all careers and returns ranked results
 * @param {Object} userAnswers - All quiz answers
 * @param {Object[]} careers - Array of career data
 * @param {string} lang - Current language ('en' or 'roman-ur')
 * @returns {Object[]} Ranked careers with scores and reasons
 */
export function matchCareers(userAnswers, careers, lang = 'en') {
  // Calculate user's RIASEC profile from interest answers
  const userRIASEC = calculateRIASEC(userAnswers.interests || []);
  
  const results = careers.map(career => {
    // 1. Interest fit (RIASEC similarity) — 35%
    const interestScore = riasecSimilarity(userRIASEC, career.riasecProfile);
    
    // 2. Skill fit — 25%
    const skillScore = calculateSkillFit(userAnswers.skills || {}, career.requiredSkills);
    
    // 3. Eligibility — 15%
    const eligibility = checkEligibility(userAnswers.group || 'other', career.eligibleGroups);
    
    // 4. Budget & time fit — 15%
    const budgetTime = calculateBudgetTimeFit({
      budget: userAnswers.budget || 'free',
      timeline: userAnswers.timeline || '1-2years',
    }, career);
    
    // 5. Preferences fit — 10%
    const prefScore = calculatePreferencesFit({
      workPreference: userAnswers.workPreference || 'local',
      relocate: userAnswers.relocate || 'no',
      city: userAnswers.city || 'Other',
    }, career);
    
    // Calculate weighted total score (0-100)
    let totalScore = (
      interestScore * 35 +
      skillScore * 25 +
      eligibility.score * 15 +
      budgetTime.score * 15 +
      prefScore * 10
    );
    
    // Cap score if not eligible
    if (!eligibility.eligible) {
      totalScore = Math.min(totalScore, 40);
    }
    
    // Round to nearest integer
    totalScore = Math.round(Math.min(100, Math.max(0, totalScore)));
    
    // Generate human-readable reasons
    const factors = {
      interestScore,
      skillScore,
      eligibilityScore: eligibility.score,
      eligible: eligibility.eligible,
      budgetScore: budgetTime.score,
      prefScore,
    };
    
    const reasons = generateReasons(factors, career, lang, userAnswers);
    const cautions = generateCautions(factors, budgetTime.cautions, career, lang);
    
    return {
      career,
      score: totalScore,
      reasons,
      cautions,
      factors, // For debugging / compare view
    };
  });
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  return results;
}

export default matchCareers;
