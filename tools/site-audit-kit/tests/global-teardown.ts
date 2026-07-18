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
const REPORT_SECTION_LABELS = [...SECTIONS.map((s) => s.label), 'Project Detail'];

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

  // ── 표에 실제로 찍히는 상태값을 한 곳에서만 계산한다 ──────────────────────
  // 2번(스크린샷 목록)과 4번(반응형 매트릭스) 표가 같은 screenshot 레코드를 두
  // 번 다른 모양으로 보여주는 것뿐이므로, 여기서 한 번만 계산해서 두 표와 최종
  // 집계(8번)가 공유한다 — 표마다 다시 계산하면서 값이 갈리거나 같은 레코드를
  // 두 번 세는 문제를 원천적으로 없앤다.
  type ScreenshotCheck = { viewport: string; label: string; file: string; status: string; note: string };
  const screenshotChecks: ScreenshotCheck[] = [];
  for (const v of VIEWPORT_ORDER) {
    for (const label of REPORT_SECTION_LABELS) {
      const entry = screenshots.find((s) => s.viewport === v && s.section === label);
      const file = entry?.file ?? `${v}-${label}`;
      const filePath = path.join(SCREENSHOT_DIR, file);
      const existsOnDisk = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
      const ok = entry ? !!entry.ok && existsOnDisk : undefined;
      screenshotChecks.push({
        viewport: v,
        label,
        file,
        status: classify(ok),
        note: entry?.remark ?? (entry ? '-' : '점검 기록 없음'),
      });
    }
  }
  const mobileMenuCheck = (() => {
    const entry = screenshots.find((s) => s.section === 'Mobile Menu');
    const filePath = path.join(SCREENSHOT_DIR, MOBILE_MENU_FILE);
    const existsOnDisk = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
    const ok = entry ? !!entry.ok && existsOnDisk : undefined;
    return { status: classify(ok), note: entry?.remark ?? '-' };
  })();

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
  for (const c of screenshotChecks) {
    lines.push(`| ${c.file} | ${c.status} | ${VIEWPORTS[c.viewport].label} - ${c.label} | ${c.note} |`);
  }
  lines.push(`| ${MOBILE_MENU_FILE} | ${mobileMenuCheck.status} | Mobile (390x844) - Mobile Menu | ${mobileMenuCheck.note} |`);
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

  // 4. 반응형 화면 확인 (2번과 같은 screenshotChecks를 재사용 — 다시 계산하지 않음)
  lines.push('## 4. 반응형 화면 확인', '');
  lines.push('| 구분 | Hero | Projects | About/Skills | Contact/Footer | Detail | Menu |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const v of VIEWPORT_ORDER) {
    const row = REPORT_SECTION_LABELS.map((label) => {
      const c = screenshotChecks.find((c) => c.viewport === v && c.label === label);
      return c?.status ?? UNKNOWN;
    });
    const menuCell = v === 'mobile' ? mobileMenuCheck.status : `${UNKNOWN} (스펙상 모바일 전용)`;
    lines.push(`| ${VIEWPORTS[v].label} | ${row.join(' | ')} | ${menuCell} |`);
  }
  lines.push('');

  // 5. 기능 테스트 결과
  lines.push('## 5. 기능 테스트 결과', '');
  lines.push('| 테스트 항목 | 결과 | 관찰 내용 | 비고 |', '| --- | --- | --- | --- |');
  const functionalChecks = functional.map((f) => ({ ...f, status: classifyResult(f.result) }));
  for (const v of VIEWPORT_ORDER) {
    const items = functionalChecks.filter((f) => f.viewport === v);
    for (const item of items) {
      lines.push(
        `| ${VIEWPORTS[v].label} - ${item.item} | ${item.status} | ${item.note ?? '-'} | ${item.remark ?? '-'} |`
      );
    }
  }
  lines.push('');

  // 6. 링크 테스트 결과
  lines.push('## 6. 링크 테스트 결과', '');
  lines.push('| 버튼/링크명 | 위치 | 결과 | 이동 URL | 비고 |', '| --- | --- | --- | --- | --- |');
  const linkChecks = links.map((l) => ({ ...l, status: classify(l.ok) }));
  for (const l of linkChecks) {
    lines.push(`| ${l.name} | ${l.location} | ${l.status} | ${l.url} | ${l.note ?? '-'} |`);
  }
  const emailChecks = emails.map((e) => ({ ...e, status: classify(e.ok) }));
  for (const e of emailChecks) {
    lines.push(
      `| 이메일 버튼 | Contact/Footer | ${e.status} | ${e.href ?? '-'} | ${e.note ?? 'mailto 형식 확인 (실제 발송 안 함)'} |`
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

  // ── 실제 집계 (표 2/4/5/6에 실제로 찍힌 상태값만, 같은 레코드 중복 집계 없음) ──
  const allStatuses: string[] = [
    ...screenshotChecks.map((c) => c.status),
    mobileMenuCheck.status,
    ...functionalChecks.map((f) => f.status),
    ...linkChecks.map((l) => l.status),
    ...emailChecks.map((e) => e.status),
  ];
  const totalConfirmed = allStatuses.filter((s) => s === CONFIRMED).length;
  const totalFailedCount = allStatuses.filter((s) => s === FAILED).length;
  const totalUnknownCount = allStatuses.filter((s) => s === UNKNOWN).length;

  const unknownItems: string[] = [
    ...screenshotChecks
      .filter((c) => c.status === UNKNOWN)
      .map((c) => `${VIEWPORTS[c.viewport].label} - ${c.label} 스크린샷 (${c.note})`),
    ...(mobileMenuCheck.status === UNKNOWN ? [`Mobile Menu 스크린샷 (${mobileMenuCheck.note})`] : []),
    ...functionalChecks
      .filter((f) => f.status === UNKNOWN)
      .map((f) => `${VIEWPORTS[f.viewport]?.label ?? f.viewport} - ${f.item}${f.note ? ` (${f.note})` : ''}`),
    ...linkChecks.filter((l) => l.status === UNKNOWN).map((l) => `${l.name} 링크 확인 불가`),
    ...emailChecks.filter((e) => e.status === UNKNOWN).map((e) => `이메일 버튼 확인 불가${e.note ? ` (${e.note})` : ''}`),
  ];

  // 8. ChatGPT에게 넘길 요약
  lines.push('## 8. ChatGPT에게 넘길 요약', '');
  lines.push('[자동 점검 요약]');
  lines.push(`- 점검 URL: ${meta.targetUrl ?? '알 수 없음'}`);
  lines.push(
    `- 생성된 스크린샷: ${screenshotChecks.filter((c) => c.status === CONFIRMED).length + (mobileMenuCheck.status === CONFIRMED ? 1 : 0)}/${screenshotChecks.length + 1}개 성공`
  );
  lines.push(`- 주요 기능 문제: ${functionalFails.length ? functionalFails.map((f) => f.item).join(', ') : '없음'}`);
  lines.push(
    `- 모바일/태블릿 문제: ${
      mobileFails.length || tabletFails.length
        ? [...mobileFails, ...tabletFails].map((f) => `${VIEWPORTS[f.viewport]?.label} - ${f.item}`).join(', ')
        : '없음'
    }`
  );
  // 표(2/4/5/6)에 실제로 찍힌 상태값을 그대로 집계한 것 — 표의 ⚠️ 개수와 항상 일치한다
  // (검사 대상 자체가 없어도 ⚠️로 집계하고, 검사하지 않은 항목을 ✅로 세지 않으며,
  // 같은 스크린샷 레코드를 표 2/4에서 두 번 세지 않는다).
  lines.push(`- 실제 집계(표 2/4/5/6 기준, 중복 없음): ${CONFIRMED} ${totalConfirmed}건 · ${FAILED} ${totalFailedCount}건 · ${UNKNOWN} ${totalUnknownCount}건`);
  lines.push(`- 확인 불가 항목: ${unknownItems.length ? unknownItems.join(', ') : '없음'}`);
  lines.push('- ChatGPT가 추가 분석해야 할 부분: 디자인 완성도, 접근성(WCAG), 문구/콘텐츠 품질 (자동 점검 범위 밖)');
  lines.push('');

  fs.writeFileSync(REPORT_FILE, lines.join('\n'));
}
