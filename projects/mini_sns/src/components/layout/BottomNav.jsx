import { useNavigate, useLocation } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  Box,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { ROUTES } from "../../constants/routes";

const NavIcon = ({ active, activeIcon, icon }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 46,
      height: 30,
      borderRadius: "15px",
      bgcolor: active ? "secondary.main" : "transparent",
      transition: "background-color 0.2s ease",
    }}
  >
    {active ? activeIcon : icon}
  </Box>
);

const NAV_ACTION_SX = {
  minWidth: 0,
  flex: 1,
  py: 0.75,
  "& .MuiBottomNavigationAction-label": {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#94A3B8",
    mt: 0.4,
    "&.Mui-selected": { fontSize: "0.8rem" },
  },
  "&.Mui-selected .MuiBottomNavigationAction-label": {
    fontWeight: 700,
    color: "primary.main",
  },
};

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) =>
    path === route || (route === ROUTES.CHAT && path.startsWith("/chat/"));

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        maxWidth: 480,
        mx: "auto",
        pb: "env(safe-area-inset-bottom)",
        borderTop: "1px solid",
        borderColor: "divider",
        boxShadow: "0 -4px 16px rgba(15,23,42,0.06)",
      }}
      elevation={0}
    >
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <BottomNavigation
          showLabels
          sx={{ width: "100%", bgcolor: "background.paper", height: 76 }}
        >
          <BottomNavigationAction
            label="홈"
            aria-label="홈 피드로 이동"
            icon={
              <NavIcon
                active={isActive(ROUTES.HOME)}
                activeIcon={
                  <HomeRoundedIcon color="primary" sx={{ fontSize: 27 }} />
                }
                icon={
                  <HomeOutlinedIcon sx={{ color: "#94A3B8", fontSize: 27 }} />
                }
              />
            }
            onClick={() => navigate(ROUTES.HOME)}
            sx={NAV_ACTION_SX}
          />
          <BottomNavigationAction
            label="모임"
            aria-label="모임 목록으로 이동"
            icon={
              <NavIcon
                active={isActive(ROUTES.MEETUP)}
                activeIcon={
                  <GroupsRoundedIcon color="primary" sx={{ fontSize: 27 }} />
                }
                icon={
                  <GroupsOutlinedIcon sx={{ color: "#94A3B8", fontSize: 27 }} />
                }
              />
            }
            onClick={() => navigate(ROUTES.MEETUP)}
            sx={NAV_ACTION_SX}
          />
          {/* 중앙 게시물 작성 버튼 자리 (Fab는 아래 오버레이로 표시) */}
          <BottomNavigationAction
            disabled
            sx={{ minWidth: 0, flex: 1, opacity: 0, pointerEvents: "none" }}
          />
          <BottomNavigationAction
            label="채팅"
            aria-label="채팅 목록으로 이동"
            icon={
              <NavIcon
                active={isActive(ROUTES.CHAT)}
                activeIcon={
                  <ForumRoundedIcon color="primary" sx={{ fontSize: 27 }} />
                }
                icon={
                  <ForumOutlinedIcon sx={{ color: "#94A3B8", fontSize: 27 }} />
                }
              />
            }
            onClick={() => navigate(ROUTES.CHAT)}
            sx={NAV_ACTION_SX}
          />
          <BottomNavigationAction
            label="내 작업"
            aria-label="프로필로 이동"
            icon={
              <NavIcon
                active={isActive(ROUTES.PROFILE)}
                activeIcon={
                  <AccountCircleRoundedIcon
                    color="primary"
                    sx={{ fontSize: 27 }}
                  />
                }
                icon={
                  <AccountCircleOutlinedIcon
                    sx={{ color: "#94A3B8", fontSize: 27 }}
                  />
                }
              />
            }
            onClick={() => navigate(ROUTES.PROFILE)}
            sx={NAV_ACTION_SX}
          />
        </BottomNavigation>

        {/* 중앙 게시물 작성 버튼 */}
        <Fab
          onClick={() => navigate(ROUTES.CREATE_POST)}
          aria-label="새 게시물 작성"
          sx={{
            position: "absolute",
            left: "50%",
            top: "46%",
            transform: "translate(-50%, -50%)",
            width: 58,
            height: 58,
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            color: "#fff",
            boxShadow:
              "0 8px 20px rgba(79,70,229,0.5), 0 0 0 6px rgba(99,102,241,0.12)",
            "&:hover": {
              background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
            },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 30 }} />
        </Fab>
      </Box>
    </Paper>
  );
};

export default BottomNav;
