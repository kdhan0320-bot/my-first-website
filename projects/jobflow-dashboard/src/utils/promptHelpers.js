export const PROMPT_TEMPLATES = {
  '자기소개서': (role, company, project) =>
    `UX/UI 기반 ${role} 지원용 자기소개서 초안을 작성해줘.\n내 이름은 [이름]이고, ${company ? `${company}에` : '해당 기업에'} 지원하려고 합니다.\n\n주요 프로젝트: ${project || 'Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard'}\n강조할 역량:\n- 사용자 흐름 정리 능력\n- 실무형 웹서비스 화면 구현 (React + MUI)\n- Supabase 데이터 연동 경험\n- 반응형 웹디자인 적용 능력\n\n3문단 내외, 800~1000자 분량으로 작성해줘.`,

  '면접 답변': (role, company, project) =>
    `${role} 직무 면접을 준비하고 있습니다.${company ? ` ${company}` : ''} 면접에서 자주 나오는 질문 5가지와 각 답변 예시를 작성해줘.\n주요 프로젝트: ${project || 'Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard'}\n각 답변은 STAR 기법(상황-과제-행동-결과)을 활용해서 구체적으로 작성해줘.`,

  '포트폴리오 설명': (role, company, project) =>
    `${role} 포트폴리오를 소개하는 텍스트를 작성해줘.${company ? ` ${company}` : ''} 제출용입니다.\n포함된 프로젝트: ${project || 'Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard'}\n각 프로젝트의 목적, 핵심 기능, 사용 기술, UX/UI 포인트를 간결하게 정리해줘.`,

  '지원동기': (role, company, project) =>
    `${company ? `${company}에 ` : ''}${role} 직무로 지원하는 지원동기를 작성해줘.\n주요 경험: ${project || 'Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard'} 프로젝트를 통한 실무형 웹개발 및 디자인 경험\n진정성 있게, 과장 없이, 300~500자 내외로 작성해줘.`,
};

export const generatePrompt = (type, role, company, project) => {
  const fn = PROMPT_TEMPLATES[type];
  if (!fn) return '';
  return fn(role, company, project);
};
