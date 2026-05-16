# PRD: Study Hub (สรุปเนื้อหา)

**Version**: 1.0 | **Status**: Draft
**Author**: Athena | **Date**: 2024-05-22
**PM Owner**: Athena | **Eng Lead**: Thor

## 1. Problem Statement
Many students feel intimidated when jumping directly into a quiz, especially for heavy subjects like Mathematics or Physics. They often search for external "cheat sheets" or summaries before practicing. By not providing these resources, Thai Exam Hub misses an opportunity to keep users on-site and provide a holistic learning experience.

**Evidence:**
- Users often bounce from the subject page if they feel unprepared.
- High demand for "สรุปสูตร" (formula summaries) in Thai student communities.

## 2. Goals & Success Metrics
### Primary Goal
To provide a friction-less "prep-layer" before quizzes that consolidates key formulas and concepts in a mobile-optimized format.

### Success Metrics
- **Feature Adoption**: 40% of users visiting a subject page click on the "Study Mode" toggle.
- **Engagement**: Increase in average session duration by 2+ minutes.
- **Conversion**: 20% higher quiz completion rate for users who viewed the summary first.

### Anti-goals
- We are NOT building long-form textbooks.
- We are NOT hosting video lectures.
- We are NOT allowing user-generated summaries in V1.

## 3. User Stories
| ID | Persona | User Story | Acceptance Criteria (Gherkin) |
|---|---|---|---|
| US.1 | ม.ปลาย Student | As a student, I want to toggle between "Practice" and "Study" modes on the subject page so I can choose how to spend my time. | **Given** I am on the Subject page, **When** I click the "Study Mode" toggle, **Then** the list of exams is replaced by a content summary. |
| US.2 | ม.ปลาย Student | As a student, I want to see math formulas rendered clearly (LaTeX) so that I can study complex equations without confusion. | **Given** I am in Study Mode, **When** I view a Math summary, **Then** formulas should be rendered using professional mathematical notation. |
| US.3 | ม.ปลาย Student | As a student on mobile, I want a distraction-free "Read Mode" so that I can study while commuting. | **Given** I am in Study Mode, **When** I scroll through the content, **Then** the UI should maximize reading space and minimize navigation clutter. |

## 4. Functional Requirements
| ID | Feature | Description | Priority |
|---|---|---|---|
| FR.1 | Study/Quiz Toggle | A prominent switch on `subject.html` to flip between Exam List and Study Summary. | P0 |
| FR.2 | LaTeX Support | Integration of `KaTeX` or similar lightweight library to render `$...$` or `$$...$$` blocks. | P0 |
| FR.3 | Markdown Content | Summaries stored as Markdown-like strings in JSON to support lists, bold text, and headings. | P1 |
| FR.4 | Read Mode UI | A dedicated CSS layout for the summary that uses larger line-height and optimized font sizes for mobile. | P1 |
| FR.5 | Subject Mapping | Each subject (Math, Physics, etc.) has a corresponding summary file or JSON entry. | P0 |

## 5. Non-Functional Requirements
- **Performance**: The LaTeX library must be loaded lazily only when Study Mode is activated to maintain fast initial load.
- **Responsibility**: Formulas must be horizontally scrollable if they exceed screen width on mobile.
- **Accessibility**: Ensure high contrast for mathematical symbols.

## 6. User Experience
### User Flow
1. **Subject Selection**: User selects "Math" from home.
2. **Subject Dashboard**: User arrives at `subject.html`.
3. **Mode Switch**: User clicks the "สรุปเนื้อหา" (Study Hub) tab/toggle.
4. **Study**: User reads through mobile-optimized notes and formulas.
5. **Action**: User clicks "ไปทำข้อสอบ" (Go to Quiz) button at the bottom of the summary to return to the exam list.

### UI Specs
- **Font**: Sarabun (18px for body, 22px for sub-headers).
- **Math**: KaTeX font (Standard LaTeX look).
- **Spacing**: Increased padding (20px) on mobile edges to prevent "text-cramming".

## 7. Technical Considerations
- **Data Storage**: Summaries will be stored in `/data/summaries/[subject_id].json`.
- **Renderer**: A simple JS function to convert basic Markdown + KaTeX tags into HTML.
- **State**: The `app.js` will handle the toggle state and fetch content on demand.

## 8. Dependencies & Risks
| Risk | Impact | Mitigation Strategy |
|---|---|---|
| Math Rendering Performance | Low | Use KaTeX (the fastest LaTeX web renderer) and local CSS. |
| Content Creation Effort | High | Start with P0 subjects (Math/Physics) where formulas are the primary value. |
| Mobile Layout Breaks | Medium | Use `overflow-x: auto` for all formula blocks. |

## 9. Timeline & Phases
- **Phase 1**: Toggle UI + Math 1 Summary (Static).
- **Phase 2**: KaTeX integration + Markdown parser.
- **Phase 3**: Physics and English summaries.
- **Phase 4**: Search within summary + Bookmarking.

## 10. Open Questions
- Should summaries be specific to exam types (e.g., TGAT vs A-Level) or general per subject?
- Do we need "Image support" within summaries for diagrams? (Yes, likely needed for Science).
