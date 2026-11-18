# LearningHub — HTML prototype (vanilla)

Bản HTML tĩnh để demo LearningHub 2 với L&D. Không build, không framework.

## Chạy

```bash
cd learninghub-static-html && python3 -m http.server 5178
# mở http://localhost:5178/pages/index.html
```

Mỗi màn có thanh **DEMO** ở đáy để đổi trạng thái. Mở thẳng một trạng thái bằng query, vd `test-result.html?sc=pass`.

## Cấu trúc

| Tầng | File | Ghi chú |
|---|---|---|
| Token | `assets/css/tokens.css` | Primitive → Semantic → Component. Đo từ web thật (Tailwind v4 + shadcn) |
| CSS component | `assets/css/components.css` | Tên class = tên component Figma |
| JS component | `assets/js/components.js` | `LH.Button`, `LH.QuestionCard`, `LH.CourseCard`, `LH.AccessNotice`… — tham số = variant / text property |
| Popup dùng chung | `assets/js/export-modal.js`, `assets/js/enroll-limit.js` | `Report / Export modal`, `Enroll / Limit modal`, `Enroll / Leave confirm` |
| Dữ liệu mẫu | `assets/js/data.js` | Tên khoá, session lấy từ web thật |
| Màn | `pages/*.html` | Chỉ ghép component |

## Màn đợt 1 ↔ docs Notion (bản 18/11/2026)

Chữ trên màn tiếng Anh theo bảng UI copy. Mỗi màn có DemoBar để đổi trạng thái.

| Màn | Trạng thái DEMO | Doc |
|---|---|---|
| `assessment.html` (#start · #practice · #exam · #result) | `seed=fresh/one/two/pass/out/reopen`, bài cuối khoá → popup hoàn thành | Exam · Practice · Learner |
| `test-start` · `practice` · `exam` · `test-result.html` | chuyển hướng vào `assessment.html` (giữ link cũ) | — |
| `course-detail.html` | `s=…` + `m=1` (Mandatory) + `p=off` (khoá tắt Practice) | Enrollment · Course Audience 3.5 · Practice · Learner 3.1 |
| `home.html` | `f=1` (3/3) · `m=1` (có khoá Mandatory) | Enrollment 3.2 |
| `lesson-learn.html` | `i=5` video · `all=last` (xong video → Completed + popup) | Learning Progress |
| `course-editor.html` | `tab=practice/audience` · `pq=empty/off/on/dup` · `aud=all/restricted/mandatory/empty` · Publish | Practice · Admin · Course Audience · Exam 3.6–3.7 · Course Information 3.3 |
| `admin-courses.html` | menu dòng View Learners / Export Data / Delete theo luật · nháp Incomplete | Course Audience 3.7 · Learning Data Export · Course Information |
| `course-create.html` | Save as Draft chỉ cần Course Title | Course Information 2.2 |
| `admin-course-learners.html` | Unenroll · Reopen Attempts · Export Data | Course Audience 3.4 · Exam 3.5 · Learning Data Export 3.1 |
| `admin-audience.html` · `admin-test-practice.html` | chuyển hướng vào tab Audience / Practice của `course-editor.html` | — |

Ảnh chụp mới nhất: `screenshots/`.

## Token chính

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--action-primary` | `#374BFA` | Nút chính, tab đang chọn |
| `--progress` | `#5163FF` | Thanh tiến độ |
| `--accent` | `#C1F129` | Chấm logo, nhãn Bắt buộc |
| `--text-strong` / `--text-default` | `#0F172A` / `#334155` | Chữ |
| `--border-default` | `#E2E8F0` | Viền card, bảng |
| `--radius` / `--card-radius` | 10px / 14px | Nút, input / card |
| Font | Inter | Toàn bộ |
