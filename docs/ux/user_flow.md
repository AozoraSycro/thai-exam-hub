# UX DESIGN DOCUMENT: Thai Exam Hub
**Designer**: Tsukuyomi — Master of UX Research
**Date**: October 27, 2023
**Focus**: Seamless mobile-first exam practice for Thai students (Gen Z)

---

## 1. DESIGN STRATEGY
The "Moonlight" approach: Providing a calm, focused, and rewarding environment for students during the high-pressure TCAS season. The design prioritizes speed (mobile-first), clarity (clean typography), and emotional support (gamification).

### Core Principles
1.  **Zero Friction**: No login required. The student's journey from landing to the first question should take less than 3 taps.
2.  **Immediate Value**: Instant feedback helps students learn from mistakes while their mental model of the question is still active.
3.  **Progressive Disclosure**: Detailed explanations and stats are tucked away until the student asks for them, keeping the quiz interface clean.

---

## 2. THE USER JOURNEY

### Phase 1: Landing & Motivation (Dashboard)
*   **Actor**: Student (Nong Fah or Nong Peach)
*   **Screen**: `index.html`
*   **Actions**:
    *   Views **Daily Streak** status (e.g., "3 Day Streak! 🔥").
    *   Selects a **Subject Card** (Teal-green theme).
*   **Emotional State**: Determined but potentially overwhelmed.
*   **UX Detail**: The streak is the first thing they see—a small hit of dopamine and a reminder of their consistency.

### Phase 2: Selection (Exam List)
*   **Screen**: `subjects/[subject].html`
*   **Actions**:
    *   Browses available exam years (e.g., TGAT 2567, A-Level 2566).
    *   Sees completion status of each set (e.g., "70% Completed").
*   **UX Detail**: Visual progress bars on each exam card provide a sense of completionist satisfaction.

### Phase 3: The Flow (Quiz Mode)
*   **Screen**: `quiz.html`
*   **Actions**:
    *   **The Question**: Clear Thai text with large, tappable option buttons (minimum 44x44px).
    *   **The Choice**: Taps an option.
    *   **The Feedback**: UI instantly updates. Correct = Green glow; Incorrect = Red shake + Highlight correct answer.
    *   **The Learning**: Explanation card slides up from the bottom (Progressive Disclosure).
*   **UX Detail**: "One question at a time" focus to reduce cognitive load. A subtle timer at the top right tracks pace without inducing panic.

### Phase 4: Closure & Reward (Results)
*   **Screen**: `results.html`
*   **Actions**:
    *   Sees **Final Score** with a grade (A, B, C, D).
    *   Views **Score Improvement Graph** (comparing current score to past attempts in this subject).
    *   Clicks **"Share to Friend"** to post on Twitter/X or LINE.
*   **UX Detail**: Confetti animation for scores >80% to celebrate the win.

### Phase 5: Consolidation (Review Mode)
*   **Screen**: `results.html` (Review section)
*   **Actions**:
    *   Filters to see only missed questions.
    *   Deep-dives into explanations.
    *   Bookmarks "killer questions" for later review.
*   **UX Detail**: This phase turns "failure" into a "learning opportunity," reducing the negative emotion of a low score.

---

## 3. KEY MOMENTS OF DELIGHT

### ✨ Moment 1: The "Fire" Streak System
*   **What**: A visual counter on the dashboard that increments every day the user completes at least 5 questions.
*   **Why**: Leverages the *Endowment Effect* and *Loss Aversion*. Once a student hits a 5-day streak, they are significantly more likely to return just to "keep the fire burning."
*   **Design**: A burning orange flame icon that turns grey if the streak is at risk (24h since last quiz).

### ✨ Moment 2: The "Ascension" Graph
*   **What**: A simple line chart on the results page showing the last 5 attempts for that subject.
*   **Why**: Provides a visual representation of the *Growth Mindset*. Seeing the line go up (even slightly) validates their effort and reduces exam anxiety.
*   **Design**: Clean teal line with dots. A "Trend" arrow showing percentage improvement (e.g., "+15% vs last week").

### ✨ Moment 3: The "Flex" Share Card
*   **What**: A generated image/text snippet: "I just scored 45/50 on TGAT English! 🏆 My streak: 7 Days. Practice with me at Thai Exam Hub!"
*   **Why**: Social proof and community. Thai students are highly active in "Studygram" and Twitter study circles.
*   **Design**: A beautiful, minimalist "Share Card" with a QR code, optimized for Instagram Stories and Twitter.

---

## 4. INFORMATION ARCHITECTURE (IA)
| Level 1 (Home) | Level 2 (Category) | Level 3 (Action) | Level 4 (Outcome) |
|---|---|---|---|
| Dashboard | Subject: Math | Exam: ONET 2567 | Result Card |
| Streak Counter | Subject: English | Exam: TGAT 2567 | Improvement Graph |
| Progress Summary | Subject: Science | Exam: Mock 1 | Review List |
| | Subject: Thai | | Share Action |
| | Subject: Social | | |

---

## 5. ACCESSIBILITY & MOBILE-FIRST SPEC
*   **Tap Targets**: All buttons are minimum 48px height for thumb-use.
*   **Typography**: Thai text (Sarabun/Kanit) at 16px minimum for body, 18-20px for question text.
*   **Color Contrast**: AA compliant teal (#1D9E75) against white background.
*   **Offline Support**: Once a subject JSON is loaded, the student can finish the quiz even if they enter a "dead zone" (e.g., on the BTS/MRT).

---
*End of Document*
