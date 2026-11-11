/* Report / Export modal — spec docs/specs/lh2/05-export-learning-data.md §3.1
 * Variant: Scope = course | session ; State = default | empty | generating */
(function () {
  const { ICON, Modal, Button, esc, toast } = LH; const D = LHData;
  const STATUSES = ['Chưa bắt đầu', 'Đang học', 'Hoàn thành', 'Không đạt', 'Mất quyền'];
  const s = { scope: 'course', sessions: [], from: '', to: '', depts: [], statuses: STATUSES.slice() };

  function estimate() {
    let n = 148;
    if (s.depts.length) n = s.depts.includes('QA') ? 42 : s.depts.includes('QC Automation') ? 17 : 0;
    n = Math.round(n * s.statuses.length / STATUSES.length);
    if (s.scope === 'session' && !s.sessions.length) return null;
    return n;
  }
  function body() {
    const dateErr = s.from && s.to && s.from > s.to;
    const n = estimate();
    const sessErr = s.scope === 'session' && !s.sessions.length;
    const disabled = dateErr || sessErr || n === 0;
    const html = `<div class="stack gap-16">
      <div class="field"><span class="field__label">Khoá học</span><div class="input" style="display:flex;align-items:center;background:var(--bg-subtle)">${esc(D.course.title)}</div></div>
      <div class="field"><span class="field__label">Phạm vi<span class="req">*</span></span>
        <div class="choice-cards">
          <label class="choice-card ${s.scope === 'course' ? 'is-selected' : ''}" data-ex-scope="course"><input type="radio" ${s.scope === 'course' ? 'checked' : ''}><div><b>Toàn khoá</b><span>Tiến độ và bài thi của cả khoá.</span></div></label>
          <label class="choice-card ${s.scope === 'session' ? 'is-selected' : ''}" data-ex-scope="session"><input type="radio" ${s.scope === 'session' ? 'checked' : ''}><div><b>Theo session</b><span>Chỉ tính các session được chọn.</span></div></label>
        </div></div>
      ${s.scope === 'session' ? `<div class="field"><span class="field__label">Session<span class="req">*</span></span><div class="stack gap-8" style="max-height:180px;overflow:auto;border:1px solid var(--border-default);border-radius:8px;padding:10px 12px">
        ${D.course.sessions.map((x, k) => `<label class="check"><input type="checkbox" data-ex-sess="${k}" ${s.sessions.includes(k) ? 'checked' : ''}>${esc(x.name)}</label>`).join('')}</div>
        ${sessErr ? `<span class="field__error">${ICON.alert}Chọn ít nhất 1 session.</span>` : ''}</div>` : ''}
      <div class="row gap-12" style="align-items:flex-start">
        <div class="field grow"><span class="field__label">Thời gian enroll — từ</span><input class="input ${dateErr ? 'is-error' : ''}" type="date" data-ex-date="from" value="${s.from}"></div>
        <div class="field grow"><span class="field__label">đến</span><input class="input ${dateErr ? 'is-error' : ''}" type="date" data-ex-date="to" value="${s.to}"></div>
      </div>
      ${dateErr ? `<span class="field__error" style="margin-top:-10px">${ICON.alert}Ngày bắt đầu phải trước ngày kết thúc.</span>` : ''}
      <div class="field"><span class="field__label">Phòng ban</span><select class="input select" data-ex-dept><option value="">Tất cả phòng ban</option>${D.hr.departments.map((d) => `<option ${s.depts[0] === d ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
      <div class="field"><span class="field__label">Trạng thái học</span><div class="row gap-16" style="flex-wrap:wrap">${STATUSES.map((x) => `<label class="check"><input type="checkbox" data-ex-status="${x}" ${s.statuses.includes(x) ? 'checked' : ''}>${x}</label>`).join('')}</div></div>
      ${n === 0 ? `<div class="estimate" style="background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)">${ICON.alert}Không có học viên khớp bộ lọc.</div>`
        : `<div class="estimate">${ICON.users}<span class="grow">Dự kiến <b>${n ?? '—'}</b> học viên</span><span class="t-xs muted">File .xlsx · 3 sheet: Học viên, Bài thi, Thông tin</span></div>`}
    </div>`;
    return { html, disabled, n };
  }
  function paint() {
    const m = document.getElementById('m-export'); if (!m) return;
    const b = body();
    m.querySelector('.modal__body').innerHTML = b.html;
    const btn = m.querySelector('#ex-go'); btn.disabled = b.disabled; btn.dataset.n = b.n;
  }
  function open() {
    document.getElementById('m-export')?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({ id: 'm-export', size: 'md', icon: 'download', iconTone: 'info', title: 'Xuất dữ liệu học tập', desc: 'Tiến độ và kết quả bài thi tại thời điểm xuất. Không gồm kết quả luyện tập.', body: '',
      foot: Button({ label: 'Huỷ', variant: 'secondary', attrs: 'data-close' }) + Button({ label: 'Xuất file', icon: 'download', attrs: 'id="ex-go"' }) }));
    paint();
  }
  document.addEventListener('click', (e) => {
    const sc = e.target.closest('[data-ex-scope]'); if (sc) { e.preventDefault(); s.scope = sc.dataset.exScope; paint(); return; }
    const go = e.target.closest('#ex-go'); if (go && !go.disabled) {
      const n = +go.dataset.n; const m = document.getElementById('m-export');
      const name = `${D.course.code}_${s.scope === 'course' ? 'ToanKhoa' : 'Session'}_09112026.xlsx`;
      if (n > 40) {
        m.querySelector('.modal__body').innerHTML = `<div class="stack gap-12" style="align-items:center;padding:24px 0;text-align:center"><div class="progress" style="width:100%"><i style="width:60%"></i></div><b>Đang tạo file…</b><span class="t-sm muted">Bạn có thể đóng popup, file vẫn được tạo và sẽ báo khi xong.</span></div>`;
        go.disabled = true;
        setTimeout(() => { document.getElementById('m-export')?.remove(); toast(`Đã xuất ${n} học viên — ${name}`); }, 1500);
      } else { m.remove(); toast(`Đã xuất ${n} học viên — ${name}`); }
    }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.exSess !== undefined) { const k = +t.dataset.exSess; s.sessions = t.checked ? [...s.sessions, k] : s.sessions.filter((x) => x !== k); paint(); }
    else if (t.dataset.exDate) { s[t.dataset.exDate] = t.value; paint(); }
    else if (t.hasAttribute('data-ex-dept')) { s.depts = t.value ? [t.value] : []; paint(); }
    else if (t.dataset.exStatus) { const v = t.dataset.exStatus; s.statuses = t.checked ? [...s.statuses, v] : s.statuses.filter((x) => x !== v); paint(); }
  });
  window.LHExport = { open };
})();
