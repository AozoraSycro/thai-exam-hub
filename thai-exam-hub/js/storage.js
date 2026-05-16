/**
 * storage.js - The Persistence Layer of Thai Exam Hub (v1.1)
 * Handles Thai timezone (Asia/Bangkok) for streak tracking.
 */

const VERSION = "1.1";
const PREFIX = "teh_";

// Helper for Thai Date (Asia/Bangkok)
const getThaiDateString = () => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
};

const getYesterdayThaiDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(yesterday);
};

// Safe localStorage access
const getRaw = (key) => {
    try {
        return localStorage.getItem(PREFIX + key);
    } catch (e) {
        return null;
    }
};

const setRaw = (key, value) => {
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
    } catch (e) {
        return false;
    }
};

export const Storage = {
    init() {
        const currentVersion = localStorage.getItem(PREFIX + 'version');
        if (currentVersion !== VERSION) {
            this.migrate(currentVersion, VERSION);
        }
        this.updateStreak();
    },

    // --- Settings & Theme ---
    getSettings() {
        const raw = getRaw('settings');
        return raw ? JSON.parse(raw) : { theme: 'light' };
    },

    saveSettings(settings) {
        setRaw('settings', settings);
    },

    // --- Streak Management ---
    updateStreak() {
        const today = getThaiDateString();
        const yesterday = getYesterdayThaiDateString();
        let streak = this.getStreak();

        if (streak.lastActiveDate === today) return;

        if (streak.lastActiveDate === yesterday) {
            streak.currentStreak += 1;
        } else {
            streak.currentStreak = 1;
        }

        if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
        }

        streak.totalDaysActive += 1;
        streak.lastActiveDate = today;
        setRaw('streak', streak);
    },

    getStreak() {
        const raw = getRaw('streak');
        try {
            return raw ? JSON.parse(raw) : { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalDaysActive: 0 };
        } catch (e) {
            return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalDaysActive: 0 };
        }
    },

    // --- Progress & Analytics ---
    saveProgress(examId, progressData) {
        const data = { examId, ...progressData, updatedAt: new Date().toISOString() };
        setRaw(`progress_${examId}`, data);
        
        if (progressData.completedAt) {
            const stats = this.getStats();
            if (!stats.examsCompleted.includes(examId)) {
                stats.examsCompleted.push(examId);
                setRaw('stats', stats);
            }
        }
    },

    getProgress(examId) {
        const raw = getRaw(`progress_${examId}`);
        return raw ? JSON.parse(raw) : null;
    },

    getAllProgress() {
        const progress = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(PREFIX + 'progress_')) {
                progress.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        return progress.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    // --- Bookmarks ---
    toggleBookmark(examId, questionIndex, note = null) {
        const bookmarks = this._getRawBookmarks();
        const key = `${examId}_${questionIndex}`;
        let bookmarked = false;

        if (bookmarks[key]) {
            delete bookmarks[key];
        } else {
            bookmarks[key] = { examId, questionIndex, bookmarkedAt: new Date().toISOString(), note };
            bookmarked = true;
        }

        setRaw('bookmarks', bookmarks);
        return bookmarked;
    },

    _getRawBookmarks() {
        const raw = getRaw('bookmarks');
        return raw ? JSON.parse(raw) : {};
    },

    isBookmarked(examId, questionIndex) {
        return !!this._getRawBookmarks()[`${examId}_${questionIndex}`];
    },

    // --- Advanced Stats ---
    recordAnswer(subject, isCorrect, topicTag = 'general') {
        const stats = this.getStats();
        
        stats.totalQuestionsAnswered += 1;
        if (isCorrect) stats.totalCorrect += 1;

        if (!stats.bySubject[subject]) stats.bySubject[subject] = { answered: 0, correct: 0 };
        stats.bySubject[subject].answered += 1;
        if (isCorrect) stats.bySubject[subject].correct += 1;

        // Topic-based tracking for recommendations
        if (!stats.byTopic[topicTag]) stats.byTopic[topicTag] = { answered: 0, correct: 0, wrong: 0 };
        stats.byTopic[topicTag].answered += 1;
        if (isCorrect) {
            stats.byTopic[topicTag].correct += 1;
        } else {
            stats.byTopic[topicTag].wrong += 1;
        }

        setRaw('stats', stats);
    },

    getStats() {
        const raw = getRaw('stats');
        return raw ? JSON.parse(raw) : {
            totalQuestionsAnswered: 0,
            totalCorrect: 0,
            bySubject: {},
            byTopic: {},
            examsCompleted: []
        };
    },

    migrate(from, to) {
        // Initial setup for v1.1
        const stats = this.getStats();
        if (!stats.byTopic) stats.byTopic = {};
        setRaw('stats', stats);
        localStorage.setItem(PREFIX + 'version', VERSION);
    }
};

Storage.init();
