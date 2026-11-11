/* LearningHub component library (vanilla).
 * Mỗi hàm = 1 component Figma cùng tên. Trạng thái = tham số (variant), chữ = tham số (text property).
 * Dùng: <script src="../assets/js/components.js"></script> → window.LH.* */
(function () {
  const P = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
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
    trophy: P('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'),
    circle: P('<circle cx="12" cy="12" r="10"/>'),
    circleCheck: P('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
    chevronU: P('<path d="m18 15-6-6-6 6"/>'),
    tvPlay: P('<path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/><path d="M7 21h10"/><rect width="20" height="14" x="2" y="3" rx="2"/>'),
    fileQ: P('<path d="M12 17h.01"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/>'),
    bell2: P('<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'),
    /* Icon 2 màu của web (xanh #374BFA + lime #C1F129) */
    grid: '<svg viewBox="0 0 20 20" fill="none"><path d="M3.33 6.67h3.34V3.33H3.33v3.34Zm5 10h3.34v-3.34H8.33v3.34Zm-5 0h3.34v-3.34H3.33v3.34Zm0-5h3.34V8.33H3.33v3.34Zm5 0h3.34V8.33H8.33v3.34Zm5-8.34v3.34h3.34V3.33h-3.34Zm-5 3.34h3.34V3.33H8.33v3.34Zm5 5h3.34V8.33h-3.34v3.34Zm0 5h3.34v-3.34h-3.34v3.34Z" fill="#334155"/></svg>',
    lessons2: '<svg viewBox="0 0 24 24" fill="none"><path d="M3.67 2.83c-.23 0-.44.09-.6.25a.86.86 0 0 0-.25.61v12.88c0 .47.38.86.86.86 2 0 5.35.42 7.66 2.84V6.79a1 1 0 0 0-.12-.44C9.32 3.3 5.67 2.84 3.67 2.83Z" fill="#374BFA"/><path d="M21.19 16.57V3.69a.86.86 0 0 0-.86-.86c-2 0-5.65.47-7.55 3.52a1 1 0 0 0-.11.44v13.48c2.31-2.42 5.66-2.84 7.66-2.84.47 0 .86-.39.86-.86Z" fill="#374BFA"/><path d="M23.14 5.8h-.62v10.77a2.2 2.2 0 0 1-2.19 2.19c-1.7 0-4.5.34-6.47 2.21 3.42-.84 7.03-.29 9.09.18a.86.86 0 0 0 1.05-.84V6.66a.86.86 0 0 0-.86-.86Z" fill="#C1F129"/><path d="M1.48 16.57V5.8H.86A.86.86 0 0 0 0 6.66v13.65c0 .26.12.5.32.67.21.16.47.22.73.17 2.06-.47 5.67-1.01 9.09-.18-1.98-1.87-4.77-2.2-6.47-2.21a2.2 2.2 0 0 1-2.19-2.19Z" fill="#C1F129"/></svg>',
    clock2: '<svg viewBox="0 0 24 24" fill="none"><path d="M11.75 5.32a6.93 6.93 0 1 0 0 13.86 6.93 6.93 0 0 0 0-13.86Zm4.41 7.56h-5.04V7.84h1.26v3.78h3.78v1.26Z" fill="#374BFA"/><path d="M11.75 1.5C5.85 1.5 1 6.35 1 12.25S5.85 23 11.75 23 22.5 18.15 22.5 12.25 17.65 1.5 11.75 1.5Zm0 18.94a8.19 8.19 0 1 1 0-16.38 8.19 8.19 0 0 1 0 16.38Z" fill="#C1F129"/></svg>',
    myCourses: '<svg viewBox="0 0 24 24" fill="none"><path d="M24 7.03v15.56h-7.15c-1.97 0-3 1.33-3.1 1.41h-3.5c-.1-.07-1.12-1.41-3.1-1.41H0V5.63h1.41v15.56h5.75c2.2 0 3.42 1.24 3.73 1.4h2.23c.3-.16 1.53-1.4 3.73-1.4h5.75V7.03H24Z" fill="#C1F129"/><path d="M9.89 20.34a6.8 6.8 0 0 0-2.73-.56H2.81V2.81h1.41v14.16h2.11c1.92 0 3.48 1.5 3.56 3.37Z" fill="#C1F129"/><path d="M16.84 4.22c-1.49 0-2.92.39-4.19 1.13.03.32.05.65.05.98v14.83l.37-.23c2.17-1.45 3.67-1.15 8.16-1.15V4.22h-4.39Z" fill="#374BFA"/><path d="M11.3 20.48a4.95 4.95 0 0 0-4.97-4.92h-.7V0c3.51 0 5.67 2.84 5.67 6.33v14.15Z" fill="#374BFA"/></svg>',
    allCourses: '<svg viewBox="0 0 24 24" fill="none"><path d="M6.4 5.2V3.6a.4.4 0 0 0-.4-.4H.4a.4.4 0 0 0-.4.4v1.6h6.4ZM0 6v13.2h6.4V6H0Zm4.8 5.2H1.6a.4.4 0 0 1-.4-.4V7.6c0-.22.18-.4.4-.4h3.2c.22 0 .4.18.4.4v3.2a.4.4 0 0 1-.4.4ZM0 21.6v2c0 .22.18.4.4.4H6a.4.4 0 0 0 .4-.4v-2H0Zm0-1.6h6.4v.8H0V20Zm7.2 0h5.2v.8H7.2V20Zm5.2-18.4V.4A.4.4 0 0 0 12 0H7.6a.4.4 0 0 0-.4.4v1.2h5.2ZM7.2 4.4h5.2v14.8H7.2V4.4Zm0 17.2v2c0 .22.18.4.4.4H12a.4.4 0 0 0 .4-.4v-2H7.2Zm0-19.2h5.2v1.2H7.2V2.4Z" fill="#374BFA"/><path d="m13.19 8.28.21.83 6.78-1.81-.21-.82-6.78 1.8Zm3.34 12.82 6.78-1.81-.43-1.64-6.78 1.8.43 1.65Zm6.15-4.23-2.3-8.8-6.77 1.81 2.3 8.8 6.77-1.81Zm-9.69-9.36 6.77-1.8-.57-2.2a.4.4 0 0 0-.49-.29l-6 1.6a.4.4 0 0 0-.28.49l.57 2.2Zm10.52 12.56-6.77 1.8.48 1.83a.4.4 0 0 0 .49.29l6-1.6a.4.4 0 0 0 .28-.49l-.48-1.83Z" fill="#C1F129"/></svg>',
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
        <div class="search-wrap"><form class="search-pill" action="course-search.html" role="search"><input type="search" name="q" placeholder="Tìm theo tên khoá hoặc tag" value="${esc(search)}" maxlength="100" autocomplete="off" aria-controls="search-pop" aria-expanded="false"><button type="button" class="search-pill__x" data-qclear aria-label="Xoá từ khoá" ${search ? '' : 'hidden'}>${ICON.x}</button><button class="search-pill__go" aria-label="Tìm">${ICON.search}</button></form><div class="search-pop" id="search-pop" role="listbox" hidden></div></div>
        <div class="explore"><button class="explore-btn" data-explore aria-expanded="false">Explore${ICON.chevronD}</button>
          <div class="explore__menu" hidden><div class="explore__h">Danh mục khoá học</div>${((window.LHData && LHData.categories) || []).map((c) => `<a href="course-search.html?ct=${encodeURIComponent(c)}" data-cat="${esc(c)}">${esc(c)}</a>`).join('')}<a class="explore__all" href="course-search.html">Xem tất cả khoá học${ICON.chevronR}</a></div></div>
      </div>
      <div class="app-header__right">
        <button class="hd-icon" aria-label="Thông báo">${ICON.bell2}</button>
        <button class="hd-icon" aria-label="Ứng dụng">${ICON.grid}</button>
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
      <div class="app-footer__h"><h5>Phát triển bản thân cùng</h5><h5 class="lime">Learning Hub</h5></div>
      <p>Nâng cao kỹ năng và mở rộng kiến thức với các khoá học được thiết kế riêng cho đội ngũ Techvify. Dù bạn là developer, designer hay project manager — luôn có một khoá học phù hợp đang chờ bạn.<br>Cùng nhau học, cùng nhau lớn, cùng nhau vươn xa!</p>
      <div class="app-footer__brand"><img src="${LOGO}" width="32" height="32" alt="logo"><span>Learning <i></i> Hub</span></div>
    </div></footer>`;
  }
  /** App / Back — icon undo #2A28DF + chữ gradient, kèm tiêu đề trang */
  function BackLink(title = '', { href = 'javascript:history.back()', big = false } = {}) {
    return `<div class="back-head"><a class="back-link" href="${href}">${ICON.undo}<span>Back</span></a>${title ? `<div class="back-head__t ${big ? 'is-big' : ''}">${esc(title)}</div>` : ''}</div>`;
  }
  /** App / Section head — icon 2 màu + tiêu đề 24/700 + "View More" */
  function SectionHead(title, icon, href, extra = '') {
    return `<div class="sec-head"><h2>${ICON[icon] || ''}${esc(title)}</h2>${href ? `<a href="${href}">View More${ICON.chevronR}</a>` : ''}${extra}</div>`;
  }

  /**
   * Search / Filter dropdown — nút lọc dạng pill + menu chọn 1.
   * State: default (giá trị mặc định) | active (đang lọc, nền primary-50) | open. Chọn → phát sự kiện 'fdd:change' {key, value}.
   */
  function FilterDropdown({ key, label, value, options, def = 'all', align = 'left' }) {
    const cur = options.find((o) => o[0] === value) || options[0];
    const active = value !== def;
    return `<div class="fdd ${active ? 'is-active' : ''}" data-fdd="${key}">
      <button type="button" class="fdd__btn" aria-haspopup="listbox" aria-expanded="false"><span class="fdd__l">${esc(label)}</span><b>${esc(cur[1])}</b>${ICON.chevronD}</button>
      <div class="fdd__menu fdd__menu--${align}" role="listbox" hidden>${options.map(([v, t, n]) => `<button type="button" role="option" class="fdd__opt ${v === value ? 'is-sel' : ''}" data-v="${esc(v)}" aria-selected="${v === value}" ${n === 0 && v !== value ? 'data-zero' : ''}><span>${esc(t)}</span>${n != null ? `<i>${n}</i>` : ''}${v === value ? ICON.check : ''}</button>`).join('')}</div></div>`;
  }

  /**
   * Search / Panel — bảng xổ dưới ô search trên header.
   * State: recent (chưa gõ) | typing (có gợi ý) | empty (gõ mà không khớp).
   * recent: [từ khoá]; results: [{title, cover, cat, st}]; total: số kết quả đầy đủ; f: {st, pd}; counts: {st:{v:n}, pd:{v:n}}
   */
  const ST_LABEL = { notstarted: 'Chưa bắt đầu', learning: 'Đang học', done: 'Hoàn thành', fail: 'Không đạt' };
  function SearchQuickChip({ key, value, label, on, n }) {
    return `<button type="button" class="sp-chip ${on ? 'is-on' : ''}" data-sp-f="${key}" data-v="${value}" aria-pressed="${on}" ${n === 0 && !on ? 'data-zero' : ''}>${on ? ICON.check : ''}${esc(label)}${n != null ? `<i>${n}</i>` : ''}</button>`;
  }
  function SearchResultItem({ title, cover, cat, st, q, i }) {
    return `<a class="sp-item" href="course-detail.html" data-sp-i="${i}" role="option"><img src="${cover}" alt=""><span class="sp-item__b"><b>${q ? highlight(title, q) : esc(title)}</b><span>${esc(cat)} · ${ST_LABEL[st] || 'Chưa bắt đầu'}</span></span></a>`;
  }
  function SearchPanel({ q = '', recent = [], results = [], total = 0, f = {}, counts = {} }) {
    const state = !q ? 'recent' : results.length ? 'typing' : 'empty';
    const filtered = (f.st && f.st !== 'all') || (f.pd && f.pd !== 'all');
    const chips = `<div class="sp-sec"><div class="sp-h">Lọc nhanh${filtered ? '<button type="button" class="sp-link" data-sp-clear>Bỏ lọc</button>' : ''}</div>
      <div class="sp-chips"><span class="sp-chips__l">Trạng thái</span>${[['notstarted', 'Chưa bắt đầu'], ['learning', 'Đang học'], ['done', 'Hoàn thành']].map(([v, t]) => SearchQuickChip({ key: 'st', value: v, label: t, on: f.st === v, n: counts.st && counts.st[v] })).join('')}</div>
      <div class="sp-chips"><span class="sp-chips__l" title="Ngày tôi đăng ký, hoặc ngày hoàn thành nếu đã xong">Thời gian</span>${[['7', '7 ngày'], ['30', '30 ngày'], ['90', '90 ngày']].map(([v, t]) => SearchQuickChip({ key: 'pd', value: v, label: t, on: f.pd === v, n: counts.pd && counts.pd[v] })).join('')}</div></div>`;
    let main = '';
    if (state === 'recent') main = recent.length ? `<div class="sp-sec"><div class="sp-h">Tìm gần đây</div>${recent.map((r, i) => `<div class="sp-rec" data-sp-i="${i}" data-sp-q="${esc(r)}" role="option">${ICON.clock}<span>${esc(r)}</span><button type="button" class="sp-rec__x" data-sp-del="${esc(r)}" aria-label="Xoá khỏi lịch sử">${ICON.x}</button></div>`).join('')}</div>` : '';
    if (state === 'typing') main = `<div class="sp-sec"><div class="sp-h">Khoá học</div>${results.map((r, i) => SearchResultItem({ ...r, q, i })).join('')}</div>`;
    if (state === 'empty') main = `<div class="sp-empty">${ICON.search}<b>Không có khoá nào khớp “${esc(q)}”</b><span>${filtered ? 'Thử bỏ bớt bộ lọc bên dưới.' : 'Thử từ khoá ngắn hơn hoặc không dấu.'}</span></div>`;
    const all = q || filtered ? `<button type="button" class="sp-all" data-sp-all data-sp-i="${state === 'typing' ? results.length : state === 'recent' ? recent.length : 0}" role="option">${ICON.search}<span>${q ? `Xem tất cả <b>${total}</b> kết quả cho “${esc(q)}”` : `Xem <b>${total}</b> khoá theo bộ lọc`}</span>${ICON.chevronR}</button>` : '';
    return `<div class="sp" data-state="${state}">${main}${chips}${all}</div>`;
  }

  function Modal({ id, size = 'md', icon, iconTone = 'info', title, desc, body = '', foot = '', footNote = '' }) {
    return `<div class="modal-backdrop" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-t">
      <div class="modal modal--${size}">
        <div class="modal__head">${icon ? `<span class="modal__icon modal__icon--${iconTone}">${ICON[icon]}</span>` : ''}
          <div class="grow"><div class="modal__title" id="${id}-t">${title}</div>${desc ? `<div class="modal__desc">${desc}</div>` : ''}</div>
          <button class="icon-btn" data-close aria-label="Đóng">${ICON.x}</button></div>
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
  function CourseCard({ title, desc = '', cover = '', state = 'default', progress = 0, lessons = 2, hours = '14h 0m', last = '', menu = false, video, test, q = '', done = '', failScore = null, href = 'course-detail.html', sched = null }) {
    const badge = {
      restricted: `<span class="cc-tag">${ICON.lock}Dành cho nhóm chỉ định</span>`,
      failed: `<span class="cc-tag cc-tag--fail">${ICON.x}Không đạt</span>`,
      completed: `<span class="cc-tag cc-tag--ok">${ICON.check}Hoàn thành</span>`,
    }[state] || '';
    // #4 §3.4 Lịch học (BR-AUD-12): chưa tới ngày bắt đầu → nút tắt; quá hạn chưa xong → nhãn đỏ
    if (APP && href === 'course-detail.html') href = App.courseHref(title);
    const upcoming = sched && sched.start && state !== 'restricted';
    const schedTag = upcoming ? `<span class="cc-tag">${ICON.clock}Bắt đầu ${esc(sched.start)}</span>` : sched && sched.overdue && state === 'in-progress' ? `<span class="cc-tag cc-tag--fail">${ICON.clock}Quá hạn</span>` : '';
    const label = state === 'restricted' ? 'Xem giới thiệu' : (state === 'completed' || state === 'failed') ? 'Xem lại khoá học' : state === 'in-progress' ? 'Continue Learning' : 'Start Courses';
    const btnCls = state === 'restricted' || state === 'completed' || state === 'failed' ? 'cc-btn cc-btn--outline' : 'cc-btn';
    const attrs = state === 'default' || state === 'limit-reached' ? 'data-start' : '';
    const parts = [video && video[1] ? `Video ${video[0]}/${video[1]}` : '', test && test[1] ? `Bài test ${test[0]}/${test[1]}` : ''].filter(Boolean).join(' · ');
    const sub = state === 'completed' && done ? `Hoàn thành: ${esc(done)}` : state === 'failed' ? `Trượt bài thi sau 3 lượt${failScore != null ? ` · điểm chính thức ${failScore}` : ''}` : last ? `Học gần nhất: ${esc(last)}` : '';
    const extra = (parts || sub) && state !== 'default' && state !== 'restricted' && state !== 'limit-reached' ? `<div class="cc-sub">${parts ? `<span class="pg__split">${parts}</span>` : ''}${sub ? `<span>${sub}</span>` : ''}</div>` : '';
    return `<article class="course-card" data-state="${state}">
      <div class="course-card__cover">${cover ? `<img src="${cover}" alt="${esc(title)}">` : ''}${schedTag || badge}</div>
      <div class="course-card__body">
        <h3 class="course-card__title">${APP ? `<a href="${href}" style="color:inherit;text-decoration:none">` : ''}${q ? highlight(title, q) : esc(title)}${APP ? '</a>' : ''}</h3>
        <div class="course-card__desc">${esc(desc)}</div>
        <div class="course-card__meta"><span>${ICON.lessons2}lessons: ${lessons}</span><span>${ICON.clock2}${esc(hours)}</span></div>
        <div class="course-card__progress">${WebProgress(progress)}${extra}</div>
        <div class="course-card__foot"><a href="${href}" class="grow" ${attrs && !APP ? 'onclick="return false"' : ''}><button class="${btnCls}" ${upcoming ? `disabled title="Khoá học mở từ ${esc(sched.start)}." style="opacity:.5;cursor:not-allowed"` : attrs}>${label}</button></a>${menu ? `<div class="course-card__menu"><button class="cc-more" data-menu aria-label="Thêm">${ICON.more}</button></div>` : ''}</div>
      </div></article>`;
  }

  /** Course / Access notice — State: restricted | removed */
  function AccessNotice({ state = 'restricted', owner = { name: 'Nguyễn Thu Hà', email: 'ha.nguyenthu@techvify.com.vn' }, progress = 45 }) {
    const removed = state === 'removed';
    return `<div class="access-box ${removed ? 'access-box--removed' : ''}">
      <span class="access-box__icon">${ICON.lock}</span>
      <div class="stack gap-4"><div class="fw-600">${removed ? 'Bạn không còn trong đối tượng của khoá học' : 'Khoá học dành cho đối tượng được chỉ định'}</div>
      <div class="t-sm muted">${removed ? `Tiến độ của bạn (${progress}%) vẫn được lưu và sẽ tiếp tục nếu bạn được thêm lại.` : `Bạn chưa thuộc đối tượng của khoá học này. Liên hệ ${esc(owner.name)} nếu bạn cần tham gia.`}</div></div>
      ${removed ? `<div class="stack gap-4"><div class="row t-xs muted" style="justify-content:space-between"><span>Tiến độ đã lưu</span><b>${progress}%</b></div>${Progress(progress)}</div>` : ''}
      <div class="contact">${Avatar(owner.name, 'sm')}<div class="grow"><div class="t-sm fw-600">${esc(owner.name)}</div><div class="t-xs muted">Người phụ trách · ${esc(owner.email)}</div></div></div>
      <a class="btn btn--outline btn--block" href="mailto:${esc(owner.email)}">${ICON.mail}Gửi email cho người phụ trách</a>
    </div>`;
  }

  /* ---------- Assessment ---------- */
  /** Assessment / Mode card — Mode: practice | exam */
  function ModeCard({ mode, questions, minutes, attemptsLeft }) {
    if (mode === 'practice') return `<div class="mode-card mode-card--practice"><span class="mode-card__icon">${ICON.dumbbell}</span>
      <div><div class="mode-card__title">Luyện tập</div></div>
      <ul><li>${questions} câu luyện tập</li><li>Không giới hạn thời gian và số lần</li></ul>
      ${Button({ label: 'Luyện tập', variant: 'outline', icon: 'dumbbell', attrs: 'data-go="practice"' })}</div>`;
    return `<div class="mode-card mode-card--exam"><span class="mode-card__icon">${ICON.award}</span>
      <div><div class="mode-card__title">Bài thi</div></div>
      <ul><li>${questions} câu · ${minutes} phút</li><li>${attemptsLeft}</li></ul>
      ${Button({ label: 'Làm bài thi', icon: 'play', attrs: 'data-go="exam"' })}</div>`;
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
      else if (!reveal) { if (isChosen) { cls += ' opt--chosen'; mark = ICON.check; tag = 'Lựa chọn của bạn'; } }
      else {
        if (isRight) { cls += ' opt--right'; mark = ICON.check; tag = isChosen ? 'Bạn chọn · Đáp án đúng' : 'Đáp án đúng'; }
        else if (isChosen) { cls += ' opt--wrong'; mark = ICON.x; tag = 'Lựa chọn của bạn'; }
      }
      return `<div class="${cls}"><span class="opt__mark ${multi ? 'opt__mark--box' : ''}">${mark}</span><span class="opt__text">${String.fromCharCode(65 + i)}. ${esc(o)}</span>${tag ? `<span class="opt__tag">${tag}</span>` : ''}</div>`;
    }).join('');
    const tone = review === 'unanswered' ? '' : result === 'correct' ? 'q-card--correct' : 'q-card--incorrect';
    const footer = review === 'hidden'
      ? `<div class="locked-answer">${ICON.eyeOff}<span>Hiện khi Đạt hoặc hết lượt</span></div>`
      : reveal && explain ? `<div class="explain"><b>Giải thích</b>${esc(explain)}</div>` : '';
    return `<article class="q-card ${tone}" data-review="${review}" data-result="${result || ''}">
      <div class="q-card__head"><span class="q-card__num">Câu ${n}${total ? '/' + total : ''}</span><span class="q-card__type">${multi ? 'Nhiều đáp án' : 'Một đáp án'}</span><span class="grow"></span>${resBadge}</div>
      <div class="q-card__body"><p class="q-card__text">${esc(text)}</p><div class="stack gap-8">${opts}</div>${footer}</div></article>`;
  }

  /** Assessment / Score ring */
  function ScoreRing({ score, pass }) {
    const c = pass ? 'var(--green-600)' : 'var(--red-600)';
    return `<div class="score-ring" style="background:conic-gradient(${c} ${score * 3.6}deg, var(--neutral-200) 0)"><div class="score-ring__in"><span class="score-ring__val" style="color:${c}">${score}</span><span class="score-ring__lbl">/ 100 điểm</span></div></div>`;
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
  /** Learn / Course content drawer (cột phải 400). marks[i] = 'done' | 'part:<p>' | 'fail' | 'none' */
  function CourseContent(sessions, { current = 0, marks = [], open, meta = {} } = {}) {
    let li = 0;
    const html = sessions.map((s, si) => {
      const start = li; const items = s.lessons.map(([k, n], j) => {
        const i = li++; const m = marks[i] || 'none'; const cur = i === current;
        const ic = m === 'done' ? `<span class="cc-ic cc-ic--done">${ICON.circleCheck}</span>` : m.startsWith('part') ? `<span class="ls ls--part" style="--p:${m.split(':')[1]}" title="Đã xem ${m.split(':')[1]}% · cần 90%"></span>` : m === 'fail' ? `<span class="ls ls--part" style="--p:50" title="Đã làm, chưa đạt"></span>` : `<span class="cc-ic">${ICON.circle}</span>`;
        const sub = meta[i] || (k === 'quiz' ? `${ICON.fileQ}<span>32 Questions</span>` : k === 'video' ? `${ICON.tvPlay}<span>10 min</span>` : '');
        return `<a class="cc-lesson ${cur ? 'is-current' : ''}" href="${k === 'video' ? 'lesson-video.html' : k === 'quiz' ? url('test-start.html') : '#'}">${ic}<div class="grow"><span class="cc-lesson__t">${j + 1}. ${esc(n)}</span>${cur || meta[i] ? `<div class="cc-lesson__m">${sub}</div>` : ''}</div></a>`;
      }).join('');
      const doneN = marks.slice(start, li).filter((m) => m === 'done').length;
      const isOpen = open ? open.includes(si) : (current >= start && current < li);
      return `<div class="cc-sec ${isOpen ? 'is-open' : ''}"><button class="cc-sec__head" data-sec>${isOpen ? ICON.chevronU : ICON.chevronD}<span class="grow">Session ${si + 1}: ${esc(s.name)}</span><span class="cc-sec__n">${doneN}/${s.lessons.length}</span></button><div class="cc-sec__body">${items}</div></div>`;
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
        <div class="learn-stage">${stage}<button class="stage-nav stage-nav--l" aria-label="Bài trước">${ICON.chevronL}</button><button class="stage-nav stage-nav--r" aria-label="Bài sau">${ICON.chevronR}</button></div></div>
        <div class="learn-tabs">${tabs.map((t) => `<button class="${t === tab ? 'is-active' : ''}">${t}</button>`).join('')}</div>
        <div class="learn-below">${below}</div></div>
        <aside class="learn-drawer">${drawer}</aside></div></div>`;
  }
  /* ---------- Assessment (Practice / Exam) — plan 10/11/2026 ---------- */
  ICON.flag = P('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>');
  ICON.timer = P('<path d="M10 2h4"/><path d="M12 14l3-3"/><circle cx="12" cy="14" r="8"/>');
  ICON.target = P('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>');

  /** Assessment / Mode select — State: default | in-progress | passed | out · Practice: on | off */
  function ModeSelect({ title, questions, minutes, attempts = 'Còn 2/3 lượt', passMark = 70, practice = true, practiceQ, state = 'default', best, last, remain = '41:20', wrong }) {
    const meta = [[ICON.list, `${questions} câu`], [ICON.clock, `${minutes} phút`], [ICON.repeat, attempts], [ICON.target, `Đạt từ ${passMark} điểm`]]
      .map(([i, t]) => `<span>${i}${esc(t)}</span>`).join('');
    const exam = {
      default: [wrong ? `Làm lại ${wrong} câu sai` : 'Exam Mode', 'data-go="exam"', '', ''],
      'in-progress': [`Tiếp tục bài thi · còn ${remain}`, 'data-go="exam"', '', 'is-warn'],
      passed: ['Xem kết quả', 'data-go="result"', '', ''],
      out: ['Xem kết quả', 'data-go="result"', '', ''],
    }[state];
    const badge = state === 'passed' ? `<span class="badge badge--success">${ICON.check}Đã đạt</span>` : state === 'out' ? `<span class="badge badge--danger">Không đạt · hết lượt</span>` : state === 'in-progress' ? `<span class="badge badge--warning">${ICON.timer}Đang làm dở</span>` : '';
    const showP = practice;
    return `<div class="stage-card stage-card--center"><div class="mode-sel" data-state="${state}">
      ${badge ? `<div class="mode-sel__badge">${badge}</div>` : ''}
      <h1>${esc(title)}</h1>
      <div class="mode-sel__meta">${meta}</div>
      <div class="mode-sel__btns ${showP ? '' : 'is-single'}">
        ${showP ? `<div class="mode-sel__opt"><button class="wbtn wbtn--outline wbtn--lg" data-go="practice">Practice Mode</button>${practiceQ ? `<p>${practiceQ} câu</p>` : ''}</div>` : ''}
        <div class="mode-sel__opt"><button class="wbtn wbtn--lg ${exam[3] === 'is-warn' ? 'wbtn--warn' : state === 'out' ? 'wbtn--outline-dark' : ''}" ${exam[1]}>${esc(exam[0])}</button>${exam[2] ? `<p>${exam[2]}</p>` : ''}</div>
      </div>
      ${best != null ? `<a class="mode-sel__best" href="#result" data-go="result">${state === 'out' || state === 'passed' ? 'Điểm chính thức' : 'Điểm cao nhất'} <b>${best}</b>${ICON.chevronR}</a>` : ''}
    </div></div>`;
  }

  /**
   * Assessment / Question (web)
   * state: answering (practice) | checked (practice sau Check) | exam (đang thi, có cờ) | review-hidden | review-revealed
   */
  function WebQuestion({ n, text, options, type = 'single', chosen = [], correct = [], explain = '', state = 'answering', showCheck = false, flagged = false }) {
    const multi = type === 'multi'; const reveal = state === 'checked' || state === 'review-revealed';
    const live = state === 'answering' || state === 'exam';
    const blank = chosen.length === 0;
    const ok = !blank && chosen.length === correct.length && chosen.every((c) => correct.includes(c));
    const result = live ? '' : blank ? 'blank' : ok ? 'correct' : 'incorrect';
    const opts = options.map((o, i) => {
      const isC = chosen.includes(i), isR = correct.includes(i);
      let cls = 'wq-opt', tag = '';
      if (reveal) { if (isR) { cls += ' is-right'; tag = `<span class="wq-tag wq-tag--ok">${isC ? 'Lựa chọn của bạn · Đáp án đúng' : 'Đáp án đúng'}</span>`; } else if (isC) { cls += ' is-wrong'; tag = '<span class="wq-tag wq-tag--bad">Lựa chọn của bạn</span>'; } }
      else if (state === 'review-hidden' && isC) { cls += ' is-mine'; tag = '<span class="wq-tag wq-tag--mine">Lựa chọn của bạn</span>'; }
      else if (isC) cls += ' is-chosen';
      return `<button class="${cls}" data-k="${i}" ${live ? '' : 'disabled'}><span class="wq-dot ${multi ? 'wq-dot--box' : ''} ${isC ? 'is-on' : ''}">${isC ? (multi ? ICON.check : '<i></i>') : ''}</span><span class="wq-opt__t">${esc(o)}</span>${tag}</button>`;
    }).join('');
    const verdict = !result ? '' : `<span class="wq-res wq-res--${result}">${result === 'correct' ? ICON.check + 'Đúng' : result === 'blank' ? 'Chưa trả lời' : ICON.x + 'Sai'}</span>`;
    const foot = reveal && explain ? `<div class="wq-foot"><div class="wq-explain"><p>Giải thích</p><div>${esc(explain)}</div></div></div>`
      : state === 'review-hidden' && blank ? '' : showCheck && state === 'answering' ? `<button class="wbtn wbtn--outline wq-check" data-check ${blank ? 'disabled' : ''}>Check answer</button>` : '';
    const flag = state === 'exam' ? `<button class="wq-flag ${flagged ? 'is-on' : ''}" data-flag title="Đánh dấu để xem lại">${ICON.flag}${flagged ? 'Đã đánh dấu' : 'Đánh dấu'}</button>` : '';
    return `<div class="wq ${flagged ? 'is-flagged' : ''}" id="q${n}" data-n="${n}" data-state="${state}" data-result="${result}">
      <div class="wq-head"><div class="wq-head__l"><span class="wq-num">Câu ${n}</span>${verdict}</div><div class="wq-badges"><span class="wq-type">${multi ? 'Multiple Choice' : 'Single Choice'}</span><span class="wq-pt">1 point</span>${flag}</div></div>
      <h2 class="wq-text">${esc(text)}</h2>${multi && live ? '<p class="wq-hint">Chọn tất cả đáp án đúng</p>' : ''}
      <div class="wq-opts">${opts}</div>${foot}</div>`;
  }
  /** Assessment / Dash meter — "x / N" + vạch 3px */
  function DashMeter(done, total, label = 'complete') {
    return `<div class="dash"><div class="dash__row"><span>${done} / ${total} ${esc(label)}</span>${ICON.trophy}</div><div class="dash__bar">${Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('')}</div></div>`;
  }
  /** Assessment / Quiz top bar — Mode: practice | exam | review. Dính trên cùng màn quiz */
  function QuizTopBar({ mode = 'practice', title, center = '', right = '' }) {
    const lbl = { practice: ['Practice', ''], exam: ['Exam', 'quiz-badge--exam'], review: ['Kết quả', 'quiz-badge--exam'] }[mode];
    return `<div class="qbar qbar--${mode}"><div class="qbar__in">
      <div class="qbar__l"><span class="quiz-badge ${lbl[1]}">${lbl[0]}</span><b class="qbar__t">${esc(title)}</b></div>
      <div class="qbar__c">${center}</div><div class="qbar__r">${right}</div></div></div>`;
  }
  /** Assessment / Exam timer — State: normal | warning (≤5 phút) | expired */
  function ExamTimer(sec) {
    const st = sec <= 0 ? 'expired' : sec <= 300 ? 'warning' : 'normal';
    const t = `${String(Math.floor(Math.max(sec, 0) / 60)).padStart(2, '0')}:${String(Math.max(sec, 0) % 60).padStart(2, '0')}`;
    return `<span class="timer timer--${st}" role="timer" aria-label="Thời gian còn lại">${ICON.timer}${t}</span>`;
  }
  /** Assessment / Question nav — item: empty | answered | flagged | current */
  function QuestionNav(items, { current, timer = '', nums } = {}) {
    const no = (i) => (nums ? nums[i] : i + 1);
    const n = (k) => items.filter((x) => x === k).length;
    return `<div class="qnav">${timer ? `<div class="qnav__timer"><span>Thời gian còn lại</span>${timer}</div>` : ''}<div class="qnav__h">Danh sách câu</div>
      <div class="qnav__grid">${items.map((st, i) => `<a href="#q${no(i)}" class="qnav__i qnav__i--${st} ${current === i ? 'is-cur' : ''}" data-jump="${no(i)}">${no(i)}${st === 'flagged' ? '<i></i>' : ''}</a>`).join('')}</div>
      <div class="qnav__lg"><span><i class="qnav__sw qnav__sw--answered"></i>Đã trả lời ${n('answered') + n('flagged-answered')}</span><span><i class="qnav__sw qnav__sw--empty"></i>Chưa làm ${n('empty') + n('flagged')}</span><span><i class="qnav__sw qnav__sw--flag"></i>Đánh dấu ${n('flagged') + n('flagged-answered')}</span></div></div>`;
  }
  /** Assessment / Submit confirm — nội dung modal Nộp bài */
  function SubmitConfirm({ unanswered = 0, flagged = 0, attempts = 'còn 2/3' }) {
    const warn = unanswered || flagged;
    return Modal({ id: 'submit-modal', size: 'sm', icon: warn ? 'alert' : 'info', iconTone: warn ? 'warning' : 'info', title: 'Nộp bài thi?',
      body: `<div class="stack gap-8 t-sm">${unanswered ? `<div class="sc-line sc-line--warn"><b>${unanswered}</b> câu chưa trả lời — sẽ tính là Sai.</div>` : ''}${flagged ? `<div class="sc-line"><b>${flagged}</b> câu đang đánh dấu xem lại.</div>` : ''}${!warn ? '<div class="sc-line">Bạn đã trả lời tất cả câu hỏi.</div>' : ''}<div class="muted">Nộp bài sẽ dùng 1 lượt (${esc(attempts)}). Không sửa được sau khi nộp.</div></div>`,
      foot: `${warn ? '<button class="wbtn wbtn--outline" data-close data-review-empty>Xem lại câu chưa làm</button>' : '<button class="wbtn wbtn--outline" data-close>Huỷ</button>'}<button class="wbtn" data-submit-now>Nộp bài</button>` });
  }
  /** Assessment / Result summary — Result: pass | fail. Chốt 11/11: lượt sau chỉ làm lại câu sai; điểm chính thức = điểm cao nhất; khoá khi Đạt hoặc hết lượt */
  function ResultSummary({ score, passMark = 70, right, wrong, blank = 0, total, minutes, attemptNo, maxAttempts = 3, used, result, canRetry, isLatest = true, best = score }) {
    const pass = result === 'pass'; const done = best >= passMark; const final = used >= maxAttempts || done; const left = maxAttempts - used;
    const c = pass ? 'var(--green-600)' : 'var(--red-600)';
    const r = 50, C = 2 * Math.PI * r;
    const title = !isLatest ? `Lượt ${attemptNo}` : done ? 'Bạn đã đạt bài thi' : final ? 'Kết quả chính thức: Không đạt' : 'Bạn chưa đạt bài thi';
    const note = !isLatest ? `Điểm chính thức: ${best}`
      : done ? `Điểm chính thức: ${best}`
      : final ? `Hết ${maxAttempts} lượt · Điểm chính thức: ${best}`
      : `Còn ${left}/${maxAttempts} lượt`;
    return `<div class="rsum rsum--${pass ? 'pass' : 'fail'}">
      <div class="rsum__ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--neutral-100)" stroke-width="10"/><circle cx="60" cy="60" r="${r}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - score / 100)}" transform="rotate(-90 60 60)"/></svg><div><b style="color:${c}">${score}</b><span>/ 100</span></div></div>
      <div class="rsum__body">
        <div class="rsum__t"><h1>${title}</h1>${pass ? `<span class="badge badge--success">${ICON.check}Đạt</span>` : `<span class="badge badge--danger">${ICON.x}Chưa đạt</span>`}</div>
        <div class="rsum__stats"><div class="is-ok"><b>${right}</b><span>Đúng</span></div><div class="is-bad"><b>${wrong}</b><span>Sai</span></div><div><b>${blank}</b><span>Bỏ trống</span></div><div><b>${total}</b><span>Tổng số câu</span></div></div>
        <div class="rsum__meta"><span>Lượt ${attemptNo}/${maxAttempts}</span><span>${minutes} phút</span><span>Đạt từ ${passMark}</span></div>
        <div class="rsum__note">${note}</div>
        <div class="rsum__act">${canRetry ? `<button class="wbtn" data-retry>Làm lại ${wrong + blank} câu sai (còn ${maxAttempts - used} lượt)</button>` : ''}<a class="wbtn wbtn--outline" href="course-detail.html">Quay lại khoá học</a></div>
      </div></div>`;
  }
  /** Assessment / Review filter — tab gạch chân. Active: all | correct | incorrect */
  function ReviewFilter(active, counts) {
    return `<div class="rfilter" role="tablist">${[['all', 'Tất cả'], ['correct', 'Đúng'], ['incorrect', 'Sai']].map(([k, t]) => `<button role="tab" class="${active === k ? 'is-active' : ''}" data-f="${k}">${t}<span>${counts[k]}</span></button>`).join('')}</div>`;
  }
  /** Assessment / Practice summary */
  function PracticeSummary({ right, total, wrong = [] }) {
    const pct = Math.round(right / total * 100);
    return `<div class="psum"><div class="psum__head"><span class="psum__ic">${ICON.trophy}</span><div><h2>Hoàn thành luyện tập</h2><p>Đúng <b>${right} / ${total}</b> câu (${pct}%)</p></div></div>
      <div class="psum__note">${ICON.info}Kết quả luyện tập không lưu vào tiến độ khoá học và không tính lượt thi.</div>
      ${wrong.length ? `<div class="psum__wrong"><b>Câu cần ôn lại</b><div>${wrong.map((n) => `<a href="#q${n}" data-jump="${n}">Câu ${n}</a>`).join('')}</div></div>` : '<div class="psum__wrong"><b>Bạn trả lời đúng tất cả các câu.</b></div>'}
      <div class="psum__act">${wrong.length ? `<button class="wbtn" data-retry-wrong>Luyện lại ${wrong.length} câu sai</button>` : ''}<button class="wbtn wbtn--outline" data-restart>Làm lại từ đầu</button><a class="wbtn wbtn--outline" href="test-start.html">Quay lại bài học</a></div></div>`;
  }

  /* ---------- Enroll ---------- */
  /**
   * Learner / Enroll slot panel — khung "Suất học" cạnh My Courses (Home). State: Available | Full.
   * BR-LRN-01: chỉ khoá Đang học tính giới hạn (tối đa 2) · Hoàn thành, Không đạt (BR-LRN-32) không tính.
   */
  function EnrollSlotPanel({ used = 0, limit = 2 }) {
    // Thông tin phụ: chip nhỏ cạnh tiêu đề My Courses (thay khung lớn). Chi tiết Không đạt / Hoàn thành xem ở My Courses.
    const full = used >= limit;
    const dots = Array.from({ length: Math.max(limit, used) }, (_, k) => `<i class="${k < used ? 'on' : ''}"></i>`).join('');
    return `<span class="slot-chip ${full ? 'slot-chip--full' : ''}" title="${full ? 'Hoàn thành 1 khoá đang học để đăng ký khoá mới.' : 'Khoá Hoàn thành và Không đạt không tính suất.'}"><span class="slot-chip__dots">${dots}</span>Suất học <b>${used}/${limit}</b>${full ? ' · Đạt giới hạn' : ''}</span>`;
  }
  /** Learner / Empty slot — thẻ mini 64px (thông tin phụ), cuối hàng My Courses, căn đỉnh */
  function EmptySlotCard(n = 1) {
    return `<a class="slot-empty" href="course-search.html"><span class="slot-empty__ic">${ICON.plus}</span><b>Còn ${n} suất</b><span class="grow"></span><span class="slot-empty__go">Khám phá khoá học${ICON.chevronR}</span></a>`;
  }

  /**
   * Course / CTA card — khung bên phải trang khoá. State: all | limit | upcoming | learning | overdue | completed | failed.
   * sched: { label, range, overdue } · slots: số khoá đang học · result: { pct, video, test } (khi đã đăng ký)
   */
  function CourseCta({ state = 'all', sched, slots = 1, limit = 2, result, startDate = '' }) {
    const tags = {
      learning: Badge('Đang học', 'info'), overdue: Badge('Đang học', 'info'),
      completed: Badge('Hoàn thành', 'success', 'check'), failed: Badge('Không đạt', 'danger'),
    }[state] || '';
    const right = state === 'overdue' ? Badge('Quá hạn', 'danger') : '';
    const head = tags || right ? `<div class="cta-card__tags">${tags}${right ? `<span class="grow"></span>${right}` : ''}</div>` : '';
    const meta = sched ? `<div class="cta-card__meta"><span class="ic">${ICON.clock}</span><span>${esc(sched.label)} <b>${esc(sched.range)}</b></span></div>` : '';
    let body = '', btn = '';
    if (result) {
      const review = state === 'completed' || state === 'failed';
      body = `<button class="cta-card__pg" data-pop>${WebProgress(result.pct, 'Tiến độ')}<span class="cta-card__sub">Video ${result.video[0]}/${result.video[1]} · Bài test ${result.test[0]}/${result.test[1]}</span></button>`;
      btn = `<button class="aside-btn ${review ? 'aside-btn--outline' : ''}" data-continue>${review ? 'Xem lại khoá học' : 'Continue Learning'}</button>`;
    } else {
      body = `<div>${EnrollSlotPanel({ used: slots, limit })}</div>`;
      btn = state === 'upcoming'
        ? `<button class="aside-btn" disabled>Start Courses</button><span class="cta-card__sub" style="text-align:center">Mở từ ${esc(startDate)}</span>`
        : `<button class="aside-btn" id="start">Start Courses</button>`;
    }
    return `<div class="cta-card" data-state="${state}">${head}${meta}${body}${btn}</div>`;
  }
  function SlotMeter(used, limit) {
    const full = used >= limit;
    const dots = Array.from({ length: Math.max(limit, used) }, (_, i) => `<i class="${i < used ? 'on' : ''}"></i>`).join('');
    return `<span class="slot-meter ${full ? 'slot-meter--full' : ''}"><span class="slot-meter__dots">${dots}</span>Đang học ${used}/${limit} khoá${full ? ' · Đạt giới hạn' : ''}</span>`;
  }

  /* ---------- Đợt 2 · #8 Tiến độ · #7 Kết quả ---------- */
  /** Course / Progress breakdown — Mode: compact (card) | full (popover). BR-LRN-21, 26 */
  function ProgressBreakdown({ pct, video, test, doc, mode = 'compact', practice = false }) {
    const parts = [video && video[1] ? `Video ${video[0]}/${video[1]}` : '', test && test[1] ? `Bài test ${test[0]}/${test[1]}` : ''].filter(Boolean).join(' · ');
    if (mode === 'compact') return `<div class="pg pg--compact"><div class="row"><span>Tiến độ</span><b>${pct}%</b></div>${Progress(pct)}${parts ? `<span class="pg__split">${parts}</span>` : ''}</div>`;
    const done = [video, test, doc].filter(Boolean).reduce((a, x) => a + x[0], 0), all = [video, test, doc].filter(Boolean).reduce((a, x) => a + x[1], 0);
    const line = (ic, lbl, v, unit) => v && v[1] ? `<div class="pg__line">${ICON[ic]}<span class="grow">${lbl}</span><b>${v[0]}/${v[1]}</b><span class="muted">${unit}</span></div>` : '';
    return `<div class="pg pg--full"><div class="row"><span class="fw-600">Tỷ lệ hoàn thành</span><span class="grow"></span><b class="t-xl">${pct}%</b></div>${Progress(pct)}
      <span class="t-xs muted">${done}/${all} bài đã hoàn thành</span>
      <div class="pg__lines">${line('video', 'Video', video, 'đã xem')}${line('quiz', 'Bài test', test, 'đã đạt')}${line('file', 'Tài liệu', doc, 'đã mở')}</div>
      ${practice ? '<span class="t-xs muted">Luyện tập không tính vào tiến độ.</span>' : ''}</div>`;
  }
  /** Learner / Completion ring — vòng Tỷ lệ hoàn thành (#7) */
  function CompletionRing(pct, size = 120) {
    return `<div class="c-ring" style="--p:${pct};width:${size}px;height:${size}px"><div class="c-ring__in"><b>${pct}%</b><span>hoàn thành</span></div></div>`;
  }

  /* ---------- Đợt 2 · #3 Duyệt khoá ---------- */
  const STATUS = { draft: ['Nháp', 'neutral'], pending: ['Chờ duyệt', 'warning'], rejected: ['Cần chỉnh sửa', 'danger'], published: ['Đang chạy', 'success'] };
  /** Course / Status badge — Status: draft | pending | rejected | published · Revision: none | pending | rejected */
  function CourseStatus(status, revision) {
    const [l, t] = STATUS[status];
    const rev = revision === 'pending' ? Badge('Bản sửa chờ duyệt', 'warning') : revision === 'rejected' ? Badge('Bản sửa cần chỉnh sửa', 'danger') : revision === 'draft' ? Badge('Bản sửa nháp', 'neutral') : '';
    return `<span class="row gap-4">${Badge(l, t)}${rev}</span>`;
  }
  /** Course / Approval banner — State: draft | pending | rejected | approved. BR-CRS-03, 07 */
  function ApprovalBanner({ state, comment = '', by = 'Lê Thị Mai (Admin L&D)', at = '10:24 · 09/11/2026', revision = false }) {
    const B = {
      draft: ['neutral', 'file', revision ? 'Bản sửa — học viên vẫn học nội dung đang chạy' : 'Bản nháp — chỉ bạn và Admin L&D thấy', '', Button({ label: 'Gửi duyệt', attrs: 'data-submit' })],
      pending: ['warning', 'clock', 'Đang chờ Admin L&D duyệt', `Đã gửi duyệt lúc ${at}.`, ''],
      rejected: ['danger', 'alert', 'Admin L&D yêu cầu chỉnh sửa', '', Button({ label: 'Gửi duyệt lại', attrs: 'data-submit' })],
      approved: ['success', 'check', 'Khoá học đang chạy', `Được duyệt lúc ${at}.`, Button({ label: 'Sửa nội dung', variant: 'outline', attrs: 'data-edit' })],
    }[state];
    const quote = comment ? `<blockquote class="ab__quote">“${esc(comment)}”<cite>${esc(by)} · ${esc(at)}</cite></blockquote>` : '';
    return `<div class="ab alert alert--${B[0]}">${ICON[B[1]]}<div class="grow stack gap-4"><b>${B[2]}</b>${B[3] ? `<span>${B[3]}</span>` : ''}${quote}</div><div class="ab__act">${B[4]}</div></div>`;
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

  /* ---------- Demo bar helper ---------- */
  /** groups: [{ label, key, options: [[value, text]], value }] ; onChange(state) */
  function DemoBar(title, groups, onChange) {
    const bar = document.createElement('div'); bar.className = 'demo-bar';
    const q = new URLSearchParams(location.search); // mở thẳng 1 trạng thái: ?key=value
    const role = App.role();
    const def = APP === 'admin' ? { r: role, role: role === 'admin' ? 'Admin' : 'Creator' } : {};
    const state = Object.fromEntries(groups.map((g) => [g.key, q.get(g.key) ?? def[g.key] ?? g.value ?? g.options[0][0]]));
    if (APP) { const set = (k, v) => { state[k] = v; onChange({ ...state }); }; onChange({ ...state }); return { state, set }; }
    const render = () => {
      bar.innerHTML = `<b>DEMO</b><span>${esc(title)}</span>` + groups.map((g) => `<div class="demo-group"><span>${esc(g.label)}</span>${g.options.map(([v, t]) => `<button data-k="${g.key}" data-v="${v}" aria-pressed="${state[g.key] === v}">${esc(t)}</button>`).join('')}</div>`).join('') + `<span class="demo-sep"></span><a href="index.html">← Danh sách màn</a>`;
    };
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-k]'); if (!b) return;
      state[b.dataset.k] = b.dataset.v; render(); onChange({ ...state });
    });
    render(); document.body.classList.add('has-demo'); document.body.appendChild(bar);
    const set = (k, v) => { state[k] = v; render(); onChange({ ...state }); };
    onChange({ ...state });
    return { state, set };
  }

  /* ---------- Search panel: mở khi bấm ô, gõ 200ms thì cập nhật, phím ↑↓ Enter Esc, lịch sử 5 từ ----------
     Áp dụng: phát 'search:apply' {q, st, pd} (cancelable). Trang kết quả gọi preventDefault để lọc tại chỗ;
     trang khác → chuyển sang course-search.html?… */
  const SP = { hl: -1, timer: null, KEY: 'lhRecentSearch' };
  const onResultsPage = () => /course-search\.html$/.test(location.pathname);
  const spF = () => { const p = new URLSearchParams(onResultsPage() ? location.search : ''); return { ct: p.get('ct') || 'all', st: p.get('st') || 'all', pd: p.get('pd') || 'all' }; };
  const recentGet = () => JSON.parse(localStorage.getItem(SP.KEY) || '[]');
  const recentAdd = (q) => { if (!q) return; localStorage.setItem(SP.KEY, JSON.stringify([q, ...recentGet().filter((x) => norm(x) !== norm(q))].slice(0, 5))); };
  function needSearch(cb) {
    if (window.LHSearch) return cb();
    const s = document.createElement('script'); s.src = '../assets/js/search.js'; s.onload = cb; document.head.appendChild(s);
  }
  function spRender() {
    const pop = document.getElementById('search-pop'); if (!pop || pop.hidden) return;
    const input = pop.parentElement.querySelector('.search-pill input');
    needSearch(() => {
      const S = window.LHSearch, data = (window.LHData && LHData.catalog) || [];
      const q = S.clean(input.value), f = spF();
      const run = (patch) => S.run(data, { q, ...f, ...patch }).items;
      const items = run({});
      const counts = { st: Object.fromEntries(['notstarted', 'learning', 'done'].map((v) => [v, run({ st: v }).length])), pd: Object.fromEntries(['7', '30', '90'].map((v) => [v, run({ pd: v }).length])) };
      pop.innerHTML = SearchPanel({ q, recent: recentGet(), total: items.length, f, counts,
        results: items.slice(0, 5).map((c) => ({ title: c.title, cover: c.cover, cat: c.cat, st: S.myStatus(c) })) });
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
  document.addEventListener('focusin', (e) => { if (e.target.matches('.search-pill input')) spOpen(); });
  document.addEventListener('input', (e) => { if (!e.target.matches('.search-pill input')) return; clearTimeout(SP.timer); SP.timer = setTimeout(() => { spOpen(); spRender(); }, 200); });
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
    if (e.target.matches('.search-pill input')) { spOpen(); return; } // bấm lại sau Esc vẫn mở
    const pop = e.target.closest('#search-pop'); if (!pop) return;
    const input = document.querySelector('.search-pill input');
    const del = e.target.closest('[data-sp-del]');
    if (del) { e.stopPropagation(); localStorage.setItem(SP.KEY, JSON.stringify(recentGet().filter((x) => x !== del.dataset.spDel))); spRender(); input.focus(); return; }
    const rec = e.target.closest('[data-sp-q]');
    if (rec) { input.value = rec.dataset.spQ; input.closest('form').querySelector('.search-pill__x').hidden = false; spClose(); spApply({ q: rec.dataset.spQ }); return; }
    const chip = e.target.closest('[data-sp-f]');
    if (chip) { const k = chip.dataset.spF; spApply({ [k]: spF()[k] === chip.dataset.v ? 'all' : chip.dataset.v }); if (onResultsPage()) { spRender(); input.focus(); } return; }
    if (e.target.closest('[data-sp-clear]')) { spApply({ st: 'all', pd: 'all' }); if (onResultsPage()) { spRender(); input.focus(); } return; }
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

  window.LH = { App, url, ICON, esc, Button, Badge, Alert, Progress, Avatar, AppHeader, Modal, toast, CourseCard, EmptySlotCard, CourseCta, AccessNotice, ModeCard, QuestionCard, ScoreRing, SlotMeter, EnrollSlotPanel, DemoBar,
    ProgressBreakdown, CompletionRing, CourseStatus, ApprovalBanner, norm, highlight,
    CategoryNav, AppFooter, BackLink, SectionHead, FilterDropdown, SearchPanel, SearchResultItem, SearchQuickChip, WebProgress, LessonsAccordion, CourseContent, LearnShell, ModeSelect, WebQuestion, DashMeter, Gauge,
    QuizTopBar, ExamTimer, QuestionNav, SubmitConfirm, ResultSummary, ReviewFilter, PracticeSummary };
})();
