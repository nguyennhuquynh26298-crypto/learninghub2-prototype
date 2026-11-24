/* LH2 Đợt 1 · Setup khoá — tab Practice, tab Audience, popup soạn câu, popup Import, điều kiện Publish.
 * Nguồn: LH2 Product Docs (Notion) bản 18/11/2026 — Practice · Admin (3.1–3.4, BR-PQ), Course Audience (3.1–3.7, BR-AUD),
 *        Exam (3.6, 3.7, BR-EX-14…17), Course Information (3.3 Cannot publish yet, BR-CI-08).
 * Nạp sau components.js + data.js. course-editor.html gọi: LHSetup.init({ getExam, getTitle, getSections, editable, onChange })
 *   LHSetup.tabs()            → { audience }; Practice là khối trên Details (không tab)
 *   LHSetup.drawPractice(el) / drawAudience(el)
 *   LHSetup.publish({ title, sections, onDone }) → kiểm điều kiện → popup Cannot publish yet | popup xác nhận Scope + N learners
 *   LHSetup.openQuestionEditor / consumeQuestionResult — page con soạn câu (Docs §3.3)
 *   LHSetup.importModal({ bank, onImport }) — Import Excel vẫn popup (§3.4)
 *   LHSetup.questionModal — giữ tương thích; ưu tiên openQuestionEditor */
