/* Dữ liệu mẫu — tên khoá, session, bài, mô tả, ảnh bìa chép từ web thật (đo 10/11/2026).
 * Ảnh bìa tải về assets/img/covers/. Riêng bài "Video: …" ở Domain 3 là bài mẫu thêm vào để demo #8 (web chưa có video). */
const COVER = (f) => `../assets/img/covers/${f}`;
window.LHData = {
  course: {
    code: 'CCAR-F', title: 'CCAR-F Claude Certified Architect – Foundations', cover: COVER('ccar-f.png'),
    desc: 'Preparation course for the Claude Certified Architect – Foundations (CCAR-F) exam. Covers the five exam domains: agentic architecture and orchestration, tool design and MCP integration, Claude Code configuration and workflows, prompt engineering and structured output, and context management and reliability.\nEach domain has its own slide deck, a domain practice set, and there are four full-length mock exams.',
    whoFor: ['Engineers and technical leads who design Claude-based systems and want to validate that knowledge against the CCAR-F certification.', 'Assumes you have built something with an LLM API before. No prior certification is required.'],
    learn: ['Design agentic architectures and choose an orchestration pattern that fits the problem', 'Define tools and integrate MCP servers so a model can act reliably', 'Configure Claude Code and set up team workflows around it', 'Write prompts that produce structured, checkable output', 'Manage context windows and build for reliability under real load', 'Sit four full mock exams under the real format'],
    owner: { name: 'Nguyễn Thu Hà', email: 'ha.nguyenthu@techvify.com.vn' },
    sessions: [
      { name: 'Domain 1 - Agentic Architecture & Orchestration', lessons: [['file', 'Slide: Agentic Architecture'], ['quiz', 'Practice: Agentic Architecture & Orchestration']] },
      { name: 'Domain 2 - Tool Design & MCP Integration', lessons: [['file', 'Slide: Tool Design & MCP'], ['quiz', 'Practice: Tool Design & MCP Integration']] },
      { name: 'Domain 3 - Claude Code Configuration & Workflows', lessons: [['file', 'Slide: Claude Code Configuration'], ['video', 'Video: CLAUDE.md, hooks, subagents'], ['quiz', 'Practice: Claude Code Configuration & Workflows']] },
      { name: 'Domain 4 - Prompt Engineering & Structured Output', lessons: [['file', 'Slide: Prompt Engineering'], ['quiz', 'Practice: Prompt Engineering & Structured Output']] },
      { name: 'Domain 5 - Context Management & Reliability', lessons: [['file', 'Slide: Context Management'], ['quiz', 'Practice: Context Management & Reliability']] },
      { name: 'Full Tests', lessons: [['quiz', 'Full Test 1'], ['quiz', 'Full Test 2'], ['quiz', 'Full Test 3'], ['quiz', 'Full Test 4']] },
      { name: 'Reference Material', lessons: [['file', 'CCAR-F Exam Guide']] },
    ],
  },
  /* Bài test đang mở ở màn học — "Practice: Agentic Architecture & Orchestration" trên web: 32 Questions | 65 Minutes */
  test: { name: 'Practice: Agentic Architecture & Orchestration', sub: 'Đề luyện theo domain — 32 câu', questions: 32, minutes: 65, maxAttempts: 3, passMark: 70, practiceQuestions: 20 },
  examQuestions: [
    { type: 'single', text: 'Trong mô hình orchestrator–worker, thành phần nào chịu trách nhiệm chia nhỏ nhiệm vụ và tổng hợp kết quả?',
      options: ['Worker agent', 'Orchestrator agent', 'Tool server (MCP)', 'Vector store'], correct: [1], chosen: [1],
      explain: 'Orchestrator lập kế hoạch, giao việc cho worker và gộp kết quả; worker chỉ thực hiện phần việc được giao.' },
    { type: 'multi', text: 'Những biện pháp nào giúp giảm rủi ro agent gọi tool sai tham số? (chọn tất cả đáp án đúng)',
      options: ['Mô tả tool rõ ràng kèm ví dụ', 'Dùng JSON schema chặt cho input', 'Tăng temperature', 'Validate input phía tool server'], correct: [0, 1, 3], chosen: [0, 1],
      explain: 'Mô tả rõ, schema chặt và validate phía server cùng giảm lỗi tham số. Tăng temperature làm kết quả kém ổn định hơn.' },
    { type: 'single', text: 'Khi nào nên chọn workflow cố định thay vì agent tự chủ?',
      options: ['Khi các bước đã biết trước và cần kết quả ổn định', 'Khi nhiệm vụ mở, không đoán trước số bước', 'Khi cần agent tự chọn tool', 'Không bao giờ'], correct: [0], chosen: [1],
      explain: 'Workflow cố định phù hợp khi đường đi đã rõ, dễ kiểm thử và chi phí thấp hơn agent tự chủ.' },
    { type: 'single', text: 'Prompt caching có tác dụng chính là gì?',
      options: ['Tăng độ chính xác', 'Giảm độ trễ và chi phí cho phần prompt lặp lại', 'Mở rộng context window', 'Mã hoá dữ liệu'], correct: [1], chosen: [],
      explain: 'Cache phần prefix lặp lại giúp giảm độ trễ và chi phí token đầu vào.' },
  ],
  practiceQuestions: [
    { type: 'single', text: 'Một agent cần đọc file, gọi API và tổng hợp báo cáo. Bước nào nên tách thành subagent?',
      options: ['Không tách, để một agent làm hết', 'Tách phần tìm kiếm / đọc dữ liệu dài để giữ context agent chính gọn', 'Tách bước in báo cáo', 'Tách theo số dòng code'], correct: [1],
      explain: 'Subagent hợp với việc khám phá tốn context; agent chính chỉ nhận phần tóm tắt.' },
    { type: 'multi', text: 'Dấu hiệu nào cho thấy mô tả tool đang chưa đủ tốt?',
      options: ['Agent gọi nhầm tool tương tự', 'Agent truyền thiếu tham số bắt buộc', 'Tool trả lời nhanh', 'Agent phải hỏi lại người dùng cùng một thông tin'], correct: [0, 1, 3],
      explain: 'Gọi nhầm, thiếu tham số, hỏi lại thông tin đã có đều là triệu chứng mô tả tool mơ hồ.' },
    { type: 'single', text: 'Trong handoff giữa hai agent, thông tin nào bắt buộc phải truyền?',
      options: ['Toàn bộ lịch sử hội thoại', 'Mục tiêu, trạng thái hiện tại và ràng buộc', 'Chỉ câu hỏi cuối', 'Không cần truyền gì'], correct: [1],
      explain: 'Truyền mục tiêu + trạng thái + ràng buộc đủ để agent sau tiếp tục mà không phình context.' },
    { type: 'tf', text: 'Prompt caching giúp mở rộng context window của mô hình.',
      options: ['Đúng', 'Sai'], correct: [1],
      explain: 'Caching chỉ giảm độ trễ và chi phí cho phần prompt lặp lại, không đổi kích thước context window.' },
  ],
  hr: {
    departments: ['QA', 'QC Automation', 'Development', 'BA', 'Design', 'HR', 'Sales', 'L&D'],
    positions: ['QA Engineer', 'Automation Tester', 'Senior QA', 'QA Lead', 'Developer', 'Business Analyst'],
  },
  members: [
    { name: 'Trần Minh Anh', email: 'anh.tranminh@techvify.com.vn', dept: 'QA', pos: 'QA Engineer', src: ['Phòng ban: QA'], status: 'Đang học' },
    { name: 'Lê Hoàng Nam', email: 'nam.lehoang@techvify.com.vn', dept: 'QC Automation', pos: 'Automation Tester', src: ['Phòng ban: QC Automation', 'Vị trí: Automation Tester'], status: 'Hoàn thành' },
    { name: 'Phạm Thu Trang', email: 'trang.phamthu@techvify.com.vn', dept: 'QA', pos: 'Senior QA', src: ['Phòng ban: QA'], status: 'Chưa đăng ký' },
    { name: 'Đỗ Quang Huy', email: 'huy.doquang@techvify.com.vn', dept: 'Development', pos: 'Developer', src: ['Cá nhân'], status: 'Đang học' },
    { name: 'Vũ Ngọc Lan', email: 'lan.vungoc@techvify.com.vn', dept: 'QA', pos: 'QA Lead', src: ['Phòng ban: QA'], status: 'Đang học' },
    { name: 'Ngô Đức Thịnh', email: 'thinh.ngoduc@techvify.com.vn', dept: 'QC Automation', pos: 'Automation Tester', src: ['Phòng ban: QC Automation', 'Vị trí: Automation Tester'], status: 'Chưa đăng ký' },
  ],
  excluded: [{ name: 'Bùi Thanh Tùng', email: 'tung.buithanh@techvify.com.vn', dept: 'QA', pos: 'QA Engineer', src: ['Phòng ban: QA'] }],
  /* Khoá đang học (dùng ở popup giới hạn enroll #9) */
  myCourses: [
    { title: 'CCAR-F Claude Certified Architect – Foundations', cover: COVER('ccar-f.png'), progress: 31, last: 'Hôm qua' },
    { title: 'QA AUTOMATION _ MODULE 2: FUNDAMENTAL TESTING', cover: COVER('qa-module-2.jpg'), progress: 50, last: '3 ngày trước' },
  ],

  /* Danh mục thật trên thanh Category */
  categories: ['Business', 'Corporate & Mandatory Training', 'Data & AI', 'Language', 'People', 'Personal Development', 'Software Development', 'Techvify Product'],

  /* Catalog = 11 khoá thật trên /course/search. pub = số ngày từ lần Publish đầu; st = trạng thái của tôi (BR-LRN-15; fail = Không đạt, BR-LRN-32); my = số ngày từ lúc tôi đăng ký (đang học / không đạt) hoặc hoàn thành (BR-LRN-16); lastDays = học gần nhất (ngày)
   * lessons / hours lấy từ card web nếu có, còn lại là số mẫu. */
  catalog: [
    { title: 'QA AUTOMATION _ MODULE 2: FUNDAMENTAL TESTING', cover: COVER('qa-module-2.jpg'), lessons: 2, hours: '14h 0m', tags: ['Testing', 'QA Automation'], cat: 'Software Development', pub: 6, st: 'learning', my: 10, progress: 50, video: [0, 0], test: [1, 2], lastDays: 3, sched: { overdue: true },
      desc: 'Module 2 tập trung vào việc xây dựng nền tảng kiểm thử tự động với các nội dung sau: API Testing, Testing Process, Performance Testing…' },
    { title: 'CCAR-F Claude Certified Architect – Foundations', cover: COVER('ccar-f.png'), lessons: 16, hours: '20h 0m', tags: ['AI', 'Claude'], cat: 'Data & AI', pub: 12, st: 'learning', my: 20, progress: 31, video: [0, 1], test: [1, 9], lastDays: 1,
      desc: 'Preparation course for the Claude Certified Architect – Foundations (CCAR-F) exam.' },
    { title: 'QA AUTOMATION _ MODULE 1: PROGRAMMING FOUNDATION', cover: COVER('qa-module-1.png'), lessons: 4, hours: '16h 0m', tags: ['Testing', 'Programming'], cat: 'Software Development', pub: 40, st: 'done', my: 60, progress: 100, video: [0, 0], test: [2, 2], lastDays: 45, done: '12/09/2026',
      desc: 'Nền tảng lập trình cho QA Automation: Java cơ bản, OOP, Git và cấu trúc project test.' },
    { title: 'HƯỚNG DẪN SỬ DỤNG APPROVAL & TEM', cover: COVER('approval-guide.png'), lessons: 3, hours: '1h 0m', tags: ['Approval', 'Hướng dẫn'], cat: 'Techvify Product', pub: 20, st: 'none',
      desc: 'Hướng dẫn tạo, duyệt đơn trên Approval và quy trình TEM nội bộ.' },
    { title: "PENETRATION TESTING: THE ATTACKER'S MINDSET", cover: COVER('pentest.png'), lessons: 6, hours: '8h 0m', tags: ['Security', 'Testing'], cat: 'Software Development', pub: 5, st: 'none', restricted: true,
      desc: 'Tư duy kẻ tấn công: recon, khai thác lỗ hổng web phổ biến và viết báo cáo pentest.' },
    { title: 'QA IN THE AGE OF AI AGENTS: RETHINKING SOFTWARE QUALITY', cover: COVER('qa-ai-agents.png'), lessons: 5, hours: '6h 0m', tags: ['AI', 'Testing'], cat: 'Data & AI', pub: 25, st: 'none', sched: { start: '15/11/2026' },
      desc: 'Chất lượng phần mềm khi đội ngũ làm việc cùng AI agent: rủi ro mới, cách kiểm thử agent.' },
    { title: 'HARNESS IS AL YOU NEED', cover: COVER('harness.png'), lessons: 4, hours: '5h 0m', tags: ['AI', 'Agent'], cat: 'Data & AI', pub: 60, st: 'none',
      desc: 'Thiết kế harness cho agent: tool, context, vòng lặp đánh giá.' },
    { title: 'LEARN ENGLISH COMMUNICATION', cover: COVER('english.png'), lessons: 10, hours: '12h 0m', tags: ['English'], cat: 'Language', pub: 200, st: 'done', my: 193, progress: 100, video: [0, 0], test: [1, 1], lastDays: 100, done: '02/05/2026',
      desc: 'Giao tiếp tiếng Anh trong môi trường dự án: họp, email, thuyết trình.' },
    { title: 'AUTOMATION TESTING: KHI AI TRỞ THÀNH ĐỒNG ĐỘI CỦA TESTER', cover: COVER('automation-ai.png'), lessons: 5, hours: '7h 0m', tags: ['Testing', 'AI', 'QA Automation'], cat: 'Software Development', pub: 85, st: 'fail', my: 25, failScore: 62, progress: 10, video: [0, 0], test: [0, 2], lastDays: 30,
      desc: 'Dùng AI hỗ trợ viết, bảo trì và phân tích kết quả test tự động.' },
    { title: 'PROMPTS ENGINEERING', cover: '', lessons: 3, hours: '3h 0m', tags: ['AI', 'Prompt'], cat: 'Data & AI', pub: 120, st: 'none',
      desc: 'Kỹ thuật viết prompt có cấu trúc, kiểm chứng được.' },
    { title: 'CURSOR TAKE IN HAND', cover: '', lessons: 3, hours: '2h 0m', tags: ['AI', 'Tool'], cat: 'Software Development', pub: 150, st: 'none',
      desc: 'Làm chủ Cursor trong công việc hằng ngày.' },
  ],

  /* Đợt 2 · #7 / #8 — kết quả của tôi ở trang khoá CCAR-F.
   * 16 bài = 6 tài liệu (slide / guide) + 1 video + 9 bài test. Đã xong 5 → P = floor(5/16×100) = 31% (BR-LRN-21) */
  myResult: {
    pct: 31, video: [0, 1], test: [1, 9], doc: [4, 6],
    /* trạng thái từng bài theo thứ tự mục lục: done | part:<%> | fail | none */
    lessons: ['done', 'done', 'done', 'fail', 'done', 'part:40', 'none', 'done', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
    tests: [
      { name: 'Practice: Agentic Architecture & Orchestration', session: 'Domain 1', best: 85, tries: '2/3', res: 'pass' },
      { name: 'Practice: Tool Design & MCP Integration', session: 'Domain 2', best: 62, tries: '2/3', res: 'fail' },
      { name: 'Practice: Claude Code Configuration & Workflows', session: 'Domain 3', best: null, tries: '0/3', res: 'none' },
      { name: 'Practice: Prompt Engineering & Structured Output', session: 'Domain 4', best: null, tries: '0/3', res: 'none' },
      { name: 'Practice: Context Management & Reliability', session: 'Domain 5', best: null, tries: '0/3', res: 'none' },
      { name: 'Full Test 1', session: 'Full Tests', best: null, tries: '0/3', res: 'none' },
    ],
  },

  /* Đợt 2 · #3 — danh sách quản lý khoá */
  adminCourses: [
    { title: 'Kiểm thử tự động với Playwright', owner: 'Phạm Thanh Long', status: 'pending', kind: 'Khoá mới', sent: '09/11 · 10:24', updated: '09/11/2026' },
    { title: 'Claude Certified Architect – Foundations', owner: 'Nguyễn Thu Hà', status: 'published', revision: 'pending', kind: 'Bản sửa', sent: '08/11 · 16:02', updated: '08/11/2026' },
    { title: 'Kiểm thử API với Postman', owner: 'Phạm Thanh Long', status: 'rejected', updated: '07/11/2026' },
    { title: 'Clean Code cho Frontend', owner: 'Trần Văn Bình', status: 'draft', updated: '06/11/2026' },
    { title: 'AI Agent Engineering', owner: 'Lê Thị Mai', status: 'published', updated: '01/11/2026' },
    { title: 'Docker cho người mới', owner: 'Phạm Thanh Long', status: 'published', revision: 'rejected', updated: '30/10/2026' },
  ],
  creators: [
    { name: 'Phạm Thanh Long', email: 'long.phamthanh@techvify.com.vn', dept: 'QA', courses: 3, since: '01/11/2026' },
    { name: 'Nguyễn Thu Hà', email: 'ha.nguyenthu@techvify.com.vn', dept: 'L&D', courses: 1, since: '15/10/2026' },
    { name: 'Trần Văn Bình', email: 'binh.tranvan@techvify.com.vn', dept: 'Development', courses: 1, since: '05/11/2026' },
  ],
};

/* Đề thi đủ 32 câu cho màn làm bài (4 câu mẫu ở trên + 28 câu theo chủ đề 5 domain). Chỉ dùng cho prototype. */
(function () {
  const T = [
    ['subagent', 'Khi nào nên giao việc cho subagent?', ['Khi việc cần khám phá nhiều, tốn context', 'Khi chỉ cần 1 lệnh đơn giản', 'Khi muốn tăng temperature', 'Không bao giờ'], 0],
    ['MCP', 'MCP server cung cấp gì cho model?', ['Tool, resource và prompt có mô tả chuẩn', 'Trọng số model', 'Bộ nhớ dài hạn tự động', 'Giao diện chat'], 0],
    ['tool schema', 'Input schema của tool nên thế nào?', ['Chặt, có kiểu và mô tả từng trường', 'Để trống cho linh hoạt', 'Chỉ có 1 trường string', 'Không cần'], 0],
    ['CLAUDE.md', 'CLAUDE.md dùng để làm gì?', ['Ghi hướng dẫn dự án cho Claude Code đọc mỗi phiên', 'Lưu log', 'Cấu hình mạng', 'Thay README'], 0],
    ['hooks', 'Hook trong Claude Code chạy khi nào?', ['Tại các sự kiện như trước/sau khi gọi tool', 'Chỉ khi khởi động máy', 'Ngẫu nhiên', 'Khi người dùng đăng xuất'], 0],
    ['structured output', 'Cách chắc chắn nhất để nhận JSON đúng schema?', ['Dùng tool use / structured output với schema', 'Nhắc "trả về JSON" trong prompt', 'Tăng max tokens', 'Dùng temperature 1'], 0],
    ['few-shot', 'Ví dụ few-shot giúp gì?', ['Định hình định dạng và phong cách đầu ra', 'Giảm chi phí về 0', 'Mở rộng context', 'Tắt hallucination hoàn toàn'], 0],
    ['context window', 'Context sắp đầy, nên làm gì trước?', ['Tóm tắt / cắt phần không còn cần', 'Gửi lại toàn bộ lịch sử', 'Đổi sang model nhỏ hơn', 'Bỏ system prompt'], 0],
    ['retry', 'Gọi tool lỗi tạm thời (timeout) nên xử lý?', ['Retry có giới hạn + backoff', 'Retry vô hạn', 'Bỏ qua lỗi', 'Dừng toàn bộ agent'], 0],
    ['eval', 'Đo chất lượng agent ổn định nhất bằng?', ['Bộ eval cố định chạy lại mỗi lần đổi', 'Cảm nhận khi dùng thử', 'Số token dùng', 'Tốc độ phản hồi'], 0],
    ['orchestration', 'Mẫu "router" phù hợp khi?', ['Đầu vào thuộc nhiều loại cần xử lý khác nhau', 'Chỉ có một loại việc', 'Cần chạy song song cùng việc', 'Không có tool'], 0],
    ['parallel', 'Chạy song song nhiều worker có lợi khi?', ['Các phần việc độc lập nhau', 'Bước sau cần kết quả bước trước', 'Chỉ có 1 bước', 'Context rất nhỏ'], 0],
    ['permission', 'Lệnh shell nguy hiểm trong Claude Code nên?', ['Yêu cầu người dùng duyệt trước khi chạy', 'Tự chạy luôn', 'Ẩn khỏi log', 'Chạy 2 lần cho chắc'], 0],
    ['system prompt', 'Thông tin nào nên để trong system prompt?', ['Vai trò, quy tắc, ràng buộc ổn định', 'Câu hỏi hiện tại của user', 'Kết quả tool vừa trả', 'Mật khẩu'], 0],
    ['XML tags', 'Dùng thẻ XML trong prompt để?', ['Tách rõ các phần dữ liệu và chỉ dẫn', 'Tăng tốc độ', 'Giảm giá', 'Mã hoá dữ liệu'], 0],
    ['prefill', 'Prefill câu trả lời giúp?', ['Ép mở đầu đúng định dạng mong muốn', 'Bỏ qua system prompt', 'Tăng context', 'Tắt tool'], 0],
    ['RAG', 'Trong RAG, chunk quá to gây ra?', ['Nhiễu, tốn context, khớp kém', 'Không ảnh hưởng', 'Model nhanh hơn', 'Giảm chi phí'], 0],
    ['caching', 'Muốn prompt caching hiệu quả, phần cố định nên đặt?', ['Ở đầu prompt', 'Ở cuối prompt', 'Xen kẽ', 'Trong câu hỏi user'], 0],
    ['handoff', 'Handoff giữa agent nên truyền?', ['Mục tiêu, trạng thái, ràng buộc', 'Toàn bộ log', 'Không gì cả', 'Chỉ tên agent'], 0],
    ['guardrail', 'Guardrail đầu ra dùng để?', ['Kiểm tra trước khi trả kết quả cho người dùng', 'Tăng tốc độ', 'Thay prompt', 'Giảm token đầu vào'], 0],
    ['idempotent', 'Tool ghi dữ liệu nên thiết kế?', ['Idempotent, gọi lại không tạo bản trùng', 'Mỗi lần gọi tạo bản mới', 'Không trả kết quả', 'Không cần xác thực'], 0],
    ['logging', 'Log của agent nên ghi?', ['Quyết định, tool call, kết quả và lỗi', 'Chỉ câu trả lời cuối', 'Không cần log', 'Chỉ thời gian'], 0],
    ['stop condition', 'Vòng lặp agent cần điều kiện dừng vì?', ['Tránh lặp vô hạn và tốn chi phí', 'Để chạy nhanh hơn', 'Để model sáng tạo hơn', 'Không cần'], 0],
    ['human-in-loop', 'Bước nào nên có người duyệt?', ['Hành động khó hoàn tác (xoá, gửi, thanh toán)', 'Đọc file', 'Tìm kiếm', 'Tóm tắt'], 0],
    ['slash command', 'Custom slash command trong Claude Code là?', ['Prompt mẫu lưu sẵn gọi bằng /tên', 'Lệnh hệ điều hành', 'Plugin trình duyệt', 'Phím tắt bàn phím'], 0],
    ['temperature', 'Tác vụ trích xuất dữ liệu nên dùng temperature?', ['Thấp', 'Cao', 'Ngẫu nhiên', 'Không quan trọng'], 0],
    ['long doc', 'Hỏi đáp trên tài liệu dài, đặt tài liệu ở?', ['Đầu prompt, câu hỏi ở cuối', 'Cuối prompt', 'Trong system và lặp lại', 'Không cần đưa vào'], 0],
    ['fallback', 'Model chính lỗi liên tục nên?', ['Có phương án dự phòng và báo lỗi rõ', 'Trả kết quả rỗng', 'Lặp vô hạn', 'Tắt ứng dụng'], 0],
  ];
  const rot = (arr, k) => arr.map((_, i) => arr[(i + k) % arr.length]);
  const gen = T.map(([topic, text, opts], i) => {
    const k = i % 4; const options = rot(opts, k); const correct = [(4 - k) % 4];
    return { type: 'single', text, options, correct, chosen: i % 3 === 0 ? [(correct[0] + 1) % 4] : i % 7 === 0 ? [] : correct,
      explain: `${opts[0]} — đây là cách làm khuyến nghị cho chủ đề ${topic}.` };
  });
  window.LHData.examFull = [...window.LHData.examQuestions, ...gen];
})();

/* Tag tiếng Việt cho khoá Testing để tìm "kiem thu" có kết quả (BR-LRN-11: khớp tên hoặc tag, bỏ dấu). */
window.LHData.catalog.forEach((c) => { if (c.tags.includes('Testing') && !c.tags.includes('Kiểm thử')) c.tags.push('Kiểm thử'); });

/* Bản học viên (hoc-vien.html): khởi đầu 1 khoá đang học (QA Module 2, quá hạn) → còn 1 suất.
 * CCAR-F chưa đăng ký để tự bấm Start, làm bài test, rồi chạm giới hạn ở khoá thứ 3. */
(function () {
  const A = window.LH && LH.App; if (!A || A.mode !== 'learner') return;
  const D = window.LHData, s = A.get();
  const ccar = D.catalog.find((c) => c.title.startsWith('CCAR-F'));
  Object.assign(ccar, { st: 'none', progress: 0, video: undefined, test: undefined, lastDays: undefined, my: undefined });
  (s.enrolled || []).forEach((t) => {
    const c = D.catalog.find((x) => x.title === t);
    if (c) Object.assign(c, { st: 'learning', fresh: true, progress: 0, my: 0, lastDays: 0, video: c === ccar ? [0, 1] : [0, 1], test: c === ccar ? [0, 9] : [0, 2] });
  });
  /* Bài test CCAR-F đã nộp (assessment.html) → cập nhật tiến độ */
  const att = JSON.parse(localStorage.getItem('lhExamAttempts') || '[]');
  if (ccar.st === 'learning' && att.length) {
    const best = Math.max(...att.map((x) => x.score));
    if (best >= D.test.passMark) Object.assign(ccar, { test: [1, 9], progress: 6 });
    else if (att.length >= 3) Object.assign(ccar, { st: 'fail', failScore: best }); // BR-LRN-32: trượt sau 3 lượt → Không đạt, nhả suất
  }
  D.myCourses = D.catalog.filter((c) => c.st === 'learning').map((c) => ({ title: c.title, cover: c.cover, progress: c.progress || 0, last: c.lastDays ? `${c.lastDays} ngày trước` : 'Hôm nay' }));
})();
