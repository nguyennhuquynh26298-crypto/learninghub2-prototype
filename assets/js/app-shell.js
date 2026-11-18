/* Khung app 1 link: hoc-vien.html / admin.html.
 * Các màn chạy trong iframe → URL ngoài giữ nguyên; trong iframe ẩn thanh DEMO, trạng thái lấy từ thao tác thật. */
(function () {
  const MODE = document.body.dataset.app; // learner | admin
  sessionStorage.setItem('lhApp', MODE);
  /* Phiên mới (tab mới) → bắt đầu sạch, không kéo lượt thi cũ của lần xem trước */
  if (!sessionStorage.getItem('lhSession')) {
    sessionStorage.setItem('lhSession', '1');
    ['lhExamAttempts', 'lhExamRunning'].forEach((k) => localStorage.removeItem(k));
  }
  const HOME = MODE === 'learner' ? 'pages/home.html' : 'pages/admin-courses.html';
  const frame = document.getElementById('frame');
  const roleOf = () => sessionStorage.getItem('lhRole') || 'admin';

  const start = location.hash.startsWith('#/pages/') ? location.hash.slice(2) : HOME;
  frame.src = start;

  frame.addEventListener('load', () => {
    try {
      const l = frame.contentWindow.location;
      const path = l.pathname.split('/').slice(-2).join('/') + l.search + l.hash;
      history.replaceState(null, '', '#/' + path);
      document.title = frame.contentDocument.title.replace(' · Learning Hub', '').replace(' · LearningHub', '') + ' · LearningHub 2';
      markNav(l.pathname.split('/').pop());
    } catch (e) { /* file:// chặn đọc iframe — bỏ qua */ }
  });

  document.getElementById('reset').addEventListener('click', () => {
    ['lhL', 'lhCur', 'lhAdminCourse', 'lhNewCourse'].forEach((k) => sessionStorage.removeItem(k));
    ['lhExamAttempts', 'lhExamRunning', 'lhRecentSearch'].forEach((k) => localStorage.removeItem(k));
    const r = roleOf();
    const map = { creator: 'editor', cr: 'editor' };
    const rr = map[r] || r;
    frame.src = MODE === 'admin' ? `pages/admin-courses.html?r=${rr === 'employee' ? 'admin' : rr}` : HOME;
  });

  /* Admin: menu trái + đổi vai trò đã chuyển vào trong trang (LH.AdminLayout). Giữ code để tương thích nếu còn #nav. */
  const nav = document.getElementById('nav');
  function normRole(r) {
    const v = String(r || 'admin').toLowerCase();
    if (v.startsWith('ed') || v.startsWith('cr')) return 'editor';
    if (v.startsWith('em')) return 'employee';
    return 'admin';
  }
  function drawNav() {
    if (!nav) return;
    const r = normRole(roleOf());
    const items = [
      ['admin-courses.html', `pages/admin-courses.html?r=${r}`, 'Course Management', ''],
      ['admin-categories.html', `pages/admin-categories.html?r=${r}`, 'Category', ''],
      ...(r === 'admin' ? [
        ['admin-employees.html', 'pages/admin-employees.html?r=admin', 'Employees', ''],
        ['admin-entities.html', 'pages/admin-entities.html?r=admin', 'Entity', ''],
        ['admin-roles.html', 'pages/admin-roles.html?r=admin', 'Roles', ''],
        ['admin-sync.html', 'pages/admin-sync.html?r=admin', 'Sync', ''],
      ] : []),
      ['admin-reports.html', `pages/admin-reports.html?r=${r}`, 'Learning Dashboard', 'LH2'],
    ];
    nav.innerHTML = `<div class="sh-role"><span>Switch role</span>
        <button data-role="admin" class="${r === 'admin' ? 'on' : ''}">Admin</button>
        <button data-role="editor" class="${r === 'editor' ? 'on' : ''}">Editor</button>
        <button data-role="employee" class="${r === 'employee' ? 'on' : ''}">Employee</button></div>
      <div class="sh-menu">${items.map(([f, href, t, w]) => `<a href="${href}" target="frame" data-f="${f}">${t}${w ? `<i>${w}</i>` : ''}</a>`).join('')}</div>`;
  }
  function markNav(file) {
    if (!nav) return;
    nav.querySelectorAll('[data-f]').forEach((a) => a.classList.toggle('on', a.dataset.f === file || (a.dataset.f === 'admin-courses.html' && /admin-audience|admin-test-practice|course-editor|course-create|admin-course-learners|course-approval/.test(file))));
  }
  if (nav) {
    nav.addEventListener('click', (e) => {
      const b = e.target.closest('[data-role]'); if (!b) return;
      sessionStorage.setItem('lhRole', b.dataset.role); drawNav();
      const rr = normRole(b.dataset.role);
      frame.src = rr === 'employee' ? 'pages/home.html' : `pages/admin-courses.html?r=${rr}`;
    });
    drawNav();
  }
})();
