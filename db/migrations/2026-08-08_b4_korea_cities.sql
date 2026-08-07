-- B-4: 국내 프로젝트 지원 — cities 테이블에 한국 주요 도시 추가 (이모지 없는 버전)
-- 앱이 국기(🇰🇷)는 클라이언트 목록에서 자동으로 채우므로 DB에는 이모지 불필요.
-- '서울'은 이미 추가됨. 아래는 나머지 17개. 한 번만 실행하세요(중복 방지 가드 없음).
-- Supabase → SQL Editor(프로젝트 yeqyjfmefihbzczbotul) → 붙여넣고 Run.

insert into public.cities (name_ko, name_en, country, default_currency) values
 ('부산','Busan','한국','KRW'),
 ('제주','Jeju','한국','KRW'),
 ('인천','Incheon','한국','KRW'),
 ('경주','Gyeongju','한국','KRW'),
 ('강릉','Gangneung','한국','KRW'),
 ('전주','Jeonju','한국','KRW'),
 ('여수','Yeosu','한국','KRW'),
 ('속초','Sokcho','한국','KRW'),
 ('대구','Daegu','한국','KRW'),
 ('대전','Daejeon','한국','KRW'),
 ('광주','Gwangju','한국','KRW'),
 ('수원','Suwon','한국','KRW'),
 ('춘천','Chuncheon','한국','KRW'),
 ('포항','Pohang','한국','KRW'),
 ('통영','Tongyeong','한국','KRW'),
 ('안동','Andong','한국','KRW'),
 ('울산','Ulsan','한국','KRW');

-- 확인: select count(*) from public.cities where country='한국';  → 18 이면 성공
