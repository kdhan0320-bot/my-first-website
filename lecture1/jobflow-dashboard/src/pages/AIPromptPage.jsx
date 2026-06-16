import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Alert,
  Stack, Divider, IconButton, Tooltip,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { PROMPT_TYPES } from '../constants';

const TEMPLATE = {
  '자기소개서': (role, company, project) =>
    `UX/UI 기반 ${role} 지원용 자기소개서 초안을 작성해줘.
내 이름은 [이름]이고, ${company ? `${company}에` : '해당 기업에'} 지원하려고 합니다.

주요 프로젝트: ${project || 'Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard'}
강조할 역량:
- 사용자 흐름 정리 능력
- 실무형 웹서비스 화면 구현 (React + MUI)
- Supabase 데이터 연동 경험
- 반응형 웹디자인 적용 능력

3문단 내외, 800~1000자 분량으로 작성해줘.`,

  '면접 답변': (role, company, project) =>
    `${role} 직무 면접을 준비하고 있습니다.${company ? ` ${company}` : ''} 면접에서 자주 나오는 질문 5가지와 각 답변 예시를 작성해줘.
주요 프로젝트: ${project || 'Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard'}
각 답변은 STAR 기법(상황-과제-행동-결과)을 활용해서 구체적으로 작성해줘.`,

  '포트폴리오 설명': (role, company, project) =>
    `${role} 포트폴리오를 소개하는 텍스트를 작성해줘.${company ? ` ${company}` : ''} 제출용입니다.
포함된 프로젝트: ${project || 'Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard'}
각 프로젝트의 목적, 핵심 기능, 사용 기술, UX/UI 포인트를 간결하게 정리해줘.`,

  '지원동기': (role, company, project) =>
    `${company ? `${company}에 ` : ''}${role} 직무로 지원하는 지원동기를 작성해줘.
주요 경험: ${project || 'Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard'} 프로젝트를 통한 실무형 웹개발 및 디자인 경험
진정성 있게, 과장 없이, 300~500자 내외로 작성해줘.`,
};

const AIPromptPage = () => {
  const [role, setRole] = useState('UX/UI 디자이너');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [promptType, setPromptType] = useState('자기소개서');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const fn = TEMPLATE[promptType];
    if (!fn) return;
    setGenerated(fn(role, company, project));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = generated;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <AutoAwesomeIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>AI 프롬프트 도우미</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        입력값을 바탕으로 Claude / ChatGPT에 바로 넣을 수 있는 프롬프트를 생성합니다.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        생성된 프롬프트를 복사해서 ChatGPT 또는 Claude에 붙여넣기 하세요.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>입력 정보</Typography>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>프롬프트 유형</InputLabel>
              <Select value={promptType} label="프롬프트 유형" onChange={(e) => setPromptType(e.target.value)}>
                {PROMPT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="지원 직무 *"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="예: UX/UI 디자이너, 웹 퍼블리셔"
            />
            <TextField
              label="회사명 (선택)"
              fullWidth
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="예: 카카오, 네이버"
            />
            <TextField
              label="강조할 프로젝트 (선택)"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="예: Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard"
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerate}
              disabled={!role.trim()}
            >
              프롬프트 생성
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {generated && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" fontWeight={600}>생성된 프롬프트</Typography>
              <Tooltip title={copied ? '복사됨!' : '클립보드에 복사'}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                  onClick={handleCopy}
                  color={copied ? 'success' : 'primary'}
                >
                  {copied ? '복사됨' : '복사'}
                </Button>
              </Tooltip>
            </Box>
            <Box
              sx={{
                bgcolor: 'background.default',
                borderRadius: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: 1.8,
                color: 'text.primary',
              }}
            >
              {generated}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
              위 텍스트를 복사해서 ChatGPT 또는 Claude에 붙여넣기 하세요.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AIPromptPage;
