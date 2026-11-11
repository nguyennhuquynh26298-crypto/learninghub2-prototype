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
    ['lhL', 'lhCur', 'lhAdminCourse'].forEach((k) => sessionStorage.removeItem(k));
    ['lhExamAttempts', 'lhExamRunning', 'lhRecentSearch'].forEach((k) => localStorage.removeItem(k));
    frame.src = MODE === 'admin' && roleOf() === 'creator' ? 'pages/admin-courses.html?r=creator' : HOME;
  });

  /* Admin: menu trái + đổi vai trò */
  const nav = document.getElementById('nav');
  function drawNav() {
    if (!nav) return;
    const r = roleOf();
    const items = r === 'admin'
      ? [['admin-courses.html', 'pages/admin-courses.html', 'Quản lý khoá học', ''], ['admin-settings.html', 'pages/admin-settings.html', 'Phân quyền Course Creator', 'Đợt 2']]
      : [['admin-courses.html', 'pages/admin-courses.html?r=creator', 'Khoá học của tôi', '']];
    nav.innerHTML = `<div class="sh-role"><span>Đăng nhập với vai trò</span>
        <button data-role="admin" class="${r === 'admin' ? 'on' : ''}">Admin L&amp;D</button>
        <button data-role="creator" class="${r === 'creator' ? 'on' : ''}">Course Creator <i>Đợt 2</i></button></div>
      <div class="sh-menu">${items.map(([f, href, t, w]) => `<a href="${href}" target="frame" data-f="${f}">${t}${w ? `<i>${w}</i>` : ''}</a>`).join('')}</div>`;
  }
  function markNav(file) {
    if (!nav) return;
    nav.querySelectorAll('[data-f]').forEach((a) => a.classList.toggle('on', a.dataset.f === file || (a.dataset.f === 'admin-courses.html' && /admin-audience|admin-test-practice|course-editor|course-approval/.test(file))));
  }
  if (nav) {
    nav.addEventListener('click', (e) => {
      const b = e.target.closest('[data-role]'); if (!b) return;
      sessionStorage.setItem('lhRole', b.dataset.role); drawNav();
      frame.src = 'pages/admin-courses.html' + (b.dataset.role === 'creator' ? '?r=creator' : '?r=admin');
    });
    drawNav();
  }
})();
