# TODO: Complete Telugu Language Support for Mock Tests & Dashboard

## Steps
- [ ] Step 1: Update `locales/en/translation.json` — add `questionBank` section with all 75 questions keyed by subject, plus missing UI keys for dashboard/recommendations.
- [ ] Step 2: Update `locales/te/translation.json` — add Telugu translations for all 75 questions and missing UI keys.
- [ ] Step 3: Update `script.js` — add `getQuestionBank()` helper, listen to `languageChanged`, translate all dynamic HTML strings with `t()`.
- [ ] Step 4: Update `index.html` — add `data-i18n` attributes to all hardcoded dashboard labels, panel titles, stat labels, empty states.
- [ ] Step 5: Test language switcher end-to-end (mock test questions + dashboard in Telugu).

