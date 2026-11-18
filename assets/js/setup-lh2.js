/* LH2 Đợt 1 · Setup khoá — tab Practice, tab Audience, popup soạn câu, popup Import, điều kiện Publish.
 * Nguồn: LH2 Product Docs (Notion) bản 18/11/2026 — Practice · Admin (3.1–3.4, BR-PQ), Course Audience (3.1–3.7, BR-AUD),
 *        Exam (3.6, 3.7, BR-EX-14…17), Course Information (3.3 Cannot publish yet, BR-CI-08).
 * Nạp sau components.js + data.js. course-editor.html gọi: LHSetup.init({ getExam, getTitle, getSections, editable, onChange })
 *   LHSetup.tabs()            → nhãn tab "Practice (n)"
 *   LHSetup.drawPractice(el) / drawAudience(el)
 *   LHSetup.publish({ title, sections, onDone }) → kiểm điều kiện → popup Cannot publish yet | popup xác nhận Scope + N learners
 *   LHSetup.questionModal({ bank, index, onSave }) · LHSetup.importModal({ bank, onImport }) — dùng chung đề thi và đề luyện tập */
(function () {
  const { ICON, esc, toast, Modal, AdminConfirm } = LH; const D = LHData;
  const KEYS = 'ABCD';
  const TYPE = { single: 'Single choice', multi: 'Multiple choice', tf: 'True / False' };
  const nq = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  let cfg = { getExam: () => [], getTitle: () => 'Course', editable: true, onChange: () => {} };

  /* ---------- Practice state ---------- */
  const sample = () => D.practiceQuestions.map((q) => ({ type: q.type, text: q.text, options: [...q.options], correct: [...q.correct], explain: q.explain || '' }));
  const P = { enabled: false, saved: [], draft: [], err: '', rowErr: {} };
  function seedPractice(kind) {
    P.saved = kind === 'empty' ? [] : sample();
    if (kind === 'dup') { const ex = cfg.getExam()[0]; if (ex) P.saved.push({ type: 'single', text: ex.text, options: ['A', 'B', 'C', 'D'], correct: [1], explain: '' }); }
    P.enabled = kind === 'on' || kind === 'dup';
    P.draft = P.saved.map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] }));
    P.savedEnabled = P.enabled; P.err = ''; P.rowErr = {};
  }
  const dirty = () => JSON.stringify(P.draft) !== JSON.stringify(P.saved) || P.enabled !== P.savedEnabled;

  /* BR-PQ-03: trùng hệt câu thi của khoá, hoặc trùng câu luyện tập khác */
  function dupErr(bank, text, self) {
    const t = nq(text); if (!t) return '';
    if (bank === 'practice') {
      const ex = cfg.getExam().find((x) => nq(x.text) === t);
      if (ex) return `Duplicate of question ${ex.n} in quiz "${ex.quiz}". Please write a different question.`;
      const k = P.draft.findIndex((x, i) => i !== self && nq(x.text) === t);
      if (k >= 0) return `Duplicate of practice question ${k + 1}.`;
    } else {
      const k = P.saved.findIndex((x) => nq(x.text) === t);
      if (k >= 0) return `Duplicate of practice question ${k + 1}. Please write a different question.`;
    }
    return '';
  }
  function rowErrors() { P.rowErr = {}; P.draft.forEach((q, i) => { const e = dupErr('practice', q.text, i); if (e) P.rowErr[i] = e; }); }

  function drawPractice(el) {
    rowErrors();
    const n = P.draft.length;
    const rows = P.draft.map((q, i) => `<div class="pq-row ${P.rowErr[i] ? 'is-err' : ''}">
        <span class="pq-row__n">${i + 1}</span>
        <div class="pq-row__main"><b>${esc(q.text)}</b>
          <span>${TYPE[q.type]} · ${q.options.length} options · Correct answer: ${q.correct.map((c) => KEYS[c]).join(', ')} · ${q.explain ? 'Explanation' : 'No explanation'}</span>
          ${P.rowErr[i] ? `<em>${ICON.alert}${esc(P.rowErr[i])}</em>` : ''}</div>
        ${cfg.editable ? `<span class="pq-row__acts"><button type="button" class="su-icon su-icon--edit" data-pq-edit="${i}" aria-label="Edit">${ICON.edit}</button><button type="button" class="su-icon su-icon--del" data-pq-del="${i}" aria-label="Delete">${ICON.trash}</button></span>` : ''}
      </div>`).join('');
    el.innerHTML = `<div class="adm-card su-panel lh2-tab">
      <div class="pq-switch">
        <label class="switch"><input type="checkbox" id="pq-on" ${P.enabled ? 'checked' : ''} ${cfg.editable ? '' : 'disabled'}><span class="switch__track"></span><span><b>Enable Practice for this course</b></span></label>
        <p class="adm-hint">Learners enrolled in this course see a Practice section on the course page. Practice questions must be different from the exam questions.</p>
        ${P.err ? `<p class="adm-err">${esc(P.err)}</p>` : ''}
      </div>
      <div class="pq-head"><h3>Practice questions <span>${n}</span></h3>
        ${cfg.editable ? `<span class="grow"></span><button type="button" class="btn-outline-sm" data-pq-import>${ICON.upload}Import Questions</button><button type="button" class="btn-cta btn-cta--soft btn-cta--sm" data-pq-add>${ICON.plus}Add Question</button>` : ''}</div>
      ${n ? `<div class="pq-list">${rows}</div>` : `<div class="pq-empty">${ICON.fileQ}<b>No practice questions yet</b><span>Add questions one by one or import your Excel file. No template needed.</span></div>`}
      ${cfg.editable ? `<div class="adm-btn-combo"><button type="button" class="btn-cta btn-cta--line" data-pq-cancel>Cancel</button><button type="button" class="btn-cta" data-pq-save>Save</button></div>` : ''}
    </div>`;
  }
  function savePractice() {
    rowErrors();
    const bad = Object.keys(P.rowErr).map((i) => +i + 1);
    if (bad.length) { toast(`${bad.length} question${bad.length > 1 ? 's have' : ' has'} errors (questions ${bad.join(', ')}). Not saved.`); return false; }
    if (P.enabled && !P.draft.length) { P.err = 'Add at least 1 practice question before enabling Practice.'; return false; } // BR-PQ-05, 10
    P.err = ''; P.saved = P.draft.map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] })); P.savedEnabled = P.enabled;
    toast(`Practice questions saved · ${P.saved.length} questions`); return true;
  }

  /* ---------- Popup soạn câu (Practice · Admin 3.2) — dùng chung đề thi ---------- */
  function questionModal({ bank = 'practice', q = null, index = -1, withScore = false, onSave }) {
    const v = q ? { ...q, options: [...q.options], correct: [...q.correct] } : { type: 'single', text: '', options: ['', '', '', ''], correct: [], explain: '', score: 1 };
    const id = 'm-pq';
    const optsHtml = () => v.options.map((o, i) => `<div class="opt-row">
        <input type="${v.type === 'multi' ? 'checkbox' : 'radio'}" name="pq-c" value="${i}" ${v.correct.includes(i) ? 'checked' : ''} aria-label="Correct answer ${KEYS[i]}">
        <span class="pq-key">${KEYS[i]}</span>
        <input class="adm-input" type="text" data-opt="${i}" value="${esc(o)}" maxlength="300" placeholder="Option ${KEYS[i]}" ${v.type === 'tf' ? 'readonly' : ''}>
        ${v.type === 'tf' || v.options.length <= 2 ? '<span></span>' : `<button type="button" class="icon-btn" data-opt-del="${i}" aria-label="Remove option">${ICON.x}</button>`}</div>`).join('');
    const body = () => `<div class="stack" style="display:flex;flex-direction:column;gap:14px">
      <div class="adm-field"><label>Question Content <span class="req">*</span></label>
        <textarea class="adm-input" id="pq-text" rows="3" maxlength="1000" placeholder="Enter question">${esc(v.text)}</textarea>
        <span class="adm-hint" id="pq-count">${v.text.length}/1000</span><p class="adm-err" id="pq-e-text"></p></div>
      <div class="cc-row"><div class="adm-field"><label>Question Type <span class="req">*</span></label>
        <select class="adm-input" id="pq-type">${Object.entries(TYPE).map(([k, t]) => `<option value="${k}" ${v.type === k ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
        ${withScore ? `<div class="adm-field"><label>Score (Points) <span class="req">*</span></label><input class="adm-input" id="pq-score" type="number" min="1" value="${v.score || 1}" style="max-width:120px"></div>` : ''}</div>
      <div class="adm-field"><span class="adm-label">Answer Option <span class="req">*</span> <span class="adm-hint">· tick the correct answer${v.type === 'multi' ? 's (at least 2)' : ''}</span></span>
        <div id="pq-opts">${optsHtml()}</div>
        ${v.type !== 'tf' && v.options.length < 4 ? '<button type="button" class="btn-link btn-link--blue" id="pq-add-opt" style="padding:0;align-self:flex-start">+ Add more Answer Option</button>' : ''}
        <p class="adm-err" id="pq-e-opt"></p></div>
      <div class="adm-field"><span class="adm-label">Explanation <span class="adm-hint">(optional)</span></span>
        <textarea class="adm-input" id="pq-explain" rows="2" maxlength="1000" placeholder="Why the correct answer is correct">${esc(v.explain || '')}</textarea></div></div>`;
    const title = (index >= 0 ? 'Edit Question' : 'Add Question') + (bank === 'practice' ? ' · Practice' : '');
    document.getElementById(id)?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({ id, size: 'lg', title, body: body(),
      foot: `<button type="button" class="btn-cta btn-cta--line" data-pq-x>Cancel</button>${index < 0 ? '<button type="button" class="btn-cta btn-cta--line" data-pq-ok="again">Save &amp; Add Another</button>' : ''}<button type="button" class="btn-cta" data-pq-ok="1">Save</button>` }));
    const m = document.getElementById(id);
    const read = () => { v.text = m.querySelector('#pq-text').value; v.explain = m.querySelector('#pq-explain').value; v.options = [...m.querySelectorAll('[data-opt]')].map((i) => i.value);
      v.correct = [...m.querySelectorAll('input[name="pq-c"]:checked')].map((i) => +i.value); if (withScore) v.score = +m.querySelector('#pq-score').value || 0; };
    const repaint = () => { m.querySelector('.modal__body').innerHTML = body(); };
    m.addEventListener('input', (e) => { if (e.target.id === 'pq-text') m.querySelector('#pq-count').textContent = `${e.target.value.length}/1000`; });
    m.addEventListener('change', (e) => {
      if (e.target.id !== 'pq-type') return; read(); const t = e.target.value;
      if (t === 'tf') { v.options = ['True', 'False']; v.correct = v.correct.slice(0, 1).filter((c) => c < 2); }
      else if (v.type === 'tf') { v.options = ['', '', '', '']; v.correct = []; }
      if (t !== 'multi' && v.correct.length > 1) v.correct = [v.correct[0]]; // Multiple → Single: giữ đáp án đúng đầu tiên
      v.type = t; repaint();
    });
    m.addEventListener('click', (e) => {
      if (e.target.closest('[data-pq-x]') || e.target.closest('[data-close]')) { m.remove(); return; }
      if (e.target === m) return; // bấm ra ngoài không đóng
      if (e.target.id === 'pq-add-opt') { read(); v.options.push(''); repaint(); return; }
      const od = e.target.closest('[data-opt-del]'); if (od) { read(); const k = +od.dataset.optDel; v.options.splice(k, 1); v.correct = v.correct.filter((c) => c !== k).map((c) => (c > k ? c - 1 : c)); repaint(); return; }
      const ok = e.target.closest('[data-pq-ok]'); if (!ok) return;
      read();
      const eT = [], eO = [];
      if (!v.text.trim()) eT.push('Please enter Question Content');
      const dup = dupErr(bank, v.text, index); if (dup) eT.push(dup);
      if (v.options.length < 2) eO.push('At least 2 answer options are required');
      v.options.forEach((o, i) => { if (!o.trim()) eO.push(`Option ${KEYS[i]} is empty. Enter content or remove it.`); });
      const seen = {}; v.options.forEach((o, i) => { const k = nq(o); if (!k) return; if (seen[k] != null) eO.push(`Options ${KEYS[seen[k]]} and ${KEYS[i]} are the same.`); else seen[k] = i; });
      if (!v.correct.length) eO.push('Please select the correct answer');
      else if (v.type === 'multi' && v.correct.length < 2) eO.push('Multiple choice needs at least 2 correct answers.');
      m.querySelector('#pq-e-text').textContent = eT.join(' '); m.querySelector('#pq-e-opt').textContent = eO.join(' ');
      if (eT.length || eO.length) return;
      const out = { type: v.type, text: v.text.trim().replace(/\s+/g, ' '), options: v.options.map((o) => o.trim()), correct: v.correct.sort(), explain: v.explain.trim(), score: v.score };
      const no = onSave(out);
      toast(`Question ${no} ${index >= 0 ? 'updated' : 'added'}`);
      if (ok.dataset.pqOk === 'again') questionModal({ bank, withScore, onSave }); else m.remove();
    });
  }

  /* ---------- Popup nhập từ file (Practice · Admin 3.3, BR-PQ-07, 08) — không có file mẫu, tự nhận cột ---------- */
  const DEMO_FILES = {
    good: { name: 'QA_Automation_questions.xlsx', note: 'Columns found: STT (ignored) · Nội dung câu hỏi · A · B · C · D · Đáp án · Giải thích' },
    word: { name: 'questions.docx', fileErr: 'Only Excel files (.xlsx, .xls) are supported.' },
    nohead: { name: 'bank_no_header.xlsx', fileErr: 'Column "Answer" not found. Add a header row and upload again.' },
    big: { name: 'full_bank_2025.xlsx', fileErr: 'This file has 236 questions, over the 200-question limit. Split it into several files.' },
  };
  function importRows(bank) {
    const ex = cfg.getExam()[0];
    const rows = [
      { row: 2, q: '1+1 bằng mấy?', type: 'single', opts: ['1', '2', '3'], ans: '2 → B', parsed: { type: 'single', text: '1+1 bằng mấy?', options: ['1', '2', '3'], correct: [1], explain: '' } },
      { row: 3, q: 'Unit test kiểm tra phạm vi nào?', type: 'single', opts: ['Một hàm / module', 'Cả hệ thống', 'Giao diện', 'Hạ tầng'], ans: 'a → A', parsed: { type: 'single', text: 'Unit test kiểm tra phạm vi nào?', options: ['Một hàm / module', 'Cả hệ thống', 'Giao diện', 'Hạ tầng'], correct: [0], explain: 'Unit test cô lập từng đơn vị nhỏ.' } },
      { row: 4, q: 'Trái đất tròn', type: 'tf', opts: ['True', 'False'], ans: 't → True', parsed: { type: 'tf', text: 'Trái đất tròn', options: ['True', 'False'], correct: [0], explain: '' } },
      { row: 5, q: 'Những công cụ nào dùng cho test tự động?', type: 'multi', opts: ['Playwright', 'Selenium', 'Figma', 'Cypress'], ans: 'A, B; D', parsed: { type: 'multi', text: 'Những công cụ nào dùng cho test tự động?', options: ['Playwright', 'Selenium', 'Figma', 'Cypress'], correct: [0, 1, 3], explain: '' } },
      { row: 6, q: 'Regression test chạy khi nào?', type: 'single', opts: ['Sau mỗi thay đổi', 'Chỉ khi release', 'Không bao giờ'], ans: '', err: 'Missing correct answer.' },
      { row: 7, q: 'Bug severity khác priority ở điểm nào?', type: 'single', opts: ['Mức ảnh hưởng vs thứ tự xử lý', 'Giống nhau'], ans: 'E', err: 'Answer "E" has no matching option.' },
    ];
    if (bank === 'practice' && ex) rows.push({ row: 8, q: ex.text, type: 'single', opts: ['…'], ans: 'B', err: `Duplicate of question ${ex.n} in quiz "${ex.quiz}". Please write a different question.` });
    rows.push({ row: 9, q: '1+1 bằng mấy?', type: 'single', opts: ['1', '2', '3'], ans: 'B', err: 'Duplicate of row 2 in this file.' });
    return rows;
  }
  function importModal({ bank = 'practice', onImport }) {
    const id = 'm-imp'; let file = null;
    const pick = `<div class="stack" style="display:flex;flex-direction:column;gap:12px">
      <p class="adm-hint">We read the first sheet: one question per row, the first row is the header. The correct answer must be in the Answer column.</p>
      <label class="dropzone" data-imp-pick="good"><span class="dropzone__ic">${ICON.upload}</span><b>Choose your Excel file</b><span>.xlsx or .xls · up to 5 MB · up to 200 questions · no template needed</span></label>
      <div class="imp-demo"><span class="adm-hint">Demo other files:</span>${Object.entries(DEMO_FILES).filter(([k]) => k !== 'good').map(([k, f]) => `<button type="button" class="btn-link btn-link--blue" data-imp-pick="${k}">${esc(f.name)}</button>`).join('')}</div>
      <p class="adm-err" id="imp-err"></p></div>`;
    const preview = () => {
      const rows = importRows(bank), ok = rows.filter((r) => !r.err).length;
      return { ok, rows, html: `<div class="stack" style="display:flex;flex-direction:column;gap:12px">
        <div class="imp-file">${ICON.sheet}<b>${esc(DEMO_FILES.good.name)}</b><span class="adm-hint">${DEMO_FILES.good.note}</span></div>
        <div class="imp-sum"><b>${ok} valid</b> · <b class="is-bad">${rows.length - ok} with errors</b> (will be skipped)</div>
        <div class="adm-scroll"><table class="imp-table"><thead><tr><th>Row</th><th>Question</th><th>Type</th><th>Options</th><th>Answer</th><th>Result</th></tr></thead><tbody>
        ${rows.map((r) => `<tr class="${r.err ? 'is-err' : ''}"><td>${r.row}</td><td>${esc(r.q)}</td><td>${TYPE[r.type]}</td><td>${r.opts.length}</td><td>${esc(r.ans || '—')}</td><td>${r.err ? `<span class="imp-bad">${esc(r.err)}</span>` : '<span class="imp-ok">Valid</span>'}</td></tr>`).join('')}
        </tbody></table></div></div>` };
    };
    document.getElementById(id)?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({ id, size: 'lg', title: 'Import Questions' + (bank === 'practice' ? ' · Practice' : ''), body: pick,
      foot: '<button type="button" class="btn-cta btn-cta--line" data-imp-x>Cancel</button>' }));
    const m = document.getElementById(id);
    m.addEventListener('click', (e) => {
      if (e.target.closest('[data-imp-x]') || e.target.closest('[data-close]')) { m.remove(); return; }
      const pk = e.target.closest('[data-imp-pick]'); if (pk) {
        e.preventDefault(); const f = DEMO_FILES[pk.dataset.impPick];
        if (f.fileErr) { m.querySelector('#imp-err').textContent = `${f.name}: ${f.fileErr}`; return; }
        file = preview();
        m.querySelector('.modal__body').innerHTML = file.html;
        m.querySelector('.modal__foot').innerHTML = `<button type="button" class="btn-cta btn-cta--line" data-imp-again>Choose Another File</button><button type="button" class="btn-cta" data-imp-go ${file.ok ? '' : 'disabled'}>Import ${file.ok} Valid Questions</button>`;
        return;
      }
      if (e.target.closest('[data-imp-again]')) { m.querySelector('.modal__body').innerHTML = pick; m.querySelector('.modal__foot').innerHTML = '<button type="button" class="btn-cta btn-cta--line" data-imp-x>Cancel</button>'; return; }
      if (e.target.closest('[data-imp-go]') && file) {
        const add = file.rows.filter((r) => !r.err).map((r) => r.parsed);
        const [a, b] = onImport(add);
        m.remove(); toast(`${add.length} questions imported (questions ${a}–${b})`);
      }
    });
  }

  /* ---------- Audience (Course Audience 3.1–3.4, 3.7) ---------- */
  const PEOPLE = [
    ['Trần Minh Anh', 'QA', 'In Progress'], ['Lê Hoàng Nam', 'QC Automation', 'Completed'], ['Phạm Thu Trang', 'QA', 'Not Enrolled'],
    ['Đỗ Quang Huy', 'Development', 'In Progress'], ['Vũ Ngọc Lan', 'QA', 'Failed'], ['Ngô Đức Thịnh', 'QC Automation', 'Not Enrolled'],
    ['Hoàng Thu Hà', 'QA', 'In Progress'], ['Bùi Văn Khoa', 'QC Automation', 'Unenrolled'],
  ].map(([name, dept, status]) => { const s = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().split(' '); return { name, dept, status, email: `${s.slice(-1)[0]}.${s.slice(0, -1).join('')}@techvify.com.vn` }; });
  const DEPT_SIZE = { QA: 18, 'QC Automation': 9, Development: 42, BA: 11, Design: 6, HR: 5, Sales: 14, 'L&D': 4 };
  const COMPANY = 412;
  const A = { scope: 'all', depts: [], indiv: [], mandatory: false, start: '', end: '', invite: false, notify: false, excluded: [], q: '', err: {}, saved: null, published: true };
  const snap = () => JSON.stringify({ scope: A.scope, depts: A.depts, indiv: A.indiv, mandatory: A.mandatory, start: A.start, end: A.end, excluded: A.excluded });
  function seedAudience(kind) {
    Object.assign(A, { scope: 'all', depts: [], indiv: [], mandatory: false, start: '', end: '', invite: false, notify: false, excluded: [], q: '', err: {} });
    if (kind === 'restricted') Object.assign(A, { scope: 'restricted', depts: ['QA', 'QC Automation'], indiv: ['Đỗ Quang Huy'], start: '10/11/2026', end: '30/11/2026', excluded: [{ name: 'Bùi Thanh Tùng', dept: 'QA', email: 'tung.buithanh@techvify.com.vn' }] });
    if (kind === 'mandatory') Object.assign(A, { scope: 'restricted', depts: ['QA'], mandatory: true, start: '10/11/2026', end: '30/11/2026' });
    if (kind === 'empty') Object.assign(A, { scope: 'restricted' });
    A.saved = snap();
  }
  const count = () => (A.scope === 'all' ? COMPANY : A.depts.reduce((a, d) => a + (DEPT_SIZE[d] || 0), 0) + A.indiv.filter((n) => !PEOPLE.find((p) => p.name === n && A.depts.includes(p.dept))).length) - A.excluded.length;
  const learners = () => PEOPLE.filter((p) => !A.excluded.find((x) => x.name === p.name) && (A.scope === 'all' || A.depts.includes(p.dept) || A.indiv.includes(p.name)))
    .map((p) => ({ ...p, source: A.scope === 'all' ? 'All Company' : A.depts.includes(p.dept) ? `Department: ${p.dept}` : 'Individual' }));
  const parseD = (s) => { const m = String(s).match(/^(\d{2})\/(\d{2})\/(\d{4})$/); return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null; };
  const ST_TONE = { 'In Progress': 'info', Completed: 'published', Failed: 'pending', 'Not Enrolled': 'neutral', 'Access Removed': 'draft', Unenrolled: 'neutral', Closed: 'neutral' };

  function drawAudience(el) {
    const ro = cfg.editable ? '' : 'disabled';
    const n = count(), list = learners().filter((p) => !A.q || LH.norm(p.name + ' ' + p.email).includes(LH.norm(A.q)));
    const chips = (arr, key) => arr.map((v) => `<span class="aud-chip">${esc(v)}${cfg.editable ? `<button type="button" data-aud-rm="${key}:${esc(v)}" aria-label="Remove">${ICON.x}</button>` : ''}</span>`).join('');
    el.innerHTML = `<div class="adm-card su-panel lh2-tab aud">
      <section class="aud-block"><h3>Scope</h3>
        <div class="aud-scope">
          <label class="aud-opt ${A.scope === 'all' ? 'is-on' : ''}"><input type="radio" name="aud-scope" value="all" ${A.scope === 'all' ? 'checked' : ''} ${ro}><span><b>All Company</b><small>All employees can see and enroll in this course.</small></span></label>
          <label class="aud-opt ${A.scope === 'restricted' ? 'is-on' : ''}"><input type="radio" name="aud-scope" value="restricted" ${A.scope === 'restricted' ? 'checked' : ''} ${ro}><span><b>Restricted</b><small>Only selected departments and individuals.</small></span></label>
        </div>
        ${A.scope === 'restricted' ? `<div class="cc-row aud-pick">
          <div class="adm-field"><label>Departments</label><select class="adm-input" id="aud-dept" ${ro}><option value="">Search and add department…</option>${D.hr.departments.filter((d) => !A.depts.includes(d)).map((d) => `<option>${esc(d)}</option>`).join('')}</select><div class="aud-chips">${chips(A.depts, 'd')}</div></div>
          <div class="adm-field"><label>Individuals</label><select class="adm-input" id="aud-ind" ${ro}><option value="">Search by name, email or employee ID…</option>${PEOPLE.map((p) => p.name).filter((x) => !A.indiv.includes(x)).map((x) => `<option>${esc(x)}</option>`).join('')}</select><div class="aud-chips">${chips(A.indiv, 'i')}</div></div>
        </div>${A.err.scope ? `<p class="adm-err">${A.err.scope}</p>` : ''}` : ''}
        <label class="check aud-mand"><input type="checkbox" id="aud-mand" ${A.mandatory ? 'checked' : ''} ${ro}><span><b>Mandatory Course</b><small>${A.scope === 'all' ? 'Mandatory for all employees.' : 'Mandatory for the selected departments and individuals.'} It doesn't count toward their 3 elective courses.</small></span></label>
        <div class="aud-count">${ICON.users}<b>${Math.max(0, n)} learners</b></div>
      </section>
      <section class="aud-block"><h3>Schedule</h3>
        <div class="cc-row"><div class="adm-field"><label>Start Date</label><input class="adm-input" id="aud-start" placeholder="dd/mm/yyyy" value="${esc(A.start)}" ${ro}><span class="adm-hint">Empty → learners can enroll right away.</span></div>
          <div class="adm-field"><label>End Date</label><input class="adm-input" id="aud-end" placeholder="dd/mm/yyyy" value="${esc(A.end)}" ${ro}><span class="adm-hint">Empty → no deadline. After End Date, unfinished learners are marked Overdue.</span>${A.err.end ? `<p class="adm-err">${A.err.end}</p>` : ''}</div></div>
        ${A.saved && JSON.parse(A.saved).start && (A.start !== JSON.parse(A.saved).start || A.end !== JSON.parse(A.saved).end) ? `<label class="check"><input type="checkbox" id="aud-notify" ${A.notify ? 'checked' : ''}><span>Notify learners of schedule change</span></label>` : ''}
      </section>
      <section class="aud-block"><div class="aud-lh"><h3>Learners <span>${list.length}</span></h3><span class="grow"></span><label class="adm-inline-search"><input id="aud-q" placeholder="Search by name or email" value="${esc(A.q)}"><span>${ICON.search}</span></label></div>
        <div class="adm-scroll"><table class="adm-table"><thead><tr><th>Full Name</th><th>Email</th><th>Department</th><th>Source</th><th>Learning Status</th><th></th></tr></thead><tbody>
        ${list.map((p) => `<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.email)}</td><td>${esc(p.dept)}</td><td>${esc(p.source)}</td><td>${LH.Tag(p.status, ST_TONE[p.status] || 'neutral')}</td><td class="t-act">${cfg.editable && A.scope === 'restricted' ? `<button type="button" class="btn-link btn-link--danger" data-aud-remove="${esc(p.name)}">Remove</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="6"><div class="empty" style="border:0">No learners yet</div></td></tr>'}
        </tbody></table></div>
        <details class="aud-ex" ${A.excluded.length ? 'open' : ''}><summary>Excluded <span>${A.excluded.length}</span></summary>
          ${A.excluded.length ? A.excluded.map((p) => `<div class="aud-ex__row"><b>${esc(p.name)}</b><span>${esc(p.email)} · ${esc(p.dept)}</span><span class="grow"></span>${cfg.editable ? `<button type="button" class="btn-outline-sm" data-aud-readd="${esc(p.name)}">Re-add</button>` : ''}</div>`).join('') : '<p class="adm-hint">No one is excluded. Excluded learners lose access even if their department is selected.</p>'}
        </details>
      </section>
      ${cfg.editable ? `<div class="adm-btn-combo aud-foot"><label class="check"><input type="checkbox" id="aud-invite" ${A.invite ? 'checked' : ''}><span>Send invitation email</span></label><span class="grow"></span><button type="button" class="btn-cta btn-cta--line" data-aud-cancel>Cancel</button><button type="button" class="btn-cta" data-aud-save>Save</button></div>` : ''}
    </div>`;
  }
  function validateAudience() {
    A.err = {};
    if (A.scope === 'restricted' && !A.depts.length && !A.indiv.length) A.err.scope = 'Please select at least one department or individual.';
    const s = parseD(A.start), e = parseD(A.end);
    if (A.end && s && e && e < s) A.err.end = 'End Date must be on or after Start Date.';
    else if (A.end && e && A.end !== JSON.parse(A.saved).end && e < new Date(2026, 10, 18)) A.err.end = 'End Date cannot be in the past.';
    return !Object.keys(A.err).length;
  }
  function saveAudience(el) {
    if (!validateAudience()) { drawAudience(el); return; }
    const before = JSON.parse(A.saved);
    /* Lần lưu làm người đã đăng ký mất quyền → hỏi xác nhận kèm số người (BR-AUD-05) */
    const lost = before.scope === 'all' && A.scope === 'restricted' ? 23 : before.depts.filter((d) => !A.depts.includes(d)).length * 4 + before.indiv.filter((x) => !A.indiv.includes(x)).length;
    const done = () => { A.saved = snap(); drawAudience(el); toast(`Audience updated · ${count()} learners${A.invite ? ' · invitation emails sent to new learners' : ''}`); A.invite = false; };
    if (lost > 0 && A.published) AdminConfirm({ cancel: 'Cancel', title: 'Save audience?', text: `${lost} enrolled learners will lose access to this course. Their progress is kept. Continue?`, ok: 'Continue', danger: true, onOk: done });
    else done();
  }

  /* ---------- Publish — Course Information 3.3 (BR-CI-08) + Course Audience 3.7 (BR-AUD-09) ---------- */
  function publish({ title, sections, basicOk = true, onDone }) {
    const miss = [];
    if (!basicOk) miss.push(['Course information is incomplete: Category.', 'basic']);
    if (!sections.length) miss.push(['Add at least 1 Section.', 'details']);
    sections.forEach((s) => {
      if (!s.lessons.length) miss.push([`Section "${s.name}" has no lessons.`, 'details']);
      s.lessons.forEach((l) => {
        if (l.type === 'lecture' && !l.content) miss.push([`Lecture "${l.name}" has no content.`, 'details']);
        if (l.type === 'quiz' && !(l.questions || []).length) miss.push([`Quiz "${l.name}" has no questions.`, 'details']);
      });
    });
    if (P.savedEnabled && !P.saved.length) miss.push(['Practice is enabled but has no questions.', 'practice']);
    if (A.scope === 'restricted' && !A.depts.length && !A.indiv.length) miss.push(['Audience is Restricted but no department or individual is selected.', 'audience']);
    if (miss.length) {
      document.getElementById('m-cant')?.remove();
      document.body.insertAdjacentHTML('beforeend', Modal({ id: 'm-cant', size: 'md', icon: 'alert', iconTone: 'warning', title: 'Cannot publish yet', desc: 'Fix these items, then publish again. Click an item to go there.',
        body: `<ul class="cant-list">${miss.map(([t, tab]) => `<li><button type="button" data-cant-go="${tab}">${ICON.chevronR}${esc(t)}</button></li>`).join('')}</ul>`,
        foot: '<button type="button" class="btn-cta" data-close>OK</button>' }));
      return;
    }
    const scope = A.scope === 'all' ? 'All Company' : 'Restricted';
    document.getElementById('m-pub')?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({ id: 'm-pub', size: 'sm', icon: 'globe', title: 'Publish course?',
      body: `<p class="t-sm">Publish "<b>${esc(title)}</b>" to <b>${scope}</b> · <b>${count()} learners</b>.</p>${A.scope === 'all' ? '<p class="t-sm muted">All employees can see and enroll in this course.</p>' : ''}`,
      foot: '<button type="button" class="btn-cta btn-cta--line" data-cant-go="audience">Review Audience</button><button type="button" class="btn-cta" data-pub-ok>Publish</button>' }));
    document.getElementById('m-pub').addEventListener('click', (e) => { if (e.target.closest('[data-pub-ok]')) { document.getElementById('m-pub').remove(); A.published = true; onDone(); } });
  }

  /* ---------- Events ---------- */
  let host = null, which = null;
  const redraw = () => { if (!host) return; which === 'practice' ? drawPractice(host) : drawAudience(host); cfg.onChange(); };
  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-cant-go]'); if (go) { document.querySelectorAll('#m-cant,#m-pub').forEach((m) => m.remove()); cfg.goTab && cfg.goTab(go.dataset.cantGo); return; }
    if (!host || !host.contains(e.target)) return;
    /* Practice */
    if (e.target.closest('[data-pq-add]')) { questionModal({ bank: 'practice', onSave: (q) => { P.draft.push(q); redraw(); return P.draft.length; } }); return; }
    const ed = e.target.closest('[data-pq-edit]'); if (ed) { const i = +ed.dataset.pqEdit; questionModal({ bank: 'practice', q: P.draft[i], index: i, onSave: (q) => { P.draft[i] = q; redraw(); return i + 1; } }); return; }
    const dl = e.target.closest('[data-pq-del]'); if (dl) { const i = +dl.dataset.pqDel; AdminConfirm({ cancel: 'Cancel', title: `Delete question ${i + 1}?`, ok: 'Delete', danger: true, onOk: () => { P.draft.splice(i, 1); redraw(); } }); return; }
    if (e.target.closest('[data-pq-import]')) { importModal({ bank: 'practice', onImport: (qs) => { const a = P.draft.length + 1; P.draft.push(...qs); redraw(); return [a, P.draft.length]; } }); return; }
    if (e.target.closest('[data-pq-save]')) { savePractice(); redraw(); return; }
    if (e.target.closest('[data-pq-cancel]')) { if (!dirty()) return; AdminConfirm({ cancel: 'Cancel', title: 'Discard unsaved changes?', ok: 'Discard', danger: true, onOk: () => { P.draft = P.saved.map((q) => ({ ...q })); P.enabled = P.savedEnabled; P.err = ''; redraw(); } }); return; }
    /* Audience */
    const rm = e.target.closest('[data-aud-rm]'); if (rm) { const [k, v] = rm.dataset.audRm.split(/:(.*)/s); if (k === 'd') A.depts = A.depts.filter((x) => x !== v); else A.indiv = A.indiv.filter((x) => x !== v); redraw(); return; }
    const rv = e.target.closest('[data-aud-remove]'); if (rv) { const name = rv.dataset.audRemove; AdminConfirm({ cancel: 'Cancel', title: 'Remove learner?', text: `Remove ${name} from this course? They will lose access immediately; their progress is kept.`, ok: 'Remove', danger: true, onOk: () => { const p = PEOPLE.find((x) => x.name === name); A.excluded.push({ name, dept: p.dept, email: p.email }); A.saved = snap(); redraw(); toast(`${name} removed · Access Removed`); } }); return; }
    const ra = e.target.closest('[data-aud-readd]'); if (ra) { A.excluded = A.excluded.filter((x) => x.name !== ra.dataset.audReadd); A.saved = snap(); redraw(); toast(`${ra.dataset.audReadd} re-added`); return; }
    if (e.target.closest('[data-aud-save]')) { saveAudience(host); cfg.onChange(); return; }
    if (e.target.closest('[data-aud-cancel]')) { if (snap() === A.saved) return; AdminConfirm({ cancel: 'Cancel', title: 'Discard unsaved changes?', ok: 'Discard', danger: true, onOk: () => { Object.assign(A, JSON.parse(A.saved)); A.err = {}; redraw(); } }); return; }
  });
  document.addEventListener('change', (e) => {
    if (!host || !host.contains(e.target)) return;
    const t = e.target;
    if (t.id === 'pq-on') { P.enabled = t.checked; P.err = P.enabled && !P.draft.length ? 'Add at least 1 practice question before enabling Practice.' : ''; redraw(); }
    if (t.name === 'aud-scope') {
      if (t.value === 'all' && A.scope === 'restricted' && (A.depts.length || A.indiv.length)) {
        AdminConfirm({ cancel: 'Cancel', title: 'Change to All Company?', text: 'All employees will be able to see and enroll. Your selected departments and individuals are kept but not applied.', ok: 'Change', onOk: () => { A.scope = 'all'; redraw(); } });
        t.checked = false; host.querySelector('input[name="aud-scope"][value="restricted"]').checked = true; return;
      }
      A.scope = t.value; A.err = {}; redraw();
    }
    if (t.id === 'aud-dept' && t.value) { A.depts.push(t.value); A.err = {}; redraw(); }
    if (t.id === 'aud-ind' && t.value) { A.indiv.push(t.value); A.err = {}; redraw(); }
    if (t.id === 'aud-mand') { A.mandatory = t.checked; redraw(); }
    if (t.id === 'aud-start') { A.start = t.value.trim(); redraw(); }
    if (t.id === 'aud-end') { A.end = t.value.trim(); validateAudience(); redraw(); }
    if (t.id === 'aud-invite') A.invite = t.checked;
    if (t.id === 'aud-notify') A.notify = t.checked;
  });
  document.addEventListener('input', (e) => { if (host && e.target.id === 'aud-q') { A.q = e.target.value; const pos = e.target.selectionStart; drawAudience(host); const q = document.getElementById('aud-q'); q.focus(); q.setSelectionRange(pos, pos); } });

  window.LHSetup = {
    init(c) { cfg = { ...cfg, ...c }; },
    seedPractice, seedAudience,
    practiceCount: () => P.saved.length,
    practiceText: () => P.saved.map((q) => q.text),
    dupErr,
    tabs: () => ({ practice: `Practice (${P.saved.length})`, audience: 'Audience' }),
    drawPractice(el) { host = el; which = 'practice'; drawPractice(el); },
    drawAudience(el) { host = el; which = 'audience'; drawAudience(el); },
    release() { host = null; which = null; },
    questionModal, importModal, publish,
    audience: A,
  };
})();
