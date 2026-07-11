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
              mt: 1.5,
              mb: 0.5,
              p: 2,
              borderRadius: "20px",
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

        {/* 프로젝트 링크 utility row (compact) */}
        <Box
          sx={{
            px: 2,
            pt: 1.25,
            pb: 1.25,
            mt: 0.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.disabled", mb: 0.75 }}
          >
            Mini SNS · 모바일 작업 커뮤니티 데모
          </Typography>
          <Box sx={{ display: "flex", gap: 0.75 }}>
            <Button
              component="a"
              href="https://github.com/kdhan0320-bot/my-first-website/tree/main/projects/mini_sns"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<GitHubIcon sx={{ fontSize: 15 }} />}
              sx={{
                flex: 1,
                minHeight: "42px",
                justifyContent: "flex-start",
                borderRadius: "10px",
                color: "text.secondary",
                borderColor: "divider",
                fontSize: "0.7rem",
                px: 1.25,
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
              startIcon={<WorkOutlineIcon sx={{ fontSize: 15 }} />}
              sx={{
                flex: 1,
                minHeight: "42px",
                justifyContent: "flex-start",
                borderRadius: "10px",
                color: "text.secondary",
                borderColor: "divider",
                fontSize: "0.7rem",
                px: 1.25,
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
