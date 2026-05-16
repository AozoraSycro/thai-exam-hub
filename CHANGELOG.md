# Changelog

All notable changes to the **Thai Exam Hub** project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]
### Planned
- Performance optimizations for slower mobile networks.
- Dark mode support.

---

## [1.2.0] - Future Release
### Added
- **LINE Integration**: Added "Share to LINE" button on the results page to allow students to boast about their scores or challenge friends.
- **Sharing Preview**: Optimized OpenGraph meta tags and generated dynamic sharing images for social platforms.
- **Result Summary**: A concise summary text designed for easy copy-pasting into chat apps.

---

## [1.1.0] - Upcoming Release
### Added
- **Streak System**: Implemented a daily streak counter to encourage consistent study habits.
- **Activity Tracking**: New `storage.js` logic to track consecutive days of activity.
- **Streak UI**: A prominent "Flame" icon in the navigation bar showing the current streak count.
- **Motivation Prompts**: Custom Thai messages that change based on the length of the user's streak.

---

## [1.0.0] - 2023-10-27
### Added
- **Core Subjects**: Initial release with 5 subjects: Thai, Math, Science, Social Studies, and English.
- **100 Questions**: 20 curated questions per subject based on ONET/TGAT/PAT patterns (2566-2567).
- **Quiz Engine**: 
  - Randomized question delivery.
  - Multiple choice selection with instant validation.
  - Timer functionality for exam simulation.
- **Progress Management**:
  - `localStorage` integration for persistent score history.
  - "Review Wrong Answers" feature to help students learn from mistakes.
- **Mobile-First Design**: Responsive UI using teal-green (#1D9E75) theme optimized for mobile WebView.
- **SEO Foundation**: Meta tags and semantic HTML for high-volume Thai exam keywords.
- **AdSense Ready**: Pre-defined ad zones for monetization.

---

## Release Process

### 1. Versioning Strategy
- **MAJOR**: Breaking changes (e.g., changing the data schema format in a way that breaks old `localStorage` data).
- **MINOR**: New features (e.g., new subjects, streak system, social sharing).
- **PATCH**: Bug fixes (e.g., fixing a typo in a question, UI layout fixes).

### 2. Branching & Merging
- `main`: Production-ready code. Always stable.
- `develop`: Integration branch for upcoming features.
- `feature/*`: Short-lived branches for specific features or bug fixes.

### 3. Release Steps
1. **Freeze**: Stop merging new features into `develop`.
2. **Review**: Run the `@artemis` test plan and verify `@heimdall` checklist.
3. **Changelog**: Move items from `[Unreleased]` to a new version section in this file.
4. **Tag**: Create a git tag (see below).
5. **Deploy**: Push to `main` to trigger the GitHub Actions workflow for GitHub Pages.

### 4. Git Tagging Protocol
Tags should be prefixed with `v`.
```bash
# Example for v1.0.0
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0: Initial Launch with 5 subjects"
git push origin v1.0.0
```

### 5. Release Notes Template
When creating a Release on GitHub, use the following template:

```markdown
## Thai Exam Hub [vX.Y.Z] - [Date]

### 🚀 Highlights
- [One sentence about the biggest change in this release]

### 📝 What's New
- [Feature 1]
- [Feature 2]

### 🐞 Bug Fixes
- [Fix 1]
- [Fix 2]

### 📦 Questions Updated
- Subjects: [Subject names]
- Total Questions added: [Number]

---
*Deployed to: https://[username].github.io/thai-exam-hub/*
```
