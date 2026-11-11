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

## Màn đợt 1 ↔ spec

| Màn | Trạng thái DEMO | Spec |
|---|---|---|
| `test-start.html` | `practice=on/off`, `att=3/inf/0` | 01 §3.2 |
| `practice.html` | tương tác thật: chọn → Kiểm tra → Câu sau | 01 §3.3 |
| `admin-test-practice.html` | `st=legacy/empty/dup/ok` | 01 §3.1 |
| `test-result.html` | `sc=fail-left/pass/fail-last/unlimited` | 02 §3.1–3.2 |
| `admin-audience.html` | `role=Admin/Creator`, `sc=limited/all/empty` + nút Xuất dữ liệu | 04 §3.1, 05 §3.1 |
| `course-detail.html` | `s=all/limit/restricted/removed/mandatory` | 04 §3.2, 09 §3.1 |
| `home.html` | `f=1/0` | 04 §3.3, 09 §3.4 |
| `my-courses.html` | `k=full/over` | 09 §3.2–3.3 |
| `admin-settings.html` | nhập 0 hoặc 11 để thấy lỗi | 09 §3.5 |

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
