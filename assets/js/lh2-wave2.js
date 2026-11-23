/* LH2 · Đợt 2 + Chúc mừng — module riêng, nạp sau components.js. Không sửa components.js (phiên Đợt 1 đang sửa).
 *
 * LHW2.ttGrad({ play })            → HTML Techter đội mũ cử nhân, vẫy tay (ảnh mascot chuẩn TECHVIFY + mũ SVG + tia lấp lánh).
 *                                     23/11: bỏ áo choàng vẽ đè lên ảnh (che tay, lệch tay áo, lòi chân) — chờ brand có ảnh Techter mặc áo cử nhân thì thay IMG.
 *                                     Tạm thời: Figma TECHTER (5.5 Mascot & Usage) chưa có tư thế cử nhân vỗ tay → design vẽ biến thể, brand duyệt (D-148).
 * LHW2.fireworks()                 → pháo hoa toàn màn ~3 giây, không lặp, không chặn bấm.
 * LHW2.passBanner({ quiz })        → băng chúc mừng cho màn Kết quả bài thi khi lượt vừa nộp Passed (Exam 3.3, BR-EX-19).
 * LHW2.courseCompleted({ learner, course, completedAt, certNo, certHref, rate, onRated, onClose })
 *                                  → popup chúc mừng hoàn thành khoá: pháo hoa + Techter + chứng chỉ, nút Download Certificate
 *                                    (Learning Progress 3.3, BR-LP-13). Đóng popup → mở Rate this course nếu rate !== false (D-173).
 * LHW2.rateCourse({ course, onSubmit }) → popup Rate this course (Learner Experience 3.6, BR-LP-11).
 * LHW2.pop({ title, desc, body, ok, cancel, danger, onOk }) → popup chung; onOk trả false để giữ popup (báo lỗi field).
 */
