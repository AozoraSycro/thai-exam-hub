/**
 * quiz.js - The Quiz Engine
 * FIXED: Universal Path Depth & Environment Detection for GitHub Pages.
 */

import { Storage } from './storage.js';

const Config = {
    get isLocal() {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    },
    get basePath() {
        return this.isLocal ? '/' : '/thai-exam-hub/';
    },
    get dataPath() {
        return `${this.basePath}data/`;
    },
    get version() {
        return '1.1.' + new Date().getTime(); // Cache buster
    }
};

async function fetchJSON(url) {
    try {
        const response = await fetch(`${url}?v=${Config.version}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

class QuizEngine {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.userAnswers = {};
        this.timer = null;
        this.secondsRemaining = 0;
        this.examId = null;
        this.examTitle = '';
        this.subject = '';
        this.startTime = null;

        this.elements = {
            quizView: document.getElementById('quiz-view'),
            resultView: document.getElementById('result-view'),
            questionText: document.getElementById('question-text'),
            optionsGrid: document.getElementById('options-grid'),
            timerDisplay: document.getElementById('timer'),
            currentNum: document.getElementById('current-question-num'),
            totalNum: document.getElementById('total-questions'),
            progressBar: document.getElementById('quiz-progress-bar'),
            scoreDisplay: document.getElementById('score-display'),
            explanationContainer: document.getElementById('explanation-container'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            submitBtn: document.getElementById('submit-btn'),
            bookmarkBtn: document.getElementById('bookmark-btn')
        };
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        this.examId = urlParams.get('id');

        if (!this.examId) {
            this.handleError('ไม่พบรหัสข้อสอบ กรุณากลับไปหน้าหลัก');
            return;
        }

        try {
            await this.loadExamData();
            this.startTimer();
            this.startTime = new Date();
            this.renderQuestion();
        } catch (e) {
            this.handleError('ไม่สามารถโหลดข้อมูลข้อสอบได้: ' + e.message);
        }
    }

    async loadExamData() {
        // DEFENSE: Construct absolute-relative path
        const dataUrl = `${Config.dataPath}${this.examId}.json`;
        console.log('Loading exam from:', dataUrl);
        
        const data = await fetchJSON(dataUrl);
        this.questions = data.questions;
        this.examTitle = data.title;
        this.subject = data.subject || 'GENERAL';
        this.secondsRemaining = (data.duration_minutes || 60) * 60;
        
        if (this.elements.totalNum) this.elements.totalNum.textContent = this.questions.length;
        document.title = `${this.examTitle} - Thai Exam Hub`;
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.secondsRemaining--;
            this.updateTimerDisplay();
            if (this.secondsRemaining <= 0) this.finishQuiz();
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.secondsRemaining / 60);
        const secs = this.secondsRemaining % 60;
        if (this.elements.timerDisplay) {
            this.elements.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    renderQuestion() {
        const q = this.questions[this.currentIndex];
        if (!q) return;

        this.elements.questionText.textContent = q.text;
        this.elements.currentNum.textContent = this.currentIndex + 1;
        
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        if (this.elements.progressBar) this.elements.progressBar.style.width = `${progress}%`;

        this.elements.optionsGrid.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = `option-btn ${this.userAnswers[this.currentIndex] === i ? 'selected' : ''}`;
            btn.innerHTML = `<span class="option-label">${String.fromCharCode(65 + i)}</span><span class="option-text"></span>`;
            btn.querySelector('.option-text').textContent = opt;
            btn.onclick = () => this.selectOption(i);
            this.elements.optionsGrid.appendChild(btn);
        });

        this.elements.prevBtn.disabled = this.currentIndex === 0;
        if (this.currentIndex === this.questions.length - 1) {
            this.elements.nextBtn.style.display = 'none';
            this.elements.submitBtn.style.display = 'block';
        } else {
            this.elements.nextBtn.style.display = 'block';
            this.elements.submitBtn.style.display = 'none';
        }

        this.updateBookmarkUI();
    }

    selectOption(index) {
        this.userAnswers[this.currentIndex] = index;
        this.renderQuestion();
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.renderQuestion();
            window.scrollTo(0, 0);
        }
    }

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
            window.scrollTo(0, 0);
        }
    }

    toggleBookmark() {
        Storage.toggleBookmark(this.examId, this.currentIndex);
        this.updateBookmarkUI();
    }

    updateBookmarkUI() {
        const isBookmarked = Storage.isBookmarked(this.examId, this.currentIndex);
        if (this.elements.bookmarkBtn) {
            this.elements.bookmarkBtn.classList.toggle('active', isBookmarked);
            const icon = this.elements.bookmarkBtn.querySelector('i');
            if (icon) icon.className = isBookmarked ? 'fas fa-star' : 'far fa-star';
        }
    }

    finishQuiz() {
        clearInterval(this.timer);
        let score = 0;
        this.questions.forEach((q, i) => {
            const isCorrect = this.userAnswers[i] === q.answer;
            if (isCorrect) score++;
            Storage.recordAnswer(this.subject, isCorrect, q.tags || []);
        });

        const progressData = {
            completedAt: new Date().toISOString(),
            answers: this.userAnswers,
            score: score,
            totalQuestions: this.questions.length
        };

        Storage.saveProgress(this.examId, progressData);
        this.showResults(score, this.questions.length);
    }

    showResults(score, total) {
        if (this.elements.quizView) this.elements.quizView.style.display = 'none';
        if (this.elements.resultView) {
            this.elements.resultView.style.display = 'block';
            this.elements.scoreDisplay.textContent = `${score} / ${total}`;
            this.renderReview();
        }
        window.scrollTo(0, 0);
    }

    renderReview() {
        this.elements.explanationContainer.innerHTML = '<h3 class="section-title">เฉลยและคำอธิบาย</h3>';
        this.questions.forEach((q, i) => {
            const userAns = this.userAnswers[i];
            const isCorrect = userAns === q.answer;
            const item = document.createElement('div');
            item.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
            item.innerHTML = `
                <div class="review-question">ข้อที่ ${i + 1}: ${q.text}</div>
                <div class="review-answers">
                    <p>คำตอบของคุณ: <span class="user-ans">${userAns !== undefined ? q.options[userAns] : 'ไม่ได้ตอบ'}</span></p>
                    <p>คำตอบที่ถูกต้อง: <span class="correct-ans">${q.options[q.answer]}</span></p>
                </div>
                <div class="explanation"><strong>💡 คำอธิบาย:</strong> <span></span></div>
            `;
            item.querySelector('.explanation span').textContent = q.explanation || 'ไม่มีคำอธิบาย';
            this.elements.explanationContainer.appendChild(item);
        });
    }

    handleError(msg) {
        const container = document.getElementById('quiz-view');
        if (container) {
            container.innerHTML = `
                <div class="error-box" style="padding: 40px; text-align: center; background: var(--card-bg); border-radius: 20px; box-shadow: var(--shadow-soft);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 20px;"></i>
                    <h2>เกิดข้อผิดพลาด</h2>
                    <p style="color: var(--text-light); margin-bottom: 30px;">${msg}</p>
                    <a href="index.html" class="start-btn" style="text-decoration: none;">กลับหน้าหลัก</a>
                </div>
            `;
        }
    }
}

window.engine = new QuizEngine();
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-view')) window.engine.init();
});