(function () {
  const { ICON, esc, toast, Modal, AdminConfirm } = LH; const D = LHData;
  const KEYS = 'ABCD';
  const TYPE = { single: 'Single Choice', multi: 'Multiple Choice', tf: 'True / False' }; // chữ như web
  const Q_STORE = 'lh2-q-editor';
  const Q_RESULT = 'lh2-q-editor-result';
  const nq = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  let cfg = { getExam: () => [], getTitle: () => 'Course', editable: true, onChange: () => {} };

  /* ---------- Practice state ---------- */
  const sample = () => D.practiceQuestions.map((q) => ({ type: q.type, text: q.text, options: [...q.options], correct: [...q.correct], explain: q.explain || '' }));
  const P = { enabled: false, saved: [], draft: [], err: '', rowErr: {} };
  const P_MAX = 500; // BR-PQ-14
  function seedPractice(kind) {
    P.saved = kind === 'empty' ? [] : sample();
    if (kind === 'dup') { const ex = cfg.getExam()[0]; if (ex) P.saved.push({ type: 'single', text: ex.text, options: ['A', 'B', 'C', 'D'], correct: [1], explain: '' }); }
    /* Demo BR-PQ-14: đề gần đầy (498 câu) để thử giới hạn 500 */
    if (kind === 'full') for (let k = P.saved.length; k < P_MAX - 2; k++) P.saved.push({ type: 'single', text: `Practice question ${k + 1}: sample content for the 500-question limit demo`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: [k % 4], explain: '' });
    P.enabled = kind === 'on' || kind === 'dup' || kind === 'full';
    P.draft = P.saved.map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] }));
    P.savedEnabled = P.enabled; P.err = ''; P.rowErr = {};
  }
  const dirty = () => JSON.stringify(P.draft) !== JSON.stringify(P.saved) || P.enabled !== P.savedEnabled;
  /* Kho đề luyện tập dùng chung giữa Setup ↔ màn Practice Questions ↔ trang soạn câu (đề xuất 19/11: lưu ngay từng thao tác) */
  const P_STORE = 'lh2-practice-bank';
  function readPracticeStore() { try { return JSON.parse(sessionStorage.getItem(P_STORE) || 'null'); } catch (_) { return null; } }
  function writePracticeStore(extra = {}) {
    const cur = readPracticeStore() || {};
    const next = { ...cur, ...extra };
    if (!('questions' in extra)) next.questions = Array.isArray(cur.questions) ? cur.questions : P.saved.map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] })); // lưu đề thi không được đụng đề Practice
    if (!('enabled' in extra)) next.enabled = 'enabled' in cur ? !!cur.enabled : !!P.savedEnabled; // màn danh sách không đổi cờ bật / tắt
    sessionStorage.setItem(P_STORE, JSON.stringify(next));
    return next;
  }
  function restorePractice(s) {
    if (!s) return;
    P.saved = (s.questions || []).map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] }));
    P.draft = P.saved.map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] }));
    P.enabled = P.savedEnabled = !!s.enabled; P.err = ''; P.rowErr = {};
  }

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

  /* ---------- Dòng câu hỏi — kế thừa web (QuestionList): nội dung · loại câu · điểm (chỉ đề thi) · sửa · xoá.
   * LH2 thêm: số thứ tự (để câu báo trùng chỉ đúng câu) + dòng lỗi đỏ khi trùng (BR-PQ-03). Dùng chung cho Quiz và tab Practice.
   * ns: 'p' (Practice) | 'si:li' (Quiz) → nút data-qr-edit / data-qr-del = "ns|i" */
  function questionRows({ list = [], ns, withScore = false, errOf = () => '', editable = true, fresh = new Set() } = {}) {
    return `<div class="qr-list">${list.map((q, i) => { const err = errOf(q, i); const pt = +q.score || 1; return `<div class="qr ${err ? 'is-err' : ''} ${fresh.has(i) ? 'is-new' : ''}" id="qr-${String(ns).replace(':', '-')}-${i}">
        <span class="qr__n">${i + 1}</span>
        <div class="qr__main"><div class="qr__line"><span class="qr__q" title="${esc(q.text)}">${esc(q.text)}</span><span class="qr__type">${TYPE[q.type] || TYPE.single}</span>${withScore ? `<span class="qr__pt">${pt} point${pt > 1 ? 's' : ''}</span>` : ''}</div>
          ${err ? `<div class="qr__err">${ICON.alert}<span>${esc(err)}</span></div>` : ''}</div>
        ${editable ? `<span class="qr__acts"><button type="button" data-qr-edit="${ns}|${i}" title="Edit" aria-label="Edit question ${i + 1}">${ICON.edit}</button><button type="button" class="is-del" data-qr-del="${ns}|${i}" title="Delete" aria-label="Delete question ${i + 1}">${ICON.trash}</button></span>` : ''}
      </div>`; }).join('')}${editable && list.length ? `<button type="button" class="qr-add" data-qr-add="${ns}">${ICON.plus}Add Question</button>` : ''}</div>`;
  }

  /* ---------- Form câu hỏi ngay tại chỗ — kế thừa web (QuestionForm hiện dưới dòng Quiz, không mở trang khác).
   * Thứ tự trường như web: Question Type · Question Content · Score (0.5 / 1, chỉ đề thi) · Answer Option (tối đa 4) · Explanation (optional) · Cancel / Save.
   * Mỗi lần 1 câu, Save là lưu ngay. Luật chung D-152: Save tắt tới khi đủ trường bắt buộc; field trống báo đỏ khi rời field.
   * key: 'p' (tab Practice) | 'si:li' (Quiz). index -1 = thêm mới. */
  const QF = { key: null, index: -1, v: null, withScore: false, bank: 'practice', touched: {}, err: {}, onSave: null, onClose: null };
  function qfOpen(key, { index = -1, q = null, withScore = false, bank = 'practice', type = null, onSave, onClose } = {}) {
    const v = cloneQ(q || blankQuestion(withScore));
    /* D-187: Save & Add Another mở câu mới giữ loại câu vừa chọn */
    if (!q && type) { v.type = type; if (type === 'tf') v.options = ['True', 'False']; }
    if (withScore) v.score = [0.5, 1].includes(+v.score) ? +v.score : 1; else delete v.score;
    Object.assign(QF, { key, index, v, withScore, bank, touched: {}, err: {}, onSave, onClose, init: JSON.stringify(v) });
  }
  function qfClose() { const cb = QF.onClose; Object.assign(QF, { key: null, index: -1, v: null, onSave: null, onClose: null }); cb && cb(); }
  const qfIs = (key) => QF.key === key;
  const qfReady = () => { const v = QF.v; return !!v && !!v.text.trim() && v.text.length <= 1000 && v.options.length >= 2 && v.options.every((o) => o.trim()) && v.correct.length >= (v.type === 'multi' ? 2 : 1); };
  const qfHasInput = () => !!QF.v && JSON.stringify(QF.v) !== QF.init; // đã đổi so với lúc mở form
  function qfHtml() {
    const v = QF.v, ws = QF.withScore, t = QF.touched, e = QF.err;
    const textErr = e.text || (t.text && !v.text.trim() ? 'Please enter Question Content' : '');
    const optErr = e.opt || '';
    const opts = v.options.map((o, i) => `<div class="qf-opt">
        <input type="${v.type === 'multi' ? 'checkbox' : 'radio'}" name="qf-c" value="${i}" ${v.correct.includes(i) ? 'checked' : ''} aria-label="Mark option ${KEYS[i]} as correct">
        <span class="pq-key">${KEYS[i]}</span>
        <input class="adm-input ${t['o' + i] && !o.trim() ? 'is-req-err' : ''}" data-qf-opt="${i}" value="${esc(o)}" maxlength="300" placeholder="Option ${KEYS[i]}" ${v.type === 'tf' ? 'readonly' : ''}>
        ${v.type === 'tf' ? '' : `<button type="button" class="su-icon su-icon--del" data-qf-optdel="${i}" aria-label="Remove option ${KEYS[i]}" ${v.options.length <= 2 ? 'disabled' : ''}>${ICON.trash}</button>`}</div>`).join('');
    const addDis = v.type === 'tf' || v.options.length >= 4;
    return `<div class="qf" id="qf">
      <div class="qf__head"><b>${QF.key === 'p' ? (QF.index >= 0 ? `Edit Practice Question ${QF.index + 1}` : 'New Practice Question') : 'Question'}</b><span class="qf__pill">${TYPE[v.type]}</span>${ws ? `<span class="qf__pt">${v.score} point${v.score > 1 ? 's' : ''}</span>` : ''}</div>
      <div class="adm-field"><label for="qf-type">Question Type</label><select class="adm-input" id="qf-type">${Object.entries(TYPE).map(([k, l]) => `<option value="${k}" ${v.type === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="adm-field qf-rte ${textErr ? 'is-err' : ''}"><label for="qf-text">Question Content <span class="req">*</span></label>${LH.Richbox({ ph: 'Enter question content', html: v.html != null ? v.html : esc(v.text), bodyAttrs: 'id="qf-text"' })}<span class="adm-hint qf-count ${v.text.length > 1000 ? 'is-over' : ''}" id="qf-count">${v.text.length}/1000</span>${textErr ? `<p class="adm-err">${esc(textErr)}</p>` : ''}</div>
      ${ws ? `<div class="adm-field qf-score"><label for="qf-score">Score (Points)</label><select class="adm-input" id="qf-score">${[0.5, 1].map((n) => `<option value="${n}" ${+v.score === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>` : ''}
      <div class="adm-field"><span class="adm-label">Answer Option <span class="req">*</span></span>
        ${opts ? `<div class="qf-opts">${opts}</div>` : ''}
        ${addDis ? '' : '<button type="button" class="qf-addopt" data-qf-addopt>+ Add more Answer Option</button>'}
        ${optErr ? `<p class="adm-err">${esc(optErr)}</p>` : ''}</div>
      <div class="adm-field qf-rte"><label for="qf-explain">Explanation (optional)</label>${LH.Richbox({ ph: 'Explain why the correct answer is correct. Shown to learners after they answer.', html: v.explainHtml != null ? v.explainHtml : esc(v.explain || ''), bodyAttrs: 'id="qf-explain"' })}</div>
      <div class="qf__foot"><button type="button" class="btn-cta btn-cta--line btn-cta--sm" data-qf-cancel>Cancel</button>${QF.index < 0 ? `<button type="button" class="btn-cta btn-cta--outline btn-cta--sm" data-qf-save-again ${qfReady() && !qfAtLimit() ? '' : `disabled title="${qfAtLimit() ? 'This practice set will reach the 500-question limit.' : 'Fill in the required fields'}"`}>Save &amp; Add Another</button>` : ''}<button type="button" class="btn-cta btn-cta--sm" data-qf-save ${qfReady() ? '' : 'disabled title="Fill in the required fields"'}>Save</button></div>
    </div>`;
  }
  function qfRepaint(focusSel) {
    const el = document.getElementById('qf'); if (!el) return;
    el.outerHTML = qfHtml();
    if (focusSel) { const f = document.querySelector(focusSel); if (f) { f.focus(); if (f.setSelectionRange && f.value != null) f.setSelectionRange(f.value.length, f.value.length); } }
  }
  /* BR-PQ-14: thêm câu này mà đề luyện tập chạm 500 thì không mở câu kế tiếp */
  const qfAtLimit = () => QF.bank === 'practice' && P.draft.length + 1 >= P_MAX;
  function qfSave(again = false) {
    const v = QF.v;
    const prac = QF.bank === 'practice' ? P.draft : P.saved;
    const res = validateQuestion(v, { bank: QF.bank, index: QF.index, withScore: QF.withScore, practiceList: prac });
    QF.err = { text: res.eT.join(' '), opt: res.eO.join(' ') };
    if (!res.ok) { qfRepaint(); return; }
    const out = normalizeOut(v); if (!QF.withScore) delete out.score;
    if (v.html != null) out.html = v.html; if (v.explainHtml != null) out.explainHtml = v.explainHtml;
    const cb = QF.onSave, idx = QF.index;
    Object.assign(QF, { key: null, onClose: null });
    cb && cb(out, idx, again && idx < 0 ? v.type : null);
  }
  /* BR-PQ-15: mỗi lúc 1 form; còn nội dung chưa lưu thì mọi thao tác làm đóng form đều hỏi Discard trước */
  const QF_LEAVE = '[data-q-add], [data-qr-edit], [data-qr-del], [data-q-import], [data-pq-add], [data-pq-import], [data-tab], [data-les-del], [data-sec-del], [data-publish], a[href]';
  let qfBypass = false;
  document.addEventListener('click', (e) => {
    if (qfBypass || !QF.v || !QF.key) return;
    const t = e.target.closest(QF_LEAVE); if (!t || t.closest('#qf')) return;
    if (!qfHasInput()) { Object.assign(QF, { key: null, onClose: null }); return; }
    e.preventDefault(); e.stopImmediatePropagation();
    AdminConfirm({ title: 'Discard unsaved changes?', ok: 'Discard', cancel: 'Keep editing', danger: true,
      onOk: () => { Object.assign(QF, { key: null, onClose: null }); qfBypass = true; try { t.click(); } finally { qfBypass = false; } } });
  }, true);
  window.addEventListener('beforeunload', (e) => { if (QF.key && qfHasInput()) { e.preventDefault(); e.returnValue = ''; } });
  document.addEventListener('input', (e) => {
    if (!QF.v || !e.target.closest('#qf')) return;
    const t = e.target;
    /* Ô soạn thảo có định dạng như web: lưu HTML để hiển thị, kiểm / đếm / so trùng trên phần chữ (BR-PQ-03) */
    const rte = t.closest && t.closest('#qf-text, #qf-explain');
    if (rte && rte.id === 'qf-text') { QF.v.html = rte.innerHTML; QF.v.text = rte.innerText.replace(/\s+/g, ' ').trim(); const c = document.getElementById('qf-count'); if (c) { c.textContent = `${QF.v.text.length}/1000`; c.classList.toggle('is-over', QF.v.text.length > 1000); } }
    else if (rte && rte.id === 'qf-explain') { QF.v.explainHtml = rte.innerHTML; QF.v.explain = rte.innerText.trim(); }
    else if (t.dataset.qfOpt != null) QF.v.options[+t.dataset.qfOpt] = t.value;
    else return;
    QF.err = {};
    const sv = document.querySelector('#qf [data-qf-save]'); if (sv) { sv.disabled = !qfReady(); sv.title = qfReady() ? '' : 'Fill in the required fields'; }
    const sa = document.querySelector('#qf [data-qf-save-again]'); if (sa) { sa.disabled = !qfReady() || qfAtLimit(); sa.title = sa.disabled ? 'Fill in the required fields' : ''; }
  });
  document.addEventListener('change', (e) => {
    if (!QF.v || !e.target.closest('#qf')) return;
    const t = e.target;
    if (t.id === 'qf-type') { applyTypeChange(QF.v, t.value); qfRepaint('#qf-type'); return; }
    if (t.id === 'qf-score') { QF.v.score = +t.value; qfRepaint('#qf-score'); return; }
    if (t.name === 'qf-c') { QF.v.correct = [...document.querySelectorAll('#qf input[name="qf-c"]:checked')].map((x) => +x.value); QF.err = {}; qfRepaint(); }
  });
  document.addEventListener('focusout', (e) => {
    if (!QF.v || !e.target.closest('#qf')) return;
    const t = e.target, key = t.id === 'qf-text' ? 'text' : t.dataset.qfOpt != null ? 'o' + t.dataset.qfOpt : null;
    if (!key || QF.touched[key]) return;
    QF.touched[key] = true;
    const blank = key === 'text' ? !QF.v.text.trim() : !QF.v.options[+t.dataset.qfOpt].trim();
    if (blank) setTimeout(() => qfRepaint(document.activeElement && document.activeElement.id ? '#' + document.activeElement.id : null), 0);
  });
  document.addEventListener('click', (e) => {
    if (!QF.v) return;
    if (e.target.closest('#qf [data-qf-addopt]')) { if (QF.v.options.length < 4) QF.v.options.push(''); qfRepaint(`#qf [data-qf-opt="${QF.v.options.length - 1}"]`); return; }
    const od = e.target.closest('#qf [data-qf-optdel]'); if (od) { const k = +od.dataset.qfOptdel; QF.v.options.splice(k, 1); QF.v.correct = QF.v.correct.filter((c) => c !== k).map((c) => (c > k ? c - 1 : c)); qfRepaint(); return; }
    /* Practice · Admin 3.4: Cancel khi đã nhập → hỏi Discard unsaved changes? (Keep editing · Discard) */
    if (e.target.closest('[data-qf-cancel]')) { if (!qfHasInput()) { qfClose(); return; } AdminConfirm({ title: 'Discard unsaved changes?', ok: 'Discard', cancel: 'Keep editing', danger: true, onOk: qfClose }); return; }
    if (e.target.closest('#qf [data-qf-save]')) { qfSave(); }
    if (e.target.closest('#qf [data-qf-save-again]')) { qfSave(true); }
  });
  /* Lưu ngay từng thao tác trên đề luyện tập (Add / Edit / Import / Delete) — câu trùng vẫn lưu nhưng hiện đỏ, Publish sẽ chặn */
  function commitPractice(list) {
    P.draft = list.map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] }));
    P.saved = P.draft.map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] }));
    if (!P.saved.length && P.enabled) P.enabled = P.savedEnabled = false;
    P.err = ''; rowErrors();
    writePracticeStore({ questions: P.saved, enabled: !!P.savedEnabled });
  }
  let pFresh = new Set();

  /* Tab Practice (Practice · Admin 3): công tắc + trạng thái + danh sách câu ngay trong tab (cùng kiểu dòng với Quiz) */
  function drawPractice(el) {
    rowErrors();
    const n = P.draft.length;
    const errN = Object.keys(P.rowErr).length;
    /* BR-PQ-14: đủ 500 câu → Add / Import tắt, kèm câu báo */
    const full = n >= P_MAX;
    /* Như dòng Quiz trên web: Import Questions · Add Question (viền). Đang mở form thì chỉ còn nút đóng */
    const formOn = qfIs('p');
    const acts = !cfg.editable ? '' : formOn
      ? `<span class="pq-acts"><button type="button" class="su-icon" data-qf-cancel aria-label="Close">${ICON.x}</button></span>`
      : `<span class="pq-acts">${full ? '<span class="pq-limit">This practice set has reached the 500-question limit.</span>' : ''}<button type="button" class="btn-cta btn-cta--outline btn-cta--sm" data-pq-import ${full ? 'disabled' : ''}>${ICON.upload}Import Questions</button><button type="button" class="btn-cta btn-cta--outline btn-cta--sm" data-pq-add ${full ? 'disabled' : ''}>${ICON.plus}Add Question</button></span>`;
    /* Luật chung 19/11: chưa có dữ liệu → điều khiển tắt. Đề rỗng → công tắc tắt (không bật được), rê chuột thấy lý do (BR-PQ-10) */
    const lockOn = !n && !P.enabled;
    el.innerHTML = `<div class="adm-card su-panel lh2-tab pq-tab" id="practice-strip">
      <div class="pq-switch">
        <label class="switch ${lockOn ? 'is-locked' : ''}" ${lockOn ? 'title="Add at least 1 practice question to turn on Practice."' : ''}><input type="checkbox" id="pq-on" ${P.enabled ? 'checked' : ''} ${cfg.editable && !lockOn ? '' : 'disabled'}><span class="switch__track"></span><span><b>Enable Practice for this quiz</b></span></label>
      </div>
      <div class="pq-head"><h3>Practice Questions <span>${n}</span></h3>${errN ? `<span class="qz-sum__err">${ICON.alert}${errN} with errors</span>` : ''}<span class="grow"></span>${acts}</div>
      ${formOn ? qfHtml() : n ? questionRows({ list: P.draft, ns: 'p', errOf: (q, i) => P.rowErr[i] || '', editable: cfg.editable, fresh: pFresh })
        : '<p class="qz-empty">No practice questions yet. Add at least 1 question to turn on Practice.</p>'}
    </div>`;
    const first = [...pFresh][0];
    if (first != null) {
      requestAnimationFrame(() => document.getElementById(`qr-p-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      setTimeout(() => { pFresh = new Set(); el.querySelectorAll('.qr.is-new').forEach((x) => x.classList.remove('is-new')); }, 3000);
    }
  }
  function savePractice({ silent = false } = {}) {
    rowErrors();
    const bad = Object.keys(P.rowErr).map((i) => +i + 1);
    if (bad.length) { if (!silent) toast(`${bad.length} question${bad.length > 1 ? 's have' : ' has'} errors (questions ${bad.join(', ')}). Not saved.`); return false; }
    if (P.enabled && !P.draft.length) { P.err = 'Add at least 1 practice question before enabling Practice.'; if (!silent) toast(P.err); return false; }
    P.err = ''; P.saved = P.draft.map((q) => ({ ...q, options: [...q.options], correct: [...q.correct] })); P.savedEnabled = P.enabled;
    if (!silent) toast(`Practice questions saved · ${P.saved.length} questions`);
    return true;
  }

  /* ---------- Form soạn câu (Docs §3.3) — dùng chung page con + fallback modal ---------- */
  function blankQuestion(withScore) {
    return { type: 'single', text: '', options: ['', '', '', ''], correct: [], explain: '', score: withScore ? 1 : undefined }; // Practice · Admin 3.2: mặc định 4 dòng trống
  }
  function cloneQ(q) {
    return q ? { ...q, options: [...(q.options || [])], correct: [...(q.correct || [])] } : blankQuestion(true);
  }
  function optsHtml(v, idPrefix = '') {
    const name = `${idPrefix}pq-c`;
    return v.options.map((o, i) => `<div class="opt-row opt-row--q">
        <input type="${v.type === 'multi' ? 'checkbox' : 'radio'}" name="${name}" value="${i}" ${v.correct.includes(i) ? 'checked' : ''} aria-label="Correct answer ${KEYS[i]}">
        <span class="pq-key">${KEYS[i]}</span>
        <input class="adm-input" type="text" data-opt="${i}" value="${esc(o)}" maxlength="300" placeholder="Option ${KEYS[i]}" ${v.type === 'tf' ? 'readonly' : ''}>
        ${v.type === 'tf' || v.options.length <= 2 ? '<span></span>' : `<button type="button" class="icon-btn" data-opt-del="${i}" aria-label="Remove option">${ICON.x}</button>`}</div>`).join('');
  }
  function questionFormHtml(v, withScore, idPrefix = '') {
    const p = idPrefix;
    return `<div class="q-form stack" style="display:flex;flex-direction:column;gap:20px" data-q-prefix="${esc(p)}">
      <div class="adm-field"><label>Question Content <span class="req">*</span></label>
        <textarea class="adm-input" id="${p}pq-text" rows="4" maxlength="1000" placeholder="Enter question">${esc(v.text)}</textarea>
        <span class="adm-hint" id="${p}pq-count">${(v.text || '').length}/1000</span><p class="adm-err" id="${p}pq-e-text"></p></div>
      <div class="cc-row q-form__row"><div class="adm-field"><label>Question Type <span class="req">*</span></label>
        <select class="adm-input" id="${p}pq-type">${Object.entries(TYPE).map(([k, t]) => `<option value="${k}" ${v.type === k ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
        ${withScore ? `<div class="adm-field"><label>Score (Points) <span class="req">*</span></label><input class="adm-input" id="${p}pq-score" type="number" min="0.5" step="0.5" value="${v.score || 1}" style="max-width:120px"><p class="adm-err" id="${p}pq-e-score"></p></div>` : ''}</div>
      <div class="adm-field"><span class="adm-label">Answer Option <span class="req">*</span></span>
        <div id="${p}pq-opts">${optsHtml(v, p)}</div>
        ${v.type !== 'tf' && v.options.length < 4 ? `<button type="button" class="btn-link btn-link--blue" id="${p}pq-add-opt" style="padding:0;align-self:flex-start">+ Add more Answer Option</button>` : ''}
        <p class="adm-err" id="${p}pq-e-opt"></p></div>
      <div class="adm-field"><span class="adm-label">Explanation <span class="adm-hint">(optional)</span></span>
        <textarea class="adm-input" id="${p}pq-explain" rows="3" maxlength="1000" placeholder="Why the correct answer is correct">${esc(v.explain || '')}</textarea></div></div>`;
  }
  function readQuestionForm(root, withScore, idPrefix = '') {
    const p = idPrefix;
    const name = `${p}pq-c`;
    const v = {
      text: root.querySelector(`#${CSS.escape(p)}pq-text`)?.value || '',
      explain: root.querySelector(`#${CSS.escape(p)}pq-explain`)?.value || '',
      type: root.querySelector(`#${CSS.escape(p)}pq-type`)?.value || 'single',
      options: [...root.querySelectorAll('[data-opt]')].map((i) => i.value),
      correct: [...root.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => +i.value),
    };
    if (withScore) v.score = +root.querySelector(`#${CSS.escape(p)}pq-score`)?.value || 0;
    return v;
  }
  function applyTypeChange(v, next) {
    if (next === 'tf') { v.options = ['True', 'False']; v.correct = v.correct.slice(0, 1).filter((c) => c < 2); }
    else if (v.type === 'tf') { v.options = ['', '', '', '']; v.correct = []; }
    if (next !== 'multi' && v.correct.length > 1) v.correct = [v.correct[0]];
    v.type = next;
    return v;
  }
  function validateQuestion(v, { bank = 'practice', index = -1, withScore = false, examList, practiceList } = {}) {
    const eT = [], eO = [], eS = [];
    if (!v.text.trim()) eT.push('Please enter Question Content');
    const dup = dupErrWithLists(bank, v.text, index, examList, practiceList); if (dup) eT.push(dup);
    if (v.options.length < 2) eO.push('At least 2 answer options are required');
    v.options.forEach((o, i) => { if (!o.trim()) eO.push(`Option ${KEYS[i]} is empty. Enter content or remove it.`); });
    const seen = {}; v.options.forEach((o, i) => { const k = nq(o); if (!k) return; if (seen[k] != null) eO.push(`Options ${KEYS[seen[k]]} and ${KEYS[i]} are the same.`); else seen[k] = i; });
    if (!v.correct.length) eO.push('Please select the correct answer');
    else if (v.type === 'multi' && v.correct.length < 2) eO.push('Multiple choice needs at least 2 correct answers.');
    if (withScore && (!(+v.score > 0))) eS.push('Score must be greater than 0.');
    return { eT, eO, eS, ok: !eT.length && !eO.length && !eS.length };
  }
  function normalizeOut(v) {
    return { type: v.type, text: v.text.trim().replace(/\s+/g, ' '), options: v.options.map((o) => o.trim()), correct: [...v.correct].sort((a, b) => a - b), explain: (v.explain || '').trim(), score: v.score };
  }
  function dupErrWithLists(bank, text, self, examList, practiceList) {
    const t = nq(text); if (!t) return '';
    const exam = examList || cfg.getExam();
    const prac = practiceList || P.draft;
    if (bank === 'practice') {
      const ex = exam.find((x) => nq(x.text) === t);
      if (ex) return `Duplicate of question ${ex.n} in quiz "${ex.quiz}". Please write a different question.`;
      const k = prac.findIndex((x, i) => i !== self && nq(x.text) === t);
      if (k >= 0) return `Duplicate of practice question ${k + 1}.`;
    } else {
      const k = (practiceList || P.saved).findIndex((x) => nq(x.text) === t);
      if (k >= 0) return `Duplicate of practice question ${k + 1}. Please write a different question.`;
    }
    return '';
  }
  /** Wire form trong root; idPrefix tránh trùng id khi nhiều khung trên 1 page. Trả { tryCommit, tryValidate, setState, getState, paint }. */
  function mountQuestionForm(root, { withScore = false, bank = 'practice', index = -1, initial = null, examList, practiceList, onCommit, idPrefix = '' } = {}) {
    const p = idPrefix;
    let v = cloneQ(initial || blankQuestion(withScore));
    let editIndex = index;
    const paint = () => { root.innerHTML = questionFormHtml(v, withScore, p); };
    const read = () => { Object.assign(v, readQuestionForm(root, withScore, p)); };
    const sel = (suffix) => root.querySelector(`#${CSS.escape(p)}${suffix}`);
    paint();
    root.addEventListener('input', (e) => { if (e.target.id === `${p}pq-text`) { const c = sel('pq-count'); if (c) c.textContent = `${e.target.value.length}/1000`; } });
    root.addEventListener('change', (e) => {
      if (e.target.id !== `${p}pq-type`) return;
      read(); applyTypeChange(v, e.target.value); paint();
    });
    root.addEventListener('click', (e) => {
      if (e.target.id === `${p}pq-add-opt`) { read(); if (v.options.length < 4) v.options.push(''); paint(); return; }
      const od = e.target.closest('[data-opt-del]');
      if (od) { read(); const k = +od.dataset.optDel; v.options.splice(k, 1); v.correct = v.correct.filter((c) => c !== k).map((c) => (c > k ? c - 1 : c)); paint(); }
    });
    function showErrors(res) {
      const te = sel('pq-e-text'); const oe = sel('pq-e-opt'); const se = sel('pq-e-score');
      if (te) te.textContent = res.eT.join(' ');
      if (oe) oe.textContent = res.eO.join(' ');
      if (se) se.textContent = res.eS.join(' ');
    }
    function tryValidate(extraPracticeList) {
      read();
      const list = extraPracticeList || practiceList || (bank === 'practice' ? P.draft : P.saved);
      const res = validateQuestion(v, { bank, index: editIndex, withScore, examList, practiceList: list });
      showErrors(res);
      if (!res.ok) return { ok: false, out: null };
      return { ok: true, out: normalizeOut(v) };
    }
    function tryCommit(mode) {
      const r = tryValidate();
      if (!r.ok) return false;
      onCommit && onCommit(r.out, mode, editIndex);
      return true;
    }
    return {
      tryCommit,
      tryValidate,
      setState(q, i) { v = cloneQ(q || blankQuestion(withScore)); editIndex = i == null ? -1 : i; paint(); },
      getState: () => { read(); return { v: cloneQ(v), index: editIndex }; },
      paint,
      idPrefix: p,
    };
  }

  /* Session bridge → page con admin-question-editor.html */
  function openQuestionEditor({ bank = 'practice', index = -1, withScore = false, questions = [], examList, practiceSaved, quiz = null, course = '', role = 'admin', st = 'draft', back = '', sectionsSnapshot = null } = {}) {
    const payload = {
      bank, index, withScore,
      questions: (questions || []).map(cloneQ),
      examList: examList || cfg.getExam(),
      practiceSaved: practiceSaved || P.saved.map(cloneQ),
      quiz, course: course || cfg.getTitle(), role, st,
      sectionsSnapshot,
      back: back || `course-editor.html?r=${role}&st=${st}&t=${encodeURIComponent(course || cfg.getTitle())}&tab=details${bank === 'practice' ? '&focus=practice' : ''}`,
    };
    sessionStorage.setItem(Q_STORE, JSON.stringify(payload));
    const q = new URLSearchParams({ bank, i: String(index), r: role, st });
    if (course || payload.course) q.set('course', course || payload.course);
    if (quiz) { q.set('si', String(quiz.si)); q.set('li', String(quiz.li)); if (quiz.name) q.set('quiz', quiz.name); }
    location.href = `admin-question-editor.html?${q}`;
  }
  function loadQuestionEditorSession() {
    try { return JSON.parse(sessionStorage.getItem(Q_STORE) || 'null'); } catch { return null; }
  }
  function saveQuestionEditorSession(data) {
    sessionStorage.setItem(Q_STORE, JSON.stringify(data));
  }
  function writeQuestionResult(result) {
    sessionStorage.setItem(Q_RESULT, JSON.stringify(result));
  }
  function consumeQuestionResult() {
    try {
      const r = JSON.parse(sessionStorage.getItem(Q_RESULT) || 'null');
      sessionStorage.removeItem(Q_RESULT);
      return r;
    } catch { sessionStorage.removeItem(Q_RESULT); return null; }
  }

  /* Fallback modal (ít dùng) — cùng form */
  function questionModal({ bank = 'practice', q = null, index = -1, withScore = false, onSave }) {
    const id = 'm-pq';
    document.getElementById(id)?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({
      id, size: 'lg',
      title: (index >= 0 ? 'Edit Question' : 'Add Question') + (bank === 'practice' ? ' · Practice' : ''),
      body: '<div id="m-pq-form"></div>',
      foot: `<button type="button" class="btn-cta btn-cta--line" data-pq-x>Cancel</button>${index < 0 ? '<button type="button" class="btn-cta btn-cta--line" data-pq-ok="again">Save &amp; Add Another</button>' : ''}<button type="button" class="btn-cta" data-pq-ok="1">Save</button>`,
    }));
    const m = document.getElementById(id);
    const formHost = m.querySelector('#m-pq-form');
    const form = mountQuestionForm(formHost, {
      withScore, bank, index, initial: q,
      onCommit(out, mode) {
        const no = onSave(out);
        toast(`Question ${no} ${index >= 0 ? 'updated' : 'added'}`);
        if (mode === 'again') { form.setState(blankQuestion(withScore), -1); }
        else m.remove();
      },
    });
    m.addEventListener('click', (e) => {
      if (e.target.closest('[data-pq-x]') || e.target.closest('[data-close]')) { m.remove(); return; }
      const ok = e.target.closest('[data-pq-ok]'); if (!ok) return;
      form.tryCommit(ok.dataset.pqOk === 'again' ? 'again' : 'save');
    });
  }

  /* ---------- Popup Import Questions (Docs §3.4 · Figma pick layout) ---------- */
  const DEMO_FILES = {
    good: { name: 'QA_Automation_questions.xlsx', note: 'Columns found: STT (ignored) · Nội dung câu hỏi · A · B · C · D · Đáp án · Giải thích' },
    word: { name: 'questions.docx', fileErr: 'Only Excel files (.xlsx, .xls) are supported.' },
    nohead: { name: 'bank_no_header.xlsx', fileErr: 'Column "Answer" not found. Add a header row and upload again.' },
    big: { name: 'full_bank_2025.xlsx', fileErr: 'This file has 236 questions, over the 200-question limit. Split it into several files.' },
  };
  function importRows(bank) {
    const ex = cfg.getExam()[0];
    const withScore = bank === 'exam';
    const rows = [
      { row: 2, q: '1+1 bằng mấy?', type: 'single', opts: ['1', '2', '3'], ans: '2 → B', score: 1, parsed: { type: 'single', text: '1+1 bằng mấy?', options: ['1', '2', '3'], correct: [1], explain: '', score: 1 } },
      { row: 3, q: 'Unit test kiểm tra phạm vi nào?', type: 'single', opts: ['Một hàm / module', 'Cả hệ thống', 'Giao diện', 'Hạ tầng'], ans: 'a → A', score: 1, parsed: { type: 'single', text: 'Unit test kiểm tra phạm vi nào?', options: ['Một hàm / module', 'Cả hệ thống', 'Giao diện', 'Hạ tầng'], correct: [0], explain: 'Unit test cô lập từng đơn vị nhỏ.', score: 1 } },
      { row: 4, q: 'Trái đất tròn', type: 'tf', opts: ['True', 'False'], ans: 't → True', score: 1, parsed: { type: 'tf', text: 'Trái đất tròn', options: ['True', 'False'], correct: [0], explain: '', score: 1 } },
      { row: 5, q: 'Những công cụ nào dùng cho test tự động?', type: 'multi', opts: ['Playwright', 'Selenium', 'Figma', 'Cypress'], ans: 'A, B; D', score: 2, parsed: { type: 'multi', text: 'Những công cụ nào dùng cho test tự động?', options: ['Playwright', 'Selenium', 'Figma', 'Cypress'], correct: [0, 1, 3], explain: '', score: 2 } },
      { row: 6, q: 'Regression test chạy khi nào?', type: 'single', opts: ['Sau mỗi thay đổi', 'Chỉ khi release', 'Không bao hours'], ans: '', err: 'Missing correct answer.' },
      { row: 7, q: 'Bug severity khác priority ở điểm nào?', type: 'single', opts: ['Mức ảnh hưởng vs thứ tự xử lý', 'Giống nhau'], ans: 'E', err: 'Answer "E" has no matching option.' },
    ];
    if (bank === 'practice' && ex) rows.push({ row: 8, q: ex.text, type: 'single', opts: ['…'], ans: 'B', err: `Duplicate of question ${ex.n} in quiz "${ex.quiz}". Please write a different question.` });
    rows.push({ row: 9, q: '1+1 bằng mấy?', type: 'single', opts: ['1', '2', '3'], ans: 'B', err: 'Duplicate of row 2 in this file.' });
    if (!withScore) rows.forEach((r) => { if (r.parsed) delete r.parsed.score; delete r.score; });
    return rows;
  }
  function importModal({ bank = 'practice', onImport, room = Infinity }) {
    const id = 'm-imp'; let file = null; let busy = false;
    const withScore = bank === 'exam';
    /* UI 19/11: bước 1/2 rõ ràng · vùng kéo-thả lớn · cách đọc file tóm 3 dòng · file demo tách xuống chân, chữ nhỏ */
    const steps = (n) => `<ol class="imp-steps">${['Choose file', 'Check questions', 'Import'].map((t, i) => `<li class="${i < n ? 'is-done' : i === n ? 'is-on' : ''}"><span>${i < n ? ICON.check : i + 1}</span>${t}</li>`).join('')}</ol>`;
    const pickHtml = () => `<div class="imp-pick">
      ${steps(0)}
      <button type="button" class="imp-drop" data-imp-pick="good">
        <span class="imp-drop__ic">${ICON.upload}</span>
        <b>Drag &amp; drop your Excel file here</b>
        <span class="imp-drop__or">or <u>browse your computer</u></span>
        <span class="imp-drop__chips"><i>.xlsx, .xls</i><i>Max 5 MB</i><i>Up to 200 questions</i></span>
      </button>
      <p class="adm-err imp-err" id="imp-err"></p>
      <div class="imp-demo"><span class="imp-demo__lab">Prototype · try other files:</span><span class="imp-demo__chips">${Object.entries(DEMO_FILES).filter(([k]) => k !== 'good').map(([k, f]) => `<button type="button" class="imp-demo__chip" data-imp-pick="${k}">${ICON.file}${esc(f.name)}</button>`).join('')}</span></div>
    </div>`;
    const loadingHtml = (name) => `<div class="imp-loading"><span class="imp-loading__spin" aria-hidden="true"></span><b>Reading ${esc(name)}…</b><span class="adm-hint">Detecting columns and validating questions</span></div>`;
    const previewHtml = (rows, name, note) => {
      const ok = rows.filter((r) => !r.err).length;
      const bad = rows.length - ok;
      const pts = withScore ? rows.filter((r) => !r.err).reduce((a, r) => a + (+r.score || 1), 0) : 0;
      return `<div class="imp-preview">
        ${steps(1)}
        <div class="imp-file">${ICON.sheet}<div class="imp-file__txt"><b>${esc(name)}</b><span>${esc(note)}</span></div></div>
        <div class="imp-sum"><b>${ok} valid</b><span>·</span><b class="is-bad">${bad} with errors</b><span>(will be skipped)</span>${withScore && ok ? `<span>·</span><b>+${pts} points</b>` : ''}</div>
        <div class="imp-wrap"><table class="imp-table"><thead><tr><th>Row</th><th>Question</th><th>Type</th><th>Options</th><th>Answer</th>${withScore ? '<th>Score</th>' : ''}<th>Result</th></tr></thead><tbody>
        ${rows.map((r) => `<tr class="${r.err ? 'is-err' : ''}"><td>${r.row}</td><td>${esc(r.q)}</td><td>${TYPE[r.type] || '—'}</td><td>${r.opts ? r.opts.length : '—'}</td><td>${esc(r.ans || '—')}</td>${withScore ? `<td>${r.err ? '—' : (r.score || 1)}</td>` : ''}<td>${r.err ? `<span class="imp-bad">${esc(r.err)}</span>` : '<span class="imp-ok">Valid</span>'}</td></tr>`).join('')}
        </tbody></table></div>
      </div>`;
    };
    const showPick = () => {
      file = null; busy = false;
      m.querySelector('.modal__body').innerHTML = pickHtml();
      m.querySelector('.modal__foot').innerHTML = '<button type="button" class="btn-cta btn-cta--line" data-imp-x>Cancel</button>';
      const box = m.querySelector('.modal'); if (box) { box.classList.remove('modal--lg'); box.classList.add('modal--md'); }
    };
    const showPreview = (rows) => {
      file = { ok: rows.filter((r) => !r.err).length, rows };
      /* BR-PQ-14: lần nhập làm vượt 500 câu bị chặn cả lần */
      const over = file.ok > room;
      m.querySelector('.modal__body').innerHTML = previewHtml(rows, DEMO_FILES.good.name, DEMO_FILES.good.note)
        + (over ? `<p class="adm-err imp-err" style="margin-top:12px">Only ${room} more question${room === 1 ? '' : 's'} can be added (500-question limit). Remove some rows and upload again.</p>` : '');
      m.querySelector('.modal__foot').innerHTML = `<button type="button" class="btn-cta btn-cta--line" data-imp-again>Choose Another File</button><button type="button" class="btn-cta" data-imp-go ${file.ok && !over ? '' : 'disabled'}>Import ${file.ok} Valid Questions</button>`;
      if (over) file.ok = 0;
      const box = m.querySelector('.modal'); if (box) { box.classList.remove('modal--md'); box.classList.add('modal--lg'); }
      busy = false;
    };

    document.getElementById(id)?.remove();
    document.body.insertAdjacentHTML('beforeend', Modal({
      id, size: 'md', title: 'Import Questions', body: pickHtml(),
      foot: '<button type="button" class="btn-cta btn-cta--line" data-imp-x>Cancel</button>',
    }));
    const m = document.getElementById(id);
    m.classList.add('imp-modal');
    m.addEventListener('click', (e) => {
      if (e.target.closest('[data-imp-x]') || e.target.closest('[data-close]')) { m.remove(); return; }
      if (e.target.closest('[data-imp-again]')) { showPick(); return; }
      if (e.target.closest('[data-imp-go]') && file && file.ok) {
        const add = file.rows.filter((r) => !r.err).map((r) => {
          const q = { ...r.parsed };
          if (withScore && q.score == null) q.score = 1;
          if (!withScore) delete q.score;
          return q;
        });
        const [a, b] = onImport(add) || [1, add.length];
        m.remove();
        toast(add.length === 1 ? `1 question imported (question ${a})` : `${add.length} questions imported (questions ${a}–${b})`);
        return;
      }
      const pk = e.target.closest('[data-imp-pick]'); if (!pk || busy) return;
      e.preventDefault();
      const key = pk.dataset.impPick;
      const f = DEMO_FILES[key];
      const errEl = m.querySelector('#imp-err');
      if (f.fileErr) {
        if (errEl) errEl.textContent = `${f.name}: ${f.fileErr}`;
        return;
      }
      if (errEl) errEl.textContent = '';
      busy = true;
      m.querySelector('.modal__body').innerHTML = loadingHtml(f.name);
      m.querySelector('.modal__foot').innerHTML = '<button type="button" class="btn-cta btn-cta--line" data-imp-x disabled>Cancel</button>';
      setTimeout(() => showPreview(importRows(bank)), 700);
    });
  }

  /* ---------- Audience (Course Audience 3.1–3.4, 3.7) ---------- */
  const PEOPLE = [
    ['Trần Minh Anh', 'QA', 'In Progress'], ['Lê Hoàng Nam', 'QC Automation', 'Completed'], ['Phạm Thu Trang', 'QA', 'Not Enrolled'],
    ['Đỗ Quang Huy', 'Development', 'In Progress'], ['Vũ Ngọc Lan', 'QA', 'Failed'], ['Ngô Đức Thịnh', 'QC Automation', 'Not Enrolled'],
    ['Hoàng Thu Hà', 'QA', 'In Progress'], ['Bùi Văn Khoa', 'QC Automation', 'Unenrolled'],
  ].map(([name, dept, status]) => { const s = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().split(' '); return { name, dept, status, email: `${s.slice(-1)[0]}.${s.slice(0, -1).join('')}@techvify.com.vn` }; }).map((p, i) => ({ ...p, id: `TVF${String(1021 + i * 37).padStart(5, '0')}` }));
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

  /* Course Audience v1.1 (D-156): tab chỉ còn thiết lập — Who can access · Rules · một nút Save.
     Danh sách học viên, Excluded, Remove / Re-add nằm ở màn View Learners (BR-AUD-16). */
  const toIso = (d) => { const m = String(d).match(/^(\d{2})\/(\d{2})\/(\d{4})$/); return m ? `${m[3]}-${m[2]}-${m[1]}` : ''; };
  const fromIso = (v) => { const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? `${m[3]}/${m[2]}/${m[1]}` : ''; };
  let ms = { open: null, q: '' };
  function msOptions(key) {
    const q = LH.norm(ms.q);
    if (key === 'd') return D.hr.departments.filter((d) => !A.depts.includes(d) && (!q || LH.norm(d).includes(q)))
      .map((d) => ({ v: d, main: d, sub: `${DEPT_SIZE[d] || 0} people` }));
    /* Course Audience 3.1: tìm theo tên (không dấu cũng được), email, mã nhân viên */
    return PEOPLE.filter((p) => !A.indiv.includes(p.name) && (!q || LH.norm(p.name + ' ' + p.email + ' ' + p.id).includes(q)))
      .map((p) => ({ v: p.name, main: p.name, sub: `${p.id} · ${p.email} · ${p.dept}` }));
  }
  function msField(key, label, ph, arr) {
    const ro = !cfg.editable;
    const open = ms.open === key && !ro;
    const opts = open ? msOptions(key) : [];
    return `<div class="adm-field"><label for="aud-ms-${key}">${label}</label>
      <div class="aud-ms ${open ? 'is-open' : ''} ${A.err.scope ? 'is-req-err' : ''}" data-aud-ms="${key}">
        ${arr.map((v) => `<span class="aud-chip">${esc(v)}${ro ? '' : `<button type="button" data-aud-rm="${key}:${esc(v)}" aria-label="Remove ${esc(v)}">${ICON.x}</button>`}</span>`).join('')}
        <input id="aud-ms-${key}" autocomplete="off" placeholder="${arr.length ? '' : ph}" value="${open ? esc(ms.q) : ''}" ${ro ? 'disabled' : ''}>
        ${open ? `<div class="aud-ms__menu" role="listbox">${opts.length ? opts.map((o) => `<button type="button" role="option" data-aud-pick="${key}:${esc(o.v)}"><b>${esc(o.main)}</b><span>${esc(o.sub)}</span></button>`).join('') : '<p class="aud-ms__none">No results</p>'}</div>` : ''}
      </div></div>`;
  }
  function drawAudience(el) {
    const ro = cfg.editable ? '' : 'disabled';
    const n = Math.max(0, count());
    const sv = A.saved ? JSON.parse(A.saved) : {};
    const schedChanged = sv.start && (A.start !== sv.start || A.end !== sv.end);
    const vl = `admin-course-learners.html?t=${encodeURIComponent(cfg.getTitle())}&r=admin`;
    el.innerHTML = `<div class="adm-card su-panel lh2-tab aud">
      <section class="aud-block"><h3>Who can access</h3>
        <div class="aud-scope" role="radiogroup" aria-label="Scope">
          <label class="aud-opt ${A.scope === 'all' ? 'is-on' : ''}"><input type="radio" name="aud-scope" value="all" ${A.scope === 'all' ? 'checked' : ''} ${ro}><b>All Company</b>${A.scope === 'all' ? `<span class="aud-opt__meta">${ICON.users}${n} learners${A.published ? `<a href="${vl}">View Learners${ICON.chevronR}</a>` : ''}</span>` : ''}</label>
          <label class="aud-opt ${A.scope === 'restricted' ? 'is-on' : ''}"><input type="radio" name="aud-scope" value="restricted" ${A.scope === 'restricted' ? 'checked' : ''} ${ro}><b>Restricted</b>${A.scope === 'restricted' ? `<span class="aud-opt__meta">${ICON.users}${n} learners${A.published ? `<a href="${vl}">View Learners${ICON.chevronR}</a>` : ''}</span>` : ''}</label>
        </div>
        ${A.scope === 'restricted' ? `<div class="cc-row aud-pick">
          ${msField('d', 'Departments', 'Search departments', A.depts)}
          ${msField('i', 'Individuals', 'Search by name, email or employee ID', A.indiv)}
        </div>${A.err.scope ? `<p class="adm-err">${A.err.scope}</p>` : ''}` : ''}
      </section>
      <section class="aud-block"><h3>Rules</h3>
        <label class="check"><input type="checkbox" id="aud-mand" ${A.mandatory ? 'checked' : ''} ${ro}><span>Mandatory Course</span></label>
        <div class="aud-dates">
          <div class="adm-field"><label for="aud-start">Start Date</label><input type="date" class="adm-input" id="aud-start" value="${toIso(A.start)}" ${ro}></div>
          <div class="adm-field"><label for="aud-end">End Date</label><input type="date" class="adm-input ${A.err.end ? 'is-req-err' : ''}" id="aud-end" value="${toIso(A.end)}" min="${toIso(A.start)}" ${ro}>${A.err.end ? `<p class="adm-err">${A.err.end}</p>` : ''}</div>
        </div>
        ${schedChanged ? `<label class="check"><input type="checkbox" id="aud-notify" ${A.notify ? 'checked' : ''}><span>Notify learners of schedule change</span></label>` : ''}
      </section>
      ${cfg.editable ? `<div class="adm-btn-combo aud-foot"><label class="check"><input type="checkbox" id="aud-invite" ${A.invite ? 'checked' : ''}><span>Send invitation email</span></label><span class="grow"></span><button type="button" class="btn-cta btn-cta--line" data-aud-cancel ${snap() === A.saved ? 'disabled title="No changes to discard"' : ''}>Cancel</button><button type="button" class="btn-cta" data-aud-save ${snap() === A.saved ? 'disabled title="No changes to save"' : ''}>Save</button></div>` : ''}
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
    /* BR-PQ-03 · BR-CI-08: còn câu trùng (dữ liệu có trước) thì không Publish */
    rowErrors();
    const pDup = Object.keys(P.rowErr).length;
    if (pDup) miss.push([`Practice has ${pDup} question${pDup === 1 ? ' that duplicates' : 's that duplicate'} exam questions.`, 'practice']);
    sections.forEach((s) => s.lessons.forEach((l) => {
      if (l.type !== 'quiz') return;
      const n = (l.questions || []).filter((q) => dupErr('exam', q.text, -1)).length;
      if (n) miss.push([`Quiz "${l.name}" has ${n} question${n === 1 ? ' that duplicates' : 's that duplicate'} practice questions.`, 'details']);
    }));
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

  /* Tab Practice: Add / Edit mở form ngay trong tab (như web), Save lưu ngay */
  function openPracticeForm(i, type = null) {
    qfOpen('p', { index: i, q: i >= 0 ? P.draft[i] : null, withScore: false, bank: 'practice', type,
      onSave: (out, idx, again) => { const next = P.draft.slice(); if (idx >= 0) next[idx] = out; else next.push(out); commitPractice(next); pFresh = again ? new Set() : new Set([idx >= 0 ? idx : next.length - 1]); toast(idx >= 0 ? `Question ${idx + 1} updated` : `Question ${next.length} added`);
        if (again) { openPracticeForm(-1, again); return; } redraw(); },
      onClose: () => redraw() });
    redraw(); document.getElementById('qf-text')?.focus();
  }

  /* ---------- Events ---------- */
  let host = null, which = null;
  const redraw = () => { if (!host) return; which === 'practice' ? drawPractice(host) : drawAudience(host); cfg.onChange(); };
  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-cant-go]'); if (go) { document.querySelectorAll('#m-cant,#m-pub').forEach((m) => m.remove()); cfg.goTab && cfg.goTab(go.dataset.cantGo); return; }
    if (ms.open && !e.target.closest('[data-aud-ms]')) { ms = { open: null, q: '' }; if (host && which === 'audience') drawAudience(host); }
    if (!host || !host.contains(e.target)) return;
    /* Practice strip */
    /* Tab Practice — lưu ngay từng thao tác */
    if (e.target.closest('[data-pq-add]')) { openPracticeForm(-1); return; }
    if (e.target.closest('[data-pq-import]')) {
      importModal({ bank: 'practice', room: P_MAX - P.draft.length, onImport: (qs) => { const a = P.draft.length; commitPractice(P.draft.concat(qs)); pFresh = new Set(qs.map((_, k) => a + k)); redraw(); return [a + 1, P.draft.length]; } });
      return;
    }
    const pd = e.target.closest('[data-qr-del^="p|"]'); if (pd) {
      const i = +pd.dataset.qrDel.split('|')[1];
      if (P.enabled && P.draft.length === 1) { // BR-PQ-05
        AdminConfirm({ title: 'Cannot delete the last question', text: 'Practice is on. Turn off Practice before deleting the last question.', ok: 'OK', cancel: 'Close' });
        return;
      }
      AdminConfirm({ cancel: 'Cancel', title: `Delete question ${i + 1}?`, text: esc(P.draft[i].text), ok: 'Delete', danger: true,
        onOk: () => { const next = P.draft.slice(); next.splice(i, 1); commitPractice(next); redraw(); toast(`Question ${i + 1} deleted`); } });
      return;
    }
    const pe = e.target.closest('[data-qr-edit^="p|"]'); if (pe) { openPracticeForm(+pe.dataset.qrEdit.split('|')[1]); return; }
    /* Audience */
    const rm = e.target.closest('[data-aud-rm]'); if (rm) { const [k, v] = rm.dataset.audRm.split(/:(.*)/s); if (k === 'd') A.depts = A.depts.filter((x) => x !== v); else A.indiv = A.indiv.filter((x) => x !== v); redraw(); return; }
    const pk = e.target.closest('[data-aud-pick]'); if (pk) { const [k, v] = pk.dataset.audPick.split(/:(.*)/s); (k === 'd' ? A.depts : A.indiv).push(v); A.err = {}; ms.q = ''; redraw(); document.getElementById(`aud-ms-${k}`)?.focus(); return; }
    const box = e.target.closest('[data-aud-ms]'); if (box && !box.querySelector('input').disabled) { if (ms.open !== box.dataset.audMs) { ms = { open: box.dataset.audMs, q: '' }; redraw(); } document.getElementById(`aud-ms-${box.dataset.audMs}`)?.focus(); return; }
    if (e.target.closest('[data-aud-save]')) { saveAudience(host); cfg.onChange(); return; }
    if (e.target.closest('[data-aud-cancel]')) { if (snap() === A.saved) return; AdminConfirm({ cancel: 'Cancel', title: 'Discard unsaved changes?', ok: 'Discard', danger: true, onOk: () => { Object.assign(A, JSON.parse(A.saved)); A.err = {}; redraw(); } }); return; }
  });
  document.addEventListener('change', (e) => {
    if (!host || !host.contains(e.target)) return;
    const t = e.target;
    if (t.id === 'pq-on') {
      if (!t.checked && P.enabled && (P.draft.length || P.saved.length)) {
        t.checked = true;
        AdminConfirm({
          cancel: 'Cancel', title: 'Turn off Practice for this quiz?',
          text: 'Learners will only see Exam Mode. Questions are kept.',
          ok: 'Turn off', danger: true,
          onOk: () => { P.enabled = false; P.err = ''; P.savedEnabled = false; writePracticeStore({ enabled: false }); redraw(); toast('Practice turned off · questions kept'); },
        });
        return;
      }
      /* BR-PQ-10: đề rỗng thì không bật được — báo lỗi tại công tắc, công tắc trả về Off */
      if (t.checked && !P.draft.length) { P.enabled = false; P.err = 'Add at least 1 practice question before enabling Practice.'; redraw(); return; }
      P.enabled = t.checked; P.err = '';
      P.savedEnabled = P.enabled; writePracticeStore({ enabled: P.enabled });
      if (P.enabled) toast('Practice turned on · learners see Practice Mode on this quiz');
      redraw();
    }
    if (t.name === 'aud-scope') {
      if (t.value === 'all' && A.scope === 'restricted' && (A.depts.length || A.indiv.length)) {
        AdminConfirm({ cancel: 'Cancel', title: 'Change to All Company?', text: 'All employees will be able to see and enroll. Your selected departments and individuals are kept but not applied.', ok: 'Change', onOk: () => { A.scope = 'all'; redraw(); } });
        t.checked = false; host.querySelector('input[name="aud-scope"][value="restricted"]').checked = true; return;
      }
      A.scope = t.value; A.err = {}; redraw();
    }
    if (t.id === 'aud-mand') { A.mandatory = t.checked; redraw(); }
    if (t.id === 'aud-start') { A.start = fromIso(t.value); validateAudience(); redraw(); }
    if (t.id === 'aud-end') { A.end = fromIso(t.value); validateAudience(); redraw(); }
    if (t.id === 'aud-invite') A.invite = t.checked;
    if (t.id === 'aud-notify') A.notify = t.checked;
  });
  document.addEventListener('input', (e) => {
    const m = host && e.target.id && e.target.id.match(/^aud-ms-(d|i)$/); if (!m) return;
    ms = { open: m[1], q: e.target.value }; drawAudience(host);
    const q = document.getElementById(e.target.id); q.focus(); q.setSelectionRange(ms.q.length, ms.q.length);
  });
  document.addEventListener('keydown', (e) => {
    if (!host || !ms.open || !e.target.id?.startsWith('aud-ms-')) return;
    if (e.key === 'Escape') { ms = { open: null, q: '' }; drawAudience(host); }
    if (e.key === 'Enter') { e.preventDefault(); host.querySelector('[data-aud-pick]')?.click(); }
    if (e.key === 'Backspace' && !e.target.value) { const k = ms.open; const arr = k === 'd' ? A.depts : A.indiv; if (arr.length) { arr.pop(); redraw(); document.getElementById(`aud-ms-${k}`)?.focus(); } }
  });

  window.LHSetup = {
    init(c) { cfg = { ...cfg, ...c }; },
    seedPractice, seedAudience,
    readPracticeStore, writePracticeStore, restorePractice,
    questionRows, commitPractice, markPracticeFresh(idx) { pFresh = new Set(idx); },
    practiceCount: () => P.saved.length,
    practiceEnabled: () => P.enabled,
    practiceDraft: () => P.draft.map(cloneQ),
    setPracticeDraft(qs) {
      P.draft = (qs || []).map(cloneQ);
      rowErrors();
    },
    savePractice,
    commitPracticeFromEditor(qs) {
      P.draft = (qs || []).map(cloneQ);
      rowErrors();
      if (P.draft.length) P.enabled = true;
      return savePractice({ silent: false });
    },
    practiceText: () => P.saved.map((q) => q.text),
    dupErr,
    TYPE, KEYS, blankQuestion, cloneQ, questionFormHtml, mountQuestionForm,
    openQuestionEditor, loadQuestionEditorSession, saveQuestionEditorSession,
    writeQuestionResult, consumeQuestionResult,
    qfOpen, qfClose, qfIs, qfHtml, qfEditing: () => (QF.key ? QF.index : -1),
    tabs: () => ({ audience: 'Audience', practice: `Practice (${P.saved.length})`, practiceCount: P.saved.length }),
    drawPractice(el) { host = el; which = 'practice'; drawPractice(el); },
    drawAudience(el) { host = el; which = 'audience'; drawAudience(el); },
    release() { host = null; which = null; },
    practiceEnabled: () => !!P.enabled,
    questionModal, importModal, publish,
    audience: A,
  };
})();
