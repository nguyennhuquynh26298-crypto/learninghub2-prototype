/* Report / Export modal — Learning Data Export 3.1–3.3 (LH2 Product Docs, Notion 18/11/2026).
 * Đợt 1: Admin L&D xuất 1 khoá / 1 file Excel. Mở từ menu dòng Course Management hoặc màn View Learners.
 * Bộ lọc: Section ("xuất theo session", BR-EXP-09) · Enrollment Date · Department · Learning Status. Estimated cập nhật ngay.
 * N = 0 → nút Export tắt (BR-EXP-02). Hơn 2.000 dòng → "Generating file…", đóng popup vẫn tạo tiếp.
 * open({ course, code, limited, depts, statuses, total, source, period }) — period ('yyyy-mm') từ Learning Report (Đợt 2) được
 * đổi thành khoảng Enrollment Date của tháng đó để giữ tương thích. */
(function () {
  const { ICON, Modal, Button, esc, toast } = LH; const D = LHData;
  const BASE = ['In Progress', 'Completed', 'Failed', 'Access Removed', 'Closed', 'Unenrolled'];
  const NOT_ENROLLED = 'Not Enrolled';
  const SHARE = { 'In Progress': 0.42, Completed: 0.31, Failed: 0.08, 'Access Removed': 0.04, Closed: 0, Unenrolled: 0.03, 'Not Enrolled': 0.12 };
  const DEPT = { QA: 0.3, 'QC Automation': 0.14, Development: 0.28, BA: 0.08, Design: 0.04, HR: 0.03, Sales: 0.08, 'L&D': 0.05 };
  const iso = (d) => d.split('/').reverse().join('-');
  let s;
  const reset = (o = {}) => {
    let from = '', to = '';
    if (o.period) { const [y, m] = o.period.split('-'); const last = new Date(+y, +m, 0).getDate(); from = `01/${m}/${y}`; to = `${last}/${m}/${y}`; }
    s = { course: o.course || D.course.title, code: o.code || D.course.code || 'CCAR-F', limited: !!o.limited, total: o.total || 148,
      sections: [], from, to, depts: (o.depts || []).slice(), statuses: (o.statuses || []).slice(), source: o.source || '' };
  };
  reset();
  const opts = () => (s.limited && !s.from && !s.to ? [...BASE, NOT_ENROLLED] : BASE);
  const dateErr = () => (s.from && s.to && iso(s.from) > iso(s.to) ? 'Start date must be before end date.' : '');
  function estimate() {
    const st = s.statuses.length ? s.statuses.filter((x) => opts().includes(x)) : opts();
    let n = s.total * st.reduce((a, x) => a + (SHARE[x] || 0), 0);
    if (s.depts.length) n *= s.depts.reduce((a, d) => a + (DEPT[d] || 0), 0);
    if (s.from || s.to) n *= 0.35;
    return Math.round(n);
  }
  const multi = (key, list, sel, allLabel) => `<div class="ex-multi" data-ex-multi="${key}">
      <label class="check"><input type="checkbox" data-ex-all="${key}" ${sel.length ? '' : 'checked'}>${esc(allLabel)}</label>
      ${list.map((v, k) => `<label class="check"><input type="checkbox" data-ex-v="${key}" value="${esc(String(key === 'sections' ? k : v))}" ${sel.includes(key === 'sections' ? k : v) ? 'checked' : ''}>${esc(key === 'sections' ? `Section ${k + 1}: ${v.name}` : v)}</label>`).join('')}</div>`;
  function body() {
    const n = estimate(), err = dateErr();
    const html = `<div class="stack gap-16">
      ${s.source ? `<div class="t-xs muted">Filters prefilled from ${esc(s.source)} · you can change them before exporting</div>` : ''}
      <div class="field"><span class="field__label">Course</span><div class="input" style="display:flex;align-items:center;background:var(--bg-subtle)">${esc(s.course)}</div></div>
      <div class="field"><span class="field__label">Section <span class="t-xs muted">· optional, default All (whole course)</span></span>${multi('sections', D.course.sessions, s.sections, 'All sections')}
        ${s.sections.length ? '<span class="t-xs muted">The Quizzes sheet only includes quizzes in the selected Sections. The Learners sheet adds "Progress in selected Sections (%)".</span>' : ''}</div>
      <div class="field"><span class="field__label">Enrollment Date <span class="t-xs muted">· optional</span></span>
        <div class="row gap-8"><input class="input" data-ex-from placeholder="dd/mm/yyyy" value="${esc(s.from)}" style="flex:1"><span class="muted">–</span><input class="input" data-ex-to placeholder="dd/mm/yyyy" value="${esc(s.to)}" style="flex:1"></div>
        ${err ? `<span class="field__error">${ICON.alert}${err}</span>` : s.limited && (s.from || s.to) ? '<span class="t-xs muted">With an Enrollment Date range, Not Enrolled learners are not included.</span>' : ''}</div>
      <div class="field"><span class="field__label">Department</span>${multi('depts', D.hr.departments, s.depts, 'All departments')}</div>
      <div class="field"><span class="field__label">Learning Status</span>${multi('statuses', opts(), s.statuses, 'All statuses')}</div>
      ${n === 0 ? `<div class="estimate" style="background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)">${ICON.alert}No learners match the selected filters.</div>`
        : `<div class="estimate">${ICON.users}<span class="grow">Estimated: <b>${n}</b> learners</span><span class="t-xs muted">.xlsx · sheets Learners, Quizzes, Info</span></div>`}
    </div>`;
    return { html, disabled: !!err || n === 0, n };
  }
  function paint() {
    const m = document.getElementById('m-export'); if (!m) return;
    const y = m.querySelector('.modal__body').scrollTop;
    const b = body(); m.querySelector('.modal__body').innerHTML = b.html; m.querySelector('.modal__body').scrollTop = y;
    const btn = m.querySelector('#ex-go'); btn.disabled = b.disabled; btn.dataset.n = b.n;
  }
  function open(o = {}) {
    reset(o);
    document.getElementById('m-export')?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({ id: 'm-export', size: 'md', icon: 'download', iconTone: 'info', title: 'Export Data',
      desc: 'Progress and exam results at the time of export. Practice results are not included.', body: '',
      foot: Button({ label: 'Cancel', variant: 'secondary', attrs: 'data-close' }) + Button({ label: 'Export', icon: 'download', attrs: 'id="ex-go"' }) }));
    paint();
  }
  const today = () => { const d = new Date(); return `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`; };
  document.addEventListener('click', (e) => {
    if (e.target.closest('#m-export [data-close]')) { document.getElementById('m-export')?.remove(); return; }
    const go = e.target.closest('#ex-go'); if (!go || go.disabled) return;
    const n = +go.dataset.n; const m = document.getElementById('m-export');
    const name = `${s.code}_${today()}.xlsx`;
    if (n > 2000 || s.total > 2000) {
      m.querySelector('.modal__body').innerHTML = `<div class="stack gap-12" style="align-items:center;padding:24px 0;text-align:center"><div class="progress" style="width:100%"><i style="width:60%"></i></div><b>Generating file…</b><span class="t-sm muted">You can close this popup. The file keeps generating and downloads when it's ready.</span></div>`;
      go.disabled = true;
      setTimeout(() => { document.getElementById('m-export')?.remove(); toast(`Exported ${n} learners · ${name}`); }, 1500);
    } else { m.remove(); toast(`Exported ${n} learners · ${name}`); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target; if (!t.closest || !t.closest('#m-export')) return;
    if (t.dataset.exAll) { s[t.dataset.exAll] = []; paint(); return; }
    if (t.dataset.exV) { const k = t.dataset.exV, v = k === 'sections' ? +t.value : t.value; s[k] = t.checked ? [...s[k], v] : s[k].filter((x) => x !== v); paint(); return; }
    if (t.matches('[data-ex-from]')) { s.from = t.value.trim(); paint(); }
    if (t.matches('[data-ex-to]')) { s.to = t.value.trim(); paint(); }
  });
  window.LHExport = { open };
})();
