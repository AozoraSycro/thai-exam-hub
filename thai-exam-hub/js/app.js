/**
 * app.js - The Brain of Thai Exam Hub
 * FIXED: Resolved 'this.basePath' bug and implemented partitioned data loading.
 * Optimized for GitHub Pages subfolder environment.
 */

import { Storage } from './storage.js';

const Config = {
    get basePath() {
        const path = window.location.pathname;
        const repoName = 'thai-exam-hub';
        if (path.includes(`/${repoName}`)) return `/${repoName}/`;
        return '/';
    },
    get dataPath() {
        return `${this.basePath}data/`;
    },
    get version() {
        return '1.5.' + new Date().getTime(); // Instant cache refresh
    }
};

async function fetchJSON(url) {
    try {
        const response = await fetch(`${url}?v=${Config.version}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`[Odin] Fetch Failed: ${url}`, error);
        throw error;
    }
}

class ThemeManager {
    init() {
        const settings = Storage.getSettings();
        const currentTheme = settings.theme || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateIcon(currentTheme);
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle')) this.toggle();
        });
    }
    updateIcon(theme) {
        const icons = document.querySelectorAll('#theme-toggle i');
        icons.forEach(icon => { icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'; });
    }
    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        Storage.saveSettings({ theme: next });
        this.updateIcon(next);
    }
}

class App {
    constructor() {
        this.theme = new ThemeManager();
        this.subjectMeta = {
            'math': { title: 'คณิตศาสตร์', icon: '📐', file: 'sum_math.json' },
            'english': { title: 'ภาษาอังกฤษ', icon: '🌍', file: 'sum_english.json' },
            'science': { title: 'วิทยาศาสตร์', icon: '🧪', file: 'sum_science.json' },
            'medical': { title: 'กสพท / แพทย์', icon: '🩺', file: 'sum_medical.json' },
            'thai': { title: 'ภาษาไทย', icon: '📚', file: 'sum_thai.json' },
            'social': { title: 'สังคม / ครู', icon: '⚖️', file: 'sum_social.json' },
            'arts': { title: 'สถาปัตยกรรม', icon: '🎨', file: 'sum_arts.json' },
            'language': { title: 'ภาษาต่างประเทศ', icon: '⛩️', file: 'sum_language.json' },
            'elite': { title: 'Elite Mocks', icon: '💎', file: 'sum_elite.json' },
            'future': { title: 'ทักษะอนาคต', icon: '🚀', file: 'sum_future.json' }
        };
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
        
        grid.innerHTML = '';
        Object.entries(this.subjectMeta).forEach(([id, meta]) => {
            const card = document.createElement('a');
            card.href = `${Config.basePath}subject.html?s=${id}`;
            card.className = 'subject-card';
            card.innerHTML = `<span class="subject-icon">${meta.icon}</span><h3>${meta.title}</h3><p>${meta.description || ''}</p>`;
            grid.appendChild(card);
        });

        try {
            const exams = await fetchJSON(`${Config.dataPath}subjects.json`);
            const featuredEl = document.getElementById('featured-exams');
            if (featuredEl) {
                featuredEl.innerHTML = '';
                exams.slice(0, 6).forEach(exam => {
                    const div = document.createElement('div');
                    div.className = 'exam-card';
                    div.innerHTML = `<div class="exam-info"><h4></h4><p></p></div><button class="start-btn">เริ่มทำ</button>`;
                    div.querySelector('h4').textContent = exam.title;
                    div.querySelector('p').textContent = `${exam.year} • ${exam.duration_minutes} นาที`;
                    div.querySelector('button').onclick = () => location.href = `${Config.basePath}quiz.html?id=${exam.id}`;
                    featuredEl.appendChild(div);
                });
            }
        } catch (e) {
            console.error('Dashboard Error:', e);
        }
    }

    async renderSubjectPage(subjectId) {
        const meta = this.subjectMeta[subjectId];
        const titleEl = document.getElementById('subject-title');
        if (titleEl) titleEl.textContent = meta ? meta.title : 'คลังความรู้';

        const listEl = document.getElementById('exam-list');
        const gridEl = document.getElementById('knowledge-grid');

        try {
            // 1. Load Exams
            const exams = await fetchJSON(`${Config.dataPath}subjects.json`);
            const filtered = exams.filter(e => e.subject === subjectId);
            if (listEl) {
                listEl.innerHTML = filtered.length ? filtered.map(exam => `
                    <div class="exam-card">
                        <div class="exam-info">
                            <h4>${exam.title}</h4>
                            <p>ปี ${exam.year} • ${exam.duration_minutes} นาที</p>
                        </div>
                        <button class="start-btn" onclick="location.href='${Config.basePath}quiz.html?id=${exam.id}'">เริ่มทำข้อสอบ</button>
                    </div>
                `).join('') : '<p class="empty-state">ยังไม่มีข้อสอบในหมวดนี้</p>';
            }

            // 2. Load Summaries (Partitioned)
            if (meta && meta.file) {
                const summaries = await fetchJSON(`${Config.dataPath}${meta.file}`);
                this.renderSummaryGrid(summaries, subjectId);

                const searchInput = document.getElementById('summary-search');
                if (searchInput) {
                    searchInput.oninput = (e) => {
                        const q = e.target.value.toLowerCase();
                        const filtered = summaries.filter(s => (s.title || '').toLowerCase().includes(q) || (s.content || '').toLowerCase().includes(q));
                        this.renderSummaryGrid(filtered, subjectId);
                    };
                }
            } else if (gridEl) {
                gridEl.innerHTML = '<p class="empty-state">ไม่มีสรุปเนื้อหาสำหรับวิชานี้</p>';
            }
        } catch (e) {
            console.error('Subject Page Error:', e);
            if (listEl) listEl.innerHTML = '<p class="error">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
        }
    }

    renderSummaryGrid(summaries, subjectId) {
        const gridEl = document.getElementById('knowledge-grid');
        if (!gridEl) return;
        gridEl.innerHTML = summaries.length ? summaries.map(s => `
            <div class="summary-card">
                <div class="summary-info">
                    <span class="tag-meta">${(s.subject || subjectId).toUpperCase()}</span>
                    <h4>${s.title}</h4>
                    <p>${(s.content || '').substring(0, 100).replace(/[#*`$]/g, '')}...</p>
                </div>
                <a href="${Config.basePath}study.html?subject=${subjectId}&id=${s.id}" class="read-btn">อ่านสรุปความรู้</a>
            </div>
        `).join('') : '<p class="empty-state">ไม่พบเนื้อหา</p>';
    }

    renderRecommendations() {
        const container = document.getElementById('recommendations-container');
        if (!container) return;
        const stats = Storage.getStats();
        const topWeak = Object.entries(stats.byTopic || {}).sort((a, b) => b[1].wrong - a[1].wrong).filter(t => t[1].wrong > 0).slice(0, 3);
        if (topWeak.length === 0) {
            container.innerHTML = '<div class="info-card" style="padding:20px; text-align:center; background:var(--card-bg); border-radius:12px; border:1px solid var(--border-color);"><p>เริ่มทำข้อสอบเพื่อวิเคราะห์เนื้อหาที่คุณควรติวเพิ่ม!</p></div>';
            return;
        }
        container.innerHTML = `<div class="recommendation-grid">${topWeak.map(t => `<div class="recommend-card"><span class="tag-alert">ทบทวนด่วน</span><h4>เรื่อง: ${t[0]}</h4><p>พลาดไปแล้ว ${t[1].wrong} ครั้ง</p><a href="${Config.basePath}subject.html?s=search&q=${t[0]}" class="read-btn">หาเนื้อหาติว →</a></div>`).join('')}</div>`;
    }

    renderFullHistory() {
        const list = document.getElementById('history-list');
        if (!list) return;
        const history = Storage.getAllProgress();
        if (history.length === 0) { list.innerHTML = '<p class="empty-state">ยังไม่มีประวัติการสอบ</p>'; return; }
        list.innerHTML = history.map(item => `<div class="history-item"><div class="history-info"><strong>${(item.examId || 'EXAM').toUpperCase().replace(/_/g, ' ')}</strong><span>${item.completedAt ? new Date(item.completedAt).toLocaleDateString('th-TH') : '-'}</span></div><div class="history-score ${(item.score/item.totalQuestions) >= 0.5 ? 'pass' : 'fail'}">${item.score} / ${item.totalQuestions}</div></div>`).join('');
    }

    initCharts() {
        if (!window.Chart) return;
        const radarCtx = document.getElementById('subjectRadarChart');
        if (radarCtx) {
            const stats = Storage.getStats();
            const subjects = Object.keys(stats.bySubject);
            if (subjects.length >= 3) {
                const data = subjects.map(s => (stats.bySubject[s].correct / stats.bySubject[s].answered) * 100);
                new Chart(radarCtx, { type: 'radar', data: { labels: subjects.map(s => s.toUpperCase()), datasets: [{ label: 'ความแม่นยำ (%)', data: data, backgroundColor: 'rgba(14, 165, 233, 0.2)', borderColor: '#0ea5e9', pointBackgroundColor: '#0ea5e9' }] }, options: { scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } } });
            } else { radarCtx.parentElement.innerHTML = '<p class="empty-state">ทำข้อสอบให้ครบ 3 หมวดเพื่อแสดงกราฟ</p>'; }
        }
    }
}

const app = new App();
window.addEventListener('DOMContentLoaded', () => app.init());
