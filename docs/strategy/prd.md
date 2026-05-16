# PRD: Thai Exam Hub

**Version**: 1.0 | **Status**: Draft
**Author**: Athena | **Date**: 2023-10-27
**PM Owner**: Athena | **Eng Lead**: Thor

## 1. Problem Statement
Thai high school students (ม.ปลาย) face significant financial and accessibility barriers when preparing for high-stakes exams (TCAS: TGAT, TPAT, A-Level). While premium tutoring platforms exist, there is a lack of high-quality, **free**, and mobile-friendly exam practice tools that provide instant feedback and progress tracking without requiring expensive subscriptions or complex setups.

**Evidence:**
- High search volume for "แนวข้อสอบ" (exam trends) and "ข้อสอบเก่า" (past papers) in Thai.
- Vibrant but fragmented study communities on Twitter/X, TikTok, and LINE OpenChat seeking consolidated resources.
- Existing free platforms often have poor UI/UX, lack mobile responsiveness, or are cluttered with outdated content.

## 2. Goals & Success Metrics
### Primary Goal
To become the go-to free platform for Thai students to practice TCAS exams through a frictionless, no-login web experience.

### Success Metrics
- **Revenue Target**: 500 THB/week ad revenue from Google AdSense.
- **Traffic Target**: ~1,500 Unique Visitors (UV) per day.
- **Engagement**: Average of 2 quizzes completed per user session.
- **Retention**: 30% Day-7 return rate (driven by streak system).

### Anti-goals
- We are NOT building a social network (no profiles, no comments).
- We are NOT hosting video lessons (text-based practice and explanations only).
- We are NOT building a native mobile app (Web-only via GitHub Pages for zero cost).
- We are NOT handling user accounts on a server (localStorage only).

## 3. User Stories
| ID | Persona | User Story | Acceptance Criteria (Gherkin) |
|---|---|---|---|
| US.1 | ม.ปลาย Student | As a student, I want to select a specific subject so that I can focus my practice on my weak areas. | **Given** I am on the home page, **When** I click a subject card, **Then** I should see a list of available exam years for that subject. |
| US.2 | ม.ปลาย Student | As a student, I want to see instant feedback for each answer so that I can learn from my mistakes immediately. | **Given** I am in quiz mode, **When** I select an option, **Then** the app should highlight the correct answer and show an explanation. |
| US.3 | ม.ปลาย Student | As a student, I want my progress to be saved automatically so that I don't lose my streak when I close the browser. | **Given** I complete a quiz, **When** I return to the site later, **Then** my dashboard should reflect my updated history and streak. |
| US.4 | ม.ปลาย Student | As a student, I want to review all wrong answers at the end of a quiz so that I can consolidate my learning. | **Given** I am on the results screen, **When** I click "Review Wrong Answers", **Then** I should see a filtered list of only the questions I missed. |

## 4. Functional Requirements
| ID | Feature | Description | Priority |
|---|---|---|---|
| FR.1 | Subject Dashboard | Landing page showing Math, English, Science, Thai, Social cards. | P0 |
| FR.2 | Quiz Engine | Ability to load JSON data and render a multiple-choice quiz (one question at a time or list view). | P0 |
| FR.3 | Scoring System | Calculate score percentage and grade upon completion. | P0 |
| FR.4 | Local Persistence | Save quiz history, bookmarks, and streaks to `localStorage`. | P0 |
| FR.5 | Explanations | Display a "Why this is correct" text block for every question. | P1 |
| FR.6 | Timer | Track time taken for each quiz to simulate exam conditions. | P1 |
| FR.7 | Ad Placements | Integration of AdSense slots (Top, Sidebar, Bottom). | P1 |
| FR.8 | Share to Social | Generate a "Share my score" text/image for LINE/Twitter. | P2 |

## 5. Non-Functional Requirements
- **Performance**: Lighthouse performance score > 90. Initial load < 2 seconds on 4G.
- **Scalability**: Must handle traffic spikes during TCAS season (Oct-Feb) via static hosting (GitHub Pages).
- **Accessibility**: Support for high-contrast text and screen readers (WCAG 2.1 Level AA).
- **Offline Capability**: Basic PWA features to allow practicing without an active internet connection after initial load.
- **Mobile-First**: 90%+ of users are expected to be on mobile devices.

## 6. User Experience
### User Flow
1. **Landing**: User lands on `index.html` → Views subject cards and current streak.
2. **Select**: User selects "English" → Shows list of years (e.g., ONET 2567, TGAT 2567).
3. **Practice**: User enters `quiz.html` → Answers questions with instant feedback toggle.
4. **Complete**: User reaches `results.html` → Sees score, time taken, and "Review" button.
5. **Review**: User looks at wrong answers and explanations.

### Design Principles
- **Clarity**: High legibility for Thai fonts (e.g., Kanit or Sarabun).
- **Focus**: Minimalist interface to reduce "exam anxiety".
- **Gamification**: Subtle use of streaks and progress bars to encourage daily use.

## 7. Technical Considerations
- **Architecture**: Single Page Application (SPA) feel using vanilla JS and HTML5.
- **Data**: Questions stored in static `.json` files for easy updates and low latency.
- **State Management**: Browser `localStorage` for all user-specific data (no backend/database costs).
- **Monetization**: Google AdSense auto-ads or fixed-unit placements.

## 8. Dependencies & Risks
| Risk | Impact | Mitigation Strategy |
|---|---|---|
| AdSense Rejection | High | Ensure content is original, high quality, and site has a Privacy Policy/Terms page. |
| localStorage Clearing | Medium | Warn users that clearing browser cache will reset progress; suggest "Export Data" feature later. |
| Content Accuracy | High | Implement a "Report Error" button for students to flag incorrect answers/explanations. |
| Copyright Claims | Medium | Use public domain past papers or generate original "trend-based" questions. |

## 9. Timeline & Phases
- **Phase 1 (MVP)**: Core quiz engine + Math & English content (Week 1-2).
- **Phase 2 (Retention)**: LocalStorage streak system + Explanations (Week 3).
- **Phase 3 (Monetization)**: AdSense integration + SEO Optimization (Week 4).
- **Phase 4 (GA)**: All 5 subjects + Social sharing + Launch campaign (Week 5).

## 10. Open Questions
- Should we support "Mock Exam" mode (timer + no instant feedback) vs "Practice" mode?
- How do we handle image-based questions (geometry/diagrams) within JSON while keeping load times low?
- What is the fallback if `localStorage` is disabled by the user?
