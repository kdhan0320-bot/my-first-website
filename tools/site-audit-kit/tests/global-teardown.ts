import fs from 'fs';
import path from 'path';
import { RESULTS_FILE, REPORT_FILE, SCREENSHOT_DIR, VIEWPORTS, SECTIONS, MOBILE_MENU_FILE } from './target';

type Entry = Record<string, any>;

function readEntries(): Entry[] {
  if (!fs.existsSync(RESULTS_FILE)) return [];
  return fs
    .readFileSync(RESULTS_FILE, 'utf-8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter((e): e is Entry => e !== null);
}

const VIEWPORT_ORDER = Object.keys(VIEWPORTS);
const REPORT_SECTION_LABELS = [...SECTIONS.map((s) => s.label), 'Project Modal'];

// 보고 기준: 확인한 내용 / 실패한 내용 / 확인 불가 / 추측 을 구분한다.
// 이 도구는 실제로 실행/관찰한 결과만 기록하며 추측(GUESS) 항목은 생성하지 않는다.
const CONFIRMED = '✅ 확인함';
const FAILED = '❌ 실패';
const UNKNOWN = '⚠️ 확인 불가';

function classify(ok: boolean | undefined): string {
  if (ok === undefined) return UNKNOWN;
  return ok ? CONFIRMED : FAILED;
}

function classifyResult(result: string | undefined): string {
  if (result === 'PASS') return CONFIRMED;
  if (result === 'FAIL') return FAILED;
  return UNKNOWN; // 'N/A' 등 실행하지 못했거나 대상이 없는 경우
}

function numberedList(items: string[]): string[] {
  if (items.length === 0) return ['1. 없음'];
  return items.map((item, i) => `${i + 1}. ${item}`);
}

export default async function globalTeardown() {
  const entries = readEntries();
  const meta = entries.find((e) => e.kind === 'meta') ?? {};
  const connectivity = entries.filter((e) => e.kind === 'connectivity');
  const screenshots = entries.filter((e) => e.kind === 'screenshot');
  const functional = entries.filter((e) => e.kind === 'functional');
  const links = entries.filter((e) => e.kind === 'link');
  const emails = entries.filter((e) => e.kind === 'email');
  const consoleErrors = entries.filter((e) => e.kind === 'consoleError');

  const lines: string[] = [];

  lines.push('# 웹사이트 자동 점검 보고서', '');
  lines.push(
    `_범례: ${CONFIRMED} = 실제로 실행/관찰하여 확인 · ${FAILED} = 실제로 실행하여 실패 확인 · ${UNKNOWN} = 대상 없음/자동 점검 범위 밖 · 추측 항목은 만들지 않음_`,
    ''
  );

  // 1. 점검 대상
  lines.push('## 1. 점검 대상');
  lines.push(`- URL: ${meta.targetUrl ?? '알 수 없음'}`);
  lines.push(`- 실행 일시: ${meta.startedAt ?? '알 수 없음'}`);
  lines.push('- 사용 도구: Playwright');
  lines.push(`- 확인한 viewport: ${VIEWPORT_ORDER.map((v) => VIEWPORTS[v].label).join(', ')}`);
  lines.push('');

  // 2. 생성된 스크린샷 목록
  lines.push('## 2. 생성된 스크린샷 목록', '');
  lines.push('| 파일명 | 생성 여부 | 설명 | 비고 |', '| --- | --- | --- | --- |');
  for (const v of VIEWPORT_ORDER) {
    for (const label of REPORT_SECTION_LABELS) {
      const entry = screenshots.find((s) => s.viewport === v && s.section === label);
      const file = entry?.file ?? `${v}-${label}`;
      const filePath = path.join(SCREENSHOT_DIR, file);
      const existsOnDisk = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
      const ok = entry ? !!entry.ok && existsOnDisk : undefined;
      lines.push(`| ${file} | ${classify(ok)} | ${VIEWPORTS[v].label} - ${label} | ${entry?.remark ?? '-'} |`);
    }
  }
  // 모바일 메뉴 스크린샷 (mobile 뷰포트에서만 존재)
  {
    const entry = screenshots.find((s) => s.section === 'Mobile Menu');
    const filePath = path.join(SCREENSHOT_DIR, MOBILE_MENU_FILE);
    const existsOnDisk = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
    const ok = entry ? !!entry.ok && existsOnDisk : undefined;
    lines.push(`| ${MOBILE_MENU_FILE} | ${classify(ok)} | Mobile (390x844) - Mobile Menu | ${entry?.remark ?? '-'} |`);
  }
  lines.push('');

  // 3. 접속/로딩 상태
  lines.push('## 3. 접속/로딩 상태', '');
  const normal = connectivity.filter((c) => c.ok).map((c) => VIEWPORTS[c.viewport]?.label ?? c.viewport);
  const problem = connectivity.filter((c) => !c.ok).map((c) => VIEWPORTS[c.viewport]?.label ?? c.viewport);
  const noConnectivityRecord = VIEWPORT_ORDER.filter((v) => !connectivity.some((c) => c.viewport === v)).map(
    (v) => VIEWPORTS[v].label
  );
  lines.push(`- 정상: ${normal.length ? normal.join(', ') : '없음'}`);
  lines.push(`- 문제: ${problem.length ? problem.join(', ') : '없음'}`);
  if (consoleErrors.length === 0) {
    lines.push('- 콘솔 에러: 없음');
  } else {
    lines.push('- 콘솔 에러:');
    for (const v of VIEWPORT_ORDER) {
      const errs = consoleErrors.filter((e) => e.viewport === v);
      if (errs.length === 0) continue;
      lines.push(`  - ${VIEWPORTS[v].label}: ${errs.length}건`);
      for (const e of errs.slice(0, 10)) {
        lines.push(`    - ${String(e.message).slice(0, 200)}`);
      }
    }
  }
  lines.push(`- 확인 불가: ${noConnectivityRecord.length ? noConnectivityRecord.join(', ') : '없음'}`);
  lines.push('');

  // 4. 반응형 화면 확인
  lines.push('## 4. 반응형 화면 확인', '');
  lines.push('| 구분 | Hero | Projects | About/Skills | Contact/Footer | Modal | Menu |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const v of VIEWPORT_ORDER) {
    const row = REPORT_SECTION_LABELS.map((label) => {
      const entry = screenshots.find((s) => s.viewport === v && s.section === label);
      return classify(entry ? entry.ok : undefined);
    });
    const menuCell =
      v === 'mobile'
        ? classify(screenshots.find((s) => s.section === 'Mobile Menu')?.ok)
        : `${UNKNOWN} (스펙상 모바일 전용)`;
    lines.push(`| ${VIEWPORTS[v].label} | ${row.join(' | ')} | ${menuCell} |`);
  }
  lines.push('');

  // 5. 기능 테스트 결과
  lines.push('## 5. 기능 테스트 결과', '');
  lines.push('| 테스트 항목 | 결과 | 관찰 내용 | 비고 |', '| --- | --- | --- | --- |');
  for (const v of VIEWPORT_ORDER) {
    const items = functional.filter((f) => f.viewport === v);
    for (const item of items) {
      lines.push(
        `| ${VIEWPORTS[v].label} - ${item.item} | ${classifyResult(item.result)} | ${item.note ?? '-'} | ${item.remark ?? '-'} |`
      );
    }
  }
  lines.push('');

  // 6. 링크 테스트 결과
  lines.push('## 6. 링크 테스트 결과', '');
  lines.push('| 버튼/링크명 | 위치 | 결과 | 이동 URL | 비고 |', '| --- | --- | --- | --- | --- |');
  for (const l of links) {
    lines.push(`| ${l.name} | ${l.location} | ${classify(l.ok)} | ${l.url} | ${l.note ?? '-'} |`);
  }
  for (const e of emails) {
    lines.push(
      `| 이메일 버튼 | Contact/Footer | ${classify(e.ok)} | ${e.href ?? '-'} | ${e.note ?? 'mailto 형식 확인 (실제 발송 안 함)'} |`
    );
  }
  lines.push('');

  // 7. 발견한 문제
  lines.push('## 7. 발견한 문제', '');
  const functionalFails = functional.filter((f) => f.result === 'FAIL');
  const mobileFails = functionalFails.filter((f) => f.viewport === 'mobile');
  const tabletFails = functionalFails.filter((f) => f.viewport === 'tablet');
  const linkFails = [...links, ...emails].filter((l) => l.ok === false);

  lines.push('디자인 문제:');
  lines.push(...numberedList(['자동 점검 범위 아님 (수동 확인 필요)']));
  lines.push('');

  lines.push('기능 문제:');
  lines.push(
    ...numberedList([
      ...functionalFails.map((f) => `${VIEWPORTS[f.viewport]?.label} - ${f.item}: ${f.note ?? ''}`.trim()),
      ...linkFails.map((l) => `${l.name ?? '이메일'}: ${l.note ?? '접속/형식 확인 실패'}`),
    ])
  );
  lines.push('');

  lines.push('모바일 문제:');
  lines.push(...numberedList(mobileFails.map((f) => `${f.item}: ${f.note ?? ''}`.trim())));
  lines.push('');

  lines.push('태블릿 문제:');
  lines.push(...numberedList(tabletFails.map((f) => `${f.item}: ${f.note ?? ''}`.trim())));
  lines.push('');

  lines.push('접근성 문제:');
  lines.push(...numberedList(['자동 점검 범위 아님 (수동 확인 필요)']));
  lines.push('');

  lines.push('문구/콘텐츠 문제:');
  lines.push(...numberedList(['자동 점검 범위 아님 (수동 확인 필요)']));
  lines.push('');

  // 8. ChatGPT에게 넘길 요약
  lines.push('## 8. ChatGPT에게 넘길 요약', '');
  lines.push('[자동 점검 요약]');
  lines.push(`- 점검 URL: ${meta.targetUrl ?? '알 수 없음'}`);
  lines.push(
    `- 생성된 스크린샷: ${screenshots.filter((s) => s.ok).length}/${screenshots.length}개 성공${
      screenshots.some((s) => !s.ok) ? ` (실패: ${screenshots.filter((s) => !s.ok).map((s) => s.file).join(', ')})` : ''
    }`
  );
  lines.push(`- 주요 기능 문제: ${functionalFails.length ? functionalFails.map((f) => f.item).join(', ') : '없음'}`);
  lines.push(
    `- 모바일/태블릿 문제: ${
      mobileFails.length || tabletFails.length
        ? [...mobileFails, ...tabletFails].map((f) => `${VIEWPORTS[f.viewport]?.label} - ${f.item}`).join(', ')
        : '없음'
    }`
  );
  lines.push(`- 확인 불가 항목: ${linkFails.length ? linkFails.map((l) => l.name ?? l.href).join(', ') : '없음'}`);
  lines.push('- ChatGPT가 추가 분석해야 할 부분: 디자인 완성도, 접근성(WCAG), 문구/콘텐츠 품질 (자동 점검 범위 밖)');
  lines.push('');

  fs.writeFileSync(REPORT_FILE, lines.join('\n'));
}
