-- ============================================================
-- Mini SNS 데모 데이터 리셋 스크립트
-- ============================================================
-- 실행 전 Supabase 데이터를 반드시 백업하세요.
--   (Supabase Dashboard > Database > Backups, 또는 pg_dump)
-- 이 스크립트는 앱 데이터 테이블만 정리합니다.
-- auth.users 삭제/생성은 이 스크립트에서 다루지 않으며,
-- Supabase Dashboard(Authentication > Users) 또는 Admin API에서
-- 별도로 처리해야 합니다.
--
-- 실행 위치: Supabase Dashboard > SQL Editor
-- 실행 방식: 아래 두 STEP을 순서대로, 원하는 부분만 골라 실행하세요.
--
-- 스키마 참고 사항:
--   이 프로젝트(ucuwhxsyvagdzersyqrf)는 작성 시점 기준 일시중지(INACTIVE)
--   상태라 실시간 스키마 조회(list_tables)를 할 수 없었습니다.
--   아래 테이블/컬럼명은 앱 소스 코드(src/pages, src/components,
--   src/hooks/useAuth.jsx)에서 실제로 호출하는 supabase 쿼리를
--   기준으로 추정한 것입니다. 실행 전 Supabase Dashboard의 Table
--   Editor에서 아래 테이블명/컬럼명이 실제와 일치하는지 확인하세요.
--
--   실제로 Supabase 테이블을 사용하는 화면: 로그인/회원가입, 홈 피드,
--     게시글 작성/수정/삭제, 댓글, 좋아요, 프로필(팔로워/팔로잉)
--   Supabase를 사용하지 않고 프론트엔드 목(mock) 데이터만 쓰는 화면:
--     모임(Meetup.jsx의 MOCK_MEETUPS), 채팅(Chat.jsx의 MOCK_ROOMS/
--     MOCK_MESSAGES), 알림(Notifications.jsx의 MOCK_NOTIFICATIONS)
--   → 위 3개 화면은 실제 DB 테이블이 없으므로 이 스크립트에서 다루지
--     않습니다. 게스트 모드 데이터도 Home.jsx의 GUEST_POSTS 상수로만
--     구성되어 있어 이 스크립트와 무관하게 항상 깨끗한 데모 화면을
--     보여줍니다.
-- ============================================================


-- ============================================================
-- STEP 1. 기존 앱 데이터 삭제
--   FK 의존성 순서: likes/comments/follows → posts → profiles
-- ============================================================

begin;

delete from public.likes;
delete from public.comments;
delete from public.follows;
delete from public.posts;

-- profiles.id는 auth.users.id를 참조하는 외래키인 경우가 많습니다.
-- 실제 로그인 계정과 연결된 프로필까지 지우면 해당 계정으로 로그인 시
-- 프로필이 비어 보일 수 있으니, 정말 전체 초기화가 필요할 때만 주석을 해제하세요.
-- delete from public.profiles;

commit;


-- ============================================================
-- STEP 2. 데모 프로필/게시물 삽입 (선택)
-- ============================================================
-- 주의: profiles.id는 auth.users.id를 참조하는 외래키일 가능성이 높습니다.
-- 즉, auth.users에 실제로 존재하지 않는 UUID로 profiles를 insert하면
-- 외래키 제약 조건 위반으로 실패할 수 있습니다.
--
-- 따라서 데모 계정을 만들려면 먼저:
--   1) Supabase Dashboard > Authentication > Users 에서
--      이메일 demo@minisns.app (또는 원하는 데모 이메일)로
--      사용자를 직접 생성하고,
--   2) 생성된 사용자의 UUID를 아래 <DEMO_USER_UUID> 자리에 붙여넣은 뒤
--   3) 아래 INSERT 문을 실행하세요.
--
-- 이 앱의 로그인 로직(src/hooks/useAuth.jsx)은 아이디를
-- `${username}@minisns.app` 형식의 이메일로 변환해 Supabase Auth에
-- 로그인 요청을 보냅니다. 즉 로그인 화면에서 아이디 `demo`,
-- 비밀번호 `demo1234!`로 로그인하려면, Dashboard에서 이메일을
-- 정확히 `demo@minisns.app`로 생성해야 합니다.

-- insert into public.profiles (id, username, nickname, profile_image_url, bio)
-- values (
--   '<DEMO_USER_UUID>',
--   'demo',
--   '데모유저',
--   'https://api.dicebear.com/7.x/initials/svg?seed=%EB%8D%B0%EB%AA%A8%EC%9C%A0%EC%A0%80',
--   'Mini SNS 기능을 체험하기 위한 데모 계정입니다.'
-- )
-- on conflict (id) do update set
--   username = excluded.username,
--   nickname = excluded.nickname,
--   profile_image_url = excluded.profile_image_url,
--   bio = excluded.bio;

-- 위와 같은 방식으로, 시연에 쓰고 싶은 다른 프로필(UX러너, 스터디메이트,
-- 프론트러너, 디자인메이트, 모바일UX 등)도 먼저 Supabase Auth에 계정을
-- 만든 뒤 동일한 패턴으로 profiles를 채우면 됩니다. 실제 서비스 계정
-- 없이 데모 화면만 보여주고 싶다면, 이 STEP 2는 건너뛰고 앱의
-- "게스트로 둘러보기" 모드를 사용하세요. 게스트 모드는 Supabase 데이터와
-- 무관하게 항상 정리된 데모 콘텐츠(Home.jsx GUEST_POSTS)를 보여줍니다.

-- insert into public.posts (user_id, caption, hashtag, image_url, location)
-- values (
--   '<DEMO_USER_UUID>',
--   '오늘 홈 피드 카드 컴포넌트를 정리했습니다. 이미지 클릭 모달까지 연결해봤어요.',
--   '#작업기록 #모바일UI #React',
--   null,
--   null
-- );
