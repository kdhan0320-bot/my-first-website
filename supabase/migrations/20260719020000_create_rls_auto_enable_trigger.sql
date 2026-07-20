-- Reconstructed baseline migration — 재구성된 기준선 migration.
-- 이 timestamp(20260719020000)는 원래 실행 시각이 아니라,
-- 20260704065841 이후이면서 20260719024903 이전에 놓이도록
-- 재구성한 값이다.
--
-- 이 파일은 원본 SQL을 그대로 복원한 것이 아니다. 현재 운영 DB의
-- public.rls_auto_enable() 함수와 ensure_rls event trigger, 그리고
-- Supabase 공식 auto-enable RLS 구성을 기준으로 재구성했다.
-- 원래 SQL 원문과 정확한 timestamp는 확인할 수 없다.
--
-- 이 설정은 설치 이후 새로 생성되는 public 테이블의 RLS를 자동으로
-- 활성화한다. 앞서 생성된 테이블은 각 migration에서 RLS를 명시적으로
-- 활성화한다.
--
-- 이 파일은 운영 DB에 다시 실행하기 위한 파일이 아니다. 운영 migration
-- history와의 정합화는 별도 승인 단계에서 다룬다.

begin;

create or replace function public.rls_auto_enable()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $function$
declare
  cmd record;
begin
  for cmd in
    select *
    from pg_event_trigger_ddl_commands()
    where command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
    and object_type in ('table', 'partitioned table')
  loop
    if cmd.schema_name is not null
      and cmd.schema_name in ('public')
      and cmd.schema_name not in ('pg_catalog', 'information_schema')
      and cmd.schema_name not like 'pg_toast%'
      and cmd.schema_name not like 'pg_temp%' then
      begin
        execute format(
          'alter table if exists %s enable row level security',
          cmd.object_identity
        );
        raise log 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      exception
        when others then
          raise log 'rls_auto_enable: failed to enable RLS on %',
            cmd.object_identity;
      end;
    else
      raise log
        'rls_auto_enable: skip % (either system schema or not in enforced list: %.)',
        cmd.object_identity,
        cmd.schema_name;
    end if;
  end loop;
end;
$function$;

drop event trigger if exists ensure_rls;

create event trigger ensure_rls
  on ddl_command_end
  when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  execute function public.rls_auto_enable();

commit;
