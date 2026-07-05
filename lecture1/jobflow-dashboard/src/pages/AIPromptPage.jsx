import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Alert, Stack,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { PROMPT_TYPES } from '../constants';
import { generatePrompt } from '../utils/promptHelpers';

const AIPromptPage = () => {
  const [role, setRole] = useState('UX/UI 디자이너');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [promptType, setPromptType] = useState('자기소개서');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const text = generatePrompt(promptType, role, company, project);
    setGenerated(text);
  };

  const handleCopy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
    } catch {
      const el = document.createElement('textarea');
      el.value = generated;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <AutoAwesomeIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>AI 프롬프트</Typography>
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
              <InputLabel id="prompt-type-label">프롬프트 유형</InputLabel>
              <Select
                labelId="prompt-type-label"
                value={promptType}
                label="프롬프트 유형"
                onChange={(e) => setPromptType(e.target.value)}
              >
                {PROMPT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="지원 직무"
              fullWidth
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="예: UX/UI 디자이너, 웹 퍼블리셔"
              slotProps={{ htmlInput: { 'aria-label': '지원 직무 입력' } }}
            />
            <TextField
              label="회사명 (선택)"
              fullWidth
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="예: 테크기업 A"
              slotProps={{ htmlInput: { 'aria-label': '회사명 입력' } }}
            />
            <TextField
              label="강조할 프로젝트 (선택)"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="예: Mini SNS, Portfolio Feedback Hub, JobFlow Dashboard"
              slotProps={{ htmlInput: { 'aria-label': '강조할 프로젝트 입력' } }}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerate}
              disabled={!role.trim()}
              aria-label="프롬프트 생성"
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
              <Button
                variant="outlined"
                size="small"
                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                onClick={handleCopy}
                color={copied ? 'success' : 'primary'}
                aria-label="프롬프트 복사"
              >
                {copied ? '복사됨' : '복사'}
              </Button>
            </Box>
            <Box
              component="pre"
              sx={{
                bgcolor: 'background.default',
                borderRadius: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                lineHeight: 1.8,
                color: 'text.primary',
                m: 0,
                wordBreak: 'break-word',
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
