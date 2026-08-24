# HSK 单词闪卡 · HSK Flashcards

按 **HSK 课文** 组织的中文单词闪卡学习网站，面向**英语母语的中文初学者**。
A lesson-by-lesson Chinese vocabulary flashcard app for English-speaking beginners.

🌐 **在线访问 / Live:** https://delamoer.github.io/hsk-flashcards/

覆盖 HSK 1–3（共 50 课、651 词），数据来自《HSK 标准教程》分课词表。

---

## ✨ 功能 Features

- **三层导航**：HSK 级别 → 课次 → 单课学习（HSK 4/5 预留占位）
- **闪卡**：正面只显汉字；点击翻转看背面——声调配色拼音、英文释义、两句中英对照例句
- **两种学习模式**：网格总览（一屏看全课）/ 逐张专注（← → 键切换、进度点）
- **发音朗读 (TTS)**：浏览器语音朗读汉字与例句（免费，无需 API）
- **声调配色**：拼音按四声上色（1 红 / 2 绿 / 3 蓝 / 4 紫 / 轻声灰），可在顶栏开关
- **自测**：英文选汉字 / 听音选字，答错自动标「需复习」，结算得分
- **学习进度**：已掌握 / 需复习 / ⭐收藏，持久化到浏览器本地（localStorage）
- **打印导出**：词表 / 可裁剪卡片两种版式
- **中英双语界面**：所有按钮、导航中英并列，学生可自助使用

---

## 🛠 技术栈 Tech Stack

Vue 3 + Vite · vue-router（hash 模式）· 纯自定义 CSS（无 UI 框架）· 浏览器 Web Speech API

数据管线：`.xlsx` → `scripts/convert.py` (Python + openpyxl, 经 `uv` 运行) → `src/data/*.json`

---

## 🚀 本地开发 Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

其它命令：

```bash
npm run build      # 生产构建到 dist/
npm run preview    # 预览构建产物
npm run convert    # 从 xlsx 重新生成 src/data/*.json（用 uv 运行 openpyxl）
npm run deploy     # 构建并发布到 gh-pages 分支（GitHub Pages）
```

> `npm run convert` 依赖 [uv](https://github.com/astral-sh/uv)（会临时拉起 openpyxl，无需预装）。

---

## 📁 项目结构 Structure

```
hsk/
├─ HSK{1,2,3}_按课次词汇闪卡表.xlsx   # 数据源（唯一真源）
├─ scripts/convert.py                # xlsx → JSON（含 50 条英文课名）
├─ DESIGN.md                         # 设计系统（暖珊橘·明快鼓励）
├─ prototype/index.html              # 早期高保真原型（设计参考，非生产代码）
├─ src/
│  ├─ data/            # 生成的 hsk1-3.json + index.js（级别/课次/查询）
│  ├─ views/           # Home / LessonList / Lesson / Quiz / Print
│  ├─ components/      # FlashCard / LevelCard / LessonCard / ProgressRing / AppHeader
│  ├─ composables/     # useProgress（进度）/ useSettings（声调配色等）
│  ├─ utils/           # pinyinTones（声调分色）/ tts（朗读）
│  └─ styles/main.css  # DESIGN.md 的 token 落地
└─ vite.config.js
```

---

## 🔄 更新数据 / 新增级别 Updating Data

数据由脚本生成，**不要手改 `src/data/*.json`**。

1. 编辑对应的 `.xlsx`（词汇的唯一真源）
2. 新增课程的英文标题写进 `scripts/convert.py` 的 `TITLES_EN`
3. 运行 `npm run convert` 重新生成 JSON
4. 新增 HSK 4/5：把 `.xlsx` 与 `TITLES_EN` 补齐、在 `convert.py` 的 `SOURCES` 里加一项，首页占位会自动变为可用

发布更新：

```bash
git add -A && git commit -m "更新说明" && git push   # 更新源码仓库
npm run deploy                                          # 更新线上页面
```

`git push` 与 `npm run deploy` 相互独立：前者更新代码库，后者才更新线上站点。

---

## 🎨 设计 Design

视觉规范见 [`DESIGN.md`](./DESIGN.md)（遵循 [Google Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/) 格式）。
风格「暖珊橘 · 明快鼓励」：珊橘→暖橙渐变主色、圆角、柔和阴影，鼓励初学者自学。