(function () {
  const { esc, toast } = window.LH;
  const IMG = '../assets/img/techter-climb.webp';
  const CAP = '<svg viewBox="0 0 100 64"><path d="M26 28v14q24 14 48 0V28L50 38Z" fill="#232838"/><polygon points="50,4 98,21 50,38 2,21" fill="#151a28" stroke="#3b4258" stroke-width="1.5"/><circle cx="50" cy="21" r="3.2" fill="#f2bf3f"/><path d="M50 21 L84 27 L84 46" stroke="#f2bf3f" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="80" y="44" width="8" height="12" rx="2" fill="#f2bf3f"/></svg>';
  const CLAP = '<svg class="clap" viewBox="0 0 60 60" aria-hidden="true"><path d="M10 30 L2 26M14 18 L8 8M26 14 L28 2M38 18 L46 10"/></svg>';
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ttGrad = ({ play = true } = {}) => `<span class="tt-grad ${play ? 'tt-grad--play' : ''}" role="img" aria-label="Techter, the TECHVIFY mascot, in a graduation cap waving"><img src="${IMG}" alt="" draggable="false"><span class="cap">${CAP}</span>${CLAP}</span>`;

  /* Pháo hoa: 3 chùm nổ + pháo giấy rơi, dừng hẳn sau ~3 giây */
  function fireworks() {
    if (reduce()) return;
    const cv = document.createElement('canvas'); cv.className = 'cel-fx'; cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const W = cv.width = innerWidth, H = cv.height = innerHeight, cx = cv.getContext('2d');
    const pal = ['#f2bf3f', '#41c8ff', '#2a28df', '#d13a32', '#1f9d55', '#ff7ac6', '#ffffff'];
    let parts = [];
    const burst = (x, y) => { for (let i = 0; i < 70; i++) { const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 6; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: 2 + Math.random() * 3, c: pal[i % pal.length], life: 60 + Math.random() * 30, kind: 'spark' }); } };
    const paper = () => { for (let i = 0; i < 90; i++) parts.push({ x: Math.random() * W, y: -20 - Math.random() * H * .4, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, s: 6 + Math.random() * 6, c: pal[i % pal.length], a: Math.random() * 6, va: (Math.random() - .5) * .3, life: 200, kind: 'paper' }); };
    burst(W * .25, H * .3); paper();
    setTimeout(() => burst(W * .75, H * .25), 350);
    setTimeout(() => burst(W * .5, H * .18), 750);
    const end = performance.now() + 3000;
    (function tick(t) {
      cx.clearRect(0, 0, W, H);
      parts = parts.filter((p) => p.life > 0 && p.y < H + 30);
      parts.forEach((p) => {
        p.life--; p.x += p.vx; p.y += p.vy;
        if (p.kind === 'spark') { p.vy += .08; p.vx *= .98; cx.globalAlpha = Math.max(0, p.life / 90); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.s, 0, 7); cx.fill(); }
        else { p.a += p.va; cx.globalAlpha = 1; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore(); }
      });
      if ((t || 0) < end && parts.length) requestAnimationFrame(tick); else cv.remove();
    })();
  }

  const passBanner = ({ quiz = 'Quiz' } = {}) =>
    `<section class="cel-pass" role="status">${ttGrad()}<div><h2>Congratulations! You passed ${esc(quiz)}.</h2><p>Correct answers and explanations are now available. This exam is complete.</p></div></section>`;

  /* Popup hoàn thành khoá — một lần cho mỗi học viên mỗi khoá (BR-LP-13); Close / bấm ngoài / Esc để đóng */
  function courseCompleted({ learner = 'Hara Nguyen', course = 'Course', completedAt = '2026-11-20T09:00:00', certNo = 'LH-QA-M1-2026-0118', certHref = 'certificate.html', rate = true, onRated, onClose } = {}) {
    /* Cùng một bản ghi chứng chỉ với màn View Certificate → ngày, số khớp nhau */
    if (!/[?&]c=/.test(certHref)) certHref += (certHref.includes('?') ? '&' : '?') + 'c=' + encodeURIComponent(course); // mở đúng khoá vừa xong
    if (window.LHCert) { const c = LHCert.get(course) || LHCert.mint({ courseTitle: course, completedAt: new Date(completedAt).toISOString(), certificateNumber: certNo }); completedAt = c.completedAt; certNo = c.certificateNumber; learner = c.learnerName || learner; }
    const el = document.createElement('div'); el.className = 'cel-modal';
    el.innerHTML = `<div class="cel-card" role="dialog" aria-modal="true" aria-labelledby="cel-t">
      <button class="cel-card__x" data-cel-close aria-label="Close">×</button>
      ${ttGrad()}
      <h2 id="cel-t">Congratulations, ${esc(learner)}!</h2>
      <p>You have completed <b>${esc(course)}</b>.</p>
      <div class="cel-cert"><div class="cel-cert__in">${LH.CertificateSheet({ learnerName: learner, courseTitle: course, completedAt, certificateNumber: certNo })}</div></div>
      <div class="cel-card__foot"><a class="cel-btn cel-btn--line" style="display:inline-grid;place-items:center;text-decoration:none" href="${esc(certHref)}">View Certificate</a><button class="cel-btn" data-cel-dl>${LH.ICON.download || ''}Download Certificate</button></div></div>`;
    document.body.appendChild(el);
    const fit = () => { const box = el.querySelector('.cel-cert'), inn = el.querySelector('.cel-cert__in'); const k = (box.clientWidth - 24) / 1122; inn.style.transform = `scale(${k})`; box.style.height = (inn.scrollHeight * k + 24) + 'px'; };
    if (LH.fitCertText) { LH.fitCertText(el); if (document.fonts) document.fonts.ready.then(() => LH.fitCertText(el)); }
    fit(); addEventListener('resize', fit);
    /* D-173: đóng popup chúc mừng → mở Rate this course (một lần, bỏ qua được bằng Later) */
    const close = () => { el.remove(); removeEventListener('resize', fit); removeEventListener('keydown', esc_); if (onClose) onClose(); if (rate) rateCourse({ course, onSubmit: onRated }); };
    const esc_ = (e) => { if (e.key === 'Escape') close(); };
    addEventListener('keydown', esc_);
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-cel-dl]')) { toast(`Certificate downloaded · Certificate_${certNo}.pdf`); return; }
      if (e.target === el || e.target.closest('[data-cel-close]')) close();
    });
    el.querySelector('[data-cel-dl]').focus({ preventScroll: true });
    fireworks();
    return el;
  }

  /* Popup chung (field lỗi hiện tại chỗ, onOk trả false thì giữ popup) */
  function pop({ title, desc = '', body = '', ok = 'Confirm', cancel = 'Cancel', danger = false, onOk } = {}) {
    const adm = document.body.classList.contains('adm-body');
    const el = document.createElement('div'); el.className = 'w2-pop';
    el.innerHTML = `<div class="w2-pop__card" role="dialog" aria-modal="true"><h3>${esc(title)}</h3>${desc ? `<p>${desc}</p>` : ''}${body}
      <div class="w2-pop__foot">${cancel ? `<button class="${adm ? 'btn-cta btn-cta--line' : 'wbtn wbtn--outline'}" data-x>${esc(cancel)}</button>` : ''}<button class="${adm ? `btn-cta ${danger ? 'btn-cta--danger' : ''}` : 'wbtn'}" data-ok>${esc(ok)}</button></div></div>`;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.closest('[data-x]')) el.remove();
      if (e.target.closest('[data-ok]')) { if (!onOk || onOk(el) !== false) el.remove(); }
    });
    return el;
  }

  function rateCourse({ course = 'this course', onSubmit } = {}) {
    let v = 0;
    const body = `<div class="w2-field"><span>Rating</span><div class="rate-stars" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? 's' : ''}">★</button>`).join('')}</div><div class="rate-err" data-err hidden>Please select a rating from 1 to 5 stars.</div></div>
      <label class="w2-field"><span>Comment <small style="font-weight:400;color:var(--c-text-subtle)">(optional)</small></span><textarea maxlength="1000" data-cm placeholder="Share what you liked or what could be better"></textarea></label>`;
    const el = pop({ title: 'Rate this course', desc: `How was <b>${esc(course)}</b>?`, body, ok: 'Submit', cancel: 'Later',
      onOk: (p) => { if (!v) { p.querySelector('[data-err]').hidden = false; return false; } toast('Thanks for your feedback!'); if (onSubmit) onSubmit({ stars: v, comment: p.querySelector('[data-cm]').value.trim() }); } });
    el.addEventListener('click', (e) => { const b = e.target.closest('[data-star]'); if (!b) return; v = +b.dataset.star; el.querySelectorAll('[data-star]').forEach((s) => { const on = +s.dataset.star <= v; s.classList.toggle('is-on', on); s.setAttribute('aria-checked', +s.dataset.star === v); }); el.querySelector('[data-err]').hidden = true; });
    return el;
  }

  /* ---------- Learner Experience — thẻ khoá tiếng Anh (3.1, 3.2, 3.3). Dùng lại class .course-card của web ----------
   * st: none | learning | done | fail | closed | removed · restricted · paid · mand · start ('dd/mm') · sched ('dd/mm – dd/mm/yyyy') · overdue */
  const ST = { learning: ['In Progress', 'cc-tag--upcoming'], done: ['Completed', 'cc-tag--ok'], fail: ['Failed', 'cc-tag--fail'], closed: ['Closed', 'cc-tag--restricted'], removed: ['Access Removed', 'cc-tag--restricted'] };
  function card(c, { q = '', mine = false } = {}) {
    const { ICON, highlight, WebProgress } = LH;
    const p = c.progress || 0;
    const tags = [];
    if (ST[c.st]) tags.push(`<span class="cc-tag ${ST[c.st][1]}">${c.st === 'learning' ? `In Progress ${p}%` : ST[c.st][0]}</span>`);
    if (c.restricted) tags.push(`<span class="cc-tag cc-tag--restricted">${ICON.lock}Restricted</span>`);
    if (c.mand) tags.push('<span class="cc-tag cc-tag--fail">Mandatory</span>');
    if (c.paid) tags.push('<span class="cc-tag cc-tag--upcoming">Paid</span>');
    if (c.start) tags.push(`<span class="cc-tag cc-tag--upcoming">${ICON.clock}Starts ${esc(c.start)}</span>`);
    if (mine && c.overdue && c.st === 'learning') tags.push(`<span class="cc-tag cc-tag--fail">${ICON.clock}Overdue</span>`);
    const enrolled = c.st && c.st !== 'none';
    const split = [c.video && c.video[1] ? `Videos ${c.video[0]}/${c.video[1]}` : '', c.test && c.test[1] ? `Quizzes ${c.test[0]}/${c.test[1]}` : ''].filter(Boolean).join(' · ');
    const lines = [split ? `<span class="pg__split">${split}</span>` : '', mine && c.sched ? `<span>Schedule: ${esc(c.sched)}</span>` : '', c.st === 'done' && c.done ? `<span>Completed: ${esc(c.done)}</span>` : ''].filter(Boolean).join('');
    const label = c.restricted && !enrolled ? 'View Details' : ['closed', 'removed'].includes(c.st) ? 'View Details' : ['done', 'fail'].includes(c.st) ? 'View Course' : c.st === 'learning' ? 'Continue Learning' : 'Start Course';
    const outline = label !== 'Continue Learning' && label !== 'Start Course';
    return `<article class="course-card" data-state="${c.st || 'none'}" data-href="course-detail.html">
      <div class="course-card__cover">${c.cover ? `<img src="${c.cover}" alt="">` : ''}<span style="position:absolute;left:12px;top:12px;display:flex;flex-wrap:wrap;gap:6px">${tags.join('').replace(/class="cc-tag /g, 'style="position:static" class="cc-tag ')}</span></div>
      <div class="course-card__body">
        <h3 class="course-card__title">${q ? highlight(c.title, q) : esc(c.title)}</h3>
        <div class="course-card__desc">${esc(c.cat || '')}${c.sub ? ' · ' + esc(c.sub) : ''}</div>
        <div class="course-card__meta"><span>${ICON.lessons2 || ''}lessons: ${c.lessons}</span><span>${ICON.clock2 || ''}${esc(c.hours)}</span></div>
        ${enrolled ? `<div class="course-card__progress"><a href="course-detail.html" style="color:inherit;text-decoration:none">${WebProgress(p, 'Progress')}</a>${lines ? `<div class="cc-sub">${lines}</div>` : ''}</div>` : ''}
        <div class="course-card__foot"><a href="course-detail.html" class="grow"><button class="cc-btn ${outline ? 'cc-btn--outline' : ''}" ${c.start && !enrolled ? `disabled title="Opens on ${esc(c.start)}" style="opacity:.5;cursor:not-allowed"` : ''}>${label}</button></a></div>
      </div></article>`;
  }

  /* Tìm theo tên, Category, Sub Category; đủ mọi từ, không phân biệt dấu (BR-CS-01…03). Trả nhóm 1|2|3, 0 = không khớp */
  function rank(c, q) {
    const words = LH.norm(String(q || '').trim().replace(/\s+/g, ' ')).split(' ').filter(Boolean);
    if (!words.length) return 3;
    const t = LH.norm(c.title), cat = LH.norm(`${c.cat || ''} ${c.sub || ''}`);
    if (!words.every((w) => t.includes(w) || cat.includes(w))) return 0;
    if (t.startsWith(words.join(' '))) return 1;
    return words.every((w) => t.includes(w)) ? 2 : 3;
  }

  window.LHW2 = { ttGrad, fireworks, passBanner, courseCompleted, rateCourse, pop, card, rank };
})();
