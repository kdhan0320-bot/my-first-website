import { forwardRef, useState } from 'react';
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const SlideUp = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const MEMBERS = ['김민준', '이서연', '박지호', '최수아', '정도윤'];

const Section08 = () => {
  const [basicOpen,    setBasicOpen]    = useState(false);
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [formOpen,     setFormOpen]     = useState(false);
  const [scrollOpen,   setScrollOpen]   = useState(false);
  const [memberOpen,   setMemberOpen]   = useState(false);
  const [fullOpen,     setFullOpen]     = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  const handleConfirm = () => { setConfirmed(true); setConfirmOpen(false); };

  return (
    <SectionWrapper number={8} title="Modal" description="Dialog, 확인창, 폼, 스크롤, 전체화면, Backdrop 패턴을 확인합니다.">
      <Stack spacing={4}>

        {/* 기본 Dialog */}
        <Row label="기본 Dialog — 제목 · 내용 · 확인/취소 버튼">
          <Button variant="contained" onClick={() => setBasicOpen(true)}>
            모달 열기
          </Button>
          <Dialog open={basicOpen} onClose={() => setBasicOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              공지사항
              <IconButton
                onClick={() => setBasicOpen(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                2024년 1월부터 서비스 이용약관이 변경됩니다.
                변경된 내용을 반드시 확인하시고 동의해 주세요.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBasicOpen(false)}>취소</Button>
              <Button variant="contained" onClick={() => setBasicOpen(false)}>확인</Button>
            </DialogActions>
          </Dialog>
        </Row>

        {/* 확인(Confirm) Dialog */}
        <Row label="확인(Confirm) Dialog — 위험 액션">
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => { setConfirmed(false); setConfirmOpen(true); }}
            >
              삭제하기
            </Button>
            {confirmed && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CheckCircleOutlineIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main">삭제가 완료되었습니다.</Typography>
              </Stack>
            )}
          </Stack>
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmberIcon color="error" /> 정말 삭제하시겠습니까?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                이 작업은 <strong>되돌릴 수 없습니다.</strong> 선택한 항목이 영구적으로 삭제됩니다.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>취소</Button>
              <Button variant="contained" color="error" onClick={handleConfirm}>삭제</Button>
            </DialogActions>
          </Dialog>
        </Row>

        {/* 폼 Dialog */}
        <Row label="폼(Form) Dialog">
          <Button variant="outlined" onClick={() => setFormOpen(true)}>계정 수정</Button>
          <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              계정 정보 수정
              <IconButton onClick={() => setFormOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField label="이름"   defaultValue="홍길동"            fullWidth />
                <TextField label="이메일" defaultValue="hong@example.com"  fullWidth />
                <TextField label="소개"   multiline rows={3} placeholder="자기소개를 입력하세요." fullWidth />
              </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setFormOpen(false)}>취소</Button>
              <Button variant="contained" onClick={() => setFormOpen(false)}>저장</Button>
            </DialogActions>
          </Dialog>
        </Row>

        {/* 스크롤 Dialog */}
        <Row label="스크롤 Dialog — 긴 내용">
          <Button variant="outlined" onClick={() => setScrollOpen(true)}>이용약관 보기</Button>
          <Dialog open={scrollOpen} onClose={() => setScrollOpen(false)} maxWidth="sm" fullWidth scroll="paper">
            <DialogTitle>
              이용약관 전문
              <IconButton onClick={() => setScrollOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {Array.from({ length: 12 }, (_, i) => (
                <Typography key={i} variant="body2" paragraph>
                  제{i + 1}조 (목적) 이 약관은 서비스 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항,
                  기타 필요한 사항을 규정함을 목적으로 합니다. 서비스를 이용하시는 경우 본 약관에 동의하시는
                  것으로 간주됩니다.
                </Typography>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setScrollOpen(false)}>거절</Button>
              <Button variant="contained" onClick={() => setScrollOpen(false)}>동의</Button>
            </DialogActions>
          </Dialog>
        </Row>

        {/* 리스트 Dialog */}
        <Row label="리스트 Dialog">
          <Button variant="outlined" startIcon={<PersonIcon />} onClick={() => setMemberOpen(true)}>
            멤버 선택
          </Button>
          <Dialog open={memberOpen} onClose={() => setMemberOpen(false)}>
            <DialogTitle>멤버 선택</DialogTitle>
            <List sx={{ pt: 0, minWidth: 280 }}>
              {MEMBERS.map((name) => (
                <ListItem key={name} disablePadding>
                  <ListItemButton onClick={() => setMemberOpen(false)}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>{name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Dialog>
        </Row>

        {/* 전체화면 Dialog */}
        <Row label="전체화면 Dialog (SlideUp 트랜지션)">
          <Button variant="outlined" onClick={() => setFullOpen(true)}>전체화면으로 열기</Button>
          <Dialog fullScreen open={fullOpen} onClose={() => setFullOpen(false)} TransitionComponent={SlideUp}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box
                sx={{
                  bgcolor: 'primary.main', color: 'white',
                  px: 2, py: 1.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6">전체화면 Dialog</Typography>
                <IconButton color="inherit" onClick={() => setFullOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stack alignItems="center" spacing={2}>
                  <Typography variant="h2" color="text.secondary">전체화면 콘텐츠 영역</Typography>
                  <Button variant="contained" onClick={() => setFullOpen(false)}>닫기</Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>
        </Row>

        {/* Backdrop */}
        <Row label="Backdrop — 로딩 오버레이">
          <Button
            variant="outlined"
            onClick={() => { setBackdropOpen(true); setTimeout(() => setBackdropOpen(false), 2500); }}
          >
            로딩 시뮬레이션 (2.5초)
          </Button>
          <Backdrop open={backdropOpen} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress color="inherit" />
              <Typography>데이터를 불러오는 중...</Typography>
            </Stack>
          </Backdrop>
        </Row>

      </Stack>
    </SectionWrapper>
  );
};

export default Section08;
