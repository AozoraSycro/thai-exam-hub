/**
 * app.js - The Brain of Thai Exam Hub
 * FIXED: Universal Data Loading with Subject Mapping for 500+ Summaries.
 */

import { Storage } from './storage.js';

class ThemeManager {
    init() {
        const settings = Storage.getSettings();
        document.documentElement.setAttribute('data-theme', settings.theme || 'light');
        this.injectToggle();
    }

    injectToggle() {
        if (document.getElementById('theme-toggle')) return;
        const btn = document.createElement('button');
        btn.id = 'theme-toggle';
        btn.className = 'floating-btn';
        this.updateToggleIcon(btn);
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);
    }

    updateToggleIcon(btn) {
        const theme = document.documentElement.getAttribute('data-theme');
        btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        Storage.saveSettings({ theme: next });
        this.updateToggleIcon(document.getElementById('theme-toggle'));
    }
}

class App {
    constructor() {
        this.theme = new ThemeManager();
        this.subjectMeta = {
            'math': { title: 'คณิตศาสตร์', icon: '📐', description: 'A-Level 1&2, TGAT 2, ONET', matchTags: ['math', 'mathematics'] },
            'english': { title: 'ภาษาอังกฤษ', icon: '🌍', description: 'TGAT 1, A-Level, ONET', matchTags: ['english'] },
            'science': { title: 'วิทยาศาสตร์', icon: '🧪', description: 'A-Level, TPAT 3, ONET', matchTags: ['science', 'physics', 'chemistry', 'biology'] },
            'medical': { title: 'กสพท / แพทย์', icon: '🩺', description: 'TPAT 1 วิชาเฉพาะแพทย์', matchTags: ['medical', 'medicine', 'ethics'] },
            'thai': { title: 'ภาษาไทย', icon: '📚', description: 'A-Level, ONET', matchTags: ['thai'] },
            'social': { title: 'สังคม / ครู', icon: '⚖️', description: 'A-Level, TPAT 5, ONET', matchTags: ['social', 'social studies', 'teacher', 'law'] },
            'arts': { title: 'สถาปัตย์/ศิลป์', icon: '🎨', description: 'TPAT 2 & TPAT 4', matchTags: ['arts', 'architecture', 'design'] },
            'language': { title: 'ภาษาต่างประเทศ', icon: '⛩️', description: 'A-Level 7 ภาษาหลัก', matchTags: ['language', 'foreign language', 'japanese', 'chinese', 'french', 'korean'] },
            'elite': { title: 'Elite Mocks', icon: '💎', description: 'ความยากระดับสูงสุด', matchTags: ['elite', 'mock'] },
            'future': { title: 'ทักษะอนาคต', icon: '🚀', description: 'TGAT 3, AI, Finance', matchTags: ['future', 'ai', 'finance', 'digital'] }
        };
        this.basePath = window.location.pathname.includes('/subjects/') || window.location.pathname.includes('/faq/') ? '../' : './';
    }

    async init() {
        this.theme.init();
        this.renderStats();
        this.renderRecommendations();
        
        const urlParams = new URLSearchParams(window.location.search);
        const subjectId = urlParams.get('s');

        if (document.getElementById('subject-grid')) await this.renderDashboard();
        if (subjectId && document.getElementById('subject-view')) await this.renderSubjectPage(subjectId);
        if (document.getElementById('history-list')) this.renderFullHistory();
        
        this.initCharts();
    }

    renderStats() {
        const stats = Storage.getStats();
        const streak = Storage.getStreak();
        document.querySelectorAll('#stat-total-solved').forEach(el => el.textContent = stats.totalQuestionsAnswered || 0);
        document.querySelectorAll('#stat-streak').forEach(el => el.textContent = streak.currentStreak || 0);
    }

    async renderDashboard() {
        const grid = document.getElementById('subject-grid');
        if (!grid) return;
        
        grid.innerHTML = Object.entries(this.subjectMeta).map(([id, meta]) => `
            <a href="${this.basePath}subject.html?s=${id}" class="subject-card">
                <span class="subject-icon">${meta.icon}</span>
                <h3>${meta.title}</h3>
                <p>${meta.description}</p>
            </a>
        `).join('');

        try {
            const response = await fetch(`${this.basePath}data/subjects.json`);
            const allExams = await response.json();
            const featuredEl = document.getElementById('featured-exams');
            if (featuredEl) {
                featuredEl.innerHTML = allExams.slice(0, 6).map(exam => `
                    <div class="exam-card">
                        <div class="exam-info">
                            <h4>${exam.title}</h4>
                            <p>${exam.year} • ${exam.duration_minutes} นาที</p>
                        </div>
                        <button class="start-btn" onclick="location.href='${this.basePath}quiz.html?id=${exam.id}'">เริ่มทำ</button>
                    </div>
                `).join('');
            }
        } catch (e) { console.error('Dashboard error:', e); }
    }

