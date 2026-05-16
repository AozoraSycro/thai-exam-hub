/**
 * quiz.js - The Quiz Engine
 * Handles question rendering, timer, user input, scoring, and progress saving.
 */

import { Storage } from './storage.js';

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
            bookmarkBtn: document.getElementById('bookmark-btn'),
            chartContainer: document.getElementById('results-chart-container')
        };
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        this.examId = urlParams.get('id');

        if (!this.examId) {
            this.handleError('ไม่พบรหัสข้อสอบ');
            return;
        }

        await this.loadExamData();
        this.startTimer();
        this.startTime = new Date();
        this.renderQuestion();
    }

    async loadExamData() {
        try {
            const response = await fetch(`./data/${this.examId}.json`);
            if (!response.ok) throw new Error('Exam file not found');
            const data = await response.json();
            
            this.questions = data.questions;
            this.examTitle = data.title;
            this.subject = data.subject;
            this.secondsRemaining = (data.duration_minutes || 60) * 60;
            
            if (this.elements.totalNum) this.elements.totalNum.textContent = this.questions.length;
            document.title = `${this.examTitle} - Thai Exam Hub`;
        } catch (e) {
            this.handleError('ไม่สามารถโหลดข้อสอบได้ กรุณาลองใหม่อีกครั้ง');
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.secondsRemaining--;
            this.updateTimerDisplay();
            if (this.secondsRemaining <= 0) {
                this.finishQuiz();
            }
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
        
        // Update Progress Bar
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        if (this.elements.progressBar) this.elements.progressBar.style.width = `${progress}%`;

        // Render Options
        this.elements.optionsGrid.innerHTML = q.options.map((opt, i) => `
            <button class="option-btn ${this.userAnswers[this.currentIndex] === i ? 'selected' : ''}" 
                    onclick="window.engine.selectOption(${i})">
                <span class="option-label">${String.fromCharCode(65 + i)}</span>
                <span class="option-text">${opt}</span>
            </button>
        `).join('');

        // Update Nav Buttons
        this.elements.prevBtn.disabled = this.currentIndex === 0;
        if (this.currentIndex === this.questions.length - 1) {
            this.elements.nextBtn.style.display = 'none';
            this.elements.submitBtn.style.display = 'block';
        } else {
            this.elements.nextBtn.style.display = 'block';
            this.elements.submitBtn.style.display = 'none';
        }

        // Bookmark state
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
        }
    }

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
        }
    }

    toggleBookmark() {
        const isBookmarked = Storage.toggleBookmark(this.examId, this.currentIndex);
        this.updateBookmarkUI();
    }

    updateBookmarkUI() {
        const isBookmarked = Storage.isBookmarked(this.examId, this.currentIndex);
        if (this.elements.bookmarkBtn) {
            this.elements.bookmarkBtn.classList.toggle('active', isBookmarked);
            this.elements.bookmarkBtn.querySelector('i').className = isBookmarked ? 'fas fa-star' : 'far fa-star';
        }
    }

    finishQuiz() {
        clearInterval(this.timer);
        const endTime = new Date();
        const timeSpent = Math.floor((endTime - this.startTime) / 1000);
        
        let score = 0;
        this.questions.forEach((q, i) => {
            const isCorrect = this.userAnswers[i] === q.answer;
            if (isCorrect) score++;
            
            // Fallback for tags if not present in JSON
            const tags = q.tags || [this.subject.toUpperCase()];
            Storage.recordAnswer(this.subject, isCorrect, tags);
        });

        const progressData = {
            startedAt: this.startTime.toISOString(),
            completedAt: endTime.toISOString(),
            answers: this.userAnswers,
            score: score,
            totalQuestions: this.questions.length,
            timeSpentSeconds: timeSpent
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
            this.renderCharts();
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
                <div class="explanation">
                    <strong>💡 คำอธิบาย:</strong> ${q.explanation}
                </div>
            `;
            this.elements.explanationContainer.appendChild(item);
        });
    }

    renderCharts() {
        const stats = Storage.getStats();
        const canvas = document.getElementById('results-radar-chart');
        if (!canvas) return;

        const subjects = Object.keys(stats.bySubject);
        const data = subjects.map(s => {
            const stat = stats.bySubject[s];
            return (stat.correct / stat.answered) * 100;
        });

        new Chart(canvas, {
            type: 'radar',
            data: {
                labels: subjects.map(s => s.toUpperCase()),
                datasets: [{
                    label: 'Performance (%)',
                    data: data,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    handleError(msg) {
        alert(msg);
        window.location.href = 'index.html';
    }
}

// Global instance for inline onclick handlers
window.engine = new QuizEngine();
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-view')) {
        window.engine.init();
    }
});
