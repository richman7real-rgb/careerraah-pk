# CareerRaah.pk 🚀

Pakistan's first career guidance platform for students and freshers. Take a free quiz, get personalized career recommendations with Pakistan-specific data, and follow step-by-step roadmaps.

## Features

- 🎯 **Smart Career Quiz** — Multi-step wizard covering education, interests (RIASEC), skills, budget, time, and location
- 📊 **25+ Careers** — Comprehensive data across 8 fields (Tech, Medical, Engineering, Business, Creative, Government, Law, Skilled Trades)
- 🗺️ **Step-by-step Roadmaps** — Month-by-month plans with free resources, projects, and certifications
- 💰 **Pakistan-specific Data** — Salary ranges in PKR, competition levels, entry exams (MDCAT, ECAT, CSS, etc.)
- 🌐 **Bilingual** — Full English and Roman Urdu support
- 🌙 **Dark/Light Theme** — Beautiful glassmorphism design with theme toggle
- 📱 **Mobile-first** — Fully responsive for phone users
- 💾 **Local Storage** — Quiz progress and preferences saved automatically

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4**
- **Framer Motion** for animations
- **react-i18next** for internationalization
- **React Router v7** for routing
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── Navbar.jsx      # Sticky glass navigation bar
├── data/
│   └── careers.json    # All career data (25+ careers)
├── hooks/
│   └── useThemeContext.jsx  # Dark/light theme context
├── pages/
│   ├── LandingPage.jsx      # Home page with hero, how-it-works, categories
│   ├── QuizPage.jsx         # 5-step career quiz wizard
│   ├── ResultsPage.jsx      # Top 3 matches with compare view
│   ├── CareerDetailPage.jsx # Full career info with roadmap
│   ├── ExplorePage.jsx      # Browse all careers with filters
│   ├── AboutPage.jsx        # Methodology and data sources
│   └── NotFoundPage.jsx     # 404 page
├── utils/
│   └── matching.js     # Career matching algorithm (0-100 scoring)
├── App.jsx             # Router and theme provider
├── i18n.js             # i18next configuration
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind
public/
├── locales/
│   ├── en.json         # English translations
│   └── roman-ur.json   # Roman Urdu translations
└── favicon.svg         # App favicon
```

## How to Add a New Career

1. Open `src/data/careers.json`
2. Add a new career object following this schema:

```json
{
  "id": "unique-slug",
  "category": "tech|medical|engineering|business|creative|government|law|trades",
  "name": { "en": "Career Name", "ru": "Career Name Roman Urdu" },
  "description": { "en": "...", "ru": "..." },
  "dayInLife": { "en": "...", "ru": "..." },
  "riasecProfile": { "R": 0-5, "I": 0-5, "A": 0-5, "S": 0-5, "E": 0-5, "C": 0-5 },
  "requiredSkills": { "math": 0-5, "english": 0-5, "coding": 0-5, "creativity": 0-5, "communication": 0-5, "problemSolving": 0-5 },
  "eligibleGroups": ["Pre-Medical", "Pre-Engineering", "ICS", "Commerce", "Arts/Humanities", "Other", "Fresher"],
  "competition": { "level": "Low|Medium|High|Very High", "reason": { "en": "...", "ru": "..." }, "demandTrend": "Growing|Stable|Declining" },
  "learningCurve": { "level": "Easy|Medium|Hard", "timeToJobReady": "X months/years", "upfrontCostPKR": 0, "mathNeeded": "None|Low|Medium|High", "codingNeeded": "...", "englishNeeded": "..." },
  "salaryPKR": { "fresher": [min, max], "mid": [min, max], "senior": [min, max], "freelanceNote": { "en": "...", "ru": "..." } },
  "minBudgetLevel": "free|upto-20k|upto-100k|full-degree",
  "entryExams": [],
  "topUniversities": [],
  "alternativePaths": [],
  "fresherEntryPath": { "en": "...", "ru": "..." },
  "roadmap": [
    { "period": "Month 0-1", "title": { "en": "...", "ru": "..." }, "skills": [], "freeResources": [], "paidResources": [], "projects": [], "certifications": [] }
  ],
  "lastUpdated": "YYYY-MM-DD"
}
```

3. The career will automatically appear in Explore page and be included in quiz matching.

## How to Add a New Language

1. Create a new translation file: `public/locales/{lang-code}.json` (copy structure from `en.json`)
2. Copy the file to `src/{lang-code}.json`
3. Add the import and resource in `src/i18n.js`:
   ```js
   import newLang from './{lang-code}.json';
   // In resources:
   '{lang-code}': { translation: newLang },
   ```
4. Update language toggle in `src/components/Navbar.jsx`
5. For RTL languages (like Urdu script), add `dir="rtl"` support to the HTML element

## Data Disclaimer

⚠️ All salary figures, competition levels, and timelines are **approximate estimates** based on publicly available data from Rozee.pk, Mustakbil, PBS, LinkedIn, Glassdoor, and community sources. These should be verified before making major career or financial decisions.

**Career data should be reviewed and updated every 6 months.**

## License

MIT
