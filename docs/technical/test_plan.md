# TEST PLAN: Thai Exam Hub
**Version**: 1.0  
**Author**: Artemis  
**Status**: Draft

## 1. Overview
This test plan defines the strategy and specific test cases for validating the core functionality of Thai Exam Hub. As the "Goddess of the Hunt," we prioritize precision in scoring, robustness in data persistence, and seamless mobile interaction.

## 2. Test Strategy
- **Unit Testing**: Focus on `storage.js` (streak logic) and `quiz.js` (scoring engine).
- **Integration Testing**: Interaction between JSON data loading and UI rendering.
- **System Testing**: End-to-end quiz flow from selection to result persistence.
- **Mobile/UX Testing**: Touch response and layout integrity on mobile viewports.

---

## 3. High-Priority Focus Areas

### 3.1 Quiz Scoring Accuracy
**Risk**: Incorrect score calculation leads to user distrust and educational misinformation.  
**Strategy**: Test against various answer patterns (all correct, all wrong, skipped, mixed).

### 3.2 Streak Counter (Midnight/Timezone)
**Risk**: Streak resets prematurely or fails to increment due to date calculation errors around 00:00.  
**Strategy**: Simulate system clock changes to test rollover at 23:59 vs 00:01 across different days.

### 3.3 localStorage Quota Handling
**Risk**: `QuotaExceededError` crashes the app if the user has excessive history or other site data.  
**Strategy**: Mock a full `localStorage` and verify graceful degradation (e.g., error messaging, FIFO cleanup).

### 3.4 Mobile Touch Behavior
**Risk**: "Ghost clicks" or 300ms delay on older mobile browsers; accidental answer selection during scrolling.  
**Strategy**: Verify `touchstart`/`touchend` events and scroll-lock behavior during interaction.

---

## 4. Manual Test Cases

| ID | Title | Steps | Expected Result |
|:---|:---|:---|:---|
| **TC-01** | Perfect Score Accuracy | 1. Load a quiz (10 Qs).<br>2. Answer all questions correctly.<br>3. Submit. | Score shows 10/10 (100%). History saved correctly. |
| **TC-02** | Zero Score Accuracy | 1. Load a quiz.<br>2. Answer all questions incorrectly.<br>3. Submit. | Score shows 0/X (0%). History saved correctly. |
| **TC-03** | Streak Increment | 1. Complete a quiz on Day 1.<br>2. Wait 24 hours (or simulate).<br>3. Complete a quiz on Day 2. | `currentStreak` increments to 2. `lastActiveDate` updates. |
| **TC-04** | Streak Reset (Gap) | 1. Complete quiz on Day 1.<br>2. Skip Day 2.<br>3. Complete quiz on Day 3. | `currentStreak` resets to 1. `longestStreak` remains unchanged. |
| **TC-05** | Midnight Rollover | 1. Start quiz at 23:58.<br>2. Finish quiz at 00:02 (Next day). | Streak increments for the new day. No logic crash due to date change. |
| **TC-06** | LocalStorage Full | 1. Use script to fill `localStorage` to 5MB.<br>2. Attempt to finish a quiz. | App catches `QuotaExceededError`. User warned or old history purged. |
| **TC-07** | Touch Latency | 1. Open on Mobile Chrome/Safari.<br>2. Rapidly tap multiple choice options. | Options highlight instantly (no 300ms delay). No double-selection. |
| **TC-08** | Scroll vs Tap | 1. Use touch to scroll vertically through long questions.<br>2. Release finger over an option. | Scroll completes smoothly. No option is selected by the scroll release. |
| **TC-09** | Persistent Progress | 1. Start quiz (answer 3/10).<br>2. Refresh page/tab.<br>3. Resume quiz. | Progress (3/10) is restored from `teh_progress`. Timer continues. |
| **TC-10** | Timezone Variance | 1. Set system clock to GMT-12.<br>2. Complete quiz.<br>3. Set clock to GMT+12. | Streak logic uses ISO date strings (UTC) to avoid local offset errors. |

---

## 5. Pass/Exit Criteria
- 100% of "High" priority test cases pass.
- No critical bugs (P0/P1) remaining in the `storage.js` or `quiz.js` logic.
- Mobile UI remains functional on viewports down to 320px width.

## 6. Recommendations
1. **Automation**: Implement Vitest for `storage.js` to automate streak edge cases.
2. **Defensive Coding**: Add a `try/catch` wrapper around all `localStorage.setItem` calls.
3. **Visual Regression**: Use Playwright to ensure mobile layout doesn't break when Thai text wraps in long questions.
