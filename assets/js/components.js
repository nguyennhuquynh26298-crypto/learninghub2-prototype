/* LearningHub component library (vanilla).
 * Mỗi hàm = 1 component Figma cùng tên. Trạng thái = tham số (variant), chữ = tham số (text property).
 * Dùng: <script src="../assets/js/components.js"></script> → window.LH.* */
/* Số phiên bản tài nguyên — tăng cùng ?v= trong pages/*.html mỗi lần sửa JS/CSS để trình duyệt không dùng bản cũ */
var LH_V = '1119q';
(function () {
  const P = (d) => `<svg class="ic" width="16" height="16" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICON = {
    search: P('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
    bell: P('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
    check: P('<path d="M20 6 9 17l-5-5"/>'),
    x: P('<path d="M18 6 6 18M6 6l12 12"/>'),
    lock: P('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    eye: P('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: P('<path d="M9.9 4.2A10 10 0 0 1 12 4c7 0 10 8 10 8a13 13 0 0 1-1.7 2.7M6.6 6.6A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="m2 2 20 20"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),
    info: P('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
    alert: P('<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4M12 17h.01"/>'),
    clock: P('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    list: P('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
    repeat: P('<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'),
    dumbbell: P('<path d="M6.5 6.5 17.5 17.5M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7"/>'),
    award: P('<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>'),
    users: P('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'),
    user: P('<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>'),
    building: P('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>'),
    briefcase: P('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
    globe: P('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
    mail: P('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
    download: P('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'),
    sheet: P('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M8 13h8M8 17h8M10 9H8"/>'),
    plus: P('<path d="M12 5v14M5 12h14"/>'),
    edit: P('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    copy: P('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),
    upload: P('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'),
    trash: P('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
    more: P('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),
    logout: P('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
    play: P('<polygon points="6 3 20 12 6 21 6 3"/>'),
    video: P('<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>'),
    file: P('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/>'),
    quiz: P('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
    chevronR: P('<path d="m9 18 6-6-6-6"/>'),
    chevronL: P('<path d="m15 18-6-6 6-6"/>'),
    chevronD: P('<path d="m6 9 6 6 6-6"/>'),
    book: P('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>'),
    star: P('<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>'),
    calendar: P('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    filter: P('<polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3"/>'),
    shield: P('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>'),
    settings: P('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    undo: P('<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>'),
    redo: P('<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>'),
    listOrdered: P('<path d="M10 6h11M10 12h11M10 18h11"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>'),
    alignLeft: P('<path d="M21 6H3M15 12H3M17 18H3"/>'),
    alignCenter: P('<path d="M21 6H3M17 12H7M19 18H5"/>'),
    alignRight: P('<path d="M21 6H3M21 12H9M21 18H7"/>'),
    alignJustify: P('<path d="M3 6h18M3 12h18M3 18h18"/>'),
    pilcrow: P('<path d="M13 4v16M17 4v16M13 4a4 4 0 0 0-4 4 4 4 0 0 0 4 4"/><path d="M9 12H4"/>'),
    palette: P('<circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.7 1.7-1.7 0-.4-.2-.9-.4-1.2-.3-.3-.4-.7-.4-1.1 0-.9.7-1.7 1.7-1.7H16c3.3 0 6-2.7 6-6 0-5.5-4.5-8.3-10-8.3z"/>'),
    highlighter: P('<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>'),
    maximize: P('<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>'),
    minimize: P('<path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3"/>'),
    bold: P('<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>'),
    italic: P('<path d="M19 4h-9M14 20H5M15 4 9 20"/>'),
    underline: P('<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>'),
    trophy: P('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'),
    circle: P('<circle cx="12" cy="12" r="10"/>'),
    circleCheck: P('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
    chevronU: P('<path d="m18 15-6-6-6 6"/>'),
    tvPlay: P('<path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/><path d="M7 21h10"/><rect width="20" height="14" x="2" y="3" rx="2"/>'),
    fileQ: P('<path d="M12 17h.01"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/>'),
    bell2: P('<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'),
    /* Icon 2 màu của web (xanh #374BFA + lime #C1F129) */
    grid: '<svg class="ic" width="16" height="16" aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none"><path d="M3.33 6.67h3.34V3.33H3.33v3.34Zm5 10h3.34v-3.34H8.33v3.34Zm-5 0h3.34v-3.34H3.33v3.34Zm0-5h3.34V8.33H3.33v3.34Zm5 0h3.34V8.33H8.33v3.34Zm5-8.34v3.34h3.34V3.33h-3.34Zm-5 3.34h3.34V3.33H8.33v3.34Zm5 5h3.34V8.33h-3.34v3.34Zm0 5h3.34v-3.34h-3.34v3.34Z" fill="#334155"/></svg>',
    lessons2: '<svg class="ic" width="16" height="16" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none"><path d="M3.67 2.83c-.23 0-.44.09-.6.25a.86.86 0 0 0-.25.61v12.88c0 .47.38.86.86.86 2 0 5.35.42 7.66 2.84V6.79a1 1 0 0 0-.12-.44C9.32 3.3 5.67 2.84 3.67 2.83Z" fill="#374BFA"/><path d="M21.19 16.57V3.69a.86.86 0 0 0-.86-.86c-2 0-5.65.47-7.55 3.52a1 1 0 0 0-.11.44v13.48c2.31-2.42 5.66-2.84 7.66-2.84.47 0 .86-.39.86-.86Z" fill="#374BFA"/><path d="M23.14 5.8h-.62v10.77a2.2 2.2 0 0 1-2.19 2.19c-1.7 0-4.5.34-6.47 2.21 3.42-.84 7.03-.29 9.09.18a.86.86 0 0 0 1.05-.84V6.66a.86.86 0 0 0-.86-.86Z" fill="#C1F129"/><path d="M1.48 16.57V5.8H.86A.86.86 0 0 0 0 6.66v13.65c0 .26.12.5.32.67.21.16.47.22.73.17 2.06-.47 5.67-1.01 9.09-.18-1.98-1.87-4.77-2.2-6.47-2.21a2.2 2.2 0 0 1-2.19-2.19Z" fill="#C1F129"/></svg>',
    clock2: '<svg class="ic" width="16" height="16" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none"><path d="M11.75 5.32a6.93 6.93 0 1 0 0 13.86 6.93 6.93 0 0 0 0-13.86Zm4.41 7.56h-5.04V7.84h1.26v3.78h3.78v1.26Z" fill="#374BFA"/><path d="M11.75 1.5C5.85 1.5 1 6.35 1 12.25S5.85 23 11.75 23 22.5 18.15 22.5 12.25 17.65 1.5 11.75 1.5Zm0 18.94a8.19 8.19 0 1 1 0-16.38 8.19 8.19 0 0 1 0 16.38Z" fill="#C1F129"/></svg>',
    myCourses: '<svg class="ic" width="16" height="16" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none"><path d="M24 7.03v15.56h-7.15c-1.97 0-3 1.33-3.1 1.41h-3.5c-.1-.07-1.12-1.41-3.1-1.41H0V5.63h1.41v15.56h5.75c2.2 0 3.42 1.24 3.73 1.4h2.23c.3-.16 1.53-1.4 3.73-1.4h5.75V7.03H24Z" fill="#C1F129"/><path d="M9.89 20.34a6.8 6.8 0 0 0-2.73-.56H2.81V2.81h1.41v14.16h2.11c1.92 0 3.48 1.5 3.56 3.37Z" fill="#C1F129"/><path d="M16.84 4.22c-1.49 0-2.92.39-4.19 1.13.03.32.05.65.05.98v14.83l.37-.23c2.17-1.45 3.67-1.15 8.16-1.15V4.22h-4.39Z" fill="#374BFA"/><path d="M11.3 20.48a4.95 4.95 0 0 0-4.97-4.92h-.7V0c3.51 0 5.67 2.84 5.67 6.33v14.15Z" fill="#374BFA"/></svg>',
    allCourses: '<svg class="ic" width="16" height="16" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none"><path d="M6.4 5.2V3.6a.4.4 0 0 0-.4-.4H.4a.4.4 0 0 0-.4.4v1.6h6.4ZM0 6v13.2h6.4V6H0Zm4.8 5.2H1.6a.4.4 0 0 1-.4-.4V7.6c0-.22.18-.4.4-.4h3.2c.22 0 .4.18.4.4v3.2a.4.4 0 0 1-.4.4ZM0 21.6v2c0 .22.18.4.4.4H6a.4.4 0 0 0 .4-.4v-2H0Zm0-1.6h6.4v.8H0V20Zm7.2 0h5.2v.8H7.2V20Zm5.2-18.4V.4A.4.4 0 0 0 12 0H7.6a.4.4 0 0 0-.4.4v1.2h5.2ZM7.2 4.4h5.2v14.8H7.2V4.4Zm0 17.2v2c0 .22.18.4.4.4H12a.4.4 0 0 0 .4-.4v-2H7.2Zm0-19.2h5.2v1.2H7.2V2.4Z" fill="#374BFA"/><path d="m13.19 8.28.21.83 6.78-1.81-.21-.82-6.78 1.8Zm3.34 12.82 6.78-1.81-.43-1.64-6.78 1.8.43 1.65Zm6.15-4.23-2.3-8.8-6.77 1.81 2.3 8.8 6.77-1.81Zm-9.69-9.36 6.77-1.8-.57-2.2a.4.4 0 0 0-.49-.29l-6 1.6a.4.4 0 0 0-.28.49l.57 2.2Zm10.52 12.56-6.77 1.8.48 1.83a.4.4 0 0 0 .49.29l6-1.6a.4.4 0 0 0 .28-.49l-.48-1.83Z" fill="#C1F129"/></svg>',
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* ---------- Chế độ app: hoc-vien.html / admin.html bọc các màn trong 1 iframe ----------
     Trong app: ẩn thanh DEMO, trạng thái lấy từ thao tác thật (sessionStorage), link màn rời → màn trọn luồng. */
  const APP = (() => { try { return (window.top !== window.self && sessionStorage.getItem('lhApp')) || null; } catch (e) { return null; } })();
  const ROUTE = { 'test-start.html': 'assessment.html', 'practice.html': 'assessment.html#practice', 'exam.html': 'assessment.html#exam', 'test-result.html': 'assessment.html#result' };
  function url(h) {
    if (!APP || !h) return h;
    const f = h.split(/[?#]/)[0];
    if (APP === 'admin' && (f === 'home.html' || f === 'my-courses.html')) return 'admin-courses.html';
    return ROUTE[f] || h;
  }
  const App = {
    mode: APP,
    get() { try { return JSON.parse(sessionStorage.getItem('lhL') || '{}'); } catch (e) { return {}; } },
    set(v) { sessionStorage.setItem('lhL', JSON.stringify(v)); },
    role() { return sessionStorage.getItem('lhRole') || 'admin'; },
    courseHref(title) { const D = window.LHData; const i = D ? D.catalog.findIndex((c) => c.title === title) : -1; return i >= 0 ? `course-detail.html?c=${i}` : 'course-detail.html'; },
  };
  if (APP) document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href'), u = url(h); if (u !== h) a.setAttribute('href', u);
  }, true);
  const initials = (name) => name.split(' ').filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase();

  /* ---------- Shared ---------- */
  function Button({ label, variant = 'primary', size, icon, iconRight, attrs = '', block, disabled }) {
    const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, block && 'btn--block'].filter(Boolean).join(' ');
    return `<button class="${cls}" ${disabled ? 'disabled' : ''} ${attrs}>${icon ? ICON[icon] : ''}${esc(label)}${iconRight ? ICON[iconRight] : ''}</button>`;
  }
  function Badge(label, tone = 'neutral', icon) { return `<span class="badge badge--${tone}">${icon ? ICON[icon] : ''}${esc(label)}</span>`; }
  function Alert({ tone = 'info', icon = 'info', title, text }) {
    return `<div class="alert alert--${tone}" role="status">${ICON[icon]}<div>${title ? `<b>${esc(title)}</b>` : ''}${text || ''}</div></div>`;
  }
  function Progress(pct) { return `<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>`; }
  function Avatar(name, size) { return `<span class="avatar ${size ? 'avatar--' + size : ''}">${initials(name)}</span>`; }

  const LOGO = '../assets/img/logo.png';
  /** App / Header — chép DOM web: h-16 + viền 1, logo 32 + "Learning•Hub" 30/400, ô tìm 400 bo 100, Explore, chuông, lưới, chip user 200 nền #F3F3F3 */
  function AppHeader({ role = 'Learner', user = 'Hara Nguyen', search = '' } = {}) {
    return `<header class="app-header"><div class="container app-header__in">
      <div class="app-header__left">
        <a class="logo" href="home.html"><img src="${LOGO}" width="32" height="32" alt="Learning Hub"><span>Learning<i></i>Hub</span></a>
        <div class="search-wrap"><form class="search-pill" action="course-search.html" role="search"><input type="search" name="q" placeholder="Search courses" value="${esc(search)}" maxlength="100" autocomplete="off" aria-controls="search-pop" aria-expanded="false"><button type="button" class="search-pill__x" data-qclear aria-label="Clear search" ${search ? '' : 'hidden'}>${ICON.x}</button><button class="search-pill__go" aria-label="Search">${ICON.search}</button></form><div class="search-pop" id="search-pop" role="listbox" hidden></div></div>
        <div class="explore"><button class="explore-btn" data-explore aria-expanded="false">Explore${ICON.chevronD}</button>
          <div class="explore__menu" hidden><div class="explore__h">Course categories</div>${((window.LHData && LHData.categories) || []).map((c) => `<a href="course-search.html?ct=${encodeURIComponent(c)}" data-cat="${esc(c)}">${esc(c)}</a>`).join('')}<a class="explore__all" href="course-search.html">View all courses${ICON.chevronR}</a></div></div>
      </div>
      <div class="app-header__right">
        <button class="hd-icon" aria-label="Notifications" title="Notifications">${ICON.bell2}</button>
        <button class="hd-icon" aria-label="Apps">${ICON.grid}</button>
        <a class="user-chip" href="my-courses.html"><span class="user-chip__av">${initials(user)}<i></i></span><span class="user-chip__name">${esc(user)}</span>${role !== 'Learner' ? `<span class="role-pill">${esc(role)}</span>` : ''}${ICON.chevronD}</a>
      </div></div></header>`;
  }
  /** App / Category nav — thanh danh mục cao 60 dưới header (Home, Search) */
  function CategoryNav(active = '') {
    const cats = (window.LHData && LHData.categories) || [];
    return `<nav class="cat-nav"><div class="container cat-nav__in">${cats.map((c) => `<a href="course-search.html?ct=${encodeURIComponent(c)}" data-cat="${esc(c)}" class="${c === active ? 'is-active' : ''}">${esc(c)}</a>`).join('')}</div></nav>`;
  }
  /** App / Footer — nền tối + ảnh footer.png, cao 812 */
  function AppFooter() {
    return `<footer class="app-footer"><div class="container">
      <div class="app-footer__h"><h5>Grow yourself with</h5><h5 class="lime">Learning Hub</h5></div>
      <p>Build your skills with courses designed for the Techvify team. Whether you are a developer, designer or project manager, there is a course waiting for you.<br>Learn together, grow together, go further together!</p>
      <div class="app-footer__brand"><img src="${LOGO}" width="32" height="32" alt="logo"><span>Learning <i></i> Hub</span></div>
    </div></footer>`;
  }
  /** App / Back — icon undo #2A28DF + chữ gradient, kèm tiêu đề trang */
  function BackLink(title = '', { href = 'home.html', big = false } = {}) {
    return `<div class="back-head"><a class="back-link" href="${href}" data-back>${ICON.undo}<span>Back</span></a>${title ? `<div class="back-head__t ${big ? 'is-big' : ''}">${esc(title)}</div>` : ''}</div>`;
  }
  /** App / Section head — icon 2 màu + tiêu đề 24/700 + "View More" */
  function SectionHead(title, icon, href, extra = '') {
    return `<div class="sec-head"><h2>${ICON[icon] || ''}${esc(title)}</h2>${href ? `<a href="${href}">View More${ICON.chevronR}</a>` : ''}${extra}</div>`;
  }

  /**
   * Search / Filter dropdown — nút lọc dạng pill + menu chọn 1.
   * State: default (giá trị mặc định) | active (đang lọc, nền primary-50) | open. Chọn → phát sự kiện 'fdd:change' {key, value}.
   */
  function FilterDropdown({ key, label, value, options, def = 'all', align = 'left', title = '' }) {
    const cur = options.find((o) => o[0] === value) || options[0];
    const active = value !== def;
    const tip = title ? ` title="${esc(title)}"` : '';
    return `<div class="fdd ${active ? 'is-active' : ''}" data-fdd="${key}"${tip}>
      <button type="button" class="fdd__btn" aria-haspopup="listbox" aria-expanded="false"${tip}><span class="fdd__l">${esc(label)}</span><b>${esc(cur[1])}</b>${ICON.chevronD}</button>
      <div class="fdd__menu fdd__menu--${align}" role="listbox" hidden>${options.map(([v, t, n]) => `<button type="button" role="option" class="fdd__opt ${v === value ? 'is-sel' : ''}" data-v="${esc(v)}" aria-selected="${v === value}" ${n === 0 && v !== value ? 'data-zero' : ''}><span>${esc(t)}</span>${n != null ? `<i>${n}</i>` : ''}${v === value ? ICON.check : ''}</button>`).join('')}</div></div>`;
  }

  /**
   * Search / Panel — bảng xổ dưới ô search trên header.
   * State: recent (chưa gõ) | typing (có gợi ý) | empty (gõ mà không khớp).
   * recent: [từ khoá]; results: [{title, cover, cat, st}]; total: số kết quả đầy đủ.
   * Không có lọc nhanh trong bảng xổ (D-41) — lọc Trạng thái / Thời gian nằm ở trang Tìm khoá.
   */
  const ST_LABEL = { notenrolled: 'Not Enrolled', learning: 'In Progress', done: 'Completed', fail: 'Failed' };
  function SearchResultItem({ title, cover, cat, st, q, i }) {
    return `<a class="sp-item" href="course-detail.html" data-sp-i="${i}" role="option"><img src="${cover}" alt=""><span class="sp-item__b"><b>${q ? highlight(title, q) : esc(title)}</b><span>${esc(cat)} · ${ST_LABEL[st] || 'Not Enrolled'}</span></span></a>`;
  }
  function SearchPanel({ q = '', recent = [], results = [], total = 0 }) {
    const state = !q ? 'recent' : results.length ? 'typing' : 'empty';
    let main = '';
    if (state === 'recent') main = recent.length ? `<div class="sp-sec"><div class="sp-h">Recent searches</div>${recent.map((r, i) => `<div class="sp-rec" data-sp-i="${i}" data-sp-q="${esc(r)}" role="option">${ICON.clock}<span>${esc(r)}</span><button type="button" class="sp-rec__x" data-sp-del="${esc(r)}" aria-label="Remove from history">${ICON.x}</button></div>`).join('')}</div>` : '';
    if (state === 'typing') main = `<div class="sp-sec"><div class="sp-h">Courses</div>${results.map((r, i) => SearchResultItem({ ...r, q, i })).join('')}</div>`;
    if (state === 'empty') main = `<div class="sp-empty">${ICON.search}<b>No courses found for “${esc(q)}”</b></div>`;

    const all = q ? `<button type="button" class="sp-all" data-sp-all data-sp-i="${state === 'typing' ? results.length : state === 'recent' ? recent.length : 0}" role="option">${ICON.search}<span>View all <b>${total}</b> results for “${esc(q)}”</span>${ICON.chevronR}</button>` : '';
    return `<div class="sp" data-state="${state}">${main}${all}</div>`;
  }

  function Modal({ id, size = 'md', icon, iconTone = 'info', title, desc, body = '', foot = '', footNote = '' }) {
    return `<div class="modal-backdrop" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-t">
      <div class="modal modal--${size}${document.body.classList.contains('adm-body') ? ' adm-popup' : ''}">
        <div class="modal__head">${icon ? `<span class="modal__icon modal__icon--${iconTone}">${ICON[icon]}</span>` : ''}
          <div class="grow"><div class="modal__title" id="${id}-t">${title}</div>${desc ? `<div class="modal__desc">${desc}</div>` : ''}</div>
          <button class="icon-btn" data-close aria-label="Close">${ICON.x}</button></div>
        <div class="modal__body">${body}</div>
        ${foot ? `<div class="modal__foot">${footNote ? `<span class="grow">${footNote}</span>` : ''}${foot}</div>` : ''}
      </div></div>`;
  }

  function toast(text) {
    let host = document.querySelector('.toast-host');
    if (!host) { host = document.createElement('div'); host.className = 'toast-host'; document.body.appendChild(host); }
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = ICON.check + esc(text);
    host.appendChild(t); setTimeout(() => t.remove(), 3200);
  }

  /**
   * Form / Required guard — LUẬT CHUNG cho mọi form có field bắt buộc (19/11/2026):
   *  1. Field bắt buộc còn trống → viền đỏ + câu báo dưới field, hiện sau khi người dùng rời field (blur) hoặc khi gọi touchAll().
   *     Chưa chạm vào thì không đỏ (không "mắng" người dùng lúc vừa mở form).
   *  2. Nút hành động (Save / Continue / Save as Draft…) tắt tới khi đủ các field nó cần; rê chuột lên nút tắt thấy "Fill in all required fields".
   *  3. Lỗi nghiệp vụ khác (trùng câu, sai định dạng…) vẫn kiểm khi bấm nút như cũ.
   * reqGuard({ root, rules: () => [{ key, el, ok, msg, mark?, msgEl? }], buttons: () => [{ el, keys? }] }) → { run, touchAll, ok }
   *  - rules() gọi lại mỗi lần kiểm nên form vẽ lại (re-render) vẫn đúng · key ổn định giữa các lần vẽ
   *  - el: chỗ đặt câu báo (sau el) · mark: các ô tô đỏ (mặc định [el]) · msgEl: dùng ô báo lỗi có sẵn thay vì tự tạo
   *  - buttons[].keys: chỉ các rule nút đó cần (vd. Save as Draft chỉ cần Course Title); bỏ trống = cần tất cả
   */
  function reqGuard({ root = document, rules, buttons = () => [] } = {}) {
    const touched = new Set(), marked = new Set(); let all = false;
    const keysOf = (t) => rules().filter((x) => x.el && (x.el === t || x.el.contains(t) || (x.mark || []).some((m) => m && (m === t || m.contains(t))))).map((x) => x.key);
    function run() {
      const list = rules();
      marked.forEach((m) => { m.classList.remove('is-req-err'); m.removeAttribute('aria-invalid'); }); marked.clear();
      list.forEach((r) => {
        if (!r.el) return;
        const show = !r.ok && (all || touched.has(r.key));
        if (show) (r.mark || [r.el]).forEach((m) => { if (!m) return; m.classList.add('is-req-err'); m.setAttribute('aria-invalid', 'true'); marked.add(m); });
        let m = r.msgEl || r.el.parentElement.querySelector(`:scope > .req-msg[data-for="${r.key}"]`);
        if (!m) { m = document.createElement('p'); m.className = 'req-msg'; m.dataset.for = r.key; r.el.insertAdjacentElement('afterend', m); }
        if (r.msgEl) { if (show) m.textContent = r.msg; else if (m.dataset.req === '1') m.textContent = ''; m.dataset.req = show ? '1' : ''; }
        else m.textContent = show ? r.msg : '';
      });
      buttons().forEach(({ el, keys }) => {
        if (!el) return;
        const need = keys ? list.filter((r) => keys.includes(r.key) || keys.some((k) => r.key.startsWith(k + ':'))) : list;
        const bad = need.some((r) => !r.ok);
        el.disabled = bad; el.title = bad ? 'Fill in all required fields' : '';
      });
      return list.every((r) => r.ok);
    }
    root.addEventListener('focusout', (e) => { const ks = keysOf(e.target); if (ks.length) { ks.forEach((k) => touched.add(k)); setTimeout(run, 0); } });
    ['input', 'change'].forEach((ev) => root.addEventListener(ev, () => setTimeout(run, 0)));
    root.addEventListener('click', () => setTimeout(run, 0));
    return { run, touchAll() { all = true; return run(); }, ok: () => rules().every((r) => r.ok), touch(k) { touched.add(k); run(); } };
  }

  /* ---------- Course ---------- */
  /** Course / Card — State: default | in-progress | completed | failed | restricted | limit-reached */
  /** Course / Progress bar web — rãnh 12 #F4F4F5, thanh 6 vàng lùi 3px */
  function WebProgress(pct, label = 'Progress') {
    return `<div class="wp"><div class="wp__row"><span>${esc(label)}</span><b>${pct}%</b></div><div class="wp__track"><i style="width:${pct}%"></i></div></div>`;
  }
  /**
   * Course / Card — chép DOM web (w-84 = 336, bìa 170, p-4, nút full 36).
   * State: default | in-progress | completed | failed | restricted | limit-reached
   * Phần LH2 thêm: nhãn trên bìa, dòng breakdown Video/Bài test (#8), Học gần nhất (#6), nhãn Không đạt (#9, BR-LRN-32).
   */
  function CourseCard({ title, desc = '', cover = '', state = 'default', progress = 0, lessons = 2, hours = '14h 0m', last = '', menu = false, video, test, q = '', done = '', failScore = null, href = 'course-detail.html', sched = null, mandatory = false }) {
    /* LH2 Đợt 1 · nhãn bìa (Course Audience 3.2, 3.5 · Enrollment 3.1) — chữ UI tiếng Anh */
    const badge = {
      restricted: `<span class="cc-tag cc-tag--restricted">${ICON.lock}Restricted</span>`,
      failed: `<span class="cc-tag cc-tag--fail">${ICON.x}Failed</span>`,
      completed: `<span class="cc-tag cc-tag--ok">${ICON.check}Completed</span>`,
    }[state] || '';
    if (APP && href === 'course-detail.html') href = App.courseHref(title);
    const upcoming = sched && sched.start && state !== 'restricted';
    const schedTag = upcoming ? `<span class="cc-tag cc-tag--upcoming">${ICON.clock}Starts ${esc(sched.start)}</span>` : sched && sched.overdue && state === 'in-progress' ? `<span class="cc-tag cc-tag--fail">${ICON.clock}Overdue</span>` : '';
    const label = state === 'restricted' ? 'View Details' : (state === 'completed' || state === 'failed') ? 'Review Course' : state === 'in-progress' ? 'Continue Learning' : 'Start Course';
    const btnCls = state === 'restricted' || state === 'completed' || state === 'failed' ? 'cc-btn cc-btn--outline' : 'cc-btn';
    const attrs = state === 'default' || state === 'limit-reached' ? 'data-start' : '';
    const parts = [video && video[1] ? `Videos ${video[0]}/${video[1]}` : '', test && test[1] ? `Quizzes ${test[0]}/${test[1]}` : ''].filter(Boolean).join(' · ');
    const sub = state === 'completed' && done ? `Completed: ${esc(done)}` : state === 'failed' ? `Failed after 3 attempts${failScore != null ? ` · Final Score ${failScore}` : ''}` : last ? `Last accessed: ${esc(last)}` : '';
    const extra = (parts || sub) && state !== 'default' && state !== 'restricted' && state !== 'limit-reached' ? `<div class="cc-sub">${parts ? `<span class="pg__split">${parts}</span>` : ''}${sub ? `<span>${sub}</span>` : ''}</div>` : '';
    const mand = mandatory && state !== 'restricted' ? `<span class="cc-mand">${ICON.shield}Mandatory</span>` : '';
    return `<article class="course-card" data-state="${state}">
      <div class="course-card__cover">${cover ? `<img src="${cover}" alt="${esc(title)}">` : ''}${schedTag || badge}</div>
      <div class="course-card__body">
        ${mand}
        <h3 class="course-card__title">${APP ? `<a href="${href}" style="color:inherit;text-decoration:none">` : ''}${q ? highlight(title, q) : esc(title)}${APP ? '</a>' : ''}</h3>
        <div class="course-card__desc">${esc(desc)}</div>
        <div class="course-card__meta"><span>${ICON.lessons2}lessons: ${lessons}</span><span>${ICON.clock2}${esc(hours)}</span></div>
        <div class="course-card__progress">${WebProgress(progress)}${extra}</div>
        <div class="course-card__foot"><a href="${href}" class="grow" ${attrs && !APP ? 'onclick="return false"' : ''}><button class="${btnCls}" ${upcoming ? `disabled title="This course opens on ${esc(sched.start)}." style="opacity:.5;cursor:not-allowed"` : attrs}>${label}</button></a>${menu ? `<div class="course-card__menu"><button class="cc-more" data-menu aria-label="More">${ICON.more}</button></div>` : ''}</div>
      </div></article>`;
  }
  /** Course / Access notice — State: restricted | removed (Course Audience 3.5, BR-AUD-04, 05) */
  function AccessNotice({ state = 'restricted', owner = { name: 'Nguyễn Thu Hà', email: 'ha.nguyenthu@techvify.com.vn' }, progress = 45 }) {
    const removed = state === 'removed';
    return `<div class="access-box ${removed ? 'access-box--removed' : ''}">
      <span class="access-box__icon">${ICON.lock}</span>
      <div class="stack gap-4"><div class="fw-600">${removed ? 'Access removed' : 'Restricted course'}</div>
      <div class="t-sm muted">${removed ? `You no longer have access to this course. Your progress (${progress}%) has been saved.` : `This course is available to selected learners only. Contact ${esc(owner.name)} if you need access.`}</div></div>
      ${removed ? `<div class="stack gap-4"><div class="row t-xs muted" style="justify-content:space-between"><span>Saved progress</span><b>${progress}%</b></div>${Progress(progress)}</div>` : ''}
      <div class="contact">${Avatar(owner.name, 'sm')}<div class="grow"><div class="t-sm fw-600">${esc(owner.name)}</div><div class="t-xs muted">Course owner · ${esc(owner.email)}</div></div></div>
      <a class="btn btn--outline btn--block" href="mailto:${esc(owner.email)}">${ICON.mail}Email course owner</a>
    </div>`;
  }

  /** Course / Practice entry — mục Practice trên trang khoá (Practice · Learner 3.1, BR-PR-01, 02) */
  function PracticeEntry({ questions = 40, href = 'practice.html' } = {}) {
    return `<div class="pr-entry"><span class="pr-entry__ic">${ICON.dumbbell}</span>
      <div class="grow"><b>Practice</b><p>${questions} questions · See answers right after each question · Does not count toward exam attempts or progress</p></div>
      <a class="wbtn wbtn--outline" href="${url(href)}" data-practice>Practice</a></div>`;
  }
  /* ---------- Assessment ---------- */
  /** Assessment / Mode card — Mode: practice | exam */
  function ModeCard({ mode, questions, minutes, attemptsLeft }) {
    if (mode === 'practice') return `<div class="mode-card mode-card--practice"><span class="mode-card__icon">${ICON.dumbbell}</span>
      <div><div class="mode-card__title">Practice</div></div>
      <ul><li>${questions} questions</li><li>Unlimited</li></ul>
      ${Button({ label: 'Start Practice', variant: 'outline', icon: 'dumbbell', attrs: 'data-go="practice"' })}</div>`;
    return `<div class="mode-card mode-card--exam"><span class="mode-card__icon">${ICON.award}</span>
      <div><div class="mode-card__title">Exam</div></div>
      <ul><li>${questions} questions · ${minutes} min</li><li>${attemptsLeft}</li></ul>
      ${Button({ label: 'Start Exam', icon: 'play', attrs: 'data-go="exam"' })}</div>`;
  }

  /**
   * Assessment / Question card
   * Review: unanswered (đang làm) | hidden (chế độ ẩn đáp án) | revealed (chế độ hiện đáp án) | practice-checked
   * Result: correct | incorrect | blank
   */
  function QuestionCard({ n, total, type = 'single', text, options, chosen = [], correct = [], explain = '', review = 'unanswered', result }) {
    const multi = type === 'multi';
    const reveal = review === 'revealed' || review === 'practice-checked';
    const resBadge = review === 'unanswered' ? '' : result === 'correct' ? Badge('Đúng', 'success', 'check') : result === 'blank' ? Badge('Chưa trả lời', 'danger', 'x') : Badge('Sai', 'danger', 'x');
    const opts = options.map((o, i) => {
      const isChosen = chosen.includes(i), isRight = correct.includes(i);
      let cls = 'opt', tag = '', mark = '';
      if (review === 'unanswered') { if (isChosen) { cls += ' opt--chosen'; mark = ICON.check; } }
      else if (!reveal) { if (isChosen) { cls += ' opt--chosen'; mark = ICON.check; tag = 'Your answer'; } }
      else {
        if (isRight) { cls += ' opt--right'; mark = ICON.check; tag = isChosen ? 'Your answer · Correct answer' : 'Correct answer'; }
        else if (isChosen) { cls += ' opt--wrong'; mark = ICON.x; tag = 'Your answer'; }
      }
      return `<div class="${cls}"><span class="opt__mark ${multi ? 'opt__mark--box' : ''}">${mark}</span><span class="opt__text">${String.fromCharCode(65 + i)}. ${esc(o)}</span>${tag ? `<span class="opt__tag">${tag}</span>` : ''}</div>`;
    }).join('');
    const tone = review === 'unanswered' ? '' : result === 'correct' ? 'q-card--correct' : 'q-card--incorrect';
    const footer = review === 'hidden'
      ? `<div class="locked-answer">${ICON.eyeOff}<span>Shown after you pass or use all attempts</span></div>`
      : reveal && explain ? `<div class="explain"><b>Explanation</b>${esc(explain)}</div>` : '';
    return `<article class="q-card ${tone}" data-review="${review}" data-result="${result || ''}">
      <div class="q-card__head"><span class="q-card__num">Question ${n}${total ? '/' + total : ''}</span><span class="q-card__type">${multi ? 'Multiple Choice' : 'Single Choice'}</span><span class="grow"></span>${resBadge}</div>
      <div class="q-card__body"><p class="q-card__text">${esc(text)}</p><div class="stack gap-8">${opts}</div>${footer}</div></article>`;
  }

  /** Assessment / Score ring */
  function ScoreRing({ score, pass }) {
    const c = pass ? 'var(--green-600)' : 'var(--red-600)';
    return `<div class="score-ring" style="background:conic-gradient(${c} ${score * 3.6}deg, var(--neutral-200) 0)"><div class="score-ring__in"><span class="score-ring__val" style="color:${c}">${score}</span><span class="score-ring__lbl">/ 100</span></div></div>`;
  }

  /* ---------- Learn (chép DOM /course/<id>/learn và /quiz/<id>) ---------- */
  /** Course / Lessons accordion (trang khoá) — session nền #ECEEFF bo 14, mở ra hộp trắng các bài.
   *  status(i) trả về text phải: "Completed" | "Not Completed" | html LH2 */
  function LessonsAccordion(sessions, { open = [0], status, locked = false } = {}) {
    let li = 0;
    return sessions.map((s, si) => {
      const isOpen = open.includes(si);
      const rows = s.lessons.map(([k, n]) => { const i = li++; return `<div class="acc__lesson ${locked ? 'is-locked' : ''}">${locked ? ICON.lock : ICON[k === 'video' ? 'tvPlay' : k === 'quiz' ? 'fileQ' : 'tvPlay']}<h3>${esc(n)}</h3><span class="acc__st">${status ? status(i, k) : 'Not Completed'}</span></div>`; }).join('');
      return `<div class="acc ${isOpen ? 'is-open' : ''}" data-acc="${si}"><button class="acc__head"><span class="acc__name">${esc(s.name)}</span><span class="acc__count">${s.lessons.length} lesson${s.lessons.length > 1 ? 's' : ''}</span><span class="acc__chev">${ICON.chevronD}</span></button>
        <div class="acc__body"><div class="acc__box">${rows}</div></div></div>`;
    }).join('');
  }
  /** Learn / Course content drawer (cột phải 400). marks[i] = 'done' | 'part:<p>' | 'fail' | 'none'
   *  Learning Progress 3.1: Not Started · In Progress · Completed; mọi bài mở được (BR-LP-04); "Section n" thay "Session n". */
  function CourseContent(sessions, { current = 0, marks = [], open, meta = {} } = {}) {
    let li = 0;
    const html = sessions.map((s, si) => {
      const start = li; const items = s.lessons.map(([k, n], j) => {
        const i = li++; const m = marks[i] || 'none'; const cur = i === current;
        const pct = m.startsWith('part') ? m.split(':')[1] : null;
        const ic = m === 'done' ? `<span class="cc-ic cc-ic--done" title="Completed">${ICON.circleCheck}</span>` : pct ? `<span class="ls ls--part" style="--p:${pct}" title="In Progress · Watched ${pct}%"></span>` : m === 'fail' ? `<span class="ls ls--part" style="--p:50" title="In Progress · not passed yet"></span>` : `<span class="cc-ic" title="Not Started">${ICON.circle}</span>`;
        const base = k === 'quiz' ? `${ICON.fileQ}<span>32 Questions</span>` : k === 'video' ? `${ICON.tvPlay}<span>10 min</span>` : `${ICON.file}<span>Document</span>`;
        const note = pct ? `<span class="cc-lesson__st">Watched ${pct}%</span>` : m === 'fail' ? '<span class="cc-lesson__st">Not passed yet</span>' : '';
        const href = k === 'quiz' ? url('test-start.html') : url(`lesson-learn.html?i=${i}`);
        return `<a class="cc-lesson ${cur ? 'is-current' : ''}" href="${href}" data-i="${i}">${ic}<div class="grow"><span class="cc-lesson__t">${j + 1}. ${esc(n)}</span><div class="cc-lesson__m">${meta[i] || base}${note}</div></div></a>`;
      }).join('');
      const doneN = marks.slice(start, li).filter((m) => m === 'done').length;
      const isOpen = open ? open.includes(si) : (current >= start && current < li);
      return `<div class="cc-sec ${isOpen ? 'is-open' : ''}"><button class="cc-sec__head" data-sec>${isOpen ? ICON.chevronU : ICON.chevronD}<span class="grow">Section ${si + 1}: ${esc(s.name)}</span><span class="cc-sec__n">${doneN}/${s.lessons.length}</span></button><div class="cc-sec__body">${items}</div></div>`;
    }).join('');
    return `<div class="drawer__head"><h2>Course content</h2><button class="hd-icon" aria-label="Close">${ICON.x}</button></div><div class="drawer__body">${html}</div>`;
  }
  /** Learn / Progress gauge — nút "Your progress" trên header màn học */
  function Gauge(pct) {
    const r = 10, c = 2 * Math.PI * r;
    return `<svg class="gauge" viewBox="0 0 24 24"><circle cx="12" cy="12" r="${r}" fill="none" stroke="#e5e5e5" stroke-width="2.5"/><circle cx="12" cy="12" r="${r}" fill="none" stroke="var(--primary-900)" stroke-width="2.5" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}" stroke-linecap="round"/></svg>`;
  }
  /** Learn / Shell — header riêng 61 + cột stage (100% − 400) + drawer 400 cố định */
  function LearnShell({ course, pct = 0, stage = '', below = '', drawer = '', tab = 'Overview' }) {
    const tabs = ['Overview', 'Notes', 'Announcements', 'Reviews', 'Learning tools'];
    return `<div class="learn-shell">
      <header class="learn-hd"><div class="learn-hd__l"><a href="home.html" class="learn-hd__home">Learning Hub</a><span class="learn-hd__sep"></span><a href="course-detail.html"><h1>${esc(course)}</h1></a></div>
        <button class="learn-hd__pg" data-pop>${Gauge(pct)}<span>Your progress</span>${ICON.chevronD}</button></header>
      <div class="learn-main"><div class="learn-col"><div class="learn-stage-wrap">
        <div class="learn-stage">${stage}<button class="stage-nav stage-nav--l" aria-label="Previous lesson">${ICON.chevronL}</button><button class="stage-nav stage-nav--r" aria-label="Next lesson">${ICON.chevronR}</button></div></div>
        <div class="learn-tabs">${tabs.map((t) => `<button class="${t === tab ? 'is-active' : ''}">${t}</button>`).join('')}</div>
        <div class="learn-below">${below}</div></div>
        <aside class="learn-drawer">${drawer}</aside></div></div>`;
  }
  /* ---------- Assessment (Practice / Exam) — plan 10/11/2026 ---------- */
  ICON.flag = P('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>');
  ICON.timer = P('<path d="M10 2h4"/><path d="M12 14l3-3"/><circle cx="12" cy="14" r="8"/>');
  ICON.target = P('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>');

  /** Assessment / Exam intro (màn bắt đầu bài thi) — Exam 3.1, Practice · Learner 3.2.
   *  Chỉ còn Exam (Practice là mục riêng trên trang khoá, BR-PR-01). State: default | in-progress | passed | out */
  /* D-167 (20/11): practice = { questions } → ô Practice Mode bên trái ô Exam Mode, cùng cỡ (Practice · Learner 3.1). Không truyền = chỉ Exam Mode */
  function ModeSelect({ title, questions, minutes, passMark = 80, totalPts, maxAttempts = 3, attemptsLeft = 3, best = null, state = 'default', remain = '', retake = false, desc = '', practice = null }) {
    const need = totalPts ? Math.ceil(passMark * totalPts / 100) : null;
    const meta = [[ICON.list, `${questions} Questions`], [ICON.clock, minutes ? `${minutes} Minutes` : 'No time limit']]
      .map(([i, t]) => `<span>${i}${esc(t)}</span>`).join('');
    const lines = [`Passing Score: <b>${passMark}%${need ? ` (${need}/${totalPts})` : ''}</b>`, `Attempts: <b>${attemptsLeft}/${maxAttempts} left</b>`]
      .concat(best != null ? [`Highest Score: <b>${best}</b>`] : []);
    const btn = {
      default: [retake ? 'Retake Exam' : 'Start Exam', 'data-go="exam"', ''],
      'in-progress': [`Resume Exam${remain ? ` · ${remain} left` : ''}`, 'data-go="exam"', 'wbtn--warn'],
      passed: ['View Result', 'data-go="result"', 'wbtn--outline'],
      out: ['View Result', 'data-go="result"', 'wbtn--outline'],
    }[state];
    const badge = state === 'passed' ? `<span class="badge badge--success">${ICON.check}Passed</span>` : state === 'out' ? `<span class="badge badge--danger">${ICON.x}Failed · no attempts left</span>` : state === 'in-progress' ? `<span class="badge badge--warning">${ICON.timer}In progress</span>` : '';
    return `<div class="stage-card stage-card--center"><div class="mode-sel" data-state="${state}">
      ${badge ? `<div class="mode-sel__badge">${badge}</div>` : ''}
      <h1>${esc(title)}</h1>
      ${desc ? `<p class="mode-sel__sub">${esc(desc)}</p>` : ''}
      ${practice ? '' : `<div class="mode-sel__meta">${meta}</div>`}
      ${practice ? (() => {
        /* D-168: 2 ô cùng khuôn — biểu tượng + tên chế độ, 3 dòng "nhãn · giá trị" thẳng hàng, nút dưới đáy. Không câu mô tả. */
        const row = (k, v) => `<div class="mode-kv"><span>${k}</span><b>${v}</b></div>`;
        return `<div class="mode-pair">
          <section class="mode-box mode-box--practice"><h2>${ICON.dumbbell}Practice</h2>
            ${row('Questions', practice.questions)}${row('Time', 'No limit')}${row('Attempts', 'Unlimited')}
            <button class="wbtn wbtn--outline wbtn--lg" data-go="practice">Start Practice</button></section>
          <section class="mode-box mode-box--exam"><h2>${ICON.award}Exam</h2>
            ${row('Questions', questions)}${row('Time', minutes ? `${minutes} min` : 'No limit')}${row('Passing Score', `${passMark}%${need ? ` (${need}/${totalPts})` : ''}`)}${row('Attempts', `${attemptsLeft}/${maxAttempts} left`)}${best != null ? row('Highest Score', best) : ''}
            <button class="wbtn wbtn--lg ${btn[2]}" ${btn[1]}>${esc(btn[0])}</button></section>
        </div>`; })() : `<div class="exam-intro"><span class="exam-intro__h">${ICON.award}Exam Mode</span>${lines.map((l) => `<span>${l}</span>`).join('')}</div>
      <div class="mode-sel__btns is-single"><div class="mode-sel__opt"><button class="wbtn wbtn--lg ${btn[2]}" ${btn[1]}>${esc(btn[0])}</button></div></div>`}
    </div></div>`;
  }

  /**
   * Assessment / Question (web) — Exam 3.1, 3.4 · Practice · Learner 3.3
   * state: answering (practice) | checked (practice sau Check Answer) | exam (đang thi) | review-hidden | review-revealed
   * prior: { chosen, result: 'correct'|'incorrect'|'blank' } — lượt 2, 3 (BR-EX-03): câu Correct giữ sẵn lựa chọn và vẫn sửa được,
   *        câu Incorrect (gồm bỏ trống) xoá trắng để chọn lại. Không hiện đáp án đúng.
   */
  const TYPE_UI = { single: 'Single choice', multi: 'Multiple choice', tf: 'True / False' };
  function WebQuestion({ n, text, options, type = 'single', chosen = [], correct = [], explain = '', state = 'answering', showCheck = false, flagged = false, prior = null, points = 1 }) {
    const multi = type === 'multi'; const reveal = state === 'checked' || state === 'review-revealed';
    const live = state === 'answering' || state === 'exam';
    const blank = chosen.length === 0;
    const ok = !blank && chosen.length === correct.length && chosen.every((c) => correct.includes(c));
    const result = live ? '' : blank ? 'blank' : ok ? 'correct' : 'incorrect';
    const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
    const changed = state === 'exam' && prior && prior.result === 'correct' && !same(prior.chosen || [], chosen);
    const opts = options.map((o, i) => {
      const isC = chosen.includes(i), isR = correct.includes(i);
      let cls = 'wq-opt', tag = '';
      if (reveal) { if (isR) { cls += ' is-right'; tag = `<span class="wq-tag wq-tag--ok">${isC ? 'Your answer · Correct answer' : 'Correct answer'}</span>`; } else if (isC) { cls += ' is-wrong'; tag = '<span class="wq-tag wq-tag--bad">Your answer</span>'; } }
      else if (state === 'review-hidden' && isC) { cls += ' is-mine'; tag = '<span class="wq-tag wq-tag--mine">Your answer</span>'; }
      else if (isC) cls += ' is-chosen';
      return `<button class="${cls}" data-k="${i}" ${live ? '' : 'disabled'}><span class="wq-dot ${multi ? 'wq-dot--box' : ''} ${isC ? 'is-on' : ''}">${isC ? (multi ? ICON.check : '<i></i>') : ''}</span><span class="wq-opt__t">${esc(o)}</span>${tag}</button>`;
    }).join('');
    const livePrior = state === 'exam' && prior ? `<span class="wq-res wq-res--${prior.result === 'correct' ? 'correct' : 'incorrect'}">${prior.result === 'correct' ? ICON.check + 'Correct' : ICON.x + 'Incorrect'}<span class="wq-prev">· previous attempt</span></span>` : '';
    const verdict = livePrior || (!result ? '' : `<span class="wq-res wq-res--${result}">${result === 'correct' ? ICON.check + 'Correct' : result === 'blank' ? 'Unanswered' : ICON.x + 'Incorrect'}</span>`);
    const foot = reveal && explain ? `<div class="wq-foot"><div class="wq-explain"><p>Explanation</p><div>${esc(explain)}</div></div></div>`
      : changed ? `<div class="wq-changed">${ICON.alert}You changed this answer. It was correct in the previous attempt.</div>`
      : showCheck && state === 'answering' ? `<div class="wq-acts"><button class="wbtn wq-check" data-check ${blank ? 'disabled' : ''}>Check Answer</button><button class="wbtn wbtn--ghost" data-skip>Skip</button><span class="wq-keys">A–D to choose · Enter to check · → to skip</span></div>` : '';
    const flag = state === 'exam' ? `<button class="wq-flag ${flagged ? 'is-on' : ''}" data-flag title="Mark for review">${ICON.flag}${flagged ? 'Marked for review' : 'Mark for review'}</button>` : '';
    return `<div class="wq ${flagged ? 'is-flagged' : ''} ${changed ? 'is-changed' : ''}" id="q${n}" data-n="${n}" data-state="${state}" data-result="${result || (prior && prior.result) || ''}">
      <div class="wq-head"><div class="wq-head__l"><span class="wq-num">Question ${n}</span>${verdict}</div><div class="wq-badges"><span class="wq-type">${TYPE_UI[type] || TYPE_UI.single}</span><span class="wq-pt">${points} point${points > 1 ? 's' : ''}</span>${flag}</div></div>
      <h2 class="wq-text">${esc(text)}</h2>${multi && live ? '<p class="wq-hint">Select all correct answers</p>' : ''}
      <div class="wq-opts">${opts}</div>${foot}</div>`;
  }
  /** Assessment / Dash meter — "x / N" + vạch 3px */
  /** marks (tuỳ chọn): mảng trạng thái từng vạch 'ok' | 'bad' | 'skip' | '' và cur = vị trí đang làm (Practice: "Question x of n") */
  function DashMeter(done, total, label = 'complete', marks = null, cur = -1) {
    const bar = Array.from({ length: total }, (_, i) => `<i class="${marks ? (marks[i] ? 'is-' + marks[i] : '') : (i < done ? 'on' : '')} ${i === cur ? 'is-cur' : ''}"></i>`).join('');
    return `<div class="dash"><div class="dash__row"><span>${marks ? esc(label) : `${done} / ${total} ${esc(label)}`}</span>${ICON.trophy}</div><div class="dash__bar">${bar}</div></div>`;
  }
  /** Assessment / Quiz top bar — Mode: practice | exam | review. Dính trên cùng màn quiz */
  function QuizTopBar({ mode = 'practice', title, center = '', right = '' }) {
    const lbl = { practice: ['Practice', ''], exam: ['Exam', 'quiz-badge--exam'], review: ['Result', 'quiz-badge--exam'] }[mode];
    return `<div class="qbar qbar--${mode}"><div class="qbar__in">
      <div class="qbar__l"><span class="quiz-badge ${lbl[1]}">${lbl[0]}</span><b class="qbar__t">${esc(title)}</b></div>
      <div class="qbar__c">${center}</div><div class="qbar__r">${right}</div></div></div>`;
  }
  /** Assessment / Exam timer — State: normal | warning (≤5 phút) | expired */
  function ExamTimer(sec) {
    const st = sec <= 0 ? 'expired' : sec <= 300 ? 'warning' : 'normal';
    const t = `${String(Math.floor(Math.max(sec, 0) / 60)).padStart(2, '0')}:${String(Math.max(sec, 0) % 60).padStart(2, '0')}`;
    return `<span class="timer timer--${st}" role="timer" aria-label="Time left">${ICON.timer}${t}</span>`;
  }
  /** Assessment / Question nav — Exam 3.1 Lưới câu hỏi.
   *  item: string cũ ('empty' | 'answered' | 'flagged' | 'flagged-answered') hoặc { st, flag }.
   *  Lượt 2, 3: st = kept (Correct giữ nguyên) | changed (Correct đã đổi) | redo (Incorrect chưa chọn lại) | redone (Incorrect đã chọn lại) */
  function QuestionNav(items, { current, timer = '', nums, retake = false } = {}) {
    const no = (i) => (nums ? nums[i] : i + 1);
    const list = items.map((x) => (typeof x === 'string' ? { st: x.endsWith('answered') ? 'answered' : 'empty', flag: x.startsWith('flagged') } : x));
    const n = (k) => list.filter((x) => x.st === k).length;
    const lg = (retake ? [['kept', 'Correct · kept'], ['changed', 'Correct · changed'], ['redo', 'Incorrect · to redo'], ['redone', 'Incorrect · redone']] : [['answered', 'Answered'], ['empty', 'Not answered']])
      .map(([k, t]) => `<span><i class="qnav__sw qnav__sw--${k}"></i>${t} ${n(k)}</span>`).join('') + `<span><i class="qnav__sw qnav__sw--flag"></i>Marked for review ${list.filter((x) => x.flag).length}</span>`;
    return `<div class="qnav">${timer ? `<div class="qnav__timer"><span>Time left</span>${timer}</div>` : ''}<div class="qnav__h">Questions</div>
      <div class="qnav__grid">${list.map((x, i) => `<a href="#q${no(i)}" class="qnav__i qnav__i--${x.st} ${x.flag ? 'is-flag' : ''} ${current === i ? 'is-cur' : ''}" data-jump="${no(i)}">${no(i)}</a>`).join('')}</div>
      <div class="qnav__lg">${lg}</div></div>`;
  }
  /** Assessment / Submit confirm — Exam 3.2 */
  function SubmitConfirm({ unanswered = 0, flagged = 0, left = 3, max = 3, changed = 0 }) {
    const warn = unanswered || flagged || changed;
    return Modal({ id: 'submit-modal', size: 'sm', icon: warn ? 'alert' : 'info', iconTone: warn ? 'warning' : 'info', title: 'Submit exam?',
      body: `<div class="stack gap-8 t-sm"><div class="sc-line ${unanswered ? 'sc-line--warn' : ''}"><b>${unanswered}</b> unanswered · <b>${flagged}</b> marked for review. Submitting uses 1 attempt (${left}/${max} left).</div>
        ${changed ? `<div class="sc-line sc-line--warn">You changed <b>${changed}</b> answer${changed > 1 ? 's' : ''} that ${changed > 1 ? 'were' : 'was'} correct in the previous attempt.</div>` : ''}
        ${unanswered ? '<div class="muted">Unanswered questions count as Incorrect.</div>' : ''}</div>`,
      foot: `${warn ? '<button class="wbtn wbtn--outline" data-close data-review-empty>Review Questions</button>' : '<button class="wbtn wbtn--outline" data-close>Cancel</button>'}<button class="wbtn" data-submit-now>Submit</button>` });
  }
  /** Assessment / Result summary — Exam 3.3. Passed / Not Passed theo lượt; Failed khi hết 3 lượt; Final Score = điểm cao nhất */
  function ResultSummary({ score, passMark = 80, totalPts, right, wrong, blank = 0, total, minutes, attemptNo, maxAttempts = 3, used, result, canRetry, isLatest = true, best = score }) {
    const pass = result === 'pass'; const done = best >= passMark; const final = used >= maxAttempts || done; const left = maxAttempts - used;
    const need = totalPts ? Math.ceil(passMark * totalPts / 100) : null;
    const failed = isLatest && final && !done;
    const c = pass ? 'var(--green-600)' : 'var(--red-600)';
    const r = 50, C = 2 * Math.PI * r;
    const title = failed ? 'Failed' : pass ? 'Passed' : 'Not Passed';
    return `<div class="rsum rsum--${pass ? 'pass' : 'fail'}">
      <div class="rsum__ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--neutral-100)" stroke-width="10"/><circle cx="60" cy="60" r="${r}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - score / 100)}" transform="rotate(-90 60 60)"/></svg><div><b style="color:${c}">${score}</b><span>/ 100</span></div></div>
      <div class="rsum__body">
        <div class="rsum__t"><h1>${isLatest ? title : `Attempt ${attemptNo}: ${pass ? 'Passed' : 'Not Passed'}`}</h1></div>
        <div class="rsum__stats"><div class="is-ok"><b>${right}</b><span>Correct</span></div><div class="is-bad"><b>${wrong}</b><span>Incorrect</span></div><div><b>${blank}</b><span>Unanswered</span></div><div><b>${total}</b><span>Total</span></div></div>
        <div class="rsum__meta"><span>Attempt ${attemptNo}/${maxAttempts}</span>${minutes ? `<span>${minutes} min</span>` : ''}<span>Passing Score: ${passMark}%${need ? ` (${need}/${totalPts})` : ''}</span>${final ? `<span>Final Score: <b>${best}</b></span>` : ''}</div>
        <div class="rsum__act">${canRetry ? `<button class="wbtn" data-retry>Retake Exam (${left} attempt${left > 1 ? 's' : ''} left)</button>` : ''}<button class="wbtn wbtn--outline" data-review>Review Answers</button><button class="wbtn wbtn--outline" data-go="start">Back to Quiz</button></div>
      </div></div>`;
  }
  /** Assessment / Answer note — Exam 3.3 Dòng thông báo đáp án. State: hidden | passed | out */
  function AnswerNote({ state, left = 0, best }) {
    if (state === 'passed') return Alert({ tone: 'success', icon: 'check', text: 'You passed! Correct answers and explanations are now available. This exam is complete.' });
    if (state === 'out') return Alert({ tone: 'neutral', icon: 'eye', text: `You have used all 3 attempts. Correct answers and explanations are now available. Final Score (highest): ${best}.` });
    return Alert({ tone: 'info', icon: 'eyeOff', text: `Correct answers and explanations will be shown once you pass or use all 3 attempts (${left} attempt${left > 1 ? 's' : ''} left).` });
  }
  /** Assessment / Review filter — Exam 3.4. Active: all | correct | incorrect */
  function ReviewFilter(active, counts) {
    return `<div class="rfilter" role="tablist">${[['all', 'All'], ['correct', 'Correct'], ['incorrect', 'Incorrect']].map(([k, t]) => `<button role="tab" class="${active === k ? 'is-active' : ''}" data-f="${k}">${t}<span>${counts[k]}</span></button>`).join('')}</div>`;
  }
  /** Assessment / Practice summary — Practice · Learner 3.3 Tổng kết */
  /** wrong: số thứ tự câu sai · skipped: số thứ tự câu bỏ qua (Skip) — cả hai vào lượt "Practice n Incorrect" */
  function PracticeSummary({ right, total, wrong = [], skipped = [] }) {
    const redo = wrong.length + skipped.length;
    const chip = (n, sk) => `<a href="#q${n}" data-jump="${n}" class="${sk ? 'is-skip' : ''}">Question ${n}${sk ? ' · skipped' : ''}</a>`;
    const list = [...wrong.map((n) => [n, false]), ...skipped.map((n) => [n, true])].sort((a, b) => a[0] - b[0]);
    return `<div class="psum"><div class="psum__head"><span class="psum__ic">${ICON.trophy}</span><div><h2>Practice complete</h2><p><b>${right} / ${total}</b> correct · ${wrong.length} incorrect${skipped.length ? ` · ${skipped.length} skipped` : ''}</p></div></div>
      <div class="psum__note">${ICON.info}Practice does not count toward exam attempts or progress, and results are not saved.</div>
      ${redo ? `<div class="psum__wrong"><b>Questions to review</b><div>${list.map(([n, sk]) => chip(n, sk)).join('')}</div></div>` : '<div class="psum__wrong"><b>All answers are correct.</b></div>'}
      <div class="psum__act">${redo ? `<button class="wbtn" data-retry-wrong>Practice ${redo} Incorrect${skipped.length ? ' &amp; Skipped' : ''}</button>` : ''}<button class="wbtn wbtn--outline" data-restart>Restart</button><button class="wbtn wbtn--outline" data-back-course>Back to Quiz</button></div></div>`;
  }
  /* ---------- Enroll — Enrollment 3.1, 3.2 (BR-ENR-01, 10) ---------- */
  /** Learner / Slot indicator — D-119/D-139: "In progress: x/3 elective courses". Mandatory không tính suất (không +1 slot). */
  function EnrollSlotPanel({ used = 0, limit = 3, mandatory = 0 }) {
    const full = used >= limit;
    const dots = Array.from({ length: limit }, (_, k) => `<i class="${k < used ? 'on' : ''}"></i>`).join('');
    const note = mandatory > 0 ? ` · ${mandatory} mandatory (not in limit)` : '';
    return `<span class="slot-chip ${full ? 'slot-chip--full' : ''}" title="Mandatory courses don\'t count toward the ${limit} elective limit."><span class="slot-chip__dots">${dots}</span>In progress: <b>${used}/${limit}</b> elective courses${note}</span>`;
  }
  /** Learner / Empty enroll frame — CTA đăng ký thêm trong giới hạn 3 elective (D-119). Không cộng suất mandatory. */
  function EmptySlotCard(left = 1) {
    const n = Math.max(1, left | 0);
    return `<a class="slot-empty" href="course-search.html" title="Open Search Courses, then Start Course. Mandatory courses don't count toward the 3 elective limit."><span class="slot-empty__ic">${ICON.plus}</span><b>Enroll another course</b><span class="slot-empty__go">${n} elective left · Browse${ICON.chevronR}</span></a>`;
  }

  /**
   * Course / CTA card — khung bên phải trang khoá. State: all | limit | upcoming | learning | overdue | completed | failed.
   * sched: { label, range } · result: { pct, video, test } (khi đã đăng ký) · mandatory: khoá bắt buộc với học viên đang xem
   */
  function CourseCta({ state = 'all', sched, slots = 1, limit = 3, result, startDate = '', certHref = '', mandatory = false, mandatoryN = 0 }) {
    const tags = {
      learning: Badge('In Progress', 'info'), overdue: Badge('In Progress', 'info'),
      completed: Badge('Completed', 'success', 'check'), failed: Badge('Failed', 'danger'),
    }[state] || '';
    const right = (state === 'overdue' ? Badge('Overdue', 'danger') : '') + (mandatory ? Badge('Mandatory', 'warning', 'shield') : '');
    const head = tags || right ? `<div class="cta-card__tags">${tags}${right ? `<span class="grow"></span>${right}` : ''}</div>` : '';
    const meta = sched ? `<div class="cta-card__meta"><span class="ic-box">${ICON.calendar}</span><span>${esc(sched.label)} <b>${esc(sched.range)}</b></span></div>` : '';
    let body = '', btn = '';
    if (result) {
      const review = state === 'completed' || state === 'failed';
      body = `<button class="cta-card__pg" data-pop>${WebProgress(result.pct, 'Progress')}<span class="cta-card__sub">Videos ${result.video[0]}/${result.video[1]} · Quizzes ${result.test[0]}/${result.test[1]}</span></button>`;
      /* D-173: khoá Completed — xem và tải chứng chỉ ngay trên trang khoá */
      const cert = state === 'completed' && certHref ? `<a class="aside-btn" href="${esc(certHref)}" style="margin-bottom:8px">${ICON.award}View Certificate</a><button class="aside-btn aside-btn--outline" data-cert-dl style="margin-bottom:8px">${ICON.download}Download Certificate</button>` : '';
      btn = `${cert}<button class="aside-btn ${review ? 'aside-btn--outline' : ''}" data-continue>${review ? 'Review Course' : 'Continue Learning'}</button>`;
    } else {
      body = mandatory ? '<span class="cta-card__sub">This mandatory course doesn\'t count toward your 3 elective courses.</span>' : `<div>${EnrollSlotPanel({ used: slots, limit, mandatory: mandatoryN })}</div>`;
      btn = state === 'upcoming'
        ? `<button class="aside-btn" disabled>Start Course</button><span class="cta-card__sub" style="text-align:center">This course opens on ${esc(startDate)}.</span>`
        : `<button class="aside-btn" id="start">Start Course</button>`;
    }
    return `<div class="cta-card" data-state="${state}">${head}${meta}${body}${btn}</div>`;
  }
  function SlotMeter(used, limit, mandatory = 0) {
    const full = used >= limit;
    const dots = Array.from({ length: limit }, (_, i) => `<i class="${i < used ? 'on' : ''}"></i>`).join('');
    const note = mandatory > 0 ? ` · ${mandatory} mandatory (not in limit)` : '';
    return `<span class="slot-meter ${full ? 'slot-meter--full' : ''}"><span class="slot-meter__dots">${dots}</span>In progress: ${used}/${limit} elective courses${note}</span>`;
  }
  /* ---------- Đợt 2 · #8 Tiến độ · #7 Kết quả ---------- */
  /** Course / Progress breakdown — Mode: compact (card) | full (popover). BR-LRN-21, 26 */
  function ProgressBreakdown({ pct, video, test, doc, mode = 'compact', practice = false }) {
    /* Learning Progress 3.2 — popover Your progress */
    const parts = [video && video[1] ? `Videos ${video[0]}/${video[1]}` : '', test && test[1] ? `Quizzes ${test[0]}/${test[1]}` : ''].filter(Boolean).join(' · ');
    if (mode === 'compact') return `<div class="pg pg--compact"><div class="row"><span>Progress</span><b>${pct}%</b></div>${Progress(pct)}${parts ? `<span class="pg__split">${parts}</span>` : ''}</div>`;
    const done = [video, test, doc].filter(Boolean).reduce((a, x) => a + x[0], 0), all = [video, test, doc].filter(Boolean).reduce((a, x) => a + x[1], 0);
    const line = (ic, lbl, v, unit) => v && v[1] ? `<div class="pg__line">${ICON[ic]}<span class="grow">${lbl}</span><b>${v[0]}/${v[1]}</b><span class="muted">${unit}</span></div>` : '';
    return `<div class="pg pg--full"><div class="row"><span class="fw-600">Completion Rate</span><span class="grow"></span><b class="t-xl">${pct}%</b></div>${Progress(pct)}
      <span class="t-xs muted">${done}/${all} lessons completed</span>
      <div class="pg__lines">${line('video', 'Videos', video, 'watched')}${line('quiz', 'Quizzes', test, 'passed')}${line('file', 'Documents', doc, 'opened')}</div>
      ${practice ? '<span class="t-xs muted">Practice does not count toward progress.</span>' : ''}</div>`;
  }
  /** Learner / Completion ring — vòng Tỷ lệ hoàn thành (#7) */
  function CompletionRing(pct, size = 120) {
    return `<div class="c-ring" style="--p:${pct};width:${size}px;height:${size}px"><div class="c-ring__in"><b>${pct}%</b><span>complete</span></div></div>`;
  }

  /* ---------- Đợt 2 · #3 Duyệt khoá ---------- */
  const STATUS = { draft: ['Draft', 'neutral'], pending: ['Pending Approval', 'warning'], rejected: ['Changes Requested', 'danger'], published: ['Published', 'success'] };
  /** Course / Status badge — Status: draft | pending | rejected | published · Revision: none | pending | rejected */
  function CourseStatus(status, revision) {
    const [l, t] = STATUS[status];
    const rev = revision === 'pending' ? Badge('Edit Pending Approval', 'warning') : revision === 'rejected' ? Badge('Edit Changes Requested', 'danger') : revision === 'draft' ? Badge('Edit Draft', 'neutral') : '';
    return `<span class="row gap-4">${Badge(l, t)}${rev}</span>`;
  }
  /** Course / Approval banner — chỉ dùng khi Admin trả về kèm nhận xét (BR-CRS-07).
   *  Không có nút (Gửi duyệt / Sửa nội dung nằm ở chân trang), không có câu ghi chú trạng thái (đã có tag cạnh tiêu đề). */
  function ApprovalBanner({ title = 'L&D requested changes', comment = '', by = 'Lê Thị Mai (Admin L&D)', at = '10:24 · 09/11/2026' }) {
    const quote = comment ? `<blockquote class="ab__quote">“${esc(comment)}”<cite>${esc(by)} · ${esc(at)}</cite></blockquote>` : '';
    return `<div class="ab alert alert--danger">${ICON.alert}<div class="grow stack gap-4"><b>${esc(title)}</b>${quote}</div></div>`;
  }

  /* ---------- Đợt 2 · #6 Tìm kiếm ---------- */
  /** Chuẩn hoá để so khớp: bỏ dấu, đ→d, chữ thường (BR-LRN-12) */
  const norm = (s) => String(s).normalize("NFD").replace(/[\̀-\ͯ]/g, "").replace(/\đ/g, "d").replace(/\Đ/g, "D").toLowerCase();
  /** In đậm phần tên khớp từ khoá (bỏ dấu khi so) */
  function highlight(text, q) {
    const words = norm(q).split(/\s+/).filter(Boolean); if (!words.length) return esc(text);
    const n = norm(text); const mark = new Array(text.length).fill(false);
    words.forEach((w) => { let i = n.indexOf(w); while (i >= 0) { for (let k = i; k < i + w.length; k++) mark[k] = true; i = n.indexOf(w, i + 1); } });
    let out = '', on = false;
    [...text].forEach((ch, i) => { if (mark[i] !== on) { out += mark[i] ? '<mark>' : '</mark>'; on = mark[i]; } out += esc(ch); });
    return out + (on ? '</mark>' : '');
  }

  /** Certificate / Sheet (23/11 · mẫu navy + vàng, cân giữa, tone TECHVIFY) — 1122×793 = A4 ngang.
   *  Vùng: dải navy chữ V + dải vàng · TECHVIFY / LearningHub · CERTIFICATE / OF COMPLETION · con dấu (logo V + năm)
   *  · PROUDLY PRESENTED TO + tên chữ viết tay · tên khoá · chân: ngày | số chứng chỉ | chức danh người ký.
   *  showMascot giữ cho tương thích chỗ gọi cũ, không còn dùng (mascot chỉ ở popup chúc mừng). */
  /* Logo chữ V TECHVIFY (chữ "Vi" trong wordmark): thanh ngang xiên + vạch "i" + chữ V nét dày, cùng nằm trong tam giác ngược.
   * Đo theo wordmark TECHVIFY (23/11). viewBox 32 × 25. */
  const TV_MARK = (cls = '', fill = 'currentColor') => `<svg class="${cls}" viewBox="0 0 32 25" aria-hidden="true" fill="${fill}">
      <polygon points="0,0 25.2,0 22.26,4.6 2.94,4.6"/>
      <polygon points="27.4,0 32,0 29.06,4.6 24.46,4.6"/>
      <polygon points="4.1,6.4 9.6,6.4 16,16.4 22.4,6.4 27.9,6.4 16,25"/>
    </svg>`;
  function certChevron() {
    return `<svg class="cert-sheet__bg" viewBox="0 0 1122 793" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="cs-navy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2c72"/><stop offset=".55" stop-color="#132058"/><stop offset="1" stop-color="#0f1845"/></linearGradient>
        <linearGradient id="cs-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8841c"/><stop offset=".25" stop-color="#f2d27a"/><stop offset=".5" stop-color="#c9a227"/><stop offset=".75" stop-color="#f2d27a"/><stop offset="1" stop-color="#a8841c"/></linearGradient>
        <linearGradient id="cs-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6eaf3"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
      </defs>
      <polygon points="0,176 561,322 1122,176 1122,430 0,430" fill="url(#cs-mist)"/>
      <polygon points="0,0 1122,0 1122,150 561,300 0,150" fill="url(#cs-navy)"/>
      <polygon points="0,150 561,300 1122,150 1122,164 561,316 0,164" fill="url(#cs-gold)"/>
      <polygon points="0,170 561,322 1122,170 1122,173 561,325 0,173" fill="#c9a227" opacity=".55"/>
    </svg>`;
  }
  function certSeal(year) {
    const pts = [];
    for (let i = 0; i < 48; i++) { const r = i % 2 ? 55 : 60, a = (Math.PI * 2 * i) / 48; pts.push(`${(60 + r * Math.sin(a)).toFixed(1)},${(60 - r * Math.cos(a)).toFixed(1)}`); }
    const leaf = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="5.2" transform="rotate(${rot} ${x} ${y})" fill="#e2bd57"/>`;
    const laurel = (side) => [0, 1, 2, 3, 4].map((k) => { const a = (200 + k * 22) * Math.PI / 180, x = 60 + side * 33 * Math.cos(a) * -1, y = 66 + 33 * Math.sin(a) * -1; return leaf(x.toFixed(1), y.toFixed(1), side * (k * 22 - 20)); }).join('');
    return `<svg class="cert-sheet__seal" viewBox="0 0 120 120" role="img" aria-label="TECHVIFY seal ${esc(year)}">
      <defs><linearGradient id="cs-seal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8c"/><stop offset=".5" stop-color="#c9a227"/><stop offset="1" stop-color="#9c7a18"/></linearGradient></defs>
      <polygon points="${pts.join(' ')}" fill="url(#cs-seal)"/>
      <circle cx="60" cy="60" r="47" fill="#0f1845" stroke="#f2d27a" stroke-width="2"/>
      <circle cx="60" cy="60" r="41" fill="none" stroke="#c9a227" stroke-width=".8" stroke-dasharray="2 2.4"/>
      ${laurel(1)}${laurel(-1)}
      <g transform="translate(42 33) scale(1.125)" fill="#ffffff"><polygon points="0,0 25.2,0 22.26,4.6 2.94,4.6"/><polygon points="27.4,0 32,0 29.06,4.6 24.46,4.6"/><polygon points="4.1,6.4 9.6,6.4 16,16.4 22.4,6.4 27.9,6.4 16,25"/></g>
      <text x="60" y="84" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5" fill="#f2d27a">${esc(year)}</text>
    </svg>`;
  }
  function CertificateSheet({ learnerName, courseTitle, completedAt, certificateNumber }) {
    const date = typeof completedAt === 'string' ? (window.LHCert ? LHCert.fmtDate(completedAt) : completedAt) : '';
    const d = new Date(completedAt), year = isNaN(d) ? String(new Date().getFullYear()) : String(d.getFullYear());
    return `<section class="cert-sheet" aria-label="Certificate of Completion">
      ${certChevron()}
      <div class="cert-sheet__frame" aria-hidden="true"></div>
      <div class="cert-sheet__brand"><b aria-label="TECHVIFY">TECH${TV_MARK('cert-sheet__vi')}FY</b><span>LearningHub</span></div>
      <div class="cert-sheet__title"><h1>Certificate</h1><p>of Completion</p></div>
      ${certSeal(year)}
      <div class="cert-sheet__main">
        <div class="cert-sheet__who">
          <p class="cert-sheet__kicker">Proudly presented to</p>
          <h2 class="cert-sheet__name">${esc(learnerName)}</h2>
          <i class="cert-sheet__rule" aria-hidden="true"></i>
        </div>
        <div class="cert-sheet__what">
          <p class="cert-sheet__kicker cert-sheet__kicker--sm">For successfully completing the course</p>
          <h3 class="cert-sheet__course" title="${esc(courseTitle)}">${esc(courseTitle)}</h3>
        </div>
        <div class="cert-sheet__foot">
          <div class="cert-sheet__sign"><b>${esc(date)}</b><i></i><span>Date of completion</span></div>
          <div class="cert-sheet__no">Certificate No.<b>${esc(certificateNumber)}</b></div>
          <div class="cert-sheet__sign"><b class="is-blank" aria-hidden="true">&nbsp;</b><i></i><span>Head of Learning &amp; Development<br>TECHVIFY</span></div>
        </div>
      </div>
    </section>`;
  }
  /** Co chữ cho vừa: tên 1 dòng (68 → 44px, rộng ≤ 820), tên khoá ≤ 2 dòng (26 → 18px) */
  function fitCertText(root = document) {
    root.querySelectorAll('.cert-sheet').forEach((sh) => {
      const n = sh.querySelector('.cert-sheet__name'), c = sh.querySelector('.cert-sheet__course');
      if (n) { let f = 68; n.style.fontSize = f + 'px'; while (n.scrollWidth > 820 && f > 44) { f -= 2; n.style.fontSize = f + 'px'; } }
      if (c) {
        let f = 26; c.classList.remove('is-clamp'); c.style.fontSize = f + 'px';
        const two = () => c.getBoundingClientRect().height / (sh.getBoundingClientRect().height / 793) <= f * 1.3 * 2 + 1;
        while (!two() && f > 18) { f -= 1; c.style.fontSize = f + 'px'; }
        if (!two()) c.classList.add('is-clamp');
      }
    });
  }

  /** Thu tấm chứng chỉ 1122×793 vừa khung .cert-scale (không cuộn ngang); gọi lại khi đổi cỡ cửa sổ */
  function fitCertScale(root = document) {
    fitCertText(root);
    if (document.fonts && !fitCertScale._wait) { fitCertScale._wait = true; document.fonts.ready.then(() => { fitCertScale._wait = false; fitCertText(root); }); }
    root.querySelectorAll('.cert-scale').forEach((box) => {
      const inn = box.querySelector('.cert-scale__in'); if (!inn) return;
      const cs = getComputedStyle(box), padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight), padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const k = Math.min(1, (box.clientWidth - padX) / 1122);
      inn.style.transform = k < 1 ? `scale(${k})` : '';
      inn.style.marginLeft = k < 1 ? Math.max(0, (box.clientWidth - padX - 1122 * k) / 2) + 'px' : '';
      box.style.height = (793 * k + padY) + 'px';
    });
  }
  if (!window.__lhCertFit) { window.__lhCertFit = true; addEventListener('resize', () => fitCertScale()); }

  /* ---------- Demo bar helper ---------- */
  /** groups: [{ label, key, options: [[value, text]], value }] ; onChange(state) */
  function DemoBar(title, groups, onChange) {
    const bar = document.createElement('div'); bar.className = 'demo-bar';
    const q = new URLSearchParams(location.search); // mở thẳng 1 trạng thái: ?key=value
    const role = App.role();
    const def = APP === 'admin' ? { r: role, role: role === 'admin' ? 'Admin' : 'Creator' } : {};
    const state = Object.fromEntries(groups.map((g) => [g.key, q.get(g.key) ?? def[g.key] ?? g.value ?? g.options[0][0]]));
    if (APP) { const set = (k, v) => { state[k] = v; onChange({ ...state }); }; onChange({ ...state }); return { state, set }; }
    /* Thu gọn mặc định thành nút DEMO góc dưới phải (nhớ trạng thái) · tự ẩn khi có popup để thấy trọn popup */
    const KEY = 'lh-demo-open';
    const setMin = (min) => { bar.classList.toggle('is-min', min); document.body.classList.toggle('demo-min', min); localStorage.setItem(KEY, min ? '0' : '1'); };
    const render = () => {
      bar.innerHTML = `<button class="demo-toggle" data-demo-toggle title="Mở / thu gọn thanh DEMO" aria-label="Mở / thu gọn thanh DEMO">DEMO</button><b>DEMO</b><span>${esc(title)}</span>` + groups.map((g) => `<div class="demo-group"><span>${esc(g.label)}</span>${g.options.map(([v, t]) => `<button data-k="${g.key}" data-v="${v}" aria-pressed="${state[g.key] === v}">${esc(t)}</button>`).join('')}</div>`).join('') + `<span class="demo-sep"></span><a href="index.html">← Danh sách màn</a><button class="demo-close" data-demo-toggle aria-label="Thu gọn">×</button>`;
    };
    const POP = '.modal-backdrop, .qz-modal, .adm-confirm';
    new MutationObserver(() => bar.classList.toggle('is-hidden', !!document.querySelector(POP))).observe(document.body, { childList: true, subtree: true });
    bar.addEventListener('click', (e) => {
      if (e.target.closest('[data-demo-toggle]')) { setMin(!bar.classList.contains('is-min')); return; }
      const b = e.target.closest('button[data-k]'); if (!b) return;
      state[b.dataset.k] = b.dataset.v; render(); onChange({ ...state });
    });
    render(); document.body.classList.add('has-demo'); document.body.appendChild(bar); setMin(localStorage.getItem(KEY) !== '1');
    const set = (k, v) => { state[k] = v; render(); onChange({ ...state }); };
    onChange({ ...state });
    return { state, set };
  }

  /* ---------- Ô tìm header — lọc ngay khi gõ (D-72) ----------
     · Ô trống: bảng xổ chỉ hiện "Tìm gần đây" (≤ 5 từ, ↑↓ Enter Esc). Có chữ: không có bảng gợi ý.
     · Trang Tìm khoá: gõ 200ms → phát 'search:live' {q}, trang lọc lưới khoá tại chỗ.
     · Trang khác: gõ ký tự đầu → chuyển sang course-search.html?q=…, giữ chữ đang gõ + con trỏ.
     · Enter / chọn từ gần đây: phát 'search:apply' {q, st, pd} (cancelable) + lưu lịch sử. */
  const SP = { hl: -1, timer: null, KEY: 'lhRecentSearch' };
  const onResultsPage = () => /course-search\.html$/.test(location.pathname);
  const spF = () => { const p = new URLSearchParams(onResultsPage() ? location.search : ''); return { ct: p.get('ct') || 'all', st: p.get('st') || 'all', pd: p.get('pd') || 'all' }; };
  const recentGet = () => JSON.parse(localStorage.getItem(SP.KEY) || '[]');
  const recentAdd = (q) => { if (!q) return; localStorage.setItem(SP.KEY, JSON.stringify([q, ...recentGet().filter((x) => norm(x) !== norm(q))].slice(0, 5))); };
  function needSearch(cb) {
    if (window.LHSearch) return cb();
    const s = document.createElement('script'); s.src = '../assets/js/search.js?v=' + LH_V; s.onload = cb; document.head.appendChild(s);
  }
  function spRender() {
    const pop = document.getElementById('search-pop'); if (!pop || pop.hidden) return;
    const input = pop.parentElement.querySelector('.search-pill input');
    needSearch(() => {
      const S = window.LHSearch, data = (window.LHData && LHData.catalog) || [];
      const q = S.clean(input.value), f = spF();
      const run = (patch) => S.run(data, { q, ...f, ...patch }).items;
      const recent = recentGet();
      if (q || !recent.length) { spClose(); return; } // có chữ → không gợi ý, lưới khoá lọc ngay
      pop.innerHTML = SearchPanel({ q: '', recent, total: run({}).items.length });
      SP.hl = -1;
    });
  }
  function spOpen() { const pop = document.getElementById('search-pop'); if (!pop) return; pop.hidden = false; pop.parentElement.querySelector('input').setAttribute('aria-expanded', 'true'); spRender(); }
  function spClose() { const pop = document.getElementById('search-pop'); if (!pop || pop.hidden) return; pop.hidden = true; pop.parentElement.querySelector('input').setAttribute('aria-expanded', 'false'); }
  function spApply(patch) {
    const input = document.querySelector('.search-pill input');
    const f = { ...spF(), q: (window.LHSearch ? LHSearch.clean(input.value) : input.value.trim()), ...patch };
    recentAdd(f.q);
    const ev = new CustomEvent('search:apply', { detail: f, cancelable: true });
    if (document.dispatchEvent(ev)) {
      const u = new URLSearchParams(); Object.entries(f).forEach(([k, v]) => { if (v && v !== 'all') u.set(k, v); });
      location.href = 'course-search.html' + (u.toString() ? '?' + u : '');
    }
  }
  document.addEventListener('focusin', (e) => { if (e.target.matches('.search-pill input') && !e.target.value.trim()) spOpen(); });
  document.addEventListener('input', (e) => {
    if (!e.target.matches('.search-pill input')) return;
    const input = e.target; clearTimeout(SP.timer);
    if (input.value.trim()) spClose();
    if (!onResultsPage()) {
      if (!input.value.trim()) { spOpen(); return; }
      SP.timer = setTimeout(() => { // sang trang Tìm khoá, giữ chữ đang gõ
        sessionStorage.setItem('lhSearchFocus', '1');
        const u = new URLSearchParams({ q: input.value });
        location.href = 'course-search.html?' + u;
      }, 150);
      return;
    }
    SP.timer = setTimeout(() => {
      const q = window.LHSearch ? LHSearch.clean(input.value) : input.value.trim();
      document.dispatchEvent(new CustomEvent('search:live', { detail: { q } }));
      if (!q) spOpen();
    }, 200);
  });
  /* Vừa chuyển sang trang Tìm khoá từ trang khác → đặt lại con trỏ cuối ô để gõ tiếp */
  document.addEventListener('DOMContentLoaded', () => {
    if (!onResultsPage() || !sessionStorage.getItem('lhSearchFocus')) return;
    sessionStorage.removeItem('lhSearchFocus');
    const i = document.querySelector('.search-pill input'); if (!i) return;
    i.focus(); const n = i.value.length; try { i.setSelectionRange(n, n); } catch (_) {}
  });
  document.addEventListener('submit', (e) => {
    if (!e.target.matches('.search-pill')) return; e.preventDefault(); clearTimeout(SP.timer);
    const sel = document.querySelector('#search-pop [data-sp-i].is-hl'); if (sel) { sel.click(); return; }
    spClose(); spApply({});
  });
  document.addEventListener('keydown', (e) => {
    if (!e.target.matches('.search-pill input')) return;
    const pop = document.getElementById('search-pop');
    if (e.key === 'Escape') { spClose(); return; }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    if (pop.hidden) spOpen();
    const opts = [...pop.querySelectorAll('[data-sp-i]')]; if (!opts.length) return;
    e.preventDefault();
    const n = opts.length + 1; // vị trí 0 = không chọn dòng nào (con trỏ ở ô gõ)
    SP.hl = ((SP.hl + 1 + (e.key === 'ArrowDown' ? 1 : -1) + n) % n) - 1;
    opts.forEach((o, i) => o.classList.toggle('is-hl', i === SP.hl));
    if (SP.hl >= 0) opts[SP.hl].scrollIntoView({ block: 'nearest' });
  });
  document.addEventListener('mousedown', (e) => { if (!e.target.closest('.search-wrap')) spClose(); });
  document.addEventListener('click', (e) => {
    if (e.target.matches('.search-pill input')) { if (!e.target.value.trim()) spOpen(); return; } // bấm lại sau Esc vẫn mở
    const pop = e.target.closest('#search-pop'); if (!pop) return;
    const input = document.querySelector('.search-pill input');
    const del = e.target.closest('[data-sp-del]');
    if (del) { e.stopPropagation(); localStorage.setItem(SP.KEY, JSON.stringify(recentGet().filter((x) => x !== del.dataset.spDel))); spRender(); input.focus(); return; }
    const rec = e.target.closest('[data-sp-q]');
    if (rec) { input.value = rec.dataset.spQ; input.closest('form').querySelector('.search-pill__x').hidden = false; spClose(); spApply({ q: rec.dataset.spQ }); return; }
    if (e.target.closest('[data-sp-all]')) { spClose(); spApply({}); return; }
    const item = e.target.closest('.sp-item'); if (item) { recentAdd(LHSearch.clean(input.value)); spClose(); }
  });
  window.LHSearchPanel = { open: spOpen, close: spClose, render: spRender };

  /* Dropdown lọc + menu Explore: mở / đóng / chọn / Esc / bấm ra ngoài */
  function closePops(except) {
    document.querySelectorAll('.fdd.is-open, .explore.is-open').forEach((el) => { if (el === except) return; el.classList.remove('is-open'); el.querySelector('[hidden], .fdd__menu, .explore__menu').hidden = true; el.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false'); });
  }
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('.fdd__opt');
    if (opt) { const box = opt.closest('.fdd'); closePops(); document.dispatchEvent(new CustomEvent('fdd:change', { detail: { key: box.dataset.fdd, value: opt.dataset.v } })); return; }
    const btn = e.target.closest('.fdd__btn, [data-explore]');
    if (btn) { const box = btn.closest('.fdd, .explore'); const open = !box.classList.contains('is-open'); closePops(box);
      box.classList.toggle('is-open', open); box.querySelector('.fdd__menu, .explore__menu').hidden = !open; btn.setAttribute('aria-expanded', open); return; }
    if (!e.target.closest('.fdd__menu, .explore__menu')) closePops();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePops(); });
  /* Ô tìm trên header: nút ✕ hiện khi có chữ */
  document.addEventListener('input', (e) => { const f = e.target.closest('.search-pill'); if (f) f.querySelector('.search-pill__x').hidden = !e.target.value; });
  document.addEventListener('click', (e) => { const x = e.target.closest('[data-qclear]'); if (!x) return; const i = x.closest('.search-pill').querySelector('input'); i.value = ''; x.hidden = true; i.focus(); i.dispatchEvent(new Event('input', { bubbles: true })); });

  /* Đóng modal + menu chung */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]') || e.target.classList.contains('modal-backdrop')) {
      const m = e.target.closest('.modal-backdrop'); if (m) m.remove();
    }
  });

  /* Accordion trang khoá + session trong drawer: bấm để mở / đóng */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.acc__head'); if (a) { a.parentElement.classList.toggle('is-open'); return; }
    const s = e.target.closest('[data-sec]');
    if (s) { const box = s.parentElement; box.classList.toggle('is-open'); s.querySelector('svg').outerHTML = box.classList.contains('is-open') ? ICON.chevronU : ICON.chevronD; }
  });

  /* ================= ADMIN — DNA Figma section Admin (32:1096) · docs/design-system/modules/admin-shell.md =================
   * Sidebar 300/102 · Toolbar 421:7216 · Page head eyebrow = paint Main item (--grad-main-*).
   * Gọi LH.AdminLayout({ active, collapsed, role }); CSS: assets/css/admin.css */
  Object.assign(ICON, {
    dash: P('<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>'),
    bookOpen: P('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
    usersRound: P('<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>'),
    chart: P('<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9M13 17V5M8 17v-3"/>'),
    ellipsisV: P('<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>'),
    lightbulb: P('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>'),
    timer: P('<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>'),
    trending: P('<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>'),
    turtle: P('<path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z"/><path d="M4.82 7.9 8 10M15.18 7.9 12 10M16.93 10H20a2 2 0 0 1 0 4H2"/>'),
    userX: P('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 8 5 5M22 8l-5 5"/>'),
    send: P('<path d="M14.5 21.7a.5.5 0 0 0 .9 0L22 3.5a.5.5 0 0 0-.6-.6L3.3 9.5a.5.5 0 0 0 0 .9l7.6 3.4a2 2 0 0 1 1 1z"/><path d="m21.9 2.1-11 10.9"/>'),
    shieldCheck: P('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>'),
    network: P('<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>'),
  });
  /* Role web GitLab LH1: admin | editor | employee — map docs LH2: Admin L&D / Course Creator / Learner */
  const ADM_USER = {
    admin: ['Lê Thị Mai', 'Admin'],
    editor: ['Phạm Thanh Long', 'Editor'],
    creator: ['Phạm Thanh Long', 'Editor'], /* alias cũ → editor */
    employee: ['Trần Minh Anh', 'Employee'],
  };
  const OUT = 'Not in LearningHub 2 scope';
  function admRole(r) {
    const v = String(r || App.role() || 'admin').toLowerCase();
    if (v.startsWith('ed') || v.startsWith('cr')) return 'editor';
    if (v.startsWith('em') || v.startsWith('le')) return 'employee';
    return 'admin';
  }
  /* Admin / Sidebar — chép đúng web thật (shadcn sidebar, đo 20/11/2026 trên /dashboard/settings/*):
   * Expanded 256 · Collapsed 72 (chỉ icon) · chuyển động 0.3s · nhớ trạng thái (web: cookie sidebar_state → prototype: localStorage lhSidebar).
   * Header: logo 40 + "Learning • Hub" 24/400 đen (ẩn khi thu gọn). Nhóm: nhãn 18/400 #959595 cao 32 (thu gọn: mờ 0, vẫn giữ chỗ).
   * Mục: cao 40, đệm 8, bo 10, icon lucide 20 nét 2, chữ 14/400 #0a0a0a. Hover và mục đang chọn: nền #EEF0FE, chữ + icon #4757FF; đang chọn chữ 500.
   * Thu gọn: mục 32×32 đệm 6 căn giữa; rê chuột hiện tooltip đen bên phải (12px, đệm 6/12, bo 8).
   * Chân: nút panel-left 28×28 nền trắng bo 8 — mở: sát phải; thu gọn: căn giữa. LH2 thêm mục Permissions và nhóm Reports theo cùng kiểu. */
  const SB_IC = {
    courses: '<path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/><path d="M7 21h10"/><rect width="20" height="14" x="2" y="3" rx="2"/>',
    categories: '<path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z"/><path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193"/><circle cx="10.5" cy="6.5" r=".5" fill="currentColor"/>',
    employees: '<path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/>',
    entities: '<path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 6h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M8 6h.01"/><path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><rect x="4" y="2" width="16" height="20" rx="2"/>',
    roles: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    sync: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    settings: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    reports: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    panel: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  };
  const sbSvg = (k, size = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SB_IC[k]}</svg>`;
  const sbCollapsed = () => localStorage.getItem('lhSidebar') === 'collapsed';
  function AdminSidebar({ active = 'courses', collapsed = false, role = 'admin' } = {}) {
    const r = admRole(role);
    const q = `?r=${r}`;
    const it = (key, label, href) => `<li><a class="sb-btn ${active === key ? 'is-active' : ''}" href="${href}" data-tip="${esc(label)}" ${active === key ? 'aria-current="page"' : ''}>${sbSvg(key)}<span>${esc(label)}</span></a></li>`;
    return `<aside class="adm-side sb" aria-label="Admin menu">
      <div class="sb__head"><a class="sb__logo" href="admin-courses.html${q}"><img src="${LOGO}" alt="logo" width="40" height="40"></a><span class="sb__brand">Learning <i></i> Hub</span></div>
      <div class="sb__content">
        <div class="sb__group"><div class="sb__label">Settings</div><ul class="sb__menu">
          ${it('courses', 'Course Management', 'admin-courses.html' + q)}
          ${it('categories', 'Category Management', 'admin-categories.html' + q)}
          ${r === 'admin' ? it('employees', 'Employee Management', 'admin-employees.html' + q) : ''}
          ${r === 'admin' ? it('entities', 'Entity Management', 'admin-entities.html' + q) : ''}
          ${r === 'admin' ? it('roles', 'Role Management', 'admin-roles.html' + q) : ''}
          ${r === 'admin' ? it('sync', 'Sync Data', 'admin-sync.html' + q) : ''}
          ${r === 'admin' ? it('settings', 'Permissions', 'admin-settings.html' + q) : ''}
        </ul></div>
        <div class="sb__group"><div class="sb__label">Reports</div><ul class="sb__menu">
          ${it('reports', 'Learning Report', 'admin-reports.html' + q)}
        </ul></div>
      </div>
      <div class="sb__foot"><button type="button" class="sb__trigger" data-sb-toggle aria-label="Toggle Sidebar" title="Toggle Sidebar">${sbSvg('panel', 24)}</button></div>
    </aside>`;
  }
  /* Tooltip khi thu gọn + nút thu gọn / mở (gắn 1 lần) */
  let sbTip = null;
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-sb-toggle]')) return;
    const shell = document.querySelector('.adm'); if (!shell) return;
    const c = !shell.classList.contains('adm--sb-collapsed');
    shell.classList.toggle('adm--sb-collapsed', c); localStorage.setItem('lhSidebar', c ? 'collapsed' : 'expanded');
    if (sbTip) sbTip.hidden = true;
  });
  document.addEventListener('mouseover', (e) => {
    const b = e.target.closest('.adm--sb-collapsed .sb-btn');
    if (!b) { if (sbTip) sbTip.hidden = true; return; }
    if (!sbTip) { sbTip = document.createElement('div'); sbTip.className = 'sb-tip'; sbTip.setAttribute('role', 'tooltip'); document.body.appendChild(sbTip); }
    const r = b.getBoundingClientRect();
    sbTip.textContent = b.dataset.tip; sbTip.hidden = false;
    sbTip.style.left = (r.right + 9) + 'px'; sbTip.style.top = (r.top + r.height / 2) + 'px';
  });
  function AdminToolbar({ role = 'admin', active = '' } = {}) {
    const r = admRole(role);
    const [name] = ADM_USER[r] || ADM_USER.admin;
    return `<div class="adm-toolbar">
      <form class="adm-search" action="admin-courses.html" role="search"><input type="hidden" name="r" value="${r}"><input name="q" placeholder="Search courses" autocomplete="off"><button type="submit" aria-label="Search">${ICON.search}</button></form>
      <div class="adm-actions">
        <a class="adm-learn" href="home.html">Let's start learning</a>
        <button type="button" class="adm-round" aria-label="Notifications" data-out="Notifications">${ICON.bell2}</button>
        <button type="button" class="adm-round adm-round--opt" aria-label="Apps" data-out="Apps">${ICON.grid}</button>
        <div class="adm-user"><button type="button" data-adm-user aria-expanded="false" title="${esc(name)}"><span class="adm-user__av">${initials(name)}</span><span class="adm-user__name"><b>${esc(name)}</b></span>${ICON.chevronD}</button>
          <div class="adm-user__menu" hidden><span>Switch role (demo)</span>
            <button type="button" data-adm-role="admin" class="${r === 'admin' ? 'is-on' : ''}">${ICON.shieldCheck}Admin</button>
            <button type="button" data-adm-role="editor" class="${r === 'editor' ? 'is-on' : ''}">${ICON.edit}Editor</button>
            <button type="button" data-adm-role="employee" class="${r === 'employee' ? 'is-on' : ''}">${ICON.user}Employee</button>
            <button type="button" data-out="Logout">${ICON.logout}Logout</button></div></div>
      </div></div>`;
  }
  function AdminLayout({ active = 'courses', collapsed = false, role } = {}) {
    const r = admRole(role);
    document.body.classList.add('adm-body');
    let shell = document.querySelector('.adm');
    if (!shell) {
      const main = document.querySelector('main');
      main.classList.remove('container', 'screen');
      shell = document.createElement('div'); shell.className = 'adm';
      shell.innerHTML = '<div class="adm-side-slot"></div><div class="adm-main"><div class="adm-tb-slot"></div></div>';
      main.parentNode.insertBefore(shell, main);
      shell.querySelector('.adm-main').appendChild(main);
      const h = document.getElementById('header'); if (h) h.hidden = true;
    }
    /* 20/11: bỏ tự thu gọn theo khổ màn — web thật chỉ thu gọn khi bấm nút */
    shell.classList.remove('adm--auto-collapse');
    shell.classList.toggle('adm--sb-collapsed', sbCollapsed()); // như web: chỉ người dùng thu gọn / mở (nút cuối sidebar), nhớ trạng thái; trang không ép
    shell.querySelector('.adm-side-slot').outerHTML = `<div class="adm-side-slot" style="display:contents">${AdminSidebar({ active, collapsed, role: r })}</div>`;
    shell.querySelector('.adm-tb-slot').innerHTML = AdminToolbar({ role: r, active });
    return '';
  }
  /** Stage tag (73:1692) — trạng thái khoá. Status: draft | pending | rejected | published · Revision: pending | rejected | draft */
  function StageTag(status, revision) {
    const S = { draft: ['Draft', 'draft'], pending: ['Pending Approval', 'pending'], rejected: ['Changes Requested', 'rejected'], published: ['Published', 'published'] }[status] || [status, 'neutral'];
    const R = { pending: ['Edit Pending Approval', 'pending'], rejected: ['Edit Changes Requested', 'rejected'], draft: ['Edit Draft', 'draft'] }[revision];
    return `<span class="stage-wrap"><span class="stage-tag stage-tag--${S[1]}">${S[0]}</span>${R ? `<span class="stage-tag stage-tag--${R[1]}">${R[0]}</span>` : ''}</span>`;
  }
  /** Tag tuỳ ý cùng kiểu Stage tag — tone: pending | published | draft | rejected | info | neutral */
  function Tag(label, tone = 'neutral') { return `<span class="stage-tag stage-tag--${tone}">${esc(label)}</span>`; }
  /** Admin / Table — cols: [[label, cls]] ; body: html các <tr> */
  function AdminTable(cols, body, attrs = '') {
    return `<div class="adm-scroll"><table class="adm-table" ${attrs}><thead><tr>${cols.map((c) => { const [l, cls] = Array.isArray(c) ? c : [c, '']; return `<th class="${cls || ''}">${l}</th>`; }).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
  }
  /** Hover list (menu 3 chấm) — items: [{ label, icon, href, attrs, danger }] */
  function RowMenu(items) {
    if (!items.length) return '';
    return `<span class="row-menu"><button type="button" data-rowmenu aria-label="Actions" aria-expanded="false">${ICON.ellipsisV}</button><span class="row-menu__list" hidden>${items.map((i) => i.href
      ? `<a href="${i.href}" class="${i.danger ? 'is-danger' : ''}" ${i.attrs || ''}>${ICON[i.icon] || ''}${esc(i.label)}</a>`
      : `<button type="button" class="${i.danger ? 'is-danger' : ''}" ${i.attrs || ''}>${ICON[i.icon] || ''}${esc(i.label)}</button>`).join('')}</span></span>`;
  }
  /** Đầu trang admin: eyebrow (dòng nhỏ gradient) + tiêu đề + mô tả + vùng nút bên phải */
  function AdminHead({ eyebrow = '', title, desc = '', right = '', back = '', xl = false }) {
    return `<div class="adm-head ${xl ? 'adm-head--xl' : ''}"><div class="adm-head__text">${back ? `<a class="adm-back" href="${back}" ${back === '#' ? '' : 'data-back'}>${ICON.undo}Back</a>` : ''}${eyebrow ? `<span class="adm-head__eyebrow">${esc(eyebrow)}</span>` : ''}<h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</div>${right}</div>`;
  }

  /* Admin / Filter chip — ghost trigger + popover trắng (Airtable-style, màu LH)
   * items: [{ key, label, mode: 'single'|'multi'|'date', display, hasValue,
   *   options?: [[value, text]], value?: string|string[],
   *   from?: '', to?: '', err?: '' }]
   * Sự kiện: ff:apply { key, value | from,to } · ff:clear { key } · ff:clear-all
   */
  function AdminFilter(items = []) {
    const any = items.some((it) => it.hasValue);
    const chip = (it) => {
      const openId = `ff-pop-${esc(it.key)}`;
      let body = '';
      if (it.mode === 'date') {
        body = `<div class="ff__dates">
          <label>Từ<span class="ff__date-field"><input type="date" data-ff-from value="${esc(it.from || '')}"></span></label>
          <label>Đến<span class="ff__date-field"><input type="date" data-ff-to value="${esc(it.to || '')}"></span></label>
        </div>${it.err ? `<p class="ff__err">${esc(it.err)}</p>` : ''}`;
      } else {
        const opts = (it.options || []).map(([v, t]) => {
          const sel = it.mode === 'multi' ? (it.value || []).includes(v) : it.value === v;
          if (it.mode === 'multi') {
            return `<label class="ff__option ${sel ? 'is-selected' : ''}" data-ff-opt data-v="${esc(v)}"><input type="checkbox" ${sel ? 'checked' : ''}><span>${esc(t)}</span></label>`;
          }
          return `<button type="button" class="ff__option ${sel ? 'is-selected' : ''}" role="option" data-ff-opt data-v="${esc(v)}" aria-selected="${sel}"><span>${esc(t)}</span>${sel ? ICON.check.replace('class="ic"', 'class="ic ff__check"') : ''}</button>`;
        }).join('');
        body = `<div class="ff__search">${ICON.search}<input type="search" data-ff-search placeholder="${esc(it.searchPh || 'Search…')}" autocomplete="off"></div>
          <div class="ff__list" role="listbox">${opts || '<div class="ff__empty">No options.</div>'}</div>`;
      }
      return `<div class="ff ${it.hasValue ? 'has-value' : ''}" data-ff="${esc(it.key)}" data-ff-mode="${esc(it.mode)}">
        <button type="button" class="ff__trigger" aria-haspopup="dialog" aria-expanded="false" aria-controls="${openId}">
          <span class="ff__label"><em>${esc(it.label)}:</em> ${esc(it.display)}</span>
          <span class="ff__caret" aria-hidden="true"></span>
        </button>
        <button type="button" class="ff__clear" data-ff-clear aria-label="Clear ${esc(it.label)}">${ICON.x}</button>
        <div class="ff__popover ${it.mode === 'date' ? 'ff__popover--date' : ''}" id="${openId}" role="dialog" hidden>
          <div class="ff__card">${body}
            <div class="ff__footer"><button type="button" data-ff-cancel>Cancel</button><button type="button" class="ff__apply" data-ff-apply>Apply</button></div>
          </div>
        </div>
      </div>`;
    };
    return `<div class="ff-bar">${items.map(chip).join('')}${any ? `<button type="button" class="ff-clear-all" data-ff-clear-all>Clear filters</button>` : ''}</div>`;
  }
  function closeAdminFilters(except) {
    document.querySelectorAll('.ff.is-open').forEach((el) => {
      if (el === except) return;
      el.classList.remove('is-open');
      const pop = el.querySelector('.ff__popover'); if (pop) pop.hidden = true;
      el.querySelector('.ff__trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
  function bindAdminFilters() {
    if (bindAdminFilters._on) return;
    bindAdminFilters._on = true;
    document.addEventListener('click', (e) => {
      const clearAll = e.target.closest('[data-ff-clear-all]');
      if (clearAll) { closeAdminFilters(); document.dispatchEvent(new CustomEvent('ff:clear-all')); return; }
      const clearOne = e.target.closest('[data-ff-clear]');
      if (clearOne) { e.stopPropagation(); const box = clearOne.closest('.ff'); closeAdminFilters(); document.dispatchEvent(new CustomEvent('ff:clear', { detail: { key: box.dataset.ff } })); return; }
      const cancel = e.target.closest('[data-ff-cancel]');
      if (cancel) { closeAdminFilters(); return; }
      const apply = e.target.closest('[data-ff-apply]');
      if (apply) {
        const box = apply.closest('.ff'); const mode = box.dataset.ffMode; const key = box.dataset.ff;
        let detail = { key };
        if (mode === 'date') {
          detail.from = box.querySelector('[data-ff-from]')?.value || '';
          detail.to = box.querySelector('[data-ff-to]')?.value || '';
        } else if (mode === 'multi') {
          detail.value = [...box.querySelectorAll('[data-ff-opt] input:checked')].map((i) => i.closest('[data-ff-opt]').dataset.v);
        } else {
          const sel = box.querySelector('.ff__option.is-selected');
          detail.value = sel ? sel.dataset.v : '';
        }
        closeAdminFilters();
        document.dispatchEvent(new CustomEvent('ff:apply', { detail }));
        return;
      }
      const opt = e.target.closest('[data-ff-opt]');
      if (opt) {
        const box = opt.closest('.ff');
        if (box.dataset.ffMode === 'multi') {
          const cb = opt.querySelector('input[type="checkbox"]');
          if (e.target !== cb) cb.checked = !cb.checked;
          opt.classList.toggle('is-selected', cb.checked);
          return;
        }
        box.querySelectorAll('.ff__option').forEach((o) => { o.classList.remove('is-selected'); o.setAttribute('aria-selected', 'false'); const ck = o.querySelector('.ff__check'); if (ck) ck.remove(); });
        opt.classList.add('is-selected'); opt.setAttribute('aria-selected', 'true');
        if (!opt.querySelector('.ff__check')) opt.insertAdjacentHTML('beforeend', ICON.check.replace('class="ic"', 'class="ic ff__check"'));
        return;
      }
      const trig = e.target.closest('.ff__trigger');
      if (trig) {
        const box = trig.closest('.ff'); const open = !box.classList.contains('is-open');
        closeAdminFilters(box);
        box.classList.toggle('is-open', open);
        const pop = box.querySelector('.ff__popover'); if (pop) pop.hidden = !open;
        trig.setAttribute('aria-expanded', open);
        if (open) box.querySelector('[data-ff-search]')?.focus();
        return;
      }
      if (!e.target.closest('.ff')) closeAdminFilters();
    });
    document.addEventListener('input', (e) => {
      const s = e.target.closest('[data-ff-search]'); if (!s) return;
      const q = s.value.trim().toLowerCase();
      s.closest('.ff').querySelectorAll('[data-ff-opt]').forEach((o) => {
        const t = (o.textContent || '').toLowerCase();
        o.hidden = q && !t.includes(q);
      });
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAdminFilters(); });
  }
  bindAdminFilters();
  /** Admin / Empty state (1265:7417) — icon tròn + tiêu đề + mô tả + CTA (html nút). Dùng cho màn chưa có dữ liệu. */
  function AdminEmpty({ icon = 'file', title = 'No data yet', desc = '', cta = '', compact = false } = {}) {
    return `<div class="adm-empty ${compact ? 'adm-empty--sm' : ''}"><span class="adm-empty__ic">${ICON[icon] || ICON.file}</span><b>${esc(title)}</b>${desc ? `<p>${desc}</p>` : ''}${cta ? `<div class="adm-empty__cta">${cta}</div>` : ''}</div>`;
  }
  /** Admin / Confirm popup (1273:8970 xoá · 1273:8997 xác nhận) — mở popup, bấm đồng ý gọi onOk(). */
  /* ---------- Richbox (LH1 TipTap toolbar) ----------
   * Undo/Redo | ¶▼ List Ordered | B I U | Palette Highlighter | Align×4 | Fullscreen */
  const RTE_TEXT_COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080', '#4757FF'];
  const RTE_HL_COLORS = ['transparent', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FF0000', '#0000FF', '#4757FF'];
  const RTE_STYLES = [['p', 'Normal'], ['h1', 'Heading 1'], ['h2', 'Heading 2'], ['h3', 'Heading 3'], ['h4', 'Heading 4']];
  function RichboxBar() {
    return `<div class="rte__bar" role="toolbar" aria-label="Formatting">
      <button type="button" data-rte-cmd="undo" title="Undo">${ICON.undo}</button>
      <button type="button" data-rte-cmd="redo" title="Redo">${ICON.redo}</button>
      <span class="rte__sep" aria-hidden="true"></span>
      <span class="rte__dd">
        <button type="button" data-rte-dd="style" title="Text style" aria-haspopup="listbox">${ICON.pilcrow}${ICON.chevronD}</button>
        <span class="rte__menu" hidden role="listbox">${RTE_STYLES.map(([v, t]) => `<button type="button" role="option" data-rte-style="${v}">${esc(t)}</button>`).join('')}</span>
      </span>
      <button type="button" data-rte-cmd="insertUnorderedList" title="Bulleted list">${ICON.list}</button>
      <button type="button" data-rte-cmd="insertOrderedList" title="Numbered list">${ICON.listOrdered}</button>
      <span class="rte__sep" aria-hidden="true"></span>
      <button type="button" data-rte-cmd="bold" title="Bold">${ICON.bold}</button>
      <button type="button" data-rte-cmd="italic" title="Italic">${ICON.italic}</button>
      <button type="button" data-rte-cmd="underline" title="Underline">${ICON.underline}</button>
      <span class="rte__sep" aria-hidden="true"></span>
      <span class="rte__dd">
        <button type="button" data-rte-dd="color" title="Text color" aria-haspopup="dialog">${ICON.palette}</button>
        <span class="rte__swatches" hidden role="dialog" aria-label="Text color">${RTE_TEXT_COLORS.map((c) => `<button type="button" data-rte-color="${c}" style="background:${c}" title="${c}"></button>`).join('')}</span>
      </span>
      <span class="rte__dd">
        <button type="button" data-rte-dd="hl" title="Highlight" aria-haspopup="dialog">${ICON.highlighter}</button>
        <span class="rte__swatches" hidden role="dialog" aria-label="Highlight">${RTE_HL_COLORS.map((c) => `<button type="button" data-rte-hl="${c}" class="${c === 'transparent' ? 'is-clear' : ''}" style="${c === 'transparent' ? '' : `background:${c}`}" title="${c === 'transparent' ? 'Clear' : c}"></button>`).join('')}</span>
      </span>
      <span class="rte__sep" aria-hidden="true"></span>
      <button type="button" data-rte-cmd="justifyLeft" title="Align left">${ICON.alignLeft}</button>
      <button type="button" data-rte-cmd="justifyCenter" title="Align center">${ICON.alignCenter}</button>
      <button type="button" data-rte-cmd="justifyRight" title="Align right">${ICON.alignRight}</button>
      <button type="button" data-rte-cmd="justifyFull" title="Justify">${ICON.alignJustify}</button>
      <span class="rte__sep" aria-hidden="true"></span>
      <button type="button" data-rte-fs title="Fullscreen">${ICON.maximize}</button>
    </div>`;
  }
  function Richbox({ id = '', ph = '', html = '', bodyAttrs = '' } = {}) {
    return `<div class="rte"${id ? ` id="${esc(id)}"` : ''}>${RichboxBar()}<div class="rte__body" contenteditable="true" role="textbox" aria-multiline="true" data-ph="${esc(ph)}" ${bodyAttrs}>${html}</div></div>`;
  }
  let rteWired = false;
  function wireRichbox() {
    if (rteWired) return; rteWired = true;
    const closeMenus = (except) => {
      document.querySelectorAll('.rte__menu, .rte__swatches').forEach((m) => { if (m !== except) m.hidden = true; });
    };
    document.addEventListener('mousedown', (e) => {
      const btn = e.target.closest('[data-rte-cmd], [data-rte-dd], [data-rte-style], [data-rte-color], [data-rte-hl], [data-rte-fs]');
      if (!btn) { closeMenus(); return; }
      e.preventDefault();
      const rte = btn.closest('.rte');
      const body = rte?.querySelector('.rte__body');
      if (btn.hasAttribute('data-rte-fs')) {
        if (!rte) return;
        const on = rte.classList.toggle('is-fs');
        btn.innerHTML = on ? ICON.minimize : ICON.maximize;
        btn.title = on ? 'Exit fullscreen' : 'Fullscreen';
        document.body.classList.toggle('rte-fs-lock', on);
        return;
      }
      if (btn.dataset.rteDd) {
        const panel = btn.parentElement.querySelector('.rte__menu, .rte__swatches');
        const open = panel && panel.hidden;
        closeMenus();
        if (panel) panel.hidden = !open;
        return;
      }
      if (btn.dataset.rteStyle) {
        document.execCommand('formatBlock', false, btn.dataset.rteStyle);
        closeMenus(); return;
      }
      if (btn.dataset.rteColor) {
        document.execCommand('foreColor', false, btn.dataset.rteColor);
        closeMenus(); return;
      }
      if (btn.dataset.rteHl !== undefined) {
        if (btn.dataset.rteHl === 'transparent') document.execCommand('removeFormat');
        else document.execCommand('hiliteColor', false, btn.dataset.rteHl);
        closeMenus(); return;
      }
      if (btn.dataset.rteCmd) {
        document.execCommand(btn.dataset.rteCmd);
        body?.focus();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const fs = document.querySelector('.rte.is-fs');
        if (fs) {
          fs.classList.remove('is-fs');
          document.body.classList.remove('rte-fs-lock');
          const b = fs.querySelector('[data-rte-fs]'); if (b) { b.innerHTML = ICON.maximize; b.title = 'Fullscreen'; }
        }
        closeMenus();
      }
    });
  }

  function AdminConfirm({ title, text = '', ok = 'Confirm', cancel = 'Cancel', danger = false, onOk } = {}) {
    const el = document.createElement('div'); el.className = 'modal-backdrop';
    el.innerHTML = `<div class="modal adm-popup adm-confirm" role="alertdialog" aria-modal="true">
      <span class="adm-confirm__ic ${danger ? 'is-danger' : ''}">${danger ? ICON.trash : ICON.alert}</span>
      <h3>${esc(title)}</h3>${text ? `<p>${text}</p>` : ''}
      <div class="adm-confirm__foot"><button class="btn-cta btn-cta--line" data-close>${esc(cancel)}</button><button class="btn-cta ${danger ? 'btn-cta--danger' : ''}" data-ok>${esc(ok)}</button></div></div>`;
    document.body.appendChild(el);
    el.querySelector('[data-ok]').addEventListener('click', () => { el.remove(); if (onOk) onOk(); });
    el.querySelector('[data-ok]').focus();
    return el;
  }
  /** Content / Card có xu hướng (71:1346) — trend: số % (dương xanh, âm đỏ), tone: '' | success | warning | danger | pink */
  function TrendKpi(label, value, trend, icon, tone = '', note = 'vs last month') {
    const up = trend >= 0;
    /* 13/11: số là trọng tâm — số lớn trên cùng, nhãn dưới (CSS order, DOM giữ nhãn trước cho trình đọc màn hình), icon nhỏ góc phải */
    return `<div class="kpi-card kpi-card--trend ${tone ? 'kpi-card--' + tone : ''}"><span class="kpi-card__text"><span class="kpi-card__label" title="${esc(label)}">${esc(label)}</span><span class="kpi-card__value">${value}</span>
      ${trend == null ? '' : `<span class="kpi-card__trend ${up ? 'is-up' : 'is-down'}"><i>${up ? '↑' : '↓'} ${Math.abs(trend)}%</i>${esc(note)}</span>`}</span><span class="kpi-card__ic">${ICON[icon] || ''}</span></div>`;
  }
  document.addEventListener('click', (e) => {
    const out = e.target.closest('[data-out]'); if (out) { e.preventDefault(); toast(out.dataset.out + ': ' + OUT); return; }
    const tg = e.target.closest('[data-adm-toggle]'); if (tg) { tg.classList.toggle('is-open'); const s = tg.nextElementSibling; if (s) s.hidden = !s.hidden; return; }
    const ub = e.target.closest('[data-adm-user]');
    const um = document.querySelector('.adm-user__menu');
    if (ub) { um.hidden = !um.hidden; ub.setAttribute('aria-expanded', !um.hidden); return; }
    const rb = e.target.closest('[data-adm-role]');
    if (rb) { sessionStorage.setItem('lhRole', rb.dataset.admRole); location.href = 'admin-courses.html?r=' + rb.dataset.admRole; return; }
    if (um && !e.target.closest('.adm-user')) um.hidden = true;
    const mb = e.target.closest('[data-rowmenu]');
    document.querySelectorAll('.row-menu__list').forEach((l) => { if (!mb || l !== mb.nextElementSibling) l.hidden = true; });
    if (mb) { const l = mb.nextElementSibling; l.hidden = !l.hidden; mb.setAttribute('aria-expanded', !l.hidden); }
  });

  /* Admin droplist — thay native <select> (OS xám/xanh hệ thống) bằng menu trắng + active primary như learning .fdd */
  function closeAdmDd(except) {
    document.querySelectorAll('.adm-dd.is-open').forEach((el) => {
      if (el === except) return;
      el.classList.remove('is-open');
      const m = el.querySelector('.adm-dd__menu');
      if (m) m.hidden = true;
      el.querySelector('.adm-dd__btn')?.setAttribute('aria-expanded', 'false');
    });
  }
  function paintAdmDd(wrap) {
    const sel = wrap._admSel; if (!sel) return;
    const btn = wrap.querySelector('.adm-dd__btn');
    const menu = wrap.querySelector('.adm-dd__menu');
    if (!btn || !menu) return;
    const opt = sel.selectedOptions[0];
    const label = (opt && opt.textContent) || (sel.options[0] && sel.options[0].textContent) || '';
    const empty = !sel.value;
    btn.innerHTML = `<span class="${empty ? 'is-ph' : ''}">${esc(label)}</span>${ICON.chevronD}`;
    btn.disabled = !!sel.disabled;
    wrap.classList.toggle('is-disabled', !!sel.disabled);
    wrap.classList.toggle('is-error', sel.classList.contains('is-error') || sel.classList.contains('is-req-err'));
    menu.innerHTML = [...sel.options].map((o) => {
      const on = o.selected || (String(o.value) === String(sel.value));
      return `<button type="button" class="adm-dd__opt ${on ? 'is-sel' : ''}" data-v="${esc(o.value)}" role="option" aria-selected="${on}"><span>${esc(o.textContent)}</span>${on ? ICON.check : ''}</button>`;
    }).join('');
  }
  function enhanceSelect(sel) {
    if (!sel || sel.tagName !== 'SELECT' || !sel.isConnected || !sel.parentNode) return; // ô đã bị gỡ khi trang vẽ lại liên tiếp
    const host = sel.closest('.adm-dd');
    if (host) { host._admSel = sel; paintAdmDd(host); return; }
    const wrap = document.createElement('div');
    wrap.className = 'adm-dd';
    wrap._admSel = sel;
    sel.classList.add('adm-dd__native');
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'adm-dd__btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    const menu = document.createElement('div');
    menu.className = 'adm-dd__menu';
    menu.hidden = true;
    menu.setAttribute('role', 'listbox');
    wrap.appendChild(btn);
    wrap.appendChild(menu);
    paintAdmDd(wrap);
    const mo = new MutationObserver(() => paintAdmDd(wrap));
    mo.observe(sel, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'class'] });
    sel.addEventListener('change', () => paintAdmDd(wrap));
  }
  function enhanceSelects(root = document) {
    root.querySelectorAll('select.adm-input, select.rpt-sel, .filter-btn select').forEach(enhanceSelect);
  }
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('.adm-dd__opt');
    if (opt) {
      const wrap = opt.closest('.adm-dd');
      const sel = wrap && wrap._admSel;
      const v = opt.dataset.v;
      if (sel && String(sel.value) !== String(v)) {
        sel.value = v;
        sel.dispatchEvent(new Event('input', { bubbles: true }));
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      paintAdmDd(wrap);
      closeAdmDd();
      return;
    }
    const btn = e.target.closest('.adm-dd__btn');
    if (btn) {
      const wrap = btn.closest('.adm-dd');
      if (!wrap || wrap.classList.contains('is-disabled')) return;
      const open = !wrap.classList.contains('is-open');
      closeAdmDd(wrap);
      wrap.classList.toggle('is-open', open);
      const menu = wrap.querySelector('.adm-dd__menu');
      if (menu) menu.hidden = !open;
      btn.setAttribute('aria-expanded', open);
      e.preventDefault();
      return;
    }
    if (!e.target.closest('.adm-dd')) closeAdmDd();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAdmDd(); });
  const bootSelects = () => enhanceSelects();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootSelects);
  else bootSelects();
  new MutationObserver((muts) => {
    muts.forEach((m) => {
      m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if (n.matches?.('select.adm-input, select.rpt-sel')) enhanceSelect(n);
        else if (n.querySelector) n.querySelectorAll('select.adm-input, select.rpt-sel, .filter-btn select').forEach(enhanceSelect);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  /* ===== Quy chuẩn Back (DS 20/11, docs/design-system/learninghub-ds-plan.md §3.4) =====
   * Mọi nút Back (BackLink, AdminHead back) có data-back:
   *  1. Trang đang có thay đổi chưa lưu (trang khai báo window.LHGuard = () => true) → hỏi "Discard unsaved changes?" (Keep editing · Discard).
   *  2. Về đúng màn trước trong luồng của người dùng (giữ bộ lọc, tab, vị trí cuộn) = lịch sử trình duyệt;
   *     mở thẳng link (không có màn trước trong hệ thống) → về màn cha cố định ở href.
   * href="#": trang tự xử lý bước lùi trong cùng màn (vd form → danh sách), không đi qua đây. */
  function goBack(fallback) {
    let same = false; try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (err) { /* */ }
    if (same && history.length > 1) history.back(); else location.href = fallback;
  }
  function discardThen(fn) {
    if (!(typeof window.LHGuard === 'function' && window.LHGuard())) { fn(); return; }
    const body = document.body.classList.contains('adm-body');
    if (body) { AdminConfirm({ title: 'Discard unsaved changes?', text: 'Your changes will not be saved.', ok: 'Discard', cancel: 'Keep editing', danger: true, onOk: fn }); return; }
    document.body.insertAdjacentHTML('beforeend', Modal({ id: 'm-discard', size: 'sm', icon: 'alert', iconTone: 'warning', title: 'Discard unsaved changes?', body: '<p class="t-sm">Your changes will not be saved.</p>',
      foot: '<button class="wbtn wbtn--outline" data-close>Keep editing</button><button class="wbtn" data-discard-ok>Discard</button>' }));
    const m = document.getElementById('m-discard');
    m.addEventListener('click', (e) => { if (e.target.closest('[data-close]') || e.target === m) m.remove(); if (e.target.closest('[data-discard-ok]')) { m.remove(); fn(); } });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('a[data-back]'); if (!b || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    e.preventDefault(); discardThen(() => { window.LHGuard = null; goBack(b.getAttribute('href')); });
  });
  window.addEventListener('beforeunload', (e) => { if (typeof window.LHGuard === 'function' && window.LHGuard()) { e.preventDefault(); e.returnValue = ''; } });

  window.LH = { App, goBack, discardThen, url, ICON, esc, reqGuard, Button, Badge, Alert, Progress, Avatar, AppHeader, Modal, toast, CourseCard, EmptySlotCard, CourseCta, AccessNotice, ModeCard, QuestionCard, ScoreRing, SlotMeter, EnrollSlotPanel, DemoBar,
    RichboxBar, Richbox, wireRichbox,
    admRole, ADM_USER, AdminLayout, AdminSidebar, AdminToolbar, AdminHead, AdminFilter, AdminTable, StageTag, Tag, RowMenu, AdminEmpty, AdminConfirm, TrendKpi,
    fitCertScale, fitCertText, ProgressBreakdown, CompletionRing, CourseStatus, ApprovalBanner, norm, highlight, enhanceSelect, enhanceSelects,
    CategoryNav, AppFooter, BackLink, SectionHead, FilterDropdown, SearchPanel, SearchResultItem, WebProgress, LessonsAccordion, CourseContent, LearnShell, ModeSelect, WebQuestion, DashMeter, Gauge,
    QuizTopBar, ExamTimer, QuestionNav, SubmitConfirm, ResultSummary, ReviewFilter, PracticeSummary, CertificateSheet, AnswerNote, PracticeEntry };
})();
