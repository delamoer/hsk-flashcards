-- 课外阅读「已读」同步到云端：progress 表加一列 reading（每个学生一行，和闪卡进度同一行）
-- 形如 { "tiantiandu-2b": { "3": "2026-11-02T08:00:00Z" } }，篇号 → 点「读完了」的时间
-- 在 Supabase 后台 SQL Editor 里运行一次即可（可重复运行）。
alter table public.progress add column if not exists reading jsonb not null default '{}'::jsonb;
-- 只读过文章、没练过闪卡的学生，第一次保存阅读时也要能插入新行
alter table public.progress alter column data set default '{}'::jsonb;
