/* Enroll / Limit modal — Notion Enrollment BR-ENR-01.
   Tối đa 3 khoá tự chọn Đang học; khoá bắt buộc không tính (BR-ENR-10). Chữ theo Enrollment 3.1 (18/11). Không có Rời khoá: học viên phải hoàn thành khoá đang học để có suất mới. */
(function () {
  const { Modal, Button, Progress, esc, toast } = LH;
  const LIMIT = 3;

  function row(c) {
    return `<div class="enrolled-row"><span class="enrolled-row__thumb"></span><div class="enrolled-row__main">
      <span class="enrolled-row__title">${esc(c.title)}</span>
      <div class="row gap-8">${Progress(c.progress).replace('class="progress"', 'class="progress" style="flex:1"')}<span class="t-xs fw-600">${c.progress}%</span></div>
      </div>
      ${Button({ label: 'Continue Learning', size: 'sm', attrs: `onclick="location.href='${LH.App.mode ? LH.App.courseHref(c.title) : 'test-start.html'}'"` })}</div>`;
  }
  function open({ target, courses }) {
    const list = courses.filter((c) => (!c.st || c.st === 'learning') && c.title !== target).slice(0, LIMIT);
    document.getElementById('m-limit')?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({ id: 'm-limit', size: 'md', icon: 'alert', iconTone: 'warning',
      title: `You're taking ${LIMIT}/${LIMIT} elective courses`,
      desc: 'Complete a course to enroll in a new one. Mandatory courses don\'t count toward this limit.',
      body: `<div class="stack gap-8">${list.map(row).join('')}</div>`,
      foot: Button({ label: 'Close', variant: 'secondary', attrs: 'data-close' }) }));
  }
  window.LHEnroll = { open, LIMIT, toast };
})();
