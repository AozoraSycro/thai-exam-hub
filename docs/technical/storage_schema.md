# Thai Exam Hub - LocalStorage Schema v1.0

This document defines the persistent data structure stored in the browser's `localStorage` for Thai Exam Hub. All keys are prefixed with `teh_` to prevent collisions.

## 1. Core Metadata
- **Key**: `teh_version`
- **Type**: `String`
- **Current Value**: `"1.0"`

## 2. Data Structures

### 2.1. Streak Tracking
Tracks consecutive days of user activity using the **Asia/Bangkok** timezone.
- **Key**: `teh_streak`
- **Schema**:
```typescript
interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // "YYYY-MM-DD" in Asia/Bangkok
  totalDaysActive: number;
}
```

### 2.2. User Progress
Tracks the current state of a specific exam attempt. One entry per exam.
- **Key**: `teh_progress_{examId}` (e.g., `teh_progress_onet_math_2566`)
- **Schema**:
```typescript
interface Progress {
  examId: string;
  startedAt: string; // ISO Timestamp
  completedAt: string | null; // ISO Timestamp
  updatedAt: string; // ISO Timestamp
  answers: { [questionIndex: number]: number }; // Map of index to selected option index
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
}
```

### 2.3. Bookmarks
A collection of specific questions saved for later review.
- **Key**: `teh_bookmarks`
- **Schema**:
```typescript
interface BookmarkMap {
  [examId_questionIndex: string]: {
    examId: string;
    questionIndex: number;
    bookmarkedAt: string; // ISO Timestamp
    note: string | null;
  };
}
```

### 2.4. Global Statistics
Aggregate data across all subjects and exams.
- **Key**: `teh_stats`
- **Schema**:
```typescript
interface Stats {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  bySubject: {
    [subjectKey: string]: {
      answered: number;
      correct: number;
    };
  };
  examsCompleted: string[]; // Array of examIds
}
```

## 3. Storage Policies
- **Timezone**: All date-based logic (streaks) uses `Asia/Bangkok` via `Intl.DateTimeFormat`.
- **Integrity**: `storage.js` wraps all `JSON.parse` and `localStorage` calls in try-catch blocks to handle corruption and `QuotaExceededError`.
- **Export/Import**: The system supports full export/import of all `teh_*` keys in a single JSON bundle for backup/sync purposes.
- **Migration**: Future schema changes will increment `teh_version` and implement logic in `Storage.migrate()`.
