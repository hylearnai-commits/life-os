# 🐱 Life-OS

个人工作生活控制台，基于 Next.js + Supabase 构建。

## ✨ 功能

- 📋 **待办事项** — 添加 / 完成切换 / 优先级 / 删除
- 🎯 **习惯打卡** — 每日打卡 / 热力图 / 连续记录
- 💰 **支出追踪** — 记一笔 / 分类 / 月度统计 / 周趋势图
- 📝 **随手记** — 实时保存 / 自动同步
- 🎯 **年度目标** — 进度追踪 / +/- 调节 / 达成状态
- ⚡ **书签管理** — 自定义图标 / 快速访问常用网站
- 🌤️ **天气** — 实时天气（上海）
- ⏱️ **专注计时** — 番茄钟 / 自定义时长 / 完成计数
- 🕐 **时钟** — 实时时间 / 智能问候语
- 🎨 **主题切换** — 暗色 / 亮色 / 午夜
- 📊 **状态概览** — 待办进度 / 打卡次数 / 支出汇总

## 🛠️ 技术栈

| 层级 | 方案 |
|------|------|
| 前端框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 后端/数据库 | Supabase (PostgreSQL) |
| 实时数据 | Supabase Realtime |
| 部署 | Vercel / 任意 Node.js 环境 |

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/hylearnai-commits/life-os.git
cd life-os

# 安装依赖
npm install

# 启动 Supabase 本地实例（需要 Docker）
npx supabase start

# 复制环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入 Supabase URL 和 Key

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
src/
├── app/
│   ├── layout.tsx       # 根布局（含侧边栏）
│   └── page.tsx        # 首页
├── components/
│   ├── Sidebar.tsx     # 左侧导航菜单
│   ├── Clock.tsx       # 实时时钟
│   ├── Weather.tsx     # 天气
│   ├── FocusTimer.tsx  # 专注计时器
│   ├── QuickAdd.tsx    # 快速添加
│   ├── Todos.tsx       # 待办事项
│   ├── Habits.tsx      # 习惯打卡
│   ├── Expenses.tsx     # 支出追踪
│   ├── Bookmarks.tsx   # 书签管理
│   ├── Goals.tsx       # 年度目标
│   ├── Notes.tsx       # 随手记
│   ├── ThemeToggle.tsx # 主题切换
│   └── Quote.tsx       # 每日一句
├── lib/
│   ├── supabase/
│   │   ├── client.ts   # 浏览器端 Supabase 客户端
│   │   └── server.ts   # 服务端 Supabase 客户端
│   └── actions.ts      # Server Actions（写操作）
└── supabase/
    └── migrations/     # 数据库结构
```

## 🗄️ 数据库表

- `todos` — 待办事项
- `habits` — 习惯
- `habit_logs` — 打卡记录
- `expenses` — 支出
- `notes` — 随手记
- `bookmarks` — 书签
- `goals` — 年度目标

## 🌐 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📦 部署到 Vercel

```bash
npm run build
vercel --prod
```

需在 Vercel 项目设置中配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 环境变量。

## License

MIT
