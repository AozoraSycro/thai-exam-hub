## CODEBASE INVESTIGATION REPORT - Thai Exam Hub
**Date**: 2024-05-22

### System Overview
Thai Exam Hub is a web-based examination platform for Thai students. It provides quizzes for various subjects (Math, English, Science, etc.) with score tracking and a dashboard.

### Architecture Summary
[Frontend] -> [JS Logic (app.js, quiz.js)] -> [Storage (storage.js / localStorage)]
                                         -> [Data (JSON files)]

### Entry Points
- `index.html`: Dashboard and subject selection.
- `quiz.html`: The main examination interface.

### Data Flow (Key Paths)
1. User selects a subject on `index.html`.
2. Navigation to `subjects/math.html` (managed by `app.js`).
3. `app.js` fetches `subjects.json`, filters by subject, and renders exam list.
4. User clicks "เริ่มทำข้อสอบ", navigating to `quiz.html?id=exam_id`.
5. `quiz.js` fetches `data/exam_id.json`, manages quiz state.
6. Upon completion, `storage.js` saves the result to `localStorage`.
7. Dashboard (`index.html`) updates with new stats and history.

### Prioritized Fix List

#### 🔴 High Priority: Hardcoded Thai Text & Localization
- **Issue**: UI strings are hardcoded across all HTML and JS files.
- **Location**: `app.js`, `quiz.js`, and every `.html` file.
- **Fix**: Centralize all Thai strings into a `js/i18n.js` or a config JSON file to support future updates and potential multi-language support.

#### 🟡 Medium Priority: Dead Code & Redundancy
- **Issue**: Orphaned file `results.html` is never linked.
- **Location**: `thai-exam-hub/results.html`.
- **Fix**: Remove the file or integrate it as a detailed history view.
- **Issue**: Redundant subject pages.
- **Location**: `thai-exam-hub/subjects/*.html`.
- **Fix**: Replace with a single `subject.html` that uses URL parameters (e.g., `subject.html?type=math`).
- **Issue**: Unused JS functions in storage.
- **Location**: `storage.js` (`getBookmarks`, `toggleBookmark`, `isBookmarked`).
- **Fix**: Remove if not planned, or implement the bookmarking feature in `quiz.html`.

#### 🔵 Low Priority: Data & UI Optimization
- **Issue**: Unused JSON fields.
- **Location**: `subjects.json` (`difficulty`), `exam.json` (`explanation`).
- **Fix**: The `explanation` field is high-value; update `quiz.js` to display it after a user answers or at the end of the quiz.
- **Issue**: Selected but unused DOM elements.
- **Location**: `quiz.js` (`explanationContainer`).
- **Fix**: Use this container to show the `explanation` from the JSON data.

### Detailed Findings

#### Unused CSS
- No significant unused CSS classes found; however, the CSS is monolithic. Moving to component-based CSS or removing orphan classes if any are found during refactoring is recommended.

#### JS Functions Never Called
- `Storage.getBookmarks()`
- `Storage.toggleBookmark()`
- `Storage.isBookmarked()`

#### JSON Fields Not Referenced
- `subjects[].difficulty`
- `questions[].explanation` (Data exists but UI does not render it)

#### Hardcoded Thai Text Locations
- **JS**: Error messages, progress indicators ("ข้อที่...", "ส่งข้อสอบ"), subject descriptions in `app.js`.
- **HTML**: Nav links, page titles, footer credits, ad placeholders.

### Recommended Reading Order
1. `js/storage.js`: Understand the data schema.
2. `js/app.js`: See how the dashboard and lists are rendered.
3. `js/quiz.js`: Study the quiz engine logic.
4. `data/subjects.json`: View the exam catalog structure.
