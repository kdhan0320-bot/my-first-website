import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const ARTICLES = [
  {
    id: 1,
    category: 'React',
    title: 'React 18 새로운 기능 총정리',
    desc: 'Concurrent Mode, Suspense, useTransition 등 React 18의 핵심 변경사항을 알아봅니다.',
    author: '김민준',
    date: '2024.01.15',
    rating: 4.5,
    img: 'https://picsum.photos/seed/react18/400/200',
  },
  {
    id: 2,
    category: 'MUI',
    title: 'Material UI v6 마이그레이션 가이드',
    desc: 'MUI v5에서 v6로 업그레이드할 때 알아야 할 Breaking Change와 새 기능을 정리합니다.',
    author: '이서연',
    date: '2024.01.20',
    rating: 4,
    img: 'https://picsum.photos/seed/muiv6/400/200',
  },
  {
    id: 3,
    category: 'TypeScript',
    title: 'TypeScript 5.0 실전 활용법',
    desc: 'Decorators, const type parameters 등 TypeScript 5의 새 문법을 실제 코드로 살펴봅니다.',
    author: '박지호',
    date: '2024.01.25',
    rating: 5,
    img: 'https://picsum.photos/seed/ts5/400/200',
  },
];

// ─── 미디어 카드 (좋아요 · 북마크 · 호버 elevation) ───────────────
const ArticleCard = ({ article }) => {
  const [liked,   setLiked]   = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      elevation={hovered ? 8 : 1}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.25s, transform 0.25s',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}
    >
      <CardActionArea>
        <CardMedia component="img" height="160" image={article.img} alt={article.title} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Chip label={article.category} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />
          <Typography variant="h3" gutterBottom>{article.title}</Typography>
          <Typography variant="body2" color="text.secondary">{article.desc}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 1.5 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton size="small" onClick={() => setLiked((p) => !p)} color={liked ? 'error' : 'default'}>
            {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small" onClick={() => setSaved((p) => !p)} color={saved ? 'warning' : 'default'}>
            {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Rating value={article.rating} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">{article.date}</Typography>
        </Stack>
      </CardActions>
    </Card>
  );
};

// ─── 확장 카드 ────────────────────────────────────────────────────
const ExpandableCard = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>R</Avatar>}
        action={<IconButton><MoreVertIcon /></IconButton>}
        title="레시피 카드"
        subheader="2024년 1월 20일"
      />
      <CardMedia component="img" height="180" image="https://picsum.photos/seed/food1/400/200" alt="음식" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          간단하게 만들 수 있는 집밥 레시피입니다. 재료 준비부터 완성까지 30분이면 충분해요!
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton color="error"><FavoriteIcon /></IconButton>
        <IconButton><ShareIcon /></IconButton>
        <IconButton
          onClick={() => setExpanded((p) => !p)}
          sx={{ ml: 'auto', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" paragraph><strong>재료:</strong> 계란 2개, 밥 1공기, 간장 1큰술, 참기름 약간</Typography>
          <Typography variant="body2" paragraph><strong>1단계:</strong> 팬에 기름을 두르고 중불로 예열합니다.</Typography>
          <Typography variant="body2" paragraph><strong>2단계:</strong> 계란을 풀어 팬에 붓고 스크램블합니다.</Typography>
          <Typography variant="body2"><strong>3단계:</strong> 밥을 넣고 간장과 참기름으로 간을 맞춥니다.</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Section09 = () => (
  <SectionWrapper number={9} title="Card" description="MUI Card의 미디어, 액션, 확장, 수평, Skeleton 패턴을 확인합니다.">
    <Stack spacing={5}>

      {/* 미디어 카드 Grid 3개 — 호버 elevation */}
      <Row label="미디어 Card × 3 — CardContent · CardActions · 호버 시 elevation 상승">
        <Grid container spacing={2}>
          {ARTICLES.map((article) => (
            <Grid item xs={12} sm={4} key={article.id}>
              <ArticleCard article={article} />
            </Grid>
          ))}
        </Grid>
      </Row>

      {/* 수평 카드 */}
      <Row label="수평 Card">
        <Stack spacing={2}>
          {ARTICLES.slice(0, 2).map((article) => (
            <Card key={article.id} sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 140, flexShrink: 0 }}
                image={article.img}
                alt={article.title}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ flex: 1 }}>
                  <Chip label={article.category} size="small" color="primary" variant="outlined" sx={{ mb: 0.5 }} />
                  <Typography variant="h3" gutterBottom>{article.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{article.desc}</Typography>
                </CardContent>
                <CardActions>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {article.author} · {article.date}
                  </Typography>
                  <Button size="small" sx={{ ml: 'auto' }}>자세히 보기</Button>
                </CardActions>
              </Box>
            </Card>
          ))}
        </Stack>
      </Row>

      {/* 확장 카드 */}
      <Row label="확장(Expandable) Card — CardHeader · ExpandMore">
        <ExpandableCard />
      </Row>

      {/* Elevation 비교 */}
      <Row label="Elevation 비교">
        <Grid container spacing={2}>
          {[0, 1, 2, 4, 8, 16].map((elev) => (
            <Grid item xs={6} sm={2} key={elev}>
              <Card elevation={elev} sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3">{elev}</Typography>
                <Typography variant="caption" color="text.secondary">elevation</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Row>

      {/* Skeleton 로딩 */}
      <Row label="Skeleton — 로딩 플레이스홀더">
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={160} animation="wave" />
                <CardContent>
                  <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
                <CardActions sx={{ px: 2, pb: 1.5 }}>
                  <Skeleton variant="circular" width={28} height={28} />
                  <Skeleton variant="circular" width={28} height={28} />
                  <Skeleton variant="rounded" width={80} height={24} sx={{ ml: 'auto' }} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Row>

    </Stack>
  </SectionWrapper>
);

export default Section09;
