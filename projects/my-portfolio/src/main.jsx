import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// SUIT Variable(한글 UI 본문용, SIL OFL-1.1) — variable WOFF2 1개 파일만 로드한다.
// 런타임 CDN이 아니라 npm 패키지(@sun-typeface/suit)에서 직접 번들에 포함한다.
import '@sun-typeface/suit/fonts/variable/woff2/SUIT-Variable.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
