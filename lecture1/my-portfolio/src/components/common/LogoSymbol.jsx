const LogoSymbol = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="logoSymbolGradient" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#14B8A6" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#logoSymbolGradient)" />
    <path
      d="M22 18H32C41 18 47 24 47 32C47 40 41 46 32 46H22V18Z"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M19 42C29 40 39 33 45 23" stroke="#DFFDF8" strokeWidth="4" strokeLinecap="round" />
    <path
      d="M45 23L44 31L37 28"
      stroke="#DFFDF8"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LogoSymbol;
