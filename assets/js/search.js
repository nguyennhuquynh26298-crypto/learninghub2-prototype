/* LearningHub 2 · #6 Tìm kiếm — logic dùng chung (BR-LRN-11..18). Cần LH.norm. */
(function () {
  const { norm } = window.LH;
  const clean = (q) => String(q || '').trim().replace(/\s+/g, ' ').slice(0, 100);

  /** BR-LRN-11, 12 — khớp khi đủ mọi từ, mỗi từ ở tên hoặc tag/danh mục. Trả về nhóm xếp hạng (BR-LRN-13) hoặc 0 nếu không khớp. */
  function rank(course, q) {
    const words = norm(clean(q)).split(' ').filter(Boolean);
    if (!words.length) return 3;
    const title = norm(course.title);
    const tagText = norm([...(course.tags || []), course.cat || ''].join(' '));
    if (!words.every((w) => title.includes(w) || tagText.includes(w))) return 0;
    if (title.startsWith(words.join(' '))) return 1;
    if (words.every((w) => title.includes(w))) return 2;
    return 3;
  }

  /** BR-LRN-15 (D-60) — Trạng thái của tôi. Chưa đăng ký = chưa enroll; Đang học gồm cả 0%. Không có "Chưa bắt đầu" */
  const myStatus = (c) => (c.st === 'done' ? 'done' : c.st === 'learning' ? 'learning' : c.st === 'fail' ? 'fail' : 'notenrolled');

  /** Trang Tìm khoá: có Chưa đăng ký; Không đạt chỉ hiện ở Tất cả */
  const STATUS_OPTS = [['all', 'Tất cả'], ['notenrolled', 'Chưa đăng ký'], ['learning', 'Đang học'], ['done', 'Hoàn thành']];
  /** Khoá của tôi: chỉ khoá đã enroll → không có Chưa đăng ký; có Không đạt */
  const MY_STATUS_OPTS = [['all', 'Tất cả'], ['learning', 'Đang học'], ['done', 'Hoàn thành'], ['fail', 'Không đạt']];
  /** BR-LRN-16 — Thời gian của tôi: ngày hoàn thành (khoá đã xong) hoặc ngày đăng ký (khoá chưa xong). Khoá chưa đăng ký chỉ hiện ở Tất cả */
  const DAY_OPTS = [['all', 'Tất cả'], ['7', '7 ngày qua'], ['30', '30 ngày qua'], ['90', '90 ngày qua']];

  /** Áp lọc + sắp xếp. f = { q, ct, st, pd, sort } */
  function run(list, f) {
    const q = clean(f.q);
    let out = list.map((c) => ({ c, r: rank(c, q) })).filter((x) => x.r > 0);
    if (f.ct && f.ct !== 'all') out = out.filter((x) => x.c.cat === f.ct);
    if (f.st && f.st !== 'all') out = out.filter((x) => myStatus(x.c) === f.st);
    if (f.pd && f.pd !== 'all') out = out.filter((x) => x.c.my != null && x.c.my <= +f.pd);
    const sort = f.sort || (q ? 'rel' : 'new');
    const byNew = (a, b) => a.c.pub - b.c.pub;
    if (sort === 'rel') out.sort((a, b) => a.r - b.r || byNew(a, b));
    else if (sort === 'az') out.sort((a, b) => a.c.title.localeCompare(b.c.title, 'vi'));
    else out.sort(byNew);
    return { q, sort, items: out.map((x) => x.c) };
  }

  window.LHSearch = { clean, rank, myStatus, run, STATUS_OPTS, MY_STATUS_OPTS, DAY_OPTS };
})();
