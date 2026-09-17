# TODO / 技术债与优化项

轻量待办清单，记录暂不紧急但值得后续处理的技术改进。完成后从此处移除。

## 扩展方向 / 架构

- [ ] **登录 / 账号 / 管理员系统（GitHub Pages + Supabase）**
  - 目标：用户登录、跨设备同步进度、管理员建号/管号/删号。
  - 约束：GitHub Pages 纯静态、无后端；公开仓库不能放密钥。故需外部服务。
  - 方案：前端留在 GH Pages，接 **Supabase**（Auth + Postgres + RLS + Edge Functions）。
    前端只用公开 anon key，安全靠数据库 RLS 策略；管理员建号/删号需 service_role 密钥，
    放在 Edge Function 里执行（唯一需要"安全服务端"的地方，补上 GH Pages 的短板）。
  - 分阶段：
    1. Supabase Auth + 云端进度（`useProgress` 登录用云、未登录回退 localStorage）→ 跨设备同步。
    2. 加 `role`（admin/student），初期用 Supabase 控制台增删账号（零前端）。
    3. 自定义 `/admin` 后台 + Edge Function（建号/改密/删号/查进度）。
    4. 可选：私有/付费课程门禁、班级、学习报表。
  - 关键约定：保持 `useProgress` 为唯一进度入口，将来切换存储后端时组件零改动。
  - 成本：Supabase 免费档 + GH Pages，起步 0 元。若日后要预览部署/SSR，再迁 Cloudflare Pages。
