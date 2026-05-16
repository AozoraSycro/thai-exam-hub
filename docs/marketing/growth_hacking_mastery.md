# Thai Exam Hub: Growth Hacking Mastery Strategy

**Objective**: Reach 1,500 Unique Visitors (UV) per day within 90 days with zero budget.
**Focus**: Viral Loops, Community Seeding, and Retention.

---

## 1. VIRAL LOOP DESIGN

### Loop 1: Score Sharing (Social Proof)
*   **Trigger**: User completes a quiz and sees the results page.
*   **Action**: Clicking "แชร์คะแนน" (Share Score) button.
*   **Mechanic**: Generates a shareable card (HTML5 Canvas or simple styled div) and pre-filled text for LINE/Twitter/Facebook.
*   **Share Text Template (Thai)**:
    > "สอบเสร็จแล้ว! 🚀 ฉันเพิ่งทำข้อสอบ {exam_name} ได้ {score}/{total} คะแนน ({percentage}%) บน Thai Exam Hub 
    > 
    > มาลองทำกันดูนะ ฝึกฟรี ไม่ต้องสมัครสมาชิก! 
    > ลิ้งค์: https://thaiexamhub.com/quiz.html?id={exam_id}
    > #ThaiExamHub #TCAS68 #DEK68 #เตรียมสอบ"
*   **Expected K-factor**: 0.15 (15% of users share, each share brings 1.2 new users).

### Loop 2: Challenge Friend (Competitive Loop)
*   **Trigger**: User scores > 70% on any exam.
*   **Action**: "ท้าเพื่อนทำข้อนี้" (Challenge a friend) button appears.
*   **Mechanic**: Generates a unique link containing `challengerScore`. If the friend uses the link, they see "You are challenging [Friend]'s score of X".
*   **Challenge Message (LINE format)**:
    > "🔥 กล้าป่าว? ฉันทำ {exam_name} ได้ {score}/{total} คะแนน ท้าให้เธอมาล้มสถิติฉัน! 
    > ใครแพ้เลี้ยงน้ำ! คลิกเลย: https://thaiexamhub.com/quiz.html?id={exam_id}&challenge={score}
    > #ThaiExamHub #ChallengeAccepted"
*   **Implementation**: Use URL parameters (`?challenge=80`) and `localStorage` to compare scores upon completion.

### Loop 3: Streak Guilt (Retention Loop)
*   **Trigger**: User has an active streak but hasn't visited for 24 hours.
*   **Action**: Browser Push Notification (Web Push API).
*   **Message Variations**:
    1.  "ไฟจะมอดแล้ว! 🔥 Streak {streak_count} วันของคุณกำลังจะหายไป เข้ามาทำสัก 5 ข้อเถอะ!"
    2.  "เพื่อนคนอื่นๆ ทำข้อสอบไปแล้ว 1,200 ข้อในวันนี้ คุณจะยอมแพ้หรอ? 📖"
    3.  "ความพยายามไม่เคยทรยศใคร... แต่ถ้าหยุดไป Streak หายนะ! กลับมาติวกันต่อเถอะ"

---

## 2. COMMUNITY SEEDING PLAYBOOK (4 WEEKS)

### Week 1: Soft Launch (LINE OpenChat)
*   **Target**: Groups like "เตรียมสอบ ม.6", "TCAS68", "ติวเลขกับพี่...".
*   **Strategy**: Join as a helpful student. Do not spam.
*   **Message Template**:
    > "สวัสดีครับเพื่อนๆ พอดีเจอเว็บรวมข้อสอบเก่า ONET/TGAT แบบทำออนไลน์ได้เลย UI คลีนมาก ไม่ต้องโหลด PDF มานั่งเปิดเอง แถมตรวจคะแนนให้เสร็จเลย ลองไปใช้กันดูนะครับ ฟรีด้วย: https://thaiexamhub.com"
*   **Goal**: 50-100 UV/day.

### Week 2: Pantip Authority Building
*   **Target**: Pantip.com (ห้องการศึกษา, ห้องสยามสแควร์).
*   **Posts to Search & Reply**: "หาข้อสอบ ONET เก่าย้อนหลัง", "เตรียมตัว TCAS ยังไงดี", "แนะนำเว็บติวฟรี".
*   **Original Post Title**: "[รีวิว] เว็บฝึกทำข้อสอบ TCAS ออนไลน์ที่ 'ฟรี' และ 'ดี' ที่สุดในตอนนี้ (ไม่ต้องสมัครสมาชิก)"
*   **Goal**: Backlinks + 200 UV/day.

