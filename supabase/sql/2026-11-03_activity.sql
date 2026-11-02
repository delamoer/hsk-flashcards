-- 每日学习足迹：一个学生一天一行，当天不停累加；只保留最近 90 天
-- counts 形如 { "m:flash|hsk-1/3": 12, "c:flash|hsk-1/3": 45 }
--   m: = 在这个位置学了几分钟，c: = 在这个位置点了几下；位置 = 类别|课（见 src/composables/useActivity.js）
-- 在 Supabase 后台 SQL Editor 里运行一次即可（可重复运行）。

create table if not exists public.activity (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,              -- 学生本地日期
  minutes int not null default 0, -- 当天学习总分钟
  counts jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.activity enable row level security;

-- 只能读：学生读自己的，管理员读全部。写入只走下面的函数，所以没有 insert/update 策略。
drop policy if exists "activity read own or admin" on public.activity;
create policy "activity read own or admin" on public.activity
  for select using (auth.uid() = user_id or public.is_admin());

-- 学生端每分钟调用一次：把这一分钟攒下的分钟数和次数加到当天那一行，再删掉自己 90 天前的旧行
create or replace function public.log_activity(p_day date, p_minutes int, p_counts jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  merged jsonb;
  k text;
  v text;
begin
  if uid is null then
    return;
  end if;
  -- 本地日期只允许在服务器日期前后两天内（时区差），防止乱写
  if p_day is null or p_day > current_date + 1 or p_day < current_date - 2 then
    return;
  end if;
  p_minutes := least(greatest(coalesce(p_minutes, 0), 0), 10);

  insert into activity (user_id, day) values (uid, p_day) on conflict (user_id, day) do nothing;
  select counts into merged from activity where user_id = uid and day = p_day for update;

  for k, v in select key, value from jsonb_each_text(coalesce(p_counts, '{}'::jsonb)) loop
    if length(k) <= 80 and v ~ '^\d{1,4}$' then
      merged := jsonb_set(merged, array[k], to_jsonb(coalesce((merged ->> k)::int, 0) + v::int));
    end if;
  end loop;

  update activity
     set minutes = minutes + p_minutes, counts = merged, updated_at = now()
   where user_id = uid and day = p_day;

  delete from activity where user_id = uid and day < current_date - 90;
end;
$$;

revoke all on function public.log_activity(date, int, jsonb) from public, anon;
grant execute on function public.log_activity(date, int, jsonb) to authenticated;
