/* LearningHub · Admin — màn khung (module LH2 không đổi): danh sách + form Tạo/Sửa/Chi tiết đúng bố cục Figma.
 * Mặc định "Chưa có dữ liệu" (Admin / Empty state). Demo bar đổi sang "Dữ liệu mẫu" để xem bố cục bảng như Figma.
 * Dùng: LHFrame.list({ active, eyebrow, title, desc, cta, search, filters, cols, rows, menu, empty, form, note }) */
(function () {
  const { ICON, esc, toast, AdminLayout, AdminHead, AdminTable, AdminEmpty, AdminConfirm, RowMenu, DemoBar } = LH;

  function field(f, v) {
    const val = v == null ? (f.value || '') : v;
    const lab = `<label>${esc(f.label)}${f.req ? ' <span class="req">*</span>' : ''}</label>`;
    const hint = f.hint ? `<span class="adm-hint">${f.hint}</span>` : '';
    const err = `<span class="adm-hint is-error" data-err hidden>${esc(f.label)} là bắt buộc.</span>`;
    let ctl;
    if (f.type === 'textarea') ctl = `<textarea class="adm-input" name="${f.key}" placeholder="${esc(f.ph || '')}" ${f.ro ? 'readonly' : ''}>${esc(val)}</textarea>`;
    else if (f.type === 'select') ctl = `<select class="adm-input" name="${f.key}" ${f.ro ? 'disabled' : ''}><option value="">${esc(f.ph || 'Chọn')}</option>${f.options.map((o) => `<option ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    else if (f.type === 'checks') {
      const on = Array.isArray(val) ? val : String(val).split(',').map((s) => s.trim());
      ctl = `<div class="frm-checks" data-name="${f.key}">${f.options.map((o) => `<label class="check"><input type="checkbox" value="${esc(o)}" ${on.includes(o) ? 'checked' : ''} ${f.ro ? 'disabled' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`;
    } else ctl = `<input class="adm-input" name="${f.key}" placeholder="${esc(f.ph || '')}" value="${esc(val)}" ${f.ro ? 'readonly' : ''} maxlength="${f.max || 255}">`;
    return `<div class="adm-field ${f.full ? 'full' : ''}" data-f="${f.key}">${lab}${ctl}${hint}${err}</div>`;
  }

  function list(cfg) {
    const S = { mode: 'list', data: 'empty', rows: cfg.rows.map((r) => ({ ...r })), editing: -1, q: '' };
    const main = document.querySelector('main');
    main.innerHTML = '<div id="frm-head"></div><div id="frm-body"></div>';

    function renderList() {
      document.getElementById('frm-head').innerHTML = AdminHead({ eyebrow: cfg.eyebrow, title: cfg.title, desc: cfg.desc,
        right: cfg.cta ? `<button class="btn-cta" data-frm-new>${ICON.plus}${esc(cfg.cta)}</button>` : '' });
      const rows = S.data === 'empty' ? [] : S.rows.filter((r) => !S.q || JSON.stringify(r).toLowerCase().includes(S.q.toLowerCase()));
      const tools = `<div class="adm-box__head adm-box__head--tools">
          ${cfg.boxTitle ? `<h2 class="adm-box__title" style="flex:1">${esc(cfg.boxTitle)}</h2>` : '<span style="flex:1"></span>'}
          ${(cfg.filters || []).map((f) => `<label class="filter-btn">${ICON.filter}<select data-frm-filter><option>${esc(f[0])}</option>${f[1].map((o) => `<option>${esc(o)}</option>`).join('')}</select></label>`).join('')}
          <label class="adm-inline-search"><input data-frm-q placeholder="${esc(cfg.search || 'Tìm kiếm tại đây')}" value="${esc(S.q)}"><span>${ICON.search}</span></label></div>`;
      const body = rows.length
        ? AdminTable(cfg.cols, rows.map((r) => `<tr>${cfg.cell(r)}<td class="t-act">${RowMenu(cfg.menu(r, S.rows.indexOf(r)))}</td></tr>`).join(''))
        : AdminEmpty(S.data === 'empty' ? cfg.empty : { icon: 'search', title: 'Không tìm thấy kết quả', desc: 'Thử từ khoá khác.' });
      document.getElementById('frm-body').innerHTML = `<section class="adm-box">${tools}<div class="adm-card">${body}</div>
        ${cfg.note ? `<p class="adm-hint frm-note">${cfg.note}</p>` : ''}</section>`;
    }

    function renderForm(idx, ro) {
      const r = idx >= 0 ? S.rows[idx] : {};
      const t = ro ? cfg.form.detailTitle || 'Chi tiết' : idx >= 0 ? cfg.form.editTitle : cfg.form.newTitle;
      document.getElementById('frm-head').innerHTML = AdminHead({ back: '#', eyebrow: cfg.eyebrow, title: t, desc: cfg.form.desc || '' });
      document.getElementById('frm-body').innerHTML = `<section class="adm-card"><h2 class="adm-card__title">Thông tin chung</h2>
        <div class="adm-form" id="frm-form">${cfg.form.fields.map((f) => field({ ...f, ro: ro || f.ro }, r[f.key])).join('')}</div>
        ${cfg.form.extra ? cfg.form.extra(r, ro) : ''}
        <div class="adm-btn-combo">${ro ? `<button class="btn-cta btn-cta--line" data-frm-back>Quay lại</button><button class="btn-cta" data-frm-edit="${idx}">${ICON.edit}Sửa</button>`
          : `<button class="btn-cta btn-cta--line" data-frm-back>Huỷ</button><button class="btn-cta" data-frm-save>Lưu</button>`}</div></section>`;
      S.mode = 'form'; S.editing = idx;
    }

    function save() {
      const form = document.getElementById('frm-form'); const out = {}; let ok = true;
      cfg.form.fields.forEach((f) => {
        const box = form.querySelector(`[data-f="${f.key}"]`); let v;
        if (f.type === 'checks') v = [...box.querySelectorAll('input:checked')].map((x) => x.value);
        else v = box.querySelector('[name]').value.trim();
        const empty = Array.isArray(v) ? !v.length : !v;
        let msg = f.req && empty ? `${f.label} là bắt buộc.` : '';
        if (!msg && f.unique && S.rows.some((x, i) => i !== S.editing && String(x[f.key]).toLowerCase() === String(v).toLowerCase())) msg = `${f.label} đã tồn tại.`;
        const e = box.querySelector('[data-err]'); e.textContent = msg; e.hidden = !msg;
        const inp = box.querySelector('.adm-input'); if (inp) inp.classList.toggle('is-error', !!msg);
        if (msg) ok = false; out[f.key] = v;
      });
      if (!ok) return;
      if (S.editing >= 0) Object.assign(S.rows[S.editing], out); else S.rows.unshift({ ...cfg.blank, ...out });
      S.data = 'sample'; S.mode = 'list'; renderList(); toast(S.editing >= 0 ? 'Đã lưu thay đổi' : 'Đã tạo mới');
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-frm-new]')) { renderForm(-1, false); return; }
      if (e.target.closest('[data-frm-back]') || (S.mode === 'form' && e.target.closest('.adm-back'))) { e.preventDefault(); S.mode = 'list'; renderList(); return; }
      if (e.target.closest('[data-frm-save]')) { save(); return; }
      const ed = e.target.closest('[data-frm-edit]'); if (ed) { renderForm(+ed.dataset.frmEdit, false); return; }
      const dt = e.target.closest('[data-frm-detail]'); if (dt) { renderForm(+dt.dataset.frmDetail, true); return; }
      const del = e.target.closest('[data-frm-del]');
      if (del) {
        const i = +del.dataset.frmDel; const r = S.rows[i];
        const block = cfg.canDelete ? cfg.canDelete(r) : '';
        if (block) { toast(block); return; }
        AdminConfirm({ danger: true, title: cfg.delTitle || 'Bạn chắc chắn muốn xoá?', text: cfg.delText ? cfg.delText(r) : '', ok: 'Xoá', onOk: () => { S.rows.splice(i, 1); renderList(); toast('Đã xoá'); } });
      }
    });
    document.addEventListener('input', (e) => { if (e.target.matches('[data-frm-q]')) { S.q = e.target.value; const p = e.target.selectionStart; renderList(); const n = document.querySelector('[data-frm-q]'); n.focus(); n.setSelectionRange(p, p); } });

    AdminLayout({ active: cfg.active, role: 'admin' });
    DemoBar(cfg.title + ' — khung Figma (không đổi ở LH2)', [{ label: 'Dữ liệu', key: 'data', options: [['empty', 'Chưa có dữ liệu'], ['sample', 'Dữ liệu mẫu (Figma)']] }], (s) => { S.data = s.data; S.mode = 'list'; renderList(); });
    return S;
  }

  window.LHFrame = { list, field };
})();
