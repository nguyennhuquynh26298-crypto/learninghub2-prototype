/* #3 Duyệt khoá — popup dùng chung (spec docs/specs/lh2/03-course-approval.md §3.4, §3.5, §3.3) */
(function () {
  const { ICON, Modal, Button, esc } = LH;
  const open = (html) => { document.querySelectorAll('.modal-backdrop').forEach((m) => m.remove()); document.body.insertAdjacentHTML('beforeend', html); };

  /** §3.5 — Yêu cầu chỉnh sửa → Rejected, kèm nhận xét */
  function comment({ course, onSend }) {
    open(Modal({ id: 'm-cmt', icon: 'alert', iconTone: 'danger', title: 'Yêu cầu chỉnh sửa', desc: `<b>${esc(course)}</b>`,
      body: `<div class="field"><label class="field__label" for="cmt">Nhận xét<span class="req">*</span></label>
        <textarea class="input" id="cmt" maxlength="1200"></textarea>
        <div class="row"><span class="field__error hidden grow" id="cmt-err">${ICON.alert}Nhận xét từ 10 đến 1000 ký tự.</span><span class="grow"></span><span class="t-xs muted" id="cmt-n">0/1000</span></div></div>`,
      foot: Button({ label: 'Huỷ', variant: 'secondary', attrs: 'data-close' }) + Button({ label: 'Gửi yêu cầu', variant: 'danger', attrs: 'id="cmt-send"' }) }));
    const ta = document.getElementById('cmt');
    ta.addEventListener('input', () => { document.getElementById('cmt-n').textContent = `${ta.value.trim().length}/1000`; });
    ta.focus();
    document.getElementById('cmt-send').onclick = () => {
      const n = ta.value.trim().length, bad = n < 10 || n > 1000;
      ta.classList.toggle('is-error', bad); document.getElementById('cmt-err').classList.toggle('hidden', !bad);
      if (bad) return;
      document.getElementById('m-cmt').remove(); onSend(ta.value.trim());
    };
  }

  /** §3.4 — Approve: khoá mới hoặc bản sửa */
  function approve({ course, revision, onOk }) {
    open(Modal({ id: 'm-approve', icon: 'check', iconTone: 'success',
      title: revision ? 'Thay nội dung đang chạy bằng bản sửa?' : `Publish ${esc(course)}?`,
      desc: revision ? 'Tiến độ học viên được tính lại theo bài mới.' : 'Học viên trong đối tượng sẽ thấy khoá ngay.',
      foot: Button({ label: 'Huỷ', variant: 'secondary', attrs: 'data-close' }) + Button({ label: 'Duyệt', attrs: 'id="ap-ok"' }) }));
    document.getElementById('ap-ok').onclick = () => { document.getElementById('m-approve').remove(); onOk(); };
  }

  /** §3.3 — Chưa gửi duyệt được: danh sách lỗi (BR-CRS-11) */
  function submitErrors(errors) {
    open(Modal({ id: 'm-err', icon: 'alert', iconTone: 'danger', title: 'Chưa gửi duyệt được', 
      body: `<div class="err-list">${errors.map(([t, href]) => `<a href="${href}" data-close>${ICON.alert}<span class="grow">${esc(t)}</span>${ICON.chevronR}</a>`).join('')}</div>`,
      foot: Button({ label: 'Đã hiểu', attrs: 'data-close' }) }));
  }

  window.LHApproval = { comment, approve, submitErrors };
})();
