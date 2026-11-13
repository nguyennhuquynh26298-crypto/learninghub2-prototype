/* LearningHub · Quiz trong Soạn khoá — Figma section Quiz 1249:5427 (Manage Question 1265:7417, Popup xoá 1273:8970 / 1273:8997).
 * [KT] Notion Quiz: Tên* · Mô tả · Giới hạn thời gian (Không giới hạn) · Điểm đạt 80% · Trộn câu · Quản lý câu hỏi (Thêm/Sửa/Xoá, điểm từng câu, tổng điểm).
 * [SỬA] D-55: bỏ Số lượt + toggle "Hiện đáp án sau khi nộp" — Exam cố định 3 lượt, đáp án mở khi Đạt hoặc hết lượt. D-58: 2–4 lựa chọn A–D, Đúng/Sai, trộn câu chỉ Exam.
 * [MỚI] D-01/D-04: toggle Cho phép luyện tập (bài cũ tắt). Tab Exam | Practice, mỗi tab Thêm/Sửa/Xoá/Nhập file.
 *        BR-ASM-03/07: chặn trùng 2 chiều. D-59: sửa Exam khi đang có người làm → phiên bản đề mới. D-18: Creator sửa khoá đang chạy → vào bản sửa, gửi duyệt.
 * Phần 1: kiểm tra câu + nhập file. Phần 2 (cuối file): giao diện. */
