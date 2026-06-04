import { useState } from 'react';
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'Docker'];

const Section05 = () => {
  const [liked,   setLiked]   = useState(false);
  const [saved,   setSaved]   = useState(false);

  // 전체 선택
  const [skills, setSkills] = useState(
    Object.fromEntries(SKILLS.map((s) => [s, false]))
  );
  const checkedCount  = Object.values(skills).filter(Boolean).length;
  const allChecked    = checkedCount === SKILLS.length;
  const indeterminate = checkedCount > 0 && !allChecked;

  const handleSelectAll = (e) =>
    setSkills(Object.fromEntries(SKILLS.map((s) => [s, e.target.checked])));
  const handleSkill = (skill) => (e) =>
    setSkills((prev) => ({ ...prev, [skill]: e.target.checked }));

  // 약관 동의
  const [terms, setTerms] = useState({ service: false, privacy: false, marketing: false });
  const requiredDone = terms.service && terms.privacy;

  return (
    <SectionWrapper number={5} title="Checkbox" description="MUI Checkbox의 상태, 색상, 그룹, 전체 선택, 커스텀 아이콘을 확인합니다.">
      <Stack spacing={4}>

        {/* 기본 상태 */}
        <Row label="기본 상태">
          <Stack direction="row" spacing={0} alignItems="center">
            {[
              { props: {},                          label: 'Unchecked'        },
              { props: { defaultChecked: true },    label: 'Checked'          },
              { props: { indeterminate: true },     label: 'Indeterminate'    },
              { props: { disabled: true },          label: 'Disabled'         },
              { props: { disabled:true, checked:true, onChange:()=>{} }, label: 'Dis.Checked' },
            ].map(({ props, label }) => (
              <Box key={label} sx={{ textAlign: 'center', width: 90 }}>
                <Checkbox {...props} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Row>

        {/* 색상 */}
        <Row label="Color">
          <Stack direction="row" spacing={0} flexWrap="wrap" useFlexGap>
            {['default','primary','secondary','success','warning','error','info'].map((color) => (
              <Box key={color} sx={{ textAlign: 'center', width: 72 }}>
                <Checkbox defaultChecked color={color} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {color}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Row>

        {/* 크기 */}
        <Row label="Size">
          <Stack direction="row" spacing={3} alignItems="center">
            <FormControlLabel control={<Checkbox size="small" defaultChecked />} label="Small" />
            <FormControlLabel control={<Checkbox size="medium" defaultChecked />} label="Medium" />
          </Stack>
        </Row>

        {/* FormGroup 수직·수평 */}
        <Row label="FormGroup — 수직 / 수평">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">관심 분야 (수직)</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />}                    label="프론트엔드" />
                  <FormControlLabel control={<Checkbox defaultChecked />}     label="백엔드"    />
                  <FormControlLabel control={<Checkbox />}                    label="데이터 분석" />
                  <FormControlLabel control={<Checkbox disabled />}           label="선택 불가" />
                </FormGroup>
                <FormHelperText>해당하는 항목을 모두 선택하세요.</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormControl component="fieldset">
                <FormLabel component="legend">관심 분야 (수평)</FormLabel>
                <FormGroup row>
                  <FormControlLabel control={<Checkbox />}                label="프론트엔드" />
                  <FormControlLabel control={<Checkbox defaultChecked />} label="백엔드"    />
                  <FormControlLabel control={<Checkbox />}                label="데이터 분석" />
                  <FormControlLabel control={<Checkbox disabled />}       label="선택 불가" />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Row>

        {/* 전체 선택 — Indeterminate */}
        <Row label="전체 선택 — Indeterminate 패턴 (3개 이상 다중 선택)">
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, maxWidth: 320 }}>
            <FormControlLabel
              label={<Typography fontWeight={500}>기술 스택 전체 선택</Typography>}
              control={
                <Checkbox
                  checked={allChecked}
                  indeterminate={indeterminate}
                  onChange={handleSelectAll}
                  color="primary"
                />
              }
            />
            <Divider sx={{ my: 1 }} />
            <FormGroup sx={{ pl: 2 }}>
              {SKILLS.map((skill) => (
                <FormControlLabel
                  key={skill}
                  control={
                    <Checkbox
                      size="small"
                      checked={skills[skill]}
                      onChange={handleSkill(skill)}
                    />
                  }
                  label={skill}
                />
              ))}
            </FormGroup>
            <Typography
              variant="caption"
              color={checkedCount > 0 ? 'primary.main' : 'text.secondary'}
              sx={{ display: 'block', mt: 1, pl: 0.5 }}
            >
              {checkedCount === 0 ? '선택 없음' : `${checkedCount}개 선택됨`}
            </Typography>
          </Box>
        </Row>

        {/* 약관 동의 */}
        <Row label="약관 동의 패턴">
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, maxWidth: 380 }}>
            <FormGroup>
              {[
                { key: 'service',   required: true,  text: '이용약관 동의'           },
                { key: 'privacy',   required: true,  text: '개인정보 처리방침 동의'   },
                { key: 'marketing', required: false, text: '마케팅 정보 수신 동의'    },
              ].map(({ key, required, text }) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={terms[key]}
                      onChange={(e) => setTerms((p) => ({ ...p, [key]: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label={
                    <>
                      <Typography component="span" variant="caption" color={required ? 'error' : 'text.secondary'}>
                        {required ? '필수 ' : '선택 '}
                      </Typography>
                      {text}
                    </>
                  }
                />
              ))}
            </FormGroup>
            <Typography
              variant="caption"
              sx={{ mt: 1, display: 'block' }}
              color={requiredDone ? 'success.main' : 'text.disabled'}
            >
              {requiredDone ? '✓ 필수 항목 동의 완료' : '필수 항목에 동의해야 합니다.'}
            </Typography>
          </Box>
        </Row>

        {/* 커스텀 아이콘 */}
        <Row label="커스텀 아이콘">
          <Stack direction="row" spacing={3} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  color="error"
                />
              }
              label="좋아요"
            />
            <FormControlLabel
              control={
                <Checkbox
                  icon={<BookmarkBorderIcon />}
                  checkedIcon={<BookmarkIcon />}
                  color="warning"
                />
              }
              label="북마크"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={liked}
                  onChange={(e) => setLiked(e.target.checked)}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  color="error"
                />
              }
              label={liked ? '찜 완료!' : '찜하기'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={saved}
                  onChange={(e) => setSaved(e.target.checked)}
                  icon={<BookmarkBorderIcon />}
                  checkedIcon={<BookmarkIcon />}
                  color="primary"
                />
              }
              label={saved ? '저장됨' : '저장하기'}
            />
          </Stack>
        </Row>

      </Stack>
    </SectionWrapper>
  );
};

export default Section05;
