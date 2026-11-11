/* Enroll / Limit modal — spec docs/specs/lh2/09-enroll-limit.md §3.1.
   Tối đa 2 khoá Đang học (BR-LRN-01). Không có Rời khoá: học viên phải hoàn thành khoá đang học để có suất mới. */
(function () {
  const { Modal, Button, Progress, esc, toast } = LH;
  const LIMIT = 2;

  function row(c) {
    return `<div class="enrolled-row"><span class="enrolled-row__thumb"></span><div class="enrolled-row__main">
      <span class="enrolled-row__title">${esc(c.title)}</span>
      <div class="row gap-8">${Progress(c.progress).replace('class="progress"', 'class="progress" style="flex:1"')}<span class="t-xs fw-600">${c.progress}%</span></div>
      <span class="t-xs muted">Học gần nhất: ${esc(c.last)}</span></div>
      ${Button({ label: 'Tiếp tục học', size: 'sm', attrs: 'onclick="location.href=\'test-start.html\'"' })}</div>`;
  }
  function open({ target, courses }) {
    const list = courses.filter((c) => !c.st || c.st === 'learning');
    document.getElementById('m-limit')?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({ id: 'm-limit', size: 'md', icon: 'alert', iconTone: 'warning',
      title: `Bạn đang học ${list.length}/${LIMIT} khoá`,
      desc: `Hoàn thành một khoá đang học để bắt đầu <b>${esc(target)}</b>.`,
      body: `<div class="stack gap-8">${list.map(row).join('')}</div>`,
      foot: Button({ label: 'Đóng', variant: 'secondary', attrs: 'data-close' }) }));
  }
  window.LHEnroll = { open, LIMIT, toast };
})();