/* Banner chỉ số của đề (13/11): ô nhãn nhỏ + giá trị đậm; ô cuối có thể nổi bật (tổng điểm) */
function qmBanner(items) {
  return `<div class="qm-banner">${items.map(([k, v, hint, hi]) => `<div class="qm-banner__it${hi ? ' is-hi' : ''}"${hint ? ` title="${hint}"` : ''}><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
}
(function () {
  const KEYS = 'ABCD', MAX_OPT = 4, MIN_OPT = 2, TF = ['Đúng', 'Sai'];
  const MAX_Q = 1000, MAX_O = 300, MAX_EX = 1000, MAX_FILE_Q = 200, MAX_MB = 5;
  const TYPE_LABEL = { single: 'Một đáp án', multi: 'Nhiều đáp án', tf: 'Đúng/Sai' };
  const BANK_LABEL = { exam: 'Đề thi (Exam)', practice: 'Luyện tập (Practice)' };
  /* BR-ASM-03: bỏ khoảng trắng thừa, không phân biệt hoa thường */
  const nq = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();

  /** Kiểm tra 1 câu. bank: 'exam' | 'practice'. quiz: { exam: [], practice: [] }. self: vị trí đang sửa (-1 = câu mới). */
  function check(q, bank, quiz, self = -1) {
    const e = [], t = String(q.text || '').trim(), opts = q.options.map((o) => String(o || '').trim());
    if (!t) e.push('Nhập nội dung câu hỏi.'); else if (t.length > MAX_Q) e.push(`Câu hỏi tối đa ${MAX_Q} ký tự.`);
    if (!(+q.score > 0)) e.push('Điểm phải lớn hơn 0.');
    if (opts.length < MIN_OPT) e.push(`Cần ít nhất ${MIN_OPT} lựa chọn.`);
    if (opts.length > MAX_OPT) e.push(`Tối đa ${MAX_OPT} lựa chọn.`);
    opts.forEach((o, i) => { if (!o) e.push(`Lựa chọn ${KEYS[i]} đang trống — nhập nội dung hoặc xoá dòng.`); else if (o.length > MAX_O) e.push(`Lựa chọn ${KEYS[i]} tối đa ${MAX_O} ký tự.`); });
    const seen = {}; opts.forEach((o, i) => { const k = nq(o); if (!k) return; if (seen[k] != null) e.push(`Lựa chọn ${KEYS[seen[k]]} và ${KEYS[i]} giống nhau.`); else seen[k] = i; });
    if (!q.correct.length) e.push('Chọn ít nhất 1 đáp án đúng.');
    if (q.type !== 'multi' && q.correct.length > 1) e.push('Loại Một đáp án chỉ có 1 đáp án đúng.');
    if (q.correct.some((c) => c >= opts.length)) e.push('Đáp án đúng không khớp lựa chọn nào.');
    if ((q.explain || '').length > MAX_EX) e.push(`Giải thích tối đa ${MAX_EX} ký tự.`);
    if (t) {
      const own = quiz[bank].findIndex((x, i) => i !== self && nq(x.text) === nq(t));
      if (own >= 0) e.push(`Trùng với câu ${own + 1} trong tab ${BANK_LABEL[bank]}.`);
      /* Chặn trùng 2 chiều: câu Practice không trùng Exam; sửa câu Exam thành trùng Practice cũng chặn */
      const other = bank === 'exam' ? 'practice' : 'exam';
      const x = quiz[other].findIndex((y) => nq(y.text) === nq(t));
      if (x >= 0) e.push(bank === 'practice' ? `Trùng với đề thi (câu Exam ${x + 1}). Câu luyện tập phải khác đề thi.` : `Trùng với câu Practice ${x + 1}. Sửa câu này hoặc câu luyện tập trước.`);
    }
    return e;
  }
  const blank = () => ({ type: 'single', text: '', options: ['', '', '', ''], correct: [], explain: '', score: 1 });
  const total = (list) => list.reduce((a, q) => a + (+q.score || 0), 0);

  /* ---------- Nhập từ file (.xlsx / .csv / .docx / .pdf — D-71) — không có file mẫu, tự tách câu (chốt 12/11/2026) ----------
     Đáp án đúng phải ghi rõ ("Đáp án: B", "Answer: A,C" hoặc cột có tiêu đề chứa "đáp án"). Cột/ dòng "Điểm" tuỳ chọn, mặc định 1. */
  let XLSXlib = null, MAMMOTH = null, PDFJS = null;
  const loadScript = (src, get) => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = () => ok(get()); s.onerror = () => no(new Error('cdn')); document.head.appendChild(s); });
  const loadXLSX = () => (XLSXlib ? Promise.resolve(XLSXlib) : loadScript('https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js', () => (XLSXlib = window.XLSX)));
  /* D-71: PDF chỉ nhận loại có lớp chữ (xuất từ Word / Google Docs). PDF scan không ra chữ → báo lỗi. */
  const PDF_VER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/';
  const loadPdf = () => (PDFJS ? Promise.resolve(PDFJS) : loadScript(PDF_VER + 'pdf.min.js', () => { PDFJS = window.pdfjsLib; PDFJS.GlobalWorkerOptions.workerSrc = PDF_VER + 'pdf.worker.min.js'; return PDFJS; }));
  const PDF_SCAN_ERR = 'File PDF là ảnh scan, không đọc được chữ. Dùng file .docx hoặc PDF xuất từ Word / Google Docs.';
  async function pdfLines(buf) {
    const doc = await PDFJS.getDocument({ data: buf }).promise, lines = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const tc = await (await doc.getPage(p)).getTextContent(); let row = [], y = null;
      const flush = () => { if (row.length) lines.push(row.join('')); row = []; };
      tc.items.forEach((it) => { const iy = Math.round(it.transform[5]); if (y != null && Math.abs(iy - y) > 2) flush(); y = iy; row.push(it.str); if (it.hasEOL) { flush(); y = null; } });
      flush();
    }
    return lines;
  }
  const loadDocx = () => (MAMMOTH ? Promise.resolve(MAMMOTH) : loadScript('https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js', () => (MAMMOTH = window.mammoth)));
  function parseCSV(text) {
    const out = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) { const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"') q = true; else if (c === ',' || c === ';') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); out.push(row); row = []; cell = ''; } else cell += c; }
    if (cell || row.length) { row.push(cell); out.push(row); }
    return out;
  }
  const bare = (s) => nq(s).normalize('NFD').replace(/[\̀-\ͯ]/g, '').replace(/đ/g, 'd');
  const TRUE_W = ['dung', 'true'], FALSE_W = ['sai', 'false'];
  function readAnswer(v) {
    const t = bare(v).replace(/[.。]$/, ''); if (!t) return null;
    if (TRUE_W.includes(t)) return { tf: 0 }; if (FALSE_W.includes(t)) return { tf: 1 };
    return { keys: t.toUpperCase().split(/[\s,;/&+]+|VA|AND/).filter(Boolean) };
  }
  function toQ(raw) {
    const errs = [], text = raw.text.trim(), explain = (raw.explain || '').trim(), score = +String(raw.score || '').replace(',', '.') || 1;
    let options = raw.options.map((o) => o.trim()); while (options.length && !options[options.length - 1]) options.pop();
    const ans = readAnswer(raw.answer || '');
    const isTF = (ans && ans.tf != null && options.length === 0) || (options.length === 2 && TRUE_W.includes(bare(options[0])) && FALSE_W.includes(bare(options[1])));
    if (isTF) {
      const k = ans && ans.tf != null ? ans.tf : ans && ans.keys && ans.keys.length === 1 ? KEYS.indexOf(ans.keys[0]) : -1;
      if (!ans) errs.push('Không xác định được đáp án đúng. Nhập tay câu này.'); else if (k < 0 || k > 1) errs.push('Câu Đúng/Sai chỉ nhận đáp án "Đúng" hoặc "Sai".');
      return { q: { type: 'tf', text, options: [...TF], correct: k >= 0 && k <= 1 ? [k] : [], explain, score }, errs };
    }
    if (options.length < MIN_OPT || options.length > MAX_OPT) errs.push(`Câu có ${options.length} lựa chọn, cần từ ${MIN_OPT} đến ${MAX_OPT}.`);
    const keys = ans && ans.keys ? ans.keys : [];
    const bad = keys.filter((k) => !KEYS.includes(k) || KEYS.indexOf(k) >= options.length);
    if (!keys.length) errs.push('Không xác định được đáp án đúng. Nhập tay câu này.');
    else if (bad.length) errs.push(`Đáp án đúng "${bad.join(', ')}" không có lựa chọn tương ứng.`);
    const correct = [...new Set(keys.filter((k) => !bad.includes(k)).map((k) => KEYS.indexOf(k)))].sort();
    return { q: { type: correct.length > 1 ? 'multi' : 'single', text, options, correct, explain, score }, errs };
  }
  function fromTable(rows) {
    rows = rows.map((r) => r.map((c) => String(c ?? '').trim())).filter((r) => r.some(Boolean));
    for (let h = 0; h < Math.min(rows.length, 5); h++) {
      const hd = rows[h].map(bare), col = { opt: [] };
      hd.forEach((t, i) => {
        if (!t) return;
        const m = t.match(/(?:^|\s|lua chon|dap an|option|phuong an)\s*([a-d])$/);
        if (m && t.length <= 20) col.opt[KEYS.indexOf(m[1].toUpperCase())] = i;
        else if (/giai thich|explain/.test(t)) col.ex = i;
        else if (/^diem$|score|point/.test(t)) col.sc = i;
        else if (/dap an|answer|key/.test(t)) col.ans = i;
        else if (/cau hoi|question|noi dung/.test(t)) col.q = i;
      });
      if (col.q == null || col.ans == null) continue;
      const opts = col.opt.filter((x) => x != null);
      return rows.slice(h + 1).map((r, k) => ({ line: `Dòng ${h + k + 2}`, raw: { text: r[col.q] || '', options: opts.map((i) => r[i] || ''), answer: r[col.ans] || '', explain: col.ex != null ? r[col.ex] : '', score: col.sc != null ? r[col.sc] : '' } }));
    }
    return fromText(rows.map((r) => r.filter(Boolean).join(' ')));
  }
  function fromText(lines) {
    const out = []; let cur = null, last = null;
    const RE_Q = /^(?:c[aâ]u|question|q)\s*\d+\s*[:.)\-–]\s*(.*)$|^\d{1,3}\s*[.)]\s+(.+)$/i;
    const RE_O = /^\(?([A-Da-d])\s*[.):\-–]\s*(.+)$/;
    const RE_A = /^(?:đáp án(?: đúng)?|dap an(?: dung)?|answer|key|correct)\s*[:\-–]\s*(.+)$/i;
    const RE_E = /^(?:giải thích|giai thich|explanation|explain)\s*[:\-–]\s*(.+)$/i;
    const RE_S = /^(?:điểm|diem|score|points?)\s*[:\-–]\s*([\d.,]+)/i;
    /* Dòng chỉ có chữ (không lựa chọn, không đáp án) = tiêu đề / đoạn dẫn → bỏ qua */
    const push = () => { if (cur && (cur.options.length || cur.answer || cur.explain)) out.push({ line: `Câu ${out.length + 1}`, raw: cur }); };
    lines.map((l) => String(l).trim()).filter(Boolean).forEach((l) => {
      let m;
      if ((m = l.match(RE_S)) && cur) { cur.score = m[1]; return; }
      if ((m = l.match(RE_A)) && cur) { cur.answer = m[1]; last = null; return; }
      if ((m = l.match(RE_E)) && cur) { cur.explain = m[1]; last = 'ex'; return; }
      if ((m = l.match(RE_O)) && cur && !cur.answer) { cur.options[KEYS.indexOf(m[1].toUpperCase())] = m[2]; last = 'opt'; return; }
      if ((m = l.match(RE_Q)) || !cur || cur.answer || cur.explain) { push(); cur = { text: m ? (m[1] ?? m[2] ?? '') : l, options: [], answer: '', explain: '', score: '' }; last = 'q'; return; }
      if (last === 'q') cur.text += ' ' + l; else if (last === 'ex') cur.explain += ' ' + l; else if (last === 'opt') { const i = cur.options.length - 1; cur.options[i] += ' ' + l; }
    });
    push();
    return out.map((b) => ({ ...b, raw: { ...b.raw, options: Array.from(b.raw.options, (o) => o || '') } }));
  }
  /** Đọc file → Promise<blocks> */
  function readFile(f) {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'csv', 'docx', 'pdf'].includes(ext)) return Promise.reject(new Error('Chỉ nhận file .xlsx, .csv, .docx hoặc .pdf.'));
    if (f.size > MAX_MB * 1024 * 1024) return Promise.reject(new Error(`File vượt ${MAX_MB} MB.`));
    if (ext === 'csv') return f.text().then((t) => fromTable(parseCSV(t.replace(/^\ufeff/, ''))));
    if (ext === 'docx') return Promise.all([loadDocx(), f.arrayBuffer()]).then(([M, buf]) => M.extractRawText({ arrayBuffer: buf })).then((r) => fromText(r.value.split(/\r?\n/)))
      .catch(() => { throw new Error('Không đọc được file .docx. Kiểm tra file có mở được bằng Word không.'); });
    if (ext === 'pdf') return Promise.all([loadPdf(), f.arrayBuffer()]).then(([, buf]) => pdfLines(buf))
      .catch(() => { throw new Error('Không đọc được file .pdf. Kiểm tra file có mở được không, hoặc dùng file .docx.'); })
      .then((lines) => { if (!lines.join('').trim()) throw new Error(PDF_SCAN_ERR); return fromText(lines); });
    return Promise.all([loadXLSX(), f.arrayBuffer()]).then(([X, buf]) => { const wb = X.read(buf); return fromTable(X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' })); })
      .catch(() => { throw new Error('Không đọc được file .xlsx. Thử lưu lại dạng .csv (UTF-8).'); });
  }
  /** Kiểm tra từng câu đọc từ file với ngân hàng hiện có → [{ line, q, errs }] */
  function validateBlocks(blocks, bank, quiz) {
    const out = [];
    blocks.forEach((b) => {
      const { q, errs } = toQ(b.raw); const own = errs.length;
      const more = check(q, bank, quiz).filter((x) => !(own && /^(Chọn ít nhất|Cần ít nhất|Tối đa \d+ lựa chọn|Đáp án đúng không khớp|Loại Một đáp án)/.test(x)));
      const all = [...errs, ...more];
      const twin = out.findIndex((o) => !o.errs.length && nq(o.q.text) === nq(q.text)); if (q.text && twin >= 0) all.push(`Trùng với ${out[twin].line.toLowerCase()} trong file.`);
      out.push({ line: b.line, q, errs: [...new Set(all)] });
    });
    return out;
  }
  /* File Word mẫu để demo khi không có file thật (câu 3 cố tình trùng đề thi mẫu) */
  const DEMO_DOCX = `Câu 1: Khi nào nên dùng subagent thay vì để agent chính tự làm?
A. Khi cần đọc nhiều dữ liệu dài, chỉ cần tóm tắt
B. Khi việc chỉ có 1 bước
C. Khi cần trả lời thật nhanh
Đáp án: A
Điểm: 2
Giải thích: Subagent giữ context của agent chính gọn.
Câu 2: Những thông tin nào nên có trong mô tả tool?
A. Tool dùng để làm gì
B. Ví dụ tham số hợp lệ
C. Tên người viết tool
D. Khi nào không nên dùng tool
Answer: A, B, D
Câu 3: Prompt caching có tác dụng chính là gì?
A. Tăng độ chính xác
B. Giảm độ trễ và chi phí cho phần prompt lặp lại
Đáp án: B
Câu 4: Hook nào chạy trước khi tool được gọi?
A. PreToolUse
B. PostToolUse
C. Stop
Câu 5: Agent chính nên tự đọc toàn bộ log dài thay vì giao cho subagent.
Đáp án: Sai`.split('\n');
  /* File PDF mẫu (giả lập chữ đọc từ PDF xuất từ Word) — câu luyện tập, câu 4 cố tình thiếu đáp án */
  const DEMO_PDF = `BỘ CÂU LUYỆN TẬP — DOMAIN 1
1. Mục đích chính của bước "plan" trước khi agent làm việc dài là gì?
A. Chia việc thành bước nhỏ, dễ kiểm tra
B. Làm agent trả lời dài hơn
C. Bỏ qua bước kiểm thử
Đáp án: A
Giải thích: Kế hoạch rõ giúp agent không lạc hướng.
2. Đâu là dấu hiệu nên tách tool thành nhiều tool nhỏ?
A. Tool có quá nhiều tham số tuỳ chọn
B. Tool làm nhiều việc khác hẳn nhau
C. Tool chỉ có 1 tham số
Đáp án: A, B
3. Context window càng dài thì luôn càng tốt cho agent.
Đáp án: Sai
4. Khi nào nên dùng MCP server thay vì gọi API trực tiếp trong prompt?
A. Khi nhiều agent cần dùng chung công cụ
B. Khi chỉ gọi 1 lần`.split('\n');

  window.LHQuizCore = { KEYS, MAX_OPT, MIN_OPT, TF, MAX_Q, MAX_O, MAX_EX, MAX_FILE_Q, MAX_MB, TYPE_LABEL, BANK_LABEL, nq, check, blank, total, readFile, fromText, validateBlocks, DEMO_DOCX, DEMO_PDF, PDF_SCAN_ERR };
})();

