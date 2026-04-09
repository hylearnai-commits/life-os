-- Life-OS 数据库初始化
-- 创建时间：2026-04-09

-- =============================================
-- 1. 待办事项 todos
-- =============================================
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. 习惯打卡 habits
-- =============================================
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT '✅',
  color TEXT DEFAULT E'#10b981',
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. 习惯记录 habit_logs
-- =============================================
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, logged_date)
);

-- =============================================
-- 4. 支出记录 expenses
-- =============================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. 随手记 notes
-- =============================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. 快捷入口 bookmarks
-- =============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 初始化默认快捷入口
-- =============================================
INSERT INTO bookmarks (name, url, icon, sort_order) VALUES
  ('Gmail', 'https://mail.google.com', '📧', 1),
  ('Notion', 'https://notion.so', '📝', 2),
  ('Calendar', 'https://calendar.google.com', '📅', 3),
  ('GitHub', 'https://github.com', '🐙', 4),
  ('飞书', 'https://feishu.cn', '📮', 5),
  ('Twitter', 'https://twitter.com', '🐦', 6);

-- =============================================
-- RLS 行级安全策略（暂时禁用方便调试）
-- =============================================
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 公开读写（本地开发用）
CREATE POLICY "Allow all for todos" ON todos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for habits" ON habits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for habit_logs" ON habit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for notes" ON notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for bookmarks" ON bookmarks FOR ALL USING (true) WITH CHECK (true);