### Week 3: Facebook Group Activation
*   **Target**: "TCAS67/68/69", "กลุ่มนักเรียนมัธยม", "สรุปเนื้อหา ม.ปลาย".
*   **Action**: Post helpful "Cheat Sheets" or "Top 5 hardest questions" and link to the full quiz on the site.
*   **Comment Strategy**: Find people asking for resources and reply with a specific exam link.
*   **Goal**: 500 UV/day.

### Week 4: TikTok Viral Push
*   **Content**: POV videos of students panicking about exams, then finding the site.
*   **Caption**: "เพิ่งรู้ว่ามีเว็บแบบนี้! ฝึกทำข้อสอบเก่าฟรีแบบไม่อั้น 😭💖 #DEK68 #TCAS68 #ThaiExamHub"
*   **Engagement**: Pin a comment: "ใครทำได้คะแนนเท่าไหร่มาเม้นบอกกันหน่อย!"
*   **Goal**: 1,000+ UV/day.

---

## 3. RETENTION & RE-ENGAGEMENT

### JS Streak Module Implementation
```javascript
// js/retention.js or integrated into storage.js
export const StreakManager = {
    checkStreak() {
        const stats = Storage.getStats();
        const now = new Date();
        const bangkokTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
        const today = bangkokTime.toISOString().split('T')[0];
        
        if (!stats.lastActiveDate) return 0;
        
        const lastDate = stats.lastActiveDate.split('T')[0];
        const diff = (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24);
        
        if (diff === 1) {
            // Continued streak
            return stats.streak;
        } else if (diff > 1) {
            // Streak broken
            return 0;
        }
        return stats.streak;
    },
    
    getMilestoneReward(streak) {
        const rewards = {
            3: "Bronze Scholar 🥉",
            7: "Silver Thinker 🥈",
            14: "Gold Master 🥇",
            30: "Diamond God of Exams 💎"
        };
        return rewards[streak] || null;
    }
};
```

### 3 Re-engagement Triggers
1.  **The "New Exam" Hook**: Notify users when a new year of their favorite subject is added.
2.  **The "Weekly Recap"**: Every Sunday, show "You solved X questions this week! Top 10% of users."
3.  **The "Panic Button"**: 30 days before the real exam, send daily reminders with "Focus on your weakest subject: [Subject Name]".

---

## 4. GROWTH METRICS DASHBOARD

| Metric | Month 1 Target | Month 2 Target | Month 3 Target | Action if below target |
| :--- | :--- | :--- | :--- | :--- |
| **1. UV/Day** | 200 | 700 | 1,500 | Increase seeding frequency |
| **2. Quiz Completion %** | 40% | 50% | 60% | Shorten quizzes or improve UI |
| **3. Return Visitor Rate** | 15% | 25% | 35% | Optimize streak notifications |
| **4. Avg. Session Duration** | 5 min | 8 min | 12 min | Add explanations/summaries |
| **5. Viral K-Factor** | 0.05 | 0.10 | 0.20 | Make sharing buttons more prominent |
| **6. Share Button CTR** | 2% | 5% | 8% | Change share card design |
| **7. Top Referrer % (Social)**| 60% | 40% | 30% | If too high, SEO is failing |
| **8. Mobile Traffic %** | 80% | 85% | 90% | Optimize for low-end Androids |
| **9. Bounce Rate** | 60% | 50% | 40% | Improve landing page speed |
| **10. Revenue (AdSense)** | ฿0 | ฿100/wk | ฿500/wk | Optimize ad placement |

---

## 5. 90-DAY GROWTH CALENDAR

| Week | Action | Channel | Metric | Experiment |
| :--- | :--- | :--- | :--- | :--- |
| **1-2** | Soft Launch & Seeding | LINE / Pantip | UV/Day | A/B Test Landing Page Headline |
| **3-4** | Content Expansion | SEO / FB Groups | Completion % | Test 5-question vs 20-question quizzes |
| **5-6** | Viral Loop Alpha | WhatsApp/LINE | K-Factor | Test "Challenge Friend" vs "Share Score" |
| **7-8** | Retention Push | Push Notifs | Return Rate | Test Emojis in notifications |
| **9-10** | Influencer Outreach | TikTok / Twitter | UV/Day | Micro-influencer shoutouts (free) |
| **11-12** | Peak Season Push | All Channels | UV/Day | "Final Countdown" daily 10-question sets |

---

**Raijin's Final Word**: Growth is a storm. It starts with a single spark (seeding) and becomes a hurricane (viral loops). Strike hard, strike fast, and never let the streak die. ⚡