    async renderSubjectPage(subjectId) {
        const meta = this.subjectMeta[subjectId];
        const titleEl = document.getElementById('subject-title');
        if (titleEl) titleEl.textContent = meta ? meta.title : 'คลังความรู้';

        try {
            // 1. Load Exams
            const examRes = await fetch(`${this.basePath}data/subjects.json`);
            const exams = await examRes.json();
            const filteredExams = exams.filter(e => e.subject === subjectId);
            const listEl = document.getElementById('exam-list');
            if (listEl) {
                listEl.innerHTML = filteredExams.length ? filteredExams.map(exam => `
                    <div class="exam-card">
                        <div class="exam-info">
                            <h4>${exam.title}</h4>
                            <p>ปี ${exam.year} • ${exam.duration_minutes} นาที</p>
                        </div>
                        <button class="start-btn" onclick="location.href='${this.basePath}quiz.html?id=${exam.id}'">เริ่มทำข้อสอบ</button>
                    </div>
                `).join('') : '<p class="empty-state">ยังไม่มีข้อสอบในหมวดนี้</p>';
            }

            // 2. Load Summaries (Flexible Search)
            const sumRes = await fetch(`${this.basePath}data/summaries.json`);
            const allSummariesRaw = await sumRes.json();
            
            const matchTags = meta ? meta.matchTags : [subjectId];
            const summaries = allSummariesRaw.filter(s => {
                const sSubject = (s.subject || '').toLowerCase();
                const sTags = (s.tags || []).map(t => t.toLowerCase());
                const sTopicId = (s.topicId || '').toLowerCase();
                
                return matchTags.some(tag => 
                    sSubject.includes(tag) || 
                    sTags.includes(tag) || 
                    sTopicId === tag ||
                    (s.title || '').toLowerCase().includes(tag)
                );
            });

            this.renderSummaryGrid(summaries, subjectId);

            // Search Logic
            const searchInput = document.getElementById('summary-search');
            if (searchInput) {
                searchInput.oninput = (e) => {
                    const q = e.target.value.toLowerCase();
                    const filtered = summaries.filter(s => 
                        (s.title || '').toLowerCase().includes(q) || 
                        (s.content || '').toLowerCase().includes(q)
                    );
                    this.renderSummaryGrid(filtered, subjectId);
                };
            }
        } catch (e) { console.error('Subject error:', e); }
    }

    renderSummaryGrid(summaries, subjectId) {
        const gridEl = document.getElementById('knowledge-grid');
        if (!gridEl) return;
        gridEl.innerHTML = summaries.length ? summaries.map(s => `
            <div class="summary-card">
                <div class="summary-info">
                    <h4>${s.title}</h4>
                    <p>${(s.content || '').substring(0, 100).replace(/[#*`$]/g, '')}...</p>
                </div>
                <a href="${this.basePath}study.html?subject=${subjectId}&id=${s.id}" class="read-btn">อ่านสรุปความรู้</a>
            </div>
        `).join('') : '<p class="empty-state" style="grid-column: 1/-1;">ยังไม่มีเนื้อหาสรุปในหมวดนี้</p>';
    }

    renderRecommendations() {
        const container = document.getElementById('recommendations-container');
        if (!container) return;
        const stats = Storage.getStats();
        const topWeak = Object.entries(stats.byTopic || {}).sort((a, b) => b[1].wrong - a[1].wrong).filter(t => t[1].wrong > 0).slice(0, 3);
        if (topWeak.length === 0) {
            container.innerHTML = '<div class="info-card" style="padding:20px; text-align:center; background:var(--card-bg); border-radius:12px; border:1px solid var(--border-color);"><p>เริ่มทำข้อสอบเพื่อให้ระบบวิเคราะห์จุดที่ควรเน้น!</p></div>';
            return;
        }
        container.innerHTML = `<div class="recommendation-grid">${topWeak.map(t => `<div class="recommend-card"><span class="tag-alert">ทบทวนด่วน</span><h4>เรื่อง: ${t[0]}</h4><p>พลาดไปแล้ว ${t[1].wrong} ครั้ง</p><a href="${this.basePath}subject.html?s=search&q=${t[0]}" class="read-btn">หาเนื้อหาติว →</a></div>`).join('')}</div>`;
    }

    renderFullHistory() {
        const list = document.getElementById('history-list');
        if (!list) return;
        const history = Storage.getAllProgress();
        if (history.length === 0) { list.innerHTML = '<p class="empty-state">ยังไม่มีประวัติการสอบ</p>'; return; }
        list.innerHTML = history.map(item => `<div class="history-item"><div class="history-info"><strong>${item.examId.toUpperCase().replace(/_/g, ' ')}</strong><span>${new Date(item.completedAt).toLocaleDateString('th-TH')}</span></div><div class="history-score ${(item.score/item.totalQuestions) >= 0.5 ? 'pass' : 'fail'}">${item.score} / ${item.totalQuestions}</div></div>`).join('');
    }

    initCharts() {
        if (!window.Chart) return;
        const radarCtx = document.getElementById('subjectRadarChart') || document.getElementById('results-radar-chart');
        if (radarCtx) {
            const stats = Storage.getStats();
            const subjects = Object.keys(stats.bySubject);
            if (subjects.length >= 3) {
                const data = subjects.map(s => (stats.bySubject[s].correct / stats.bySubject[s].answered) * 100);
                new Chart(radarCtx, { type: 'radar', data: { labels: subjects.map(s => s.toUpperCase()), datasets: [{ label: 'ความแม่นยำ (%)', data: data, backgroundColor: 'rgba(14, 165, 233, 0.2)', borderColor: '#0ea5e9', pointBackgroundColor: '#0ea5e9' }] }, options: { scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } } });
            } else { radarCtx.parentElement.innerHTML = '<p class="empty-state">ทำข้อสอบให้ครบ 3 หมวดเพื่อแสดงกราฟ</p>'; }
        }
    }

    getDifficultyBadge(level) {
        if (level === 'hard') return '<span class="diff-badge hard">ยากมาก</span>';
        if (level === 'medium') return '<span class="diff-badge med">ปกติ</span>';
        return '<span class="diff-badge easy">ง่าย</span>';
    }
}

const app = new App();
window.addEventListener('DOMContentLoaded', () => app.init());
