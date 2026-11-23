/* Period picker — chọn kỳ báo cáo Tuần / Tháng (Learning Report).
 * Key giữ format cũ: tháng `m:yyyy-mm`, tuần `w:yyyy-mm-dd` (ngày Thứ Hai, tuần ISO-8601 Thứ Hai → Chủ Nhật).
 *
 *   LH.PeriodPicker({ id, type: 'week'|'month', value, min: 'yyyy-mm-dd', today: 'yyyy-mm-dd' }) → HTML
 *   Chọn kỳ (ô lịch, ‹ ›, "This week/month") → phát sự kiện `lh-pp-change` (bubbles) với detail.value.
 *   LH.period: helper ngày dùng chung (keyOf, label, start, end, shift, dmy, isCurrent, clamp).
 */
(function () {
  const LH = window.LH;
  const { ICON, esc } = LH;
  const pad = (n) => String(n).padStart(2, '0');
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MONL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  /* ---------- Helper ngày (giờ địa phương, không lệch múi giờ) ---------- */
  const parse = (s) => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d || 1); };
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addD = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const monday = (d) => addD(d, -((d.getDay() + 6) % 7));
  const isoWeek = (d) => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
    return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7);
  };
  const dm = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  const dmy = (d) => `${dm(d)}/${d.getFullYear()}`;
  const isMonth = (k) => k[0] === 'm';
  const start = (k) => parse(k.slice(2));
  const end = (k) => { const s = start(k); return isMonth(k) ? new Date(s.getFullYear(), s.getMonth() + 1, 0) : addD(s, 6); };
  const keyOf = (type, d) => type === 'month' ? `m:${d.getFullYear()}-${pad(d.getMonth() + 1)}` : `w:${ymd(monday(d))}`;
  const label = (k) => isMonth(k) ? `${k.slice(7)}/${k.slice(2, 6)}` : `${dm(start(k))} – ${dmy(end(k))}`;
  const shift = (k, n) => { const s = start(k); return isMonth(k) ? keyOf('month', new Date(s.getFullYear(), s.getMonth() + n, 1)) : keyOf('week', addD(s, 7 * n)); };
  const bounds = (type, min, today) => [keyOf(type, parse(min)), keyOf(type, parse(today))];
  const isCurrent = (k, today) => k === keyOf(isMonth(k) ? 'month' : 'week', parse(today));
  /* Đổi loại kỳ giữ mốc thời gian. Tháng → tuần: tuần chứa ngày cuối tháng (hoặc hôm nay nếu tháng hiện tại).
   * Tuần → tháng: tháng chứa Thứ Năm của tuần (quy tắc ISO: tuần thuộc tháng có phần lớn ngày). */
  const convert = (k, type, today) => {
    const t = parse(today);
    let anchor = isMonth(k) ? end(k) : addD(start(k), 3);
    if (anchor > t) anchor = t;
    return keyOf(type, anchor);
  };

  /* ---------- Trigger ---------- */
  const unit = (type) => type === 'month' ? 'month' : 'week';
  function PeriodPicker({ id, type = 'month', value, min, today }) {
    const [lo, hi] = bounds(type, min, today);
    const prevOff = value <= lo, nextOff = value >= hi, cur = value === hi;
    const step = (dir, off, tip) => `<button type="button" class="lh-pp__step" data-pp-step="${dir}" aria-label="${dir < 0 ? 'Previous' : 'Next'} ${unit(type)}" title="${esc(off ? tip : `${dir < 0 ? 'Previous' : 'Next'} ${unit(type)}`)}" ${off ? 'aria-disabled="true"' : ''}>${dir < 0 ? ICON.chevronL : ICON.chevronR}</button>`;
    return `<div class="lh-pp lh-pp--${type}" id="${esc(id)}" data-pp data-type="${type}" data-value="${esc(value)}" data-min="${esc(min)}" data-today="${esc(today)}">
      ${step(-1, prevOff, `No data before ${label(lo)}`)}
      <button type="button" class="lh-pp__btn" aria-haspopup="dialog" aria-expanded="false" aria-label="${type === 'month' ? 'Month' : 'Week'}: ${esc(label(value))}${cur ? ' (current)' : ''}">
        ${ICON.calendar}<span class="lh-pp__lbl">${esc(label(value))}</span>${cur ? '<span class="lh-pp__cur">Current</span>' : ''}${ICON.chevronD}
      </button>
      ${step(1, nextOff, 'Future periods are not available')}
      <div class="lh-pp__pop" role="dialog" aria-label="Select ${unit(type)}" hidden></div>
    </div>`;
  }

  /* ---------- Popover ---------- */
  const S = { el: null, view: null, focus: null }; // view: Date ngày 01 (tháng) — Month xem cả năm, Week xem 1 tháng
  const cfg = (el) => { const d = el.dataset; const [lo, hi] = bounds(d.type, d.min, d.today); return { type: d.type, value: d.value, lo, hi, today: parse(d.today) }; };

  function paint() {
    const el = S.el; if (!el) return;
    const c = cfg(el), pop = el.querySelector('.lh-pp__pop'), v = S.view;
    const off = (k) => k < c.lo || k > c.hi;
    const why = (k) => k > c.hi ? 'Future period' : `No data before ${label(c.lo)}`;
    let head, body, foot;
    if (c.type === 'month') {
      const y = v.getFullYear();
      head = { title: String(y), prev: `m:${y - 1}-12` < c.lo, next: `m:${y + 1}-01` > c.hi, unit: 'year' };
      body = `<div class="lh-pp__months" role="grid" aria-label="${y}">${MON.map((m, i) => {
        const k = `m:${y}-${pad(i + 1)}`, dis = off(k);
        return `<button type="button" role="gridcell" class="lh-pp__m ${k === c.value ? 'is-sel' : ''} ${k === c.hi ? 'is-cur' : ''}" data-pp-pick="${k}" aria-selected="${k === c.value}" ${dis ? `aria-disabled="true" title="${why(k)}"` : ''} tabindex="${k === S.focus ? 0 : -1}" aria-label="${MONL[i]} ${y}">${m}</button>`;
      }).join('')}</div>`;
      foot = 'This month';
    } else {
      const y = v.getFullYear(), mo = v.getMonth(), last = new Date(y, mo + 1, 0);
      head = { title: `${MONL[mo]} ${y}`, prev: keyOf('week', addD(v, -1)) < c.lo, next: keyOf('week', addD(last, 1)) > c.hi, unit: 'month' };
      const rows = [];
      for (let d = monday(v); d <= last; d = addD(d, 7)) rows.push(d);
      const todayY = ymd(c.today);
      body = `<div class="lh-pp__weeks" role="grid" aria-label="${MONL[mo]} ${y}">
        <div class="lh-pp__dow" aria-hidden="true"><span>Wk</span>${DOW.map((x) => `<span>${x}</span>`).join('')}</div>
        ${rows.map((d) => {
          const k = keyOf('week', d), dis = off(k);
          return `<button type="button" role="row" class="lh-pp__w ${k === c.value ? 'is-sel' : ''} ${k === c.hi ? 'is-cur' : ''}" data-pp-pick="${k}" aria-selected="${k === c.value}" ${dis ? `aria-disabled="true" title="${why(k)}"` : ''} tabindex="${k === S.focus ? 0 : -1}" aria-label="Week ${isoWeek(d)}: ${label(k)}">
            <span class="lh-pp__wn">${isoWeek(d)}</span>${[0, 1, 2, 3, 4, 5, 6].map((i) => { const x = addD(d, i); return `<span class="lh-pp__d ${x.getMonth() !== mo ? 'is-out' : ''} ${ymd(x) === todayY ? 'is-today' : ''}">${x.getDate()}</span>`; }).join('')}
          </button>`;
        }).join('')}
      </div>`;
      foot = 'This week';
    }
    const nav = (dir, dis) => `<button type="button" class="lh-pp__nav" data-pp-nav="${dir}" aria-label="${dir < 0 ? 'Previous' : 'Next'} ${head.unit}" ${dis ? 'disabled' : ''}>${dir < 0 ? ICON.chevronL : ICON.chevronR}</button>`;
    pop.innerHTML = `<div class="lh-pp__head">${nav(-1, head.prev)}<b aria-live="polite">${head.title}</b>${nav(1, head.next)}</div>${body}
      <div class="lh-pp__foot"><button type="button" class="lh-pp__today" data-pp-pick="${c.hi}">${foot}</button></div>`;
  }
  const viewOf = (k) => { const s = isMonth(k) ? start(k) : addD(start(k), 3); return isMonth(k) ? new Date(s.getFullYear(), 0, 1) : new Date(s.getFullYear(), s.getMonth(), 1); };
  function focusCell() { S.el?.querySelector(`.lh-pp__pop [data-pp-pick="${S.focus}"]:not(.lh-pp__today)`)?.focus(); }

  function open(el) {
    close();
    S.el = el; S.focus = el.dataset.value; S.view = viewOf(S.focus);
    paint();
    el.querySelector('.lh-pp__pop').hidden = false;
    el.querySelector('.lh-pp__btn').setAttribute('aria-expanded', 'true');
    el.classList.add('is-open');
    focusCell();
  }
  function close(refocus) {
    const el = S.el; if (!el) return;
    S.el = null;
    if (!el.isConnected) return;
    el.querySelector('.lh-pp__pop').hidden = true;
    el.classList.remove('is-open');
    const b = el.querySelector('.lh-pp__btn'); b.setAttribute('aria-expanded', 'false');
    if (refocus) b.focus();
  }
  /* Phát sự kiện đổi kỳ; trang vẽ lại → trả focus về đúng điều khiển (cùng id) */
  function emit(el, value, refocus) {
    const id = el.id;
    close();
    if (value === el.dataset.value) { document.querySelector(`#${id} ${refocus}`)?.focus(); return; }
    el.dispatchEvent(new CustomEvent('lh-pp-change', { bubbles: true, detail: { value, type: el.dataset.type } }));
    requestAnimationFrame(() => document.querySelector(`#${id} ${refocus}`)?.focus());
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-pp]');
    if (!el) { close(); return; }
    const c = cfg(el);
    const st = e.target.closest('[data-pp-step]');
    if (st) {
      if (st.getAttribute('aria-disabled') === 'true') return;
      const dir = +st.dataset.ppStep;
      emit(el, shift(c.value, dir), `[data-pp-step="${dir}"]`); return;
    }
    if (e.target.closest('.lh-pp__btn')) { S.el === el ? close(true) : open(el); return; }
    const nv = e.target.closest('[data-pp-nav]');
    if (nv) {
      const n = +nv.dataset.ppNav;
      S.view = c.type === 'month' ? new Date(S.view.getFullYear() + n, 0, 1) : new Date(S.view.getFullYear(), S.view.getMonth() + n, 1);
      paint();
      (el.querySelector(`[data-pp-nav="${n}"]:not([disabled])`) || el.querySelector(`[data-pp-nav="${-n}"]`))?.focus();
      return;
    }
    const pk = e.target.closest('[data-pp-pick]');
    if (pk) { if (pk.getAttribute('aria-disabled') === 'true') return; emit(el, pk.dataset.ppPick, '.lh-pp__btn'); }
  });

  document.addEventListener('keydown', (e) => {
    const el = S.el;
    if (!el || !el.contains(e.target)) return;
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (!e.target.closest('[data-pp-pick]:not(.lh-pp__today)')) return;
    const c = cfg(el), m = c.type === 'month';
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: m ? -3 : -1, ArrowDown: m ? 3 : 1 }[e.key];
    let k = null;
    if (delta) k = shift(S.focus, delta);
    else if (e.key === 'PageUp' || e.key === 'PageDown') {
      const n = e.key === 'PageUp' ? -1 : 1, s = start(S.focus);
      k = m ? shift(S.focus, 12 * n) : keyOf('week', new Date(s.getFullYear(), s.getMonth() + n, s.getDate()));
    } else return;
    e.preventDefault();
    if (k < c.lo) k = c.lo; if (k > c.hi) k = c.hi;
    S.focus = k; S.view = viewOf(k);
    paint(); focusCell();
  });
  /* Tab ra khỏi khối → đóng */
  document.addEventListener('focusin', (e) => { if (S.el && !S.el.contains(e.target)) close(); });

  LH.PeriodPicker = PeriodPicker;
  LH.period = { keyOf, label, start, end, shift, convert, isCurrent, dmy, parse };
})();
