import { Box, Typography } from "@mui/material";

const railSegmentSx = {
  display: "flex",
  alignItems: "baseline",
  gap: 0.5,
  minWidth: 0,
  flex: { sm: 1 },
};

const RailSegment = ({ label, text }) => (
  <Box sx={railSegmentSx}>
    <Typography
      variant="caption"
      sx={{
        color: "#A5B4FC",
        fontWeight: 700,
        fontSize: "0.68rem",
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="caption"
      noWrap
      sx={{ color: "#E0E7FF", fontSize: "0.72rem", minWidth: 0 }}
    >
      {text}
    </Typography>
  </Box>
);

const SummaryRail = ({ flowLabel, flowText, featureLabel, featureText }) => (
  <Box
    sx={{
      mt: 0.85,
      px: 1.25,
      py: 0.65,
      borderRadius: "12px",
      bgcolor: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.16)",
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      gap: { xs: 0.25, sm: 0 },
    }}
  >
    <RailSegment label={flowLabel} text={flowText} />
    {featureText && (
      <>
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            width: "1px",
            height: 12,
            bgcolor: "rgba(255,255,255,0.18)",
            mx: 1.5,
            flexShrink: 0,
          }}
        />
        <RailSegment label={featureLabel} text={featureText} />
      </>
    )}
  </Box>
);

const PageHeroHeader = ({
  title,
  subtitle,
  chips,
  action,
  flowLabel,
  flowText,
  featureLabel = "기능",
  featureText,
}) => (
  <Box
    sx={{
      px: 2,
      pt: 1.75,
      pb: 1.5,
      background:
        "linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, color: "#fff" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ color: "#C7D2FE", mt: 0.15, mb: chips ? 0.75 : 0 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
    {chips && (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>{chips}</Box>
    )}
    {flowText && (
      <SummaryRail
        flowLabel={flowLabel}
        flowText={flowText}
        featureLabel={featureLabel}
        featureText={featureText}
      />
    )}
  </Box>
);

export const heroChipSx = {
  bgcolor: "rgba(255,255,255,0.16)",
  color: "#fff",
  fontWeight: 600,
  fontSize: "0.68rem",
  border: "1px solid rgba(255,255,255,0.22)",
};

export const heroSurfaceSx = {
  backgroundImage:
    "radial-gradient(circle at 15% 0%, rgba(99,102,241,0.08) 0%, transparent 42%), radial-gradient(circle at 100% 10%, rgba(6,182,212,0.07) 0%, transparent 38%)",
  backgroundRepeat: "no-repeat",
};

export const cardCanvasSx = {
  bgcolor: "#F8FAFC",
  backgroundImage:
    "radial-gradient(circle at 10% 22%, rgba(99,102,241,0.055) 0%, transparent 40%), radial-gradient(circle at 92% 68%, rgba(6,182,212,0.05) 0%, transparent 38%)",
  backgroundRepeat: "no-repeat",
};

export const cardShelfSx = {
  position: "relative",
  mt: "-10px",
  borderRadius: "18px 18px 0 0",
  boxShadow: "0 -8px 16px -8px rgba(15,23,42,0.10)",
  pt: "10px",
  ...cardCanvasSx,
};

export default PageHeroHeader;
