import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import WorkOutlineIcon from "@mui/icons-material/WorkOutlineOutlined";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const MainLayout = ({ children, hideGuestBanner = false }) => {
  const navigate = useNavigate();
  const { isGuest, isDemo, exitGuestMode } = useAuth();

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        minHeight: "100vh",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <TopBar />
      <Box
        sx={{
          pt: "56px",
          pb: "calc(76px + env(safe-area-inset-bottom))",
          minHeight: "100vh",
        }}
      >
        {isGuest && !hideGuestBanner && (
          <Box
            sx={{
              mx: 2,
              mt: 2,
              mb: 0.5,
              p: 2.5,
              borderRadius: "22px",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.10) 100%)",
              border: "1px solid rgba(99,102,241,0.22)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                color: "#3730A3",
                mb: 0.6,
                lineHeight: 1.4,
              }}
            >
              {isDemo
                ? "데모 계정으로 둘러보는 중입니다."
                : "게스트로 둘러보는 중입니다."}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#4C1D95",
                lineHeight: 1.7,
                mb: 1.75,
              }}
            >
              실제 데이터는 저장되지 않고, 주요 화면 흐름만 확인할 수 있어요.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                exitGuestMode();
                navigate(ROUTES.LOGIN);
              }}
              sx={{
                borderRadius: 2,
                fontSize: "0.8rem",
                fontWeight: 700,
                px: 2.5,
                py: 0.8,
                background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                },
              }}
            >
              로그인 화면으로
            </Button>
          </Box>
        )}
        {children}

        {/* 포트폴리오용 안내 푸터 */}
        <Box
          sx={{
            px: 2,
            pt: 4,
            pb: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            mt: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontWeight: 700,
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            AI-assisted Social App
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "text.disabled",
              lineHeight: 1.6,
              mb: 1.5,
            }}
          >
            Claude를 활용해 라우팅, 컴포넌트 구조, 주요 UI 흐름 구현을 보조받은
            학습 목적의 프론트엔드 SNS 프로젝트입니다.
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontWeight: 700,
              color: "text.secondary",
              mb: 1,
            }}
          >
            프로젝트 링크
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <Button
              component="a"
              href="https://github.com/kdhan0320-bot/my-first-website/tree/main/lecture1/mini_sns"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<GitHubIcon sx={{ fontSize: 16 }} />}
              sx={{
                flex: 1,
                justifyContent: "flex-start",
                borderRadius: 2,
                color: "text.secondary",
                borderColor: "divider",
                fontSize: "0.75rem",
                "&:hover": {
                  color: "primary.main",
                  borderColor: "primary.main",
                  bgcolor: "transparent",
                },
              }}
            >
              GitHub 저장소
            </Button>
            <Button
              component="a"
              href="https://kdhan0320-bot.github.io/my-first-website/my-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<WorkOutlineIcon sx={{ fontSize: 16 }} />}
              sx={{
                flex: 1,
                justifyContent: "flex-start",
                borderRadius: 2,
                color: "text.secondary",
                borderColor: "divider",
                fontSize: "0.75rem",
                "&:hover": {
                  color: "primary.main",
                  borderColor: "primary.main",
                  bgcolor: "transparent",
                },
              }}
            >
              포트폴리오로 돌아가기
            </Button>
          </Box>
        </Box>
      </Box>
      <BottomNav />
    </Box>
  );
};

export default MainLayout;