/* ================= Phần 2 — giao diện: wizard 3 bước (D-70) =================
   B1 Thông tin · B2 Đề thi (Exam) · B3 Luyện tập (Practice). Bước câu hỏi: chưa có câu → 2 thẻ "Soạn tay" | "Nhập từ file";
   trình soạn câu và bảng kiểm tra file nằm ngay trong bước (không mở popup chồng). */
(function () {
  const C = window.LHQuizCore; const { ICON, esc, toast, AdminConfirm, AdminEmpty } = LH;
  const clone = (x) => JSON.parse(JSON.stringify(x));
  /* Popup quiz: bấm nền mờ không đóng (tránh mất nội dung đang nhập) */
  document.addEventListener('click', (e) => { if (e.target.matches('.qz-modal')) e.stopImmediatePropagation(); }, true);
  function modal(id, size, title, desc, body, foot) {
    document.getElementById(id)?.remove();
    document.body.insertAdjacentHTML('beforeend', `<div class="modal-backdrop qz-modal" id="${id}" role="dialog" aria-modal="true"><div class="modal modal--${size} adm-popup">
      <div class="modal__head"><div class="grow"><div class="modal__title">${title}</div>${desc ? `<div class="modal__desc">${desc}</div>` : ''}</div><button class="icon-btn" data-qz-x="${id}" aria-label="Đóng">${ICON.x}</button></div>
      <div class="modal__body">${body}</div><div class="modal__foot">${foot}</div></div></div>`);
    const el = document.getElementById(id);
    el.addEventListener('click', (e) => { if (e.target.closest(`[data-qz-x="${id}"]`)) el.dispatchEvent(new CustomEvent('qz-close')); });
    return el;
  }
  const newQuiz = () => ({ title: '', desc: '', minutes: 30, noLimit: false, pass: 80, shuffle: true, practice: false, exam: [], practice_q: [] });
  const MAX_TITLE = 60;

  /** Popup xoá quiz — Figma 1273:8997 */
  function confirmDelete(quiz, onOk) {
    AdminConfirm({ danger: true, title: 'Bạn chắc chắn muốn xoá quiz này?', text: `<b>${esc(quiz.title)}</b> cùng ${quiz.exam.length} câu Exam và ${quiz.practice_q.length} câu Practice sẽ bị xoá.`, ok: 'Xoá', onOk });
  }

  /**
   * Wizard tạo / sửa quiz.
   * quiz: quiz có sẵn (sửa) hoặc bỏ trống (tạo mới). preset: dữ liệu điền sẵn khi tạo mới (demo).
   * step: 1 | 2 | 3. ctx: { titles: tên bài khác trong khoá, inProgress (D-59), creatorLive (D-18), open: add|edit|import|importdemo|importpdf|pdfscan }
   * onSave(quiz, { draft })
   */
  function openWizard({ quiz, preset, step = 1, ctx = {}, onSave }) {
    const isNew = !quiz, W = quiz ? clone(quiz) : { ...newQuiz(), ...clone(preset || {}) };
    const before = JSON.stringify(W), examBefore = JSON.stringify(W.exam), practiceWas = !!(quiz && quiz.practice);
    let cur = step === 3 && !W.practice ? 2 : step, view = 'list', ed = null, im = null, msg = '', tried1 = false;
    const banks = () => ({ exam: W.exam, practice: W.practice_q });
    const bankOf = (s) => (s === 3 ? 'practice' : 'exam');
    const listOf = (s) => (s === 3 ? W.practice_q : W.exam);
    const dirty = () => JSON.stringify(W) !== before;
    const el = modal('qz-wiz', 'xl', isNew ? 'Tạo quiz' : `Sửa quiz · ${esc(W.title)}`, '',
      '<nav class="qw-steps" id="qw-steps" aria-label="Các bước tạo quiz"></nav><div id="qw-body" class="qw-body"></div>', '');

    /* ----- Kiểm tra ----- */
    function infoErrs() {
      const t = W.title.trim(), e = {};
      if (!t) e.title = 'Nhập tên quiz.'; else if (t.length > MAX_TITLE) e.title = `Tên quiz tối đa ${MAX_TITLE} ký tự.`;
      else if ((ctx.titles || []).some((x) => C.nq(x) === C.nq(t))) e.title = 'Tên này đã có ở bài khác trong khoá. Đặt tên khác.';
      if (!(W.pass >= 1 && W.pass <= 100)) e.pass = 'Điểm đạt từ 1 đến 100%.';
      if (!W.noLimit && !(W.minutes >= 1)) e.minutes = 'Nhập số phút lớn hơn 0.';
      return e;
    }
    function bankErr(s) {
      if (s === 1) return Object.values(infoErrs())[0] || '';
      if (s === 3 && !W.practice) return '';
      const b = bankOf(s), L = listOf(s);
      if (s === 2 && (!L.length || !C.total(L))) return 'Đề thi cần ít nhất 1 câu hỏi và tổng điểm lớn hơn 0.';
      if (s === 3 && !L.length) return 'Thêm ít nhất 1 câu luyện tập, hoặc quay lại Bước 1 tắt Cho phép luyện tập.';
      const bad = L.map((q, k) => (C.check(q, b, banks(), k).length ? k + 1 : 0)).filter(Boolean);
      return bad.length ? `Còn ${bad.length} câu lỗi (câu ${bad.join(', ')}) — sửa trước khi đi tiếp.` : '';
    }

    /* ----- Thanh bước ----- */
    function drawSteps() {
      const items = [[1, 'Thông tin', W.title.trim() ? esc(W.title.trim()) : 'Tên, thời gian, điểm đạt'], [2, 'Đề thi (Exam)', `${W.exam.length} câu · ${C.total(W.exam)} điểm`], [3, 'Luyện tập (Practice)', W.practice ? `${W.practice_q.length} câu` : 'Đang tắt']];
      el.querySelector('#qw-steps').innerHTML = items.map(([n, t, sub]) => {
        const off = n === 3 && !W.practice, done = n !== cur && !off && !bankErr(n) && (n === 1 || listOf(n).length > 0);
        return `<button type="button" class="qw-step ${n === cur ? 'is-current' : ''} ${done ? 'is-done' : ''} ${off ? 'is-off' : ''}" data-qw-go="${n}" ${n === cur ? 'aria-current="step"' : ''} ${view !== 'list' && n !== cur ? 'disabled' : ''}>
          <span class="qw-step__n">${done ? ICON.check : n}</span><span class="qw-step__t"><b>${t}</b><span>${sub}</span></span></button>`;
      }).join('<span class="qw-step__line" aria-hidden="true"></span>');
    }

    /* ----- B1 Thông tin ----- */
    function info() {
      const e = tried1 ? infoErrs() : {};
      return `<div class="adm-form">
        <div class="adm-field full"><label for="qf-title">Tên quiz <span class="req">*</span></label><input class="adm-input ${e.title ? 'is-error' : ''}" id="qf-title" maxlength="${MAX_TITLE}" value="${esc(W.title)}" placeholder="VD: Test Domain 1 — Agentic Architecture">
          ${e.title ? `<span class="adm-hint is-error">${e.title}</span>` : `<span class="adm-hint">Tối đa ${MAX_TITLE} ký tự, không trùng tên bài khác trong khoá.</span>`}</div>
        <div class="adm-field full"><label for="qf-desc">Mô tả</label><textarea class="adm-input" id="qf-desc" placeholder="Nhập mô tả...">${esc(W.desc)}</textarea></div>
        <div class="adm-field"><label for="qf-min">Giới hạn thời gian (phút)</label><input class="adm-input ${e.minutes ? 'is-error' : ''}" id="qf-min" type="number" min="1" value="${W.minutes}" ${W.noLimit ? 'disabled' : ''}>
          <label class="check"><input type="checkbox" id="qf-nolimit" ${W.noLimit ? 'checked' : ''}><span>Không giới hạn</span></label>${e.minutes ? `<span class="adm-hint is-error">${e.minutes}</span>` : ''}</div>
        <div class="adm-field"><label for="qf-pass">Điểm đạt (%) <span class="req">*</span></label><input class="adm-input ${e.pass ? 'is-error' : ''}" id="qf-pass" type="number" min="1" max="100" value="${W.pass}">
          ${e.pass ? `<span class="adm-hint is-error">${e.pass}</span>` : ''}<span class="adm-hint qw-rule">${ICON.info}Exam cố định 3 lượt · đáp án hiện khi Đạt hoặc hết lượt (D-55).</span></div>
        <div class="adm-field full"><label class="switch"><input type="checkbox" id="qf-shuffle" ${W.shuffle ? 'checked' : ''}><span class="switch__track"></span>Trộn thứ tự câu hỏi <span class="adm-hint">· chỉ áp cho Exam (D-58)</span></label></div>
        <div class="adm-field full"><label class="switch"><input type="checkbox" id="qf-practice" ${W.practice ? 'checked' : ''}><span class="switch__track"></span>Cho phép luyện tập (Practice) <span class="stage-tag stage-tag--info">LH2</span></label>
          <span class="adm-hint" id="qf-practice-hint">${practiceHint()}</span></div>
      </div>`;
    }
    const practiceHint = () => (W.practice ? 'Bật: có thêm Bước 3 soạn bộ câu luyện tập riêng — không giới hạn lượt, không tính điểm.'
      : W.practice_q.length ? `Đang tắt. Bộ ${W.practice_q.length} câu luyện tập vẫn được giữ, bật lại là dùng được.` : 'Tắt: quiz chỉ có đề thi. Bài có từ trước LH2 mặc định tắt (D-04).');

    /* ----- B2 / B3 danh sách câu ----- */
    function bankList() {
      const b = bankOf(cur), L = listOf(cur), exam = b === 'exam';
      if (!exam && !W.practice) return AdminEmpty({ icon: 'dumbbell', title: 'Chế độ luyện tập đang tắt', desc: 'Bật để soạn bộ câu luyện tập riêng cho học viên. Bài có từ trước LearningHub 2 mặc định tắt.', cta: '<button class="btn-cta" data-qw-on>Bật Cho phép luyện tập</button>', compact: true });
      const errAt = L.map((q, k) => C.check(q, b, banks(), k));
      const head = exam
        ? qmBanner([['Lượt làm', '3 lượt'], ['Điểm đạt', W.pass + '%'], ['Thời gian', W.noLimit ? 'Không giới hạn' : W.minutes + ' phút'], ['Trộn câu', W.shuffle ? 'Bật' : 'Tắt'], ['Tổng điểm', C.total(L) + ' điểm', 'Bằng tổng điểm các câu', true]])
        : qmBanner([['Lượt làm', 'Không giới hạn'], ['Tính điểm / tiến độ', 'Không'], ['Đáp án', 'Hiện ngay'], ['Trùng đề thi', 'Không cho phép']]);
      const flags = (exam && ctx.inProgress ? `<div class="qm-flag qm-flag--warn">${ICON.alert}<span><b>${ctx.inProgress} học viên đang làm dở đề này.</b> Lưu thay đổi sẽ tạo đề phiên bản v${(W.version || 1) + 1}; người đang dở làm tiếp đề v${W.version || 1} (D-59).</span></div>` : '')
        + (ctx.creatorLive ? `<div class="qm-flag">${ICON.info}<span>Khoá đang chạy: thay đổi được lưu vào <b>bản sửa</b>, học viên vẫn làm đề cũ tới khi Admin L&amp;D duyệt (D-18).</span></div>` : '')
        + (msg ? `<div class="field__error">${ICON.alert}${esc(msg)}</div>` : '');
      if (!L.length) return `${head}${flags}<div class="qw-pick">
          <button type="button" class="qw-card" data-qw-add>${ICON.edit}<b>Soạn tay</b><span>Tạo từng câu: nội dung, loại câu (Một đáp án / Nhiều đáp án / Đúng-Sai), lựa chọn A–D, tick đáp án đúng${exam ? ', điểm' : ''}.</span></button>
          <button type="button" class="qw-card" data-qw-import>${ICON.upload}<b>Nhập từ file</b><span>.xlsx, .csv, .docx, .pdf · tối đa ${C.MAX_MB} MB · ${C.MAX_FILE_Q} câu. Hệ thống tự tách câu, bạn xem lại trước khi nhập.</span></button></div>`;
      return `${head}${flags}<div class="qm-tools"><span class="adm-hint grow">${L.length} câu${errAt.some((x) => x.length) ? ` · <span class="qm-bad">${errAt.filter((x) => x.length).length} câu lỗi</span>` : ''}</span>
          <button class="btn-cta btn-cta--line btn-cta--sm" data-qw-import>${ICON.upload}Nhập từ file</button><button class="btn-cta btn-cta--sm" data-qw-add>${ICON.plus}Thêm câu hỏi</button></div>
        <div class="qm-list">${L.map((q, k) => `<div class="qe-row ${errAt[k].length ? 'qe-row--dup' : ''}" data-qw-edit="${k}"><span class="qe-row__num">${k + 1}</span>
          <div class="qe-row__main"><div class="qe-row__text">${esc(q.text)}</div>
            <div class="qe-row__meta">${C.TYPE_LABEL[q.type]} · ${q.options.length} lựa chọn · Đáp án: <span class="qe-row__ans">${q.correct.map((c) => (q.type === 'tf' ? C.TF[c] : C.KEYS[c])).join(', ') || '—'}</span>${exam ? ` · <b>${q.score} điểm</b>` : ''}</div>
            ${errAt[k].length ? `<div class="field__error">${ICON.alert}${esc(errAt[k][0])}</div>` : ''}</div>
          <button class="icon-btn" data-qw-edit="${k}" title="Sửa" aria-label="Sửa câu ${k + 1}">${ICON.edit}</button><button class="icon-btn" data-qw-del="${k}" title="Xoá" aria-label="Xoá câu ${k + 1}">${ICON.trash}</button></div>`).join('')}</div>`;
    }

    /* ----- Soạn tay (nhúng trong bước) — giữ form spec 01 §3.2 ----- */
    function editor() {
      const { k, draft: q, tried } = ed, b = bankOf(cur), exam = b === 'exam';
      const errs = tried ? C.check(q, b, banks(), k) : [], multi = q.type === 'multi', tf = q.type === 'tf';
      return `<div class="qw-sub"><button type="button" class="btn btn--link" data-qw-back>← Danh sách câu</button><b>${k >= 0 ? `Sửa câu ${k + 1}` : `Thêm câu ${listOf(cur).length + 1}`} · ${C.BANK_LABEL[b]}</b></div>
        ${errs.length ? `<div class="qe-err"><b>Chưa lưu được — sửa ${errs.length} lỗi:</b><ul>${errs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
        <div class="adm-field"><label for="qe-text">Nội dung câu hỏi <span class="req">*</span></label><textarea class="adm-input ${tried && !q.text.trim() ? 'is-error' : ''}" id="qe-text" maxlength="${C.MAX_Q}">${esc(q.text)}</textarea><span class="adm-hint qe-counter"><span id="qe-n">${q.text.length}</span>/${C.MAX_Q}</span></div>
        <div class="${exam ? 'qe-2' : ''}"><div class="adm-field"><span class="adm-label">Loại câu hỏi <span class="req">*</span></span><div class="combo qe-type">${Object.entries(C.TYPE_LABEL).map(([v, t]) => `<button type="button" data-type="${v}" class="${q.type === v ? 'is-active' : ''}">${t}</button>`).join('')}</div></div>
          ${exam ? `<div class="adm-field"><label for="qe-score">Điểm <span class="req">*</span></label><input class="adm-input ${tried && !(+q.score > 0) ? 'is-error' : ''}" id="qe-score" type="number" min="0.5" step="0.5" value="${q.score}"></div>` : ''}</div>
        <div class="adm-field"><span class="adm-label">Lựa chọn và đáp án đúng <span class="req">*</span> <span class="adm-hint">· ${tf ? '2 lựa chọn cố định' : '2–4 lựa chọn (A–D)'} · tick ${multi ? 'các ô' : 'ô'} đáp án đúng</span></span>
          <div class="stack gap-8">${q.options.map((o, i) => `<div class="qe-opt ${q.correct.includes(i) ? 'is-right' : ''}">
            <input type="${multi ? 'checkbox' : 'radio'}" name="qe-c" data-c="${i}" ${q.correct.includes(i) ? 'checked' : ''} aria-label="Đáp án đúng ${C.KEYS[i]}"><span class="qe-opt__k">${C.KEYS[i]}</span>
            <input class="adm-input ${tried && !o.trim() ? 'is-error' : ''}" data-o="${i}" maxlength="${C.MAX_O}" value="${esc(o)}" placeholder="Lựa chọn ${C.KEYS[i]}" ${tf ? 'readonly' : ''}>
            ${tf ? '<span></span>' : `<button type="button" class="icon-btn" data-rm="${i}" ${q.options.length <= C.MIN_OPT ? 'disabled' : ''} aria-label="Xoá lựa chọn ${C.KEYS[i]}">${ICON.x}</button>`}</div>`).join('')}</div>
          ${!tf && q.options.length < C.MAX_OPT ? `<div><button type="button" class="btn btn--link" data-addopt>${ICON.plus}Thêm lựa chọn</button></div>` : ''}</div>
        <div class="adm-field"><label for="qe-ex">Giải thích</label><textarea class="adm-input" id="qe-ex" maxlength="${C.MAX_EX}" placeholder="${exam ? 'Hiện cho học viên khi Đạt hoặc hết 3 lượt' : 'Hiện ngay sau khi trả lời'}">${esc(q.explain)}</textarea></div>`;
    }
    const openEditor = (k) => { ed = { k, draft: k >= 0 ? clone(listOf(cur)[k]) : C.blank(), tried: false }; view = 'editor'; msg = ''; draw(); el.querySelector('#qe-text')?.focus(); };

    /* ----- Nhập từ file (nhúng trong bước) — D-71: cả Exam và Practice, Exam đọc cột Điểm ----- */
    function importer() {
      const b = bankOf(cur), exam = b === 'exam', { rows, err } = im;
      const sub = `<div class="qw-sub"><button type="button" class="btn btn--link" data-qw-back>← Danh sách câu</button><b>Nhập câu hỏi từ file · ${C.BANK_LABEL[b]}</b></div>`;
      if (!rows) return `${sub}<label class="drop" id="imp-drop">${ICON.upload}<b>Kéo thả hoặc chọn file câu hỏi</b><span class="adm-hint">.xlsx, .csv, .docx, .pdf · tối đa ${C.MAX_MB} MB · tối đa ${C.MAX_FILE_Q} câu</span><input type="file" id="imp-file" accept=".xlsx,.csv,.docx,.pdf" hidden></label>
        ${err ? `<div class="field__error">${ICON.alert}${esc(err)}</div>` : ''}`;
      const good = rows.filter((r) => !r.errs.length), bad = rows.length - good.length;
      return `${sub}<div class="imp-sum">${LH.Tag(rows.name, 'neutral')}${LH.Tag(good.length + ' câu hợp lệ', 'published')}${bad ? LH.Tag(bad + ' câu lỗi — bỏ qua', 'pending') : ''}${exam ? LH.Tag('Cộng thêm ' + C.total(good.map((r) => r.q)) + ' điểm', 'info') : ''}<span class="grow"></span><button class="btn btn--link" data-imp-again>Chọn file khác</button></div>
        <div class="adm-scroll imp-wrap"><table class="adm-table imp-table"><thead><tr><th>Vị trí</th><th>Câu hỏi</th><th>Loại</th><th>Đáp án</th>${exam ? '<th class="num">Điểm</th>' : ''}<th>Kết quả</th></tr></thead><tbody>
        ${rows.map((r) => `<tr class="${r.errs.length ? 'is-bad' : ''}"><td>${r.line}</td><td>${esc(r.q.text) || '<i>(trống)</i>'}<div class="adm-hint">${r.q.options.length} lựa chọn</div></td><td>${C.TYPE_LABEL[r.q.type]}</td>
          <td>${r.q.type === 'tf' ? (r.q.correct.length ? C.TF[r.q.correct[0]] : '—') : r.q.correct.map((c) => C.KEYS[c]).join(', ') || '—'}</td>${exam ? `<td class="num">${r.q.score}</td>` : ''}
          <td>${r.errs.length ? `<span class="adm-hint is-error">${r.errs.map(esc).join('<br>')}</span>` : LH.Tag('Hợp lệ', 'published')}</td></tr>`).join('')}</tbody></table></div>`;
    }
    const openImport = () => { im = { rows: null, err: '' }; view = 'import'; msg = ''; draw(); };
    const take = (name, blocks) => {
      if (!blocks.length) im.err = 'Không tìm thấy câu hỏi nào trong file.';
      else if (blocks.length > C.MAX_FILE_Q) im.err = `File có ${blocks.length} câu, vượt giới hạn ${C.MAX_FILE_Q} câu / file.`;
      else { im.rows = C.validateBlocks(blocks, bankOf(cur), banks()); im.rows.name = name; im.err = ''; }
      draw();
    };
    const handle = (f) => { if (f) C.readFile(f).then((b) => take(f.name, b)).catch((er) => { im.err = er.message; draw(); }); };
    const demo = (kind) => {
      if (kind === 'pdf') take('Luyen_tap_Domain1.pdf', C.fromText(C.DEMO_PDF));
      else if (kind === 'scan') { im.err = C.PDF_SCAN_ERR + ' (Bien_ban_scan.pdf)'; draw(); }
      else take('Cau_hoi_Domain1.docx', C.fromText(C.DEMO_DOCX));
    };

    /* ----- Chân popup ----- */
    function drawFoot() {
      const f = el.querySelector('.modal__foot');
      if (view === 'editor') { f.innerHTML = `<button class="btn-cta btn-cta--line" data-qw-back>Huỷ</button>${ed.k < 0 ? '<button class="btn-cta btn-cta--soft" data-qe-save="more">Lưu và thêm câu khác</button>' : ''}<button class="btn-cta" data-qe-save="one">${ed.k >= 0 ? 'Lưu thay đổi' : 'Lưu câu hỏi'}</button>`; return; }
      if (view === 'import') { const good = im.rows ? im.rows.filter((r) => !r.errs.length).length : 0;
        f.innerHTML = `<button class="btn-cta btn-cta--line" data-qw-back>Huỷ</button><button class="btn-cta" data-imp-ok ${good ? '' : 'disabled'}>${!im.rows ? 'Nhập câu hợp lệ' : good ? `Nhập ${good} câu hợp lệ` : 'Không có câu hợp lệ'}</button>`; return; }
      const last = cur === 3 || (cur === 2 && !W.practice);
      f.innerHTML = `<span class="grow adm-hint">${dirty() ? 'Có thay đổi chưa lưu' : ''}</span>`
        + (cur === 1 ? '<button class="btn-cta btn-cta--line" data-qz-x="qz-wiz">Huỷ</button>' : '<button class="btn-cta btn-cta--line" data-qw-prev>Quay lại</button>')
        + (isNew ? '<button class="btn-cta btn-cta--soft" data-qw-draft>Lưu nháp</button>' : '<button class="btn-cta btn-cta--soft" data-qw-finish>Lưu quiz</button>')
        + (last ? `<button class="btn-cta" data-qw-finish>${isNew ? `${ICON.check}Tạo quiz` : 'Lưu quiz'}</button>` : `<button class="btn-cta" data-qw-next>Tiếp tục: ${cur === 1 ? 'Đề thi' : 'Luyện tập'}</button>`);
      if (!isNew && last) f.querySelector('.btn-cta--soft').remove();
    }

    function draw() {
      drawSteps();
      const body = el.querySelector('#qw-body');
      body.innerHTML = cur === 1 ? info() : view === 'editor' ? editor() : view === 'import' ? importer() : bankList();
      drawFoot();
    }
    const scrollTop = () => { el.querySelector('.modal__body').scrollTop = 0; };

    /* ----- Điều hướng ----- */
    function go(n) {
      if (n === cur) return;
      if (n === 3 && !W.practice) { cur = 3; view = 'list'; msg = ''; draw(); return; }
      if (cur === 1) { tried1 = true; if (bankErr(1)) { draw(); return; } }
      if (n > cur && cur === 2 && bankErr(2)) { msg = bankErr(2); draw(); scrollTop(); return; }
      cur = n; view = 'list'; msg = ''; draw(); scrollTop();
    }
    function finish(draft) {
      tried1 = true;
      if (draft) { if (infoErrs().title) { cur = 1; view = 'list'; draw(); return; } return done(true); }
      for (const s of [1, 2, 3]) { const m = bankErr(s); if (m) { cur = s; view = 'list'; msg = s > 1 ? m : ''; draw(); scrollTop(); return; } }
      const step2 = () => {
        if (!isNew && JSON.stringify(W.exam) !== examBefore && ctx.inProgress) {
          return AdminConfirm({ title: `Lưu thành đề phiên bản v${(W.version || 1) + 1}?`, text: `${ctx.inProgress} học viên đang dở lượt sẽ làm tiếp đề v${W.version || 1}. Lượt mới từ giờ dùng đề v${(W.version || 1) + 1}.`, ok: 'Lưu phiên bản mới',
            onOk: () => { W.version = (W.version || 1) + 1; done(false); } });
        }
        done(false);
      };
      if (practiceWas && !W.practice && W.practice_q.length) return AdminConfirm({ title: 'Tắt chế độ luyện tập?', text: `Học viên không còn thấy ${W.practice_q.length} câu luyện tập. Bộ câu vẫn được giữ, bật lại là dùng được.`, ok: 'Tắt luyện tập', onOk: step2 });
      step2();
    }
    function done(draft) {
      W.title = W.title.trim(); el.remove(); onSave(W, { draft });
      if (draft) toast(bankErr(2) || bankErr(3) ? 'Đã lưu nháp quiz — còn thiếu câu hỏi, bổ sung trước khi gửi duyệt' : 'Đã lưu nháp quiz');
      else toast(ctx.creatorLive ? 'Đã lưu vào bản sửa — nhớ Gửi duyệt' : isNew ? `Đã tạo quiz: ${W.exam.length} câu Exam${W.practice ? ` · ${W.practice_q.length} câu Practice` : ''}` : W.version > 1 && JSON.stringify(W.exam) !== examBefore ? `Đã lưu đề v${W.version}` : 'Đã lưu quiz');
    }
    const close = () => {
      if (!dirty()) return el.remove();
      AdminConfirm({ danger: true, title: isNew ? 'Bỏ quiz đang tạo?' : 'Bỏ thay đổi chưa lưu?', text: isNew ? 'Thông tin và câu hỏi vừa nhập sẽ không được lưu. Bấm "Lưu nháp" nếu muốn làm tiếp sau.' : 'Các thay đổi thông tin và câu hỏi sẽ không được lưu.', ok: isNew ? 'Bỏ quiz' : 'Bỏ thay đổi', onOk: () => el.remove() });
    };
    el.addEventListener('qz-close', close);

    /* ----- Sự kiện ----- */
    el.addEventListener('input', (e) => {
      const t = e.target;
      if (t.id === 'qf-title') { W.title = t.value; drawSteps(); }
      else if (t.id === 'qf-desc') W.desc = t.value;
      else if (t.id === 'qf-min') W.minutes = +t.value;
      else if (t.id === 'qf-pass') W.pass = +t.value;
      else if (view === 'editor') {
        const d = ed.draft;
        if (t.id === 'qe-text') { d.text = t.value; el.querySelector('#qe-n').textContent = t.value.length; }
        if (t.id === 'qe-ex') d.explain = t.value;
        if (t.id === 'qe-score') d.score = t.value;
        if (t.dataset.o != null) d.options[+t.dataset.o] = t.value;
      }
    });
    el.addEventListener('change', (e) => {
      const t = e.target;
      if (t.id === 'qf-nolimit') { W.noLimit = t.checked; el.querySelector('#qf-min').disabled = t.checked; return; }
      if (t.id === 'qf-shuffle') { W.shuffle = t.checked; return; }
      if (t.id === 'qf-practice') { W.practice = t.checked; el.querySelector('#qf-practice-hint').textContent = practiceHint(); drawSteps(); drawFoot(); return; }
      if (t.id === 'imp-file') { handle(t.files[0]); return; }
      if (view === 'editor' && t.dataset.c != null) { const i = +t.dataset.c, d = ed.draft;
        d.correct = d.type !== 'multi' ? [i] : (t.checked ? [...d.correct, i].sort() : d.correct.filter((x) => x !== i)); draw(); }
    });
    el.addEventListener('dragover', (e) => { const d = e.target.closest('#imp-drop'); if (d) { e.preventDefault(); d.classList.add('is-over'); } });
    el.addEventListener('dragleave', (e) => { const d = e.target.closest('#imp-drop'); if (d) d.classList.remove('is-over'); });
    el.addEventListener('drop', (e) => { const d = e.target.closest('#imp-drop'); if (d) { e.preventDefault(); handle(e.dataTransfer.files[0]); } });
    el.addEventListener('click', (e) => {
      const c = (s) => e.target.closest(s);
      let x;
      if ((x = c('[data-qw-go]'))) return go(+x.dataset.qwGo);
      if (c('[data-qw-next]')) return go(cur + 1);
      if (c('[data-qw-prev]')) return go(cur === 3 || W.practice ? cur - 1 : 1);
      if (c('[data-qw-draft]')) return finish(true);
      if (c('[data-qw-finish]')) return finish(false);
      if (c('[data-qw-on]')) { W.practice = true; draw(); toast('Đã bật Cho phép luyện tập'); return; }
      if (c('[data-qw-back]')) { view = 'list'; draw(); return; }
      if (c('[data-qw-add]')) return openEditor(-1);
      if (c('[data-qw-import]')) return openImport();
      if ((x = c('[data-qw-del]'))) { const k = +x.dataset.qwDel, L = listOf(cur);
        AdminConfirm({ danger: true, title: 'Bạn chắc chắn muốn xoá câu hỏi này?', text: esc(L[k].text), ok: 'Xoá', onOk: () => { L.splice(k, 1); msg = ''; draw(); toast(`Đã xoá câu ${k + 1}`); } }); return; }
      if ((x = c('[data-qw-edit]'))) return openEditor(+x.dataset.qwEdit);
      /* import */
      if ((x = c('[data-imp-demo]'))) return demo(x.dataset.impDemo);
      if (c('[data-imp-again]')) { im = { rows: null, err: '' }; draw(); return; }
      if (c('[data-imp-ok]') && im?.rows) { const good = im.rows.filter((r) => !r.errs.length).map((r) => r.q), L = listOf(cur), from = L.length + 1;
        L.push(...good); view = 'list'; msg = ''; draw(); toast(`Đã nhập ${good.length} câu (câu ${from}–${L.length})`); return; }
      /* editor */
      if (view !== 'editor') return;
      const d = ed.draft;
      if ((x = c('[data-type]'))) { const was = d.type; d.type = x.dataset.type;
        if (d.type === 'tf' && was !== 'tf') { d.options = [...C.TF]; d.correct = []; } else if (was === 'tf' && d.type !== 'tf') { d.options = ['', '', '', '']; d.correct = []; }
        if (d.type !== 'multi' && d.correct.length > 1) d.correct = [d.correct[0]]; draw(); return; }
      if (c('[data-addopt]')) { d.options.push(''); draw(); return; }
      if ((x = c('[data-rm]')) && d.options.length > C.MIN_OPT) { const i = +x.dataset.rm; d.options.splice(i, 1); d.correct = d.correct.filter((v) => v !== i).map((v) => (v > i ? v - 1 : v)); draw(); return; }
      if (!(x = c('[data-qe-save]'))) return;
      const b = bankOf(cur), L = listOf(cur), k = ed.k;
      ed.tried = true; d.text = d.text.trim(); d.options = d.options.map((o) => o.trim()); d.explain = d.explain.trim(); d.score = +d.score || 0;
      if (C.check(d, b, banks(), k).length) { draw(); scrollTop(); return; }
      if (k >= 0) L[k] = d; else L.push(d);
      const n = k >= 0 ? k + 1 : L.length;
      if (x.dataset.qeSave === 'more') { toast(`Đã thêm câu ${n}`); ed = { k: -1, draft: C.blank(), tried: false }; draw(); scrollTop(); el.querySelector('#qe-text').focus(); }
      else { view = 'list'; draw(); toast(k >= 0 ? `Đã cập nhật câu ${n}` : `Đã thêm câu ${n}`); }
    });

    draw();
    if (cur > 1 && (cur === 2 || W.practice)) {
      if (ctx.open === 'add') openEditor(-1);
      else if (ctx.open === 'edit' && listOf(cur).length) openEditor(0);
      else if (/^(import|importdemo|importpdf|pdfscan)$/.test(ctx.open || '')) { openImport(); if (ctx.open !== 'import') demo({ importdemo: 'docx', importpdf: 'pdf', pdfscan: 'scan' }[ctx.open]); }
    }
    if (cur === 1) el.querySelector('#qf-title').focus();
    return el;
  }

  /* Lớp gọi cũ → wizard (giữ để trang khác chạy được) */
  const openForm = ({ quiz, ctx, onSave }) => openWizard({ quiz, step: 1, ctx, onSave });
  const openManager = ({ quiz, ctx = {}, onSave }) => openWizard({ quiz, step: ctx.tab === 'practice' ? 3 : 2, ctx, onSave });

  window.LHQuiz = { openWizard, openForm, openManager, confirmDelete, modal, clone };
})();
